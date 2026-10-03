import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { FeaturedManager } from "@/components/admin/featured-manager";

export const metadata = { title: "Featured — Admin" };

export default async function AdminFeaturedPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) redirect("/");

  const [featuredMembers, featuredBusinesses, pinnedEvents] = await Promise.all([
    db.memberProfile.findMany({
      where: { isFeatured: true, status: "PUBLISHED" },
      orderBy: { featuredOrder: "asc" },
    }),
    db.business.findMany({
      where: { isFeatured: true, status: "PUBLISHED" },
      orderBy: { featuredOrder: "asc" },
    }),
    db.event.findMany({
      where: { isPinnedHome: true, status: "PUBLISHED" },
      orderBy: { startsAt: "asc" },
    }),
  ]);

  const [allMembers, allBusinesses, allEvents] = await Promise.all([
    db.memberProfile.findMany({ where: { status: "PUBLISHED", isFeatured: false }, take: 50 }),
    db.business.findMany({ where: { status: "PUBLISHED", isFeatured: false }, take: 50 }),
    db.event.findMany({
      where: { status: "PUBLISHED", isPinnedHome: false, endsAt: { gt: new Date() } },
      take: 20,
    }),
  ]);

  return (
    <FeaturedManager
      featuredMembers={featuredMembers}
      featuredBusinesses={featuredBusinesses}
      pinnedEvents={pinnedEvents}
      allMembers={allMembers}
      allBusinesses={allBusinesses}
      allEvents={allEvents}
    />
  );
}
