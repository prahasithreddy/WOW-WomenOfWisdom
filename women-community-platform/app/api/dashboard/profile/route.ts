import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { userId, name, headline, bio, city, country, phone, website, linkedin, instagram, twitter,
      industryId, visibilityPhone, visibilityEmail } = body;

    if (userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existing = await db.memberProfile.findUnique({ where: { userId } });

    if (existing) {
      await db.memberProfile.update({
        where: { userId },
        data: {
          name: name || existing.name,
          headline: headline || null,
          bio: bio || null,
          city: city || null,
          country: country || null,
          phone: phone || null,
          website: website || null,
          linkedin: linkedin || null,
          instagram: instagram || null,
          twitter: twitter || null,
          industryId: industryId || null,
          visibilityPhone: visibilityPhone ?? false,
          visibilityEmail: visibilityEmail ?? false,
        },
      });
    } else {
      const slug = generateSlug(name, session.user.id.slice(-6));
      await db.memberProfile.create({
        data: {
          userId,
          slug,
          name: name || "Member",
          headline: headline || null,
          bio: bio || null,
          city: city || null,
          country: country || null,
          phone: phone || null,
          website: website || null,
          linkedin: linkedin || null,
          instagram: instagram || null,
          twitter: twitter || null,
          industryId: industryId || null,
          visibilityPhone: visibilityPhone ?? false,
          visibilityEmail: visibilityEmail ?? false,
          status: "DRAFT",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
