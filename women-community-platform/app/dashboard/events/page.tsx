import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlusCircle, Calendar, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusChip } from "@/components/shared/status-chip";
import { Badge } from "@/components/ui/badge";
import { EVENT_TYPE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { EventActions } from "@/components/dashboard/event-actions";

export const metadata = { title: "Events — Dashboard" };

export default async function DashboardEventsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const events = await db.event.findMany({
    where: { organiserId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { registrations: true } },
      reviewLogs: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  return (
    <div className="min-h-screen bg-lavender-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-serif font-semibold text-foreground">My Events</h1>
              <p className="text-muted-foreground text-sm">{events.length} event{events.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <Link href="/dashboard/events/new">
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" /> New Event
            </Button>
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-border/50">
            <Calendar className="h-12 w-12 text-purple-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No events yet</h3>
            <p className="text-muted-foreground mb-6">Submit an event to share with the community.</p>
            <Link href="/dashboard/events/new">
              <Button>Create First Event</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => {
              const lastLog = event.reviewLogs[0];
              return (
                <Card key={event.id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">{event.title}</h3>
                        <StatusChip status={event.status} size="sm" />
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="teal" className="text-xs">{EVENT_TYPE_LABELS[event.type]}</Badge>
                        <span className="text-xs text-muted-foreground">{formatDate(event.startsAt)}</span>
                        <span className="text-xs text-muted-foreground">
                          {event._count.registrations} registrations
                          {event.capacity ? ` / ${event.capacity}` : ""}
                        </span>
                      </div>
                      {lastLog?.comment && lastLog.state === "CHANGES_REQUESTED" && (
                        <div className="mt-2 p-2 bg-rose-50 border border-rose-200 rounded-lg">
                          <p className="text-xs text-rose-700">{lastLog.comment}</p>
                        </div>
                      )}
                    </div>
                    <EventActions event={event} />
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
