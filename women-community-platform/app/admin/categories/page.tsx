import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminCategoriesClient } from "@/components/admin/admin-categories-client";

export const metadata = { title: "Categories — Admin" };

export default async function AdminCategoriesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) redirect("/");

  const categories = await db.category.findMany({ orderBy: [{ type: "asc" }, { name: "asc" }] });

  return <AdminCategoriesClient categories={categories} />;
}
