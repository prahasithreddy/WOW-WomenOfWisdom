import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

const regSchema = z.object({
  eventId: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  quantity: z.number().min(1).max(10),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = regSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    const session = await auth();
    const { eventId, name, email, phone, quantity } = parsed.data;

    // Check event capacity
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { registrations: true } } },
    });
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    let status = "CONFIRMED";
    if (event.capacity) {
      const remaining = event.capacity - event._count.registrations;
      if (remaining <= 0) status = "WAITLIST";
    }

    const registration = await db.eventRegistration.create({
      data: {
        eventId,
        userId: session?.user?.id ?? null,
        name,
        email,
        phone,
        quantity,
        status,
      },
    });

    return NextResponse.json({ success: true, id: registration.id, status });
  } catch (err) {
    console.error("Event registration error:", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
