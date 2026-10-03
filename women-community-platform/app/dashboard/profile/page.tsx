import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/dashboard/profile-form";

export const metadata = { title: "My Profile — Dashboard" };

export default async function DashboardProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const profile = await db.memberProfile.findUnique({
    where: { userId: session.user.id },
    include: { industry: true, reviewLogs: { orderBy: { createdAt: "desc" }, take: 5 } },
  });

  const categories = await db.category.findMany({
    where: { type: "industry" },
    orderBy: { name: "asc" },
  });

  return <ProfileForm profile={profile} categories={categories} userId={session.user.id} />;
}
