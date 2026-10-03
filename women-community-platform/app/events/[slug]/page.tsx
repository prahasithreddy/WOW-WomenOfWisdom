import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MapPin, Clock, Users, Calendar, Globe, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EVENT_TYPE_LABELS } from "@/lib/constants";
import { formatDateTime, formatPrice } from "@/lib/utils";
import { EventRegistrationForm } from "@/components/events/event-registration-form";

export const revalidate = 60;

interface Params { slug: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await db.event.findUnique({ where: { slug } });
  return {
    title: event?.title ?? "Event",
    description: event?.description ?? "",
  };
}

export default async function EventDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  const event = await db.event.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      organiser: {
        include: {
          profile: { select: { slug: true, name: true, photo: true } },
        },
      },
      _count: { select: { registrations: true } },
    },
  });

  if (!event) notFound();

  const registrationCount = event._count.registrations;
  const spotsLeft = event.capacity ? event.capacity - registrationCount : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;
  const hasEnded = new Date(event.endsAt) < new Date();

  return (
    <div className="min-h-screen bg-lavender-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        {event.banner && (
          <div className="rounded-2xl overflow-hidden aspect-[16/6] bg-purple-gradient mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="teal">{EVENT_TYPE_LABELS[event.type]}</Badge>
                <Badge variant={event.isFree ? "teal" : "default"}>
                  {event.isFree ? "Free" : "Paid"}
                </Badge>
                {isFull && <Badge variant="blush">Sold Out</Badge>}
              </div>

              <h1 className="text-3xl font-serif font-semibold text-foreground mb-4">{event.title}</h1>

              {/* Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Date & Time</p>
                    <p className="text-muted-foreground">{formatDateTime(event.startsAt, event.timezone)}</p>
                    {event.endsAt && (
                      <p className="text-muted-foreground text-xs">Ends: {formatDateTime(event.endsAt, event.timezone)}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-teal-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">{event.isOnline ? "Online Event" : "Venue"}</p>
                    <p className="text-muted-foreground">{event.isOnline ? "Link provided upon registration" : (event.venue ?? "TBA")}</p>
                  </div>
                </div>
                {event.capacity && (
                  <div className="flex items-start gap-3">
                    <Users className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Capacity</p>
                      <p className="text-muted-foreground">
                        {registrationCount} registered / {event.capacity} spots
                        {spotsLeft !== null && spotsLeft > 0 && ` · ${spotsLeft} left`}
                      </p>
                    </div>
                  </div>
                )}
                {!event.isFree && event.price && (
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-4 w-4 text-teal-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Price</p>
                      <p className="text-muted-foreground">{formatPrice(event.price, event.currency)}</p>
                    </div>
                  </div>
                )}
              </div>

              {event.description && (
                <div className="pt-5 border-t border-border">
                  <h2 className="text-lg font-semibold text-foreground mb-3">About This Event</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{event.description}</p>
                </div>
              )}

              {event.sponsorName && (
                <div className="mt-5 pt-5 border-t border-border">
                  <p className="text-xs text-muted-foreground">Sponsored by <strong>{event.sponsorName}</strong></p>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Organiser */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-3">Organised by</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-sm">
                    {event.organiser.name?.[0] ?? "O"}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{event.organiser.name}</p>
                  <p className="text-xs text-muted-foreground">{event.organiser.email}</p>
                </div>
              </div>
            </Card>

            {/* Registration */}
            {!hasEnded ? (
              <Card className="p-6">
                <EventRegistrationForm
                  eventId={event.id}
                  eventTitle={event.title}
                  isFree={event.isFree}
                  price={event.price}
                  currency={event.currency}
                  isFull={isFull}
                />
              </Card>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground text-sm">This event has ended.</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
