import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NewEventForm } from "@/components/dashboard/new-event-form";

export const metadata = { title: "New Event — Dashboard" };

export default async function NewEventPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return <NewEventForm userId={session.user.id} />;
}
