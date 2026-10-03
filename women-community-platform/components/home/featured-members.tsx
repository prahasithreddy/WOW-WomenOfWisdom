"use client";

import Link from "next/link";
import { ArrowRight, Users, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, truncate } from "@/lib/utils";
import type { MemberProfile } from "@prisma/client";

interface FeaturedMembersProps {
  members: MemberProfile[];
}

export function FeaturedMembers({ members }: FeaturedMembersProps) {
  const reduce = useReducedMotion();
  const spotlight = members.slice(0, 2);
  const compact   = members.slice(2, 6);

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="section-label">Our members</span>
            <h2 className="section-heading">Meet the community</h2>
            <p className="section-subheading">
              Connect with inspiring women from every industry and walk of life.
            </p>
          </div>
          <Link href="/members" className="shrink-0">
            <Button variant="secondary" className="gap-2">
              All members <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {members.length === 0 ? (
          <div className="text-center py-12 bg-lavender-200 rounded-2xl border border-lavender-300">
            <Users className="h-10 w-10 text-purple-400 mx-auto mb-4" />
            <p className="text-muted mb-4">Featured members will appear here after joining.</p>
            <Link href="/join">
              <Button size="sm">Join Now</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Spotlight row — 2 horizontal feature cards */}
            {spotlight.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {spotlight.map((member, i) => (
                  <motion.div
                    key={member.id}
                    initial={reduce ? {} : { opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <SpotlightCard member={member} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Compact row — up to 4 smaller cards */}
            {compact.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {compact.map((member, i) => (
                  <motion.div
                    key={member.id}
                    initial={reduce ? {} : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <CompactCard member={member} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* Horizontal spotlight card — large avatar + name/headline/location visible */
function SpotlightCard({ member }: { member: MemberProfile }) {
  return (
    <Link href={`/members/${member.slug}`} className="group block">
      <div
        className="flex items-center gap-5 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 border"
        style={{
          background: "#FDFCFF",
          borderColor: "#E4E0F7",
          boxShadow: "0 1px 3px rgba(30,27,75,0.06), 0 4px 16px rgba(30,27,75,0.08)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 4px 12px rgba(30,27,75,0.10), 0 12px 40px rgba(147,51,234,0.18)";
          (e.currentTarget as HTMLDivElement).style.borderColor = "#a855f7";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 1px 3px rgba(30,27,75,0.06), 0 4px 16px rgba(30,27,75,0.08)";
          (e.currentTarget as HTMLDivElement).style.borderColor = "#E4E0F7";
        }}
      >
        <Avatar className="h-20 w-20 rounded-2xl ring-2 ring-purple-100 group-hover:ring-purple-300 transition-all duration-300 shrink-0">
          <AvatarImage src={member.photo ?? undefined} className="rounded-2xl object-cover" />
          <AvatarFallback className="rounded-2xl text-2xl bg-purple-100 text-purple-700 font-serif font-bold">
            {getInitials(member.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-base text-foreground group-hover:text-purple-600 transition-colors duration-200 truncate">
            {member.name}
          </h4>
          {member.headline && (
            <p className="text-sm text-muted mt-0.5 line-clamp-2 leading-relaxed">
              {truncate(member.headline, 80)}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {member.city && (
              <span className="flex items-center gap-1 text-xs text-muted">
                <MapPin className="h-3 w-3 text-purple-400" />
                {member.city}
              </span>
            )}
          </div>
        </div>

        <ArrowRight className="h-4 w-4 text-muted group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
      </div>
    </Link>
  );
}

/* Small compact card — center aligned, avatar + name + location */
function CompactCard({ member }: { member: MemberProfile }) {
  return (
    <Link href={`/members/${member.slug}`} className="group block">
      <div className="flex flex-col items-center text-center p-5 rounded-2xl transition-all duration-300 hover:bg-lavender-200 hover:-translate-y-0.5 border border-transparent hover:border-lavender-300">
        <div className="relative mb-3">
          <Avatar className="h-16 w-16 rounded-xl ring-2 ring-purple-100 group-hover:ring-purple-300 transition-all duration-300">
            <AvatarImage src={member.photo ?? undefined} className="rounded-xl" />
            <AvatarFallback className="rounded-xl text-lg bg-purple-100 text-purple-700 font-serif font-bold">
              {getInitials(member.name)}
            </AvatarFallback>
          </Avatar>
        </div>

        <h4 className="font-semibold text-sm text-foreground group-hover:text-purple-600 transition-colors duration-200 line-clamp-1">
          {member.name}
        </h4>
        {member.headline && (
          <p className="text-xs text-muted mt-0.5 line-clamp-2 leading-relaxed">
            {truncate(member.headline, 50)}
          </p>
        )}
        {member.city && (
          <div className="flex items-center gap-1 mt-1.5 text-xs text-muted">
            <MapPin className="h-3 w-3" />
            <span>{member.city}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
