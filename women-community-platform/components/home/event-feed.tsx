"use client";

import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EVENT_TYPE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { Event } from "@prisma/client";

interface EventFeedProps {
  events: Event[];
}

export function EventFeed({ events }: EventFeedProps) {
  const reduce = useReducedMotion();

  return (
    <section className="py-16 md:py-24" style={{ background: "#F0EEFF" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="section-label">What&apos;s on</span>
            <h2 className="section-heading">Upcoming events</h2>
            <p className="section-subheading">
              Stay connected with the latest gatherings in our community.
            </p>
          </div>
          <Link href="/events" className="shrink-0">
            <Button variant="secondary" className="gap-2">
              See all events <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-lavender-300">
            <Calendar className="h-10 w-10 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2 font-serif">No upcoming events yet</h3>
            <p className="text-muted text-sm mb-6">Share yours with the community.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/dashboard/events/new">
                <Button size="sm">Submit an Event</Button>
              </Link>
              <Link href="/join">
                <Button size="sm" variant="secondary">Join the Community</Button>
              </Link>
            </div>
          </div>
        ) : events.length === 1 ? (
          /* Single event — full width hero card */
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <EventCard event={events[0]} hero />
          </motion.div>
        ) : (
          /* Asymmetric layout: hero card left + side stack right */
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Featured hero card — takes 3/5 width */}
            <motion.div
              className="lg:col-span-3"
              initial={reduce ? {} : { opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <EventCard event={events[0]} hero />
            </motion.div>

            {/* Side stack — remaining events */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {events.slice(1).map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={reduce ? {} : { opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1"
                >
                  <EventCard event={event} compact />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function EventCard({
  event,
  hero,
  compact,
}: {
  event: Event;
  hero?: boolean;
  compact?: boolean;
}) {
  const registrationCount = 0;
  const spotsLeft = event.capacity ? event.capacity - registrationCount : null;

  return (
    <Link href={`/events/${event.slug}`} className="group block h-full">
      <div className={`card card-hover h-full flex flex-col overflow-hidden`}>

        {/* Banner image */}
        <div
          className={`relative bg-violet-800 overflow-hidden ${
            hero ? "aspect-[16/9]" : compact ? "aspect-[16/7]" : "aspect-video"
          }`}
        >
          {event.banner ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.banner}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            /* Elegant placeholder: type label + date as large type */
            <div
              className="w-full h-full flex flex-col items-start justify-end p-6"
              style={{
                background: "linear-gradient(135deg, #2D1B69 0%, #5E3399 100%)",
              }}
            >
              <span
                className="text-purple-300 font-bold uppercase mb-2"
                style={{ fontSize: "0.65rem", letterSpacing: "0.14em" }}
              >
                {EVENT_TYPE_LABELS[event.type]}
              </span>
              <span className="text-lavender-100 font-serif font-bold text-2xl leading-tight">
                {formatDate(event.startsAt)}
              </span>
            </div>
          )}

          {/* Gradient scrim for text legibility at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-violet-950/40 to-transparent pointer-events-none" />

          {/* Badges */}
          <div className="absolute top-3 left-3">
            <Badge variant="ink">{EVENT_TYPE_LABELS[event.type]}</Badge>
          </div>
          {event.isPinnedHome && (
            <div className="absolute top-3 right-3">
              <Badge variant="default">Featured</Badge>
            </div>
          )}
          <div className="absolute bottom-3 right-3">
            <Badge variant={event.isFree ? "success" : "default"}>
              {event.isFree ? "Free" : event.price ? `$${event.price}` : "Paid"}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3
            className={`font-serif font-semibold text-foreground mb-3 group-hover:text-purple-600 transition-colors duration-200 line-clamp-2 ${
              hero ? "text-xl" : "text-base"
            }`}
          >
            {event.title}
          </h3>

          <div className="flex flex-col gap-2 text-sm text-muted mt-auto">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-purple-500 shrink-0" />
              <span>{formatDate(event.startsAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-rose-400 shrink-0" />
              <span className="truncate">{event.isOnline ? "Online" : (event.venue ?? "TBA")}</span>
            </div>
          </div>

          {spotsLeft !== null && spotsLeft <= 10 && spotsLeft > 0 && (
            <div className="mt-3 text-xs font-semibold text-rose-500">
              Only {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-lavender-300">
            <Button variant="secondary" size="sm" className="w-full">
              View Event
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
