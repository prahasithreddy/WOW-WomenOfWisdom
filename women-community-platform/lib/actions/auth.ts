"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signIn } from "@/lib/auth";
import { z } from "zod";
import { generateSlug } from "@/lib/utils";
import { createNotification } from "@/lib/actions/notifications";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  bio: z.string().optional(),
  consent: z.literal("true").refine((v) => v === "true", { message: "You must accept the terms" }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export async function registerUser(data: RegisterInput) {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, password, phone, city, country, bio } = parsed.data;

  // Check if email already exists
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const slug = generateSlug(name, Math.random().toString(36).slice(2, 8));

  const user = await db.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "PENDING",
      status: "PENDING",
      emailVerified: new Date(), // In production: send verification email
    },
  });

  // Create member profile
  await db.memberProfile.create({
    data: {
      userId: user.id,
      slug,
      name,
      phone,
      city,
      country,
      bio,
      status: "DRAFT",
    },
  });

  // Notify admins
  const admins = await db.user.findMany({
    where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
    select: { id: true },
  });

  for (const admin of admins) {
    await createNotification({
      userId: admin.id,
      type: "SYSTEM",
      title: "New member registration",
      message: `${name} has registered and is awaiting approval.`,
      payload: { userId: user.id },
    });
  }

  return { success: true, userId: user.id };
}

export async function loginUser(email: string, password: string) {
  try {
    await signIn("credentials", { email, password, redirect: false });
    return { success: true };
  } catch {
    return { error: "Invalid email or password." };
  }
}

export async function acceptInvitation(token: string, password: string) {
  const invitation = await db.invitation.findFirst({
    where: {
      tokenHash: token,
      acceptedAt: null,
      expiresAt: { gt: new Date() },
    },
  });

  if (!invitation) {
    return { error: "Invalid or expired invitation link." };
  }

  const existing = await db.user.findUnique({ where: { email: invitation.email } });
  if (existing) {
    return { error: "An account already exists for this email." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const nameParts = invitation.email.split("@")[0].split(".");
  const name = nameParts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
  const slug = generateSlug(name, Math.random().toString(36).slice(2, 8));

  const user = await db.user.create({
    data: {
      email: invitation.email,
      passwordHash,
      name,
      role: invitation.preVerified ? "MEMBER" : "PENDING",
      status: invitation.preVerified ? "APPROVED" : "PENDING",
      emailVerified: new Date(),
    },
  });

  await db.memberProfile.create({
    data: {
      userId: user.id,
      slug,
      name,
      status: invitation.preVerified ? "APPROVED" : "DRAFT",
    },
  });

  await db.invitation.update({
    where: { id: invitation.id },
    data: { acceptedAt: new Date() },
  });

  return { success: true };
}
