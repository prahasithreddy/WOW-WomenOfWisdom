import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { name, type } = await req.json();
  const slug = `${type}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  
  try {
    const category = await db.category.create({ data: { name, type, slug } });
    return NextResponse.json({ success: true, id: category.id });
  } catch {
    return NextResponse.json({ error: "Category may already exist" }, { status: 400 });
  }
}
