import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, tagline, description, categoryId, contactEmail, contactPhone, location, website, hours } = body;

    const contactJson = JSON.stringify({ email: contactEmail || null, phone: contactPhone || null });

    const existing = await db.business.findFirst({ where: { ownerId: session.user.id } });

    if (existing) {
      await db.business.update({
        where: { id: existing.id },
        data: {
          name: name || existing.name,
          tagline: tagline || null,
          description: description || null,
          categoryId: categoryId || null,
          contactJson,
          location: location || null,
          website: website || null,
          hours: hours || null,
        },
      });
    } else {
      const slug = generateSlug(name, session.user.id.slice(-6));
      await db.business.create({
        data: {
          ownerId: session.user.id,
          name,
          slug,
          tagline: tagline || null,
          description: description || null,
          categoryId: categoryId || null,
          contactJson,
          location: location || null,
          website: website || null,
          hours: hours || null,
          status: "DRAFT",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save business" }, { status: 500 });
  }
}
