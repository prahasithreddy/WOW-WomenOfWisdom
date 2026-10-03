import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";

export const metadata = { title: "Audit Log — Admin" };

export default async function AdminAuditPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) redirect("/");

  const logs = await db.auditLog.findMany({
    include: {
      actor: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const actionColor = (action: string) => {
    if (action.includes("APPROVE") || action.includes("PUBLISH")) return "bg-emerald-50 text-emerald-700";
    if (action.includes("REJECT")) return "bg-red-50 text-red-700";
    if (action.includes("SUSPEND")) return "bg-amber-50 text-amber-700";
    if (action.includes("REVIEW")) return "bg-blue-50 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-lavender-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-semibold text-foreground">Audit Log</h1>
            <p className="text-sm text-muted-foreground">Last 200 admin actions</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Activity className="h-10 w-10 mb-3 opacity-30" />
                <p>No audit log entries yet</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start justify-between gap-4 px-5 py-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${actionColor(log.action)}`}
                        >
                          {log.action.replace(/_/g, " ")}
                        </span>
                        <span className="text-xs text-muted-foreground">{log.entity}</span>
                      </div>
                      {log.after && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{log.after}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        by {log.actor?.name ?? "System"} · {log.actor?.email}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground shrink-0">
                      {formatDateTime(log.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
