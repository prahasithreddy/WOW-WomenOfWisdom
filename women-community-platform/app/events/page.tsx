import { db } from "@/lib/db";
import { Metadata } from "next";
import Link from "next/link";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EVENT_TYPE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { Event } from "@prisma/client";

export const metadata: Metadata = {
  title: "Events",
  description: "Discover upcoming cultural, corporate, property, and webinar events.",
};

export const revalidate = 60;

interface SearchParams { type?: string; page?: string }

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");
  const take = 12;
  const skip = (page - 1) * take;

  const where = {
    status: "PUBLISHED",
    endsAt: { gt: new Date() },
    ...(params.type && params.type !== "all" ? { type: params.type } : {}),
  };

  const [events, total] = await Promise.all([
    db.event.findMany({
      where,
      orderBy: [{ isPinnedHome: "desc" }, { startsAt: "asc" }],
      take,
      skip,
      include: { _count: { select: { registrations: true } } },
    }),
    db.event.count({ where }),
  ]);

  const totalPages = Math.ceil(total / take);

  return (
    <div className="min-h-screen bg-lavender-100">

      {/* Header */}
      <div className="relative overflow-hidden grain-overlay" style={{ background: "#2D1B69" }}>
        <div className="h-px w-full absolute top-0 left-0 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-purple-400 font-bold uppercase mb-2" style={{ fontSize: "0.65rem", letterSpacing: "0.16em" }}>
                Community calendar
              </p>
              <h1 className="text-4xl font-serif font-bold text-lavender-100 mb-1" style={{ letterSpacing: "-0.03em" }}>Events</h1>
              <p className="text-violet-200">{total} upcoming events in the community</p>
            </div>
            <Link href="/dashboard/events/new">
              <Button className="bg-purple-400 text-violet-950 font-bold hover:bg-purple-300">
                Submit an event
              </Button>
            </Link>
          </div>
        </div>
        <div className="h-px w-full absolute bottom-0 left-0 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Type Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["all", ...Object.keys(EVENT_TYPE_LABELS)].map((type) => (
            <Link
              key={type}
              href={`/events${type !== "all" ? `?type=${type}` : ""}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                (params.type === type) || (!params.type && type === "all")
                  ? "bg-violet-950 text-purple-300"
                  : "bg-white text-muted hover:bg-purple-50 hover:text-purple-700 border border-lavender-300"
              }`}
            >
              {type === "all" ? "All events" : EVENT_TYPE_LABELS[type]}
            </Link>
          ))}
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-serif font-semibold text-foreground mb-2">No upcoming events</h3>
            <p className="text-muted">Check back soon or submit your own event.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((event) => (
                <EventCard key={event.id} event={event as Event & { _count: { registrations: number } }} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/events?${new URLSearchParams({ ...params, page: String(p) })}`}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      p === page
                        ? "bg-violet-950 text-purple-300"
                        : "bg-white text-muted border border-lavender-300 hover:border-purple-400 hover:text-purple-600"
                    }`}
                  >
                    {p}
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EventCard({ event }: { event: Event & { _count: { registrations: number } } }) {
  const spotsLeft = event.capacity ? event.capacity - event._count.registrations : null;

  return (
    <Link href={`/events/${event.slug}`} className="group block">
      <div className="card card-hover h-full flex flex-col">
        {/* Banner */}
        <div className="relative aspect-video bg-violet-800 overflow-hidden">
          {event.banner ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.banner}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-start justify-end p-5" style={{ background: "linear-gradient(135deg, #2D1B69 0%, #5E3399 100%)" }}>
              <span className="text-purple-300 text-xs uppercase font-bold mb-1" style={{ letterSpacing: "0.12em" }}>
                {EVENT_TYPE_LABELS[event.type]}
              </span>
              <span className="text-lavender-100 font-serif font-bold text-xl leading-tight">
                {formatDate(event.startsAt)}
              </span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge variant="ink">{EVENT_TYPE_LABELS[event.type]}</Badge>
          </div>
          <div className="absolute bottom-3 right-3">
            <Badge variant={event.isFree ? "success" : "default"}>
              {event.isFree ? "Free" : event.price ? `$${event.price}` : "Paid"}
            </Badge>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-serif font-semibold text-foreground group-hover:text-purple-600 transition-colors duration-200 line-clamp-2 mb-3">
            {event.title}
          </h3>
          <div className="space-y-2 text-sm text-muted mt-auto">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-purple-500" />
              {formatDate(event.startsAt)}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-rose-400" />
              {event.isOnline ? "Online" : (event.venue ?? "TBA")}
            </div>
          </div>
          {spotsLeft !== null && spotsLeft <= 10 && spotsLeft > 0 && (
            <p className="text-xs text-rose-600 font-semibold mt-3">Only {spotsLeft} spots left</p>
          )}
          <Button variant="secondary" size="sm" className="w-full mt-4">View event</Button>
        </div>
      </div>
    </Link>
  );
}
