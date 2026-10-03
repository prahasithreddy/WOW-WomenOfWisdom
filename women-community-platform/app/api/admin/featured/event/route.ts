import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { eventId, isPinned } = await req.json();
  await db.event.update({ where: { id: eventId }, data: { isPinnedHome: isPinned } });
  return NextResponse.json({ success: true });
}
