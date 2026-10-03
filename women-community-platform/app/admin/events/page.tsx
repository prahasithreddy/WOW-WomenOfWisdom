import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Calendar, ExternalLink, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDateTime } from "@/lib/utils";

export const metadata = { title: "Events — Admin" };

export default async function AdminEventsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) redirect("/");

  const events = await db.event.findMany({
    include: {
      organiser: { select: { name: true } },
      _count: { select: { registrations: true } },
    },
    orderBy: { startsAt: "desc" },
  });

  const statusIcon = (status: string) => {
    if (status === "PUBLISHED") return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />;
    if (status === "REJECTED") return <XCircle className="h-3.5 w-3.5 text-red-500" />;
    return <Clock className="h-3.5 w-3.5 text-amber-400" />;
  };

  const upcoming = events.filter((e) => new Date(e.startsAt) >= new Date());
  const past = events.filter((e) => new Date(e.startsAt) < new Date());

  const EventTable = ({ items, label }: { items: typeof events; label: string }) => (
    <div className="mb-8">
      <h2 className="text-sm font-semibold text-muted-foreground mb-3">{label} ({items.length})</h2>
      <Card>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No events.</p>
          ) : (
            <div className="divide-y divide-border/50">
              {items.map((event) => (
                <div key={event.id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.organiser.name} · {formatDateTime(event.startsAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                      {event._count.registrations} registered
                    </Badge>
                    <div className="flex items-center gap-1.5">
                      {statusIcon(event.status)}
                      <span className="text-xs text-muted-foreground capitalize">{event.status.toLowerCase()}</span>
                    </div>
                    {event.status === "PUBLISHED" && (
                      <Link
                        href={`/events/${event.slug}`}
                        target="_blank"
                        className="text-purple-600 hover:text-purple-700"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-lavender-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-semibold text-foreground">Events</h1>
            <p className="text-sm text-muted-foreground">{events.length} total</p>
          </div>
        </div>
        <EventTable items={upcoming} label="Upcoming" />
        <EventTable items={past} label="Past" />
      </div>
    </div>
  );
}
