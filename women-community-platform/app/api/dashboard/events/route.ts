import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, type, description, startsAt, endsAt, timezone, venue, isOnline, capacity, isFree, price } = body;

    const slug = generateSlug(title, Math.random().toString(36).slice(2, 8));

    const event = await db.event.create({
      data: {
        organiserId: session.user.id,
        title,
        slug,
        type: type ?? "OTHER",
        description: description ?? null,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        timezone: timezone ?? "UTC",
        venue: venue ?? null,
        isOnline: isOnline ?? false,
        capacity: capacity ?? null,
        isFree: isFree ?? true,
        price: isFree ? null : (price ?? null),
        status: "DRAFT",
      },
    });

    return NextResponse.json({ success: true, id: event.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
