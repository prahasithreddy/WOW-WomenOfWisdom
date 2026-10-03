import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminMembersClient } from "@/components/admin/admin-members-client";

export const metadata = { title: "Members — Admin" };

export default async function AdminMembersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) redirect("/");

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { profile: { select: { name: true, city: true, slug: true } } },
  });

  return <AdminMembersClient users={users} />;
}
