import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NewMarketItemForm } from "@/components/dashboard/new-market-item-form";

export const metadata = { title: "New Listing — Dashboard" };

export default async function NewMarketItemPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return <NewMarketItemForm userId={session.user.id} />;
}
