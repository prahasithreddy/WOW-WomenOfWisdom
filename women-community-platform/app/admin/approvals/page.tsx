import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ApprovalsQueue } from "@/components/admin/approvals-queue";

export const metadata = { title: "Approvals Queue — Admin" };

export default async function ApprovalsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) redirect("/");

  const [pendingMembers, pendingProfiles, pendingBusinesses, pendingEvents, pendingMarket] = await Promise.all([
    db.user.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: { profile: true },
    }),
    db.memberProfile.findMany({
      where: { status: "SUBMITTED" },
      orderBy: { updatedAt: "asc" },
      include: { user: { select: { email: true } } },
    }),
    db.business.findMany({
      where: { status: "SUBMITTED" },
      orderBy: { updatedAt: "asc" },
      include: { owner: { select: { email: true, name: true } }, category: true },
    }),
    db.event.findMany({
      where: { status: "SUBMITTED" },
      orderBy: { updatedAt: "asc" },
      include: { organiser: { select: { email: true, name: true } } },
    }),
    db.marketItem.findMany({
      where: { status: "SUBMITTED" },
      orderBy: { updatedAt: "asc" },
      include: { seller: { select: { email: true, name: true } } },
    }),
  ]);

  return (
    <ApprovalsQueue
      pendingMembers={pendingMembers}
      pendingProfiles={pendingProfiles}
      pendingBusinesses={pendingBusinesses}
      pendingEvents={pendingEvents}
      pendingMarket={pendingMarket}
    />
  );
}
