import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { BusinessForm } from "@/components/dashboard/business-form";

export const metadata = { title: "My Business — Dashboard" };

export default async function DashboardBusinessPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [business, categories] = await Promise.all([
    db.business.findFirst({
      where: { ownerId: session.user.id },
      include: {
        offerings: true,
        tags: true,
        reviewLogs: { orderBy: { createdAt: "desc" }, take: 3 },
      },
    }),
    db.category.findMany({ where: { type: "business" }, orderBy: { name: "asc" } }),
  ]);

  return <BusinessForm business={business} categories={categories} userId={session.user.id} />;
}
