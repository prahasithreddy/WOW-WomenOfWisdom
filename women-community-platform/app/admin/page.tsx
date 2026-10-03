import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminOverview } from "@/components/admin/admin-overview";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) redirect("/");

  const [
    pendingMembers,
    pendingContent,
    totalMembers,
    totalBusinesses,
    totalEvents,
    totalListings,
    recentRegistrations,
  ] = await Promise.all([
    db.user.count({ where: { status: "PENDING" } }),
    db.memberProfile.count({ where: { status: "SUBMITTED" } }),
    db.user.count({ where: { status: "APPROVED" } }),
    db.business.count({ where: { status: "PUBLISHED" } }),
    db.event.count({ where: { status: "PUBLISHED", endsAt: { gt: new Date() } } }),
    db.marketItem.count({ where: { status: "PUBLISHED", saleStatus: "AVAILABLE" } }),
    db.user.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { profile: { select: { name: true, city: true, headline: true } } },
    }),
  ]);

  const pendingBusinesses = await db.business.count({ where: { status: "SUBMITTED" } });
  const pendingEvents = await db.event.count({ where: { status: "SUBMITTED" } });
  const pendingMarket = await db.marketItem.count({ where: { status: "SUBMITTED" } });

  return (
    <AdminOverview
      stats={{
        pendingMembers,
        pendingContent: pendingContent + pendingBusinesses + pendingEvents + pendingMarket,
        totalMembers,
        totalBusinesses,
        totalEvents,
        totalListings,
      }}
      recentRegistrations={recentRegistrations}
    />
  );
}
