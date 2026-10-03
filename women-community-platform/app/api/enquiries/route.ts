import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

const enquirySchema = z.object({
  targetType: z.string(),
  targetId: z.string(),
  senderName: z.string().min(2),
  senderEmail: z.string().email(),
  senderPhone: z.string().optional(),
  message: z.string().min(10),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = enquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const session = await auth();
    const { targetType, targetId, senderName, senderEmail, senderPhone, message } = parsed.data;

    const enquiry = await db.enquiry.create({
      data: {
        targetType,
        targetId,
        senderId: session?.user?.id ?? null,
        senderName,
        senderEmail,
        senderPhone,
        message,
      },
    });

    // Notify owner
    // In production: send email notification
    return NextResponse.json({ success: true, id: enquiry.id });
  } catch (err) {
    console.error("Enquiry error:", err);
    return NextResponse.json({ error: "Failed to send enquiry" }, { status: 500 });
  }
}
