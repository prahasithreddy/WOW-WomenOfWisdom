import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, category, condition, price, location, description } = body;

    const slug = generateSlug(title, Math.random().toString(36).slice(2, 8));

    const item = await db.marketItem.create({
      data: {
        sellerId: session.user.id,
        title,
        slug,
        category: category ?? "USED_ITEMS",
        condition: condition ?? "GOOD",
        price: price ?? null,
        location: location ?? null,
        description: description ?? null,
        status: "DRAFT",
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      },
    });

    return NextResponse.json({ success: true, id: item.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}
