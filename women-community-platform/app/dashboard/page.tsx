import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.status !== "APPROVED") redirect("/pending");

  const [profile, business, marketItems, events, notifications] = await Promise.all([
    db.memberProfile.findUnique({ where: { userId: session.user.id } }),
    db.business.findFirst({ where: { ownerId: session.user.id } }),
    db.marketItem.findMany({
      where: { sellerId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.event.findMany({
      where: { organiserId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.notification.findMany({
      where: { userId: session.user.id, readAt: null },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const enquiries = await db.enquiry.findMany({
    where: {
      OR: [
        { senderId: session.user.id },
        ...(business ? [{ targetId: business.id }] : []),
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <DashboardOverview
      user={session.user}
      profile={profile}
      business={business}
      marketItems={marketItems}
      events={events}
      enquiries={enquiries}
      unreadNotifications={notifications.length}
    />
  );
}
