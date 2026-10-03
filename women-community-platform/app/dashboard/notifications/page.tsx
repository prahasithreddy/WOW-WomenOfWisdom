import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Bell, CheckCircle, Info, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { timeAgo } from "@/lib/utils";

export const metadata = { title: "Notifications — Dashboard" };

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const notifications = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Mark all as read
  await db.notification.updateMany({
    where: { userId: session.user.id, readAt: null },
    data: { readAt: new Date() },
  });

  return (
    <div className="min-h-screen bg-lavender-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-serif font-semibold text-foreground">Notifications</h1>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-border/50">
            <Bell className="h-12 w-12 text-purple-300 mx-auto mb-4" />
            <p className="text-muted-foreground">No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => {
              const isApproved = notif.type.includes("APPROVED");
              const isRejected = notif.type.includes("REJECTED");
              const isChanges = notif.type.includes("CHANGES");
              const isUnread = !notif.readAt;

              return (
                <Card key={notif.id} className={`p-5 ${isUnread ? "border-l-4 border-l-purple-400" : ""}`}>
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 shrink-0 ${isApproved ? "text-teal-500" : isRejected ? "text-red-500" : isChanges ? "text-amber-500" : "text-purple-500"}`}>
                      {isApproved ? <CheckCircle className="h-4 w-4" /> :
                       isRejected ? <AlertCircle className="h-4 w-4" /> :
                       <Info className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{notif.title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{notif.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{timeAgo(notif.createdAt)}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
