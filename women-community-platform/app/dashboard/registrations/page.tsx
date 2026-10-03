import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CalendarCheck, MapPin, Globe, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";

export const metadata = { title: "My Registrations — Dashboard" };

export default async function DashboardRegistrationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const registrations = await db.eventRegistration.findMany({
    where: { userId: session.user.id },
    include: { event: true },
    orderBy: { event: { startsAt: "asc" } },
  });

  const upcoming = registrations.filter((r) => new Date(r.event.startsAt) >= new Date());
  const past = registrations.filter((r) => new Date(r.event.startsAt) < new Date());

  const RegList = ({ items, label }: { items: typeof registrations; label: string }) => (
    <div className="mb-8">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{label}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground pl-1">No {label.toLowerCase()} registrations.</p>
      ) : (
        <div className="space-y-3">
          {items.map((reg) => (
            <Card key={reg.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{reg.event.title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{formatDateTime(reg.event.startsAt)}</span>
                      {reg.event.isOnline ? (
                        <span className="flex items-center gap-0.5"><Globe className="h-3 w-3" />Online</span>
                      ) : reg.event.venue ? (
                        <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{reg.event.venue}</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {reg.event.status === "PUBLISHED" && (
                      <Link href={`/events/${reg.event.slug}`} className="text-purple-600 hover:text-purple-700">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    )}
                    <Badge variant={reg.event.isFree ? "teal" : "secondary"} className="text-xs">
                      {reg.event.isFree ? "Free" : reg.event.price ? `$${reg.event.price}` : "Paid"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-lavender-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-semibold text-foreground">My Registrations</h1>
            <p className="text-sm text-muted-foreground">{registrations.length} event{registrations.length !== 1 ? "s" : ""} registered</p>
          </div>
        </div>

        {registrations.length === 0 ? (
          <Card className="p-12 text-center">
            <CalendarCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground font-medium">No event registrations yet</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Browse upcoming events and register to see them here.</p>
            <Link href="/events">
              <Badge variant="secondary" className="cursor-pointer px-4 py-1.5 text-sm">Browse Events</Badge>
            </Link>
          </Card>
        ) : (
          <>
            <RegList items={upcoming} label="Upcoming" />
            <RegList items={past} label="Past" />
          </>
        )}
      </div>
    </div>
  );
}
