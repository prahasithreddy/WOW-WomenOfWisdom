"use client";

import Link from "next/link";
import { ArrowRight, Star, Building2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { truncate } from "@/lib/utils";

interface Business {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  tagline: string | null;
  description: string | null;
  isFeatured: boolean;
  owner: { name: string | null };
  category: { name: string } | null;
}

interface FeaturedBusinessesProps {
  businesses: Business[];
}

export function FeaturedBusinesses({ businesses }: FeaturedBusinessesProps) {
  const reduce = useReducedMotion();

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="section-label">Women-owned</span>
            <h2 className="section-heading">Featured businesses</h2>
            <p className="section-subheading">
              Discover and support businesses built by our members.
            </p>
          </div>
          <Link href="/businesses" className="shrink-0">
            <Button variant="secondary" className="gap-2">
              All businesses <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {businesses.length === 0 ? (
          <div className="text-center py-12 bg-lavender-200 rounded-2xl border border-lavender-300">
            <Building2 className="h-10 w-10 text-purple-400 mx-auto mb-4" />
            <p className="text-muted">Featured businesses will appear here.</p>
          </div>
        ) : (
          <BentoGrid businesses={businesses} reduce={!!reduce} />
        )}
      </div>
    </section>
  );
}

function BentoGrid({ businesses, reduce }: { businesses: Business[]; reduce: boolean }) {
  /* Bento layout:
     - 1–2 businesses: 2-wide cards side by side
     - 3+ businesses: first 2 wide (col-span-3 each), rest compact in 2-col row
     Tailwind grid is 6-col to allow 3+3 wide split and 2-col compact
  */
  const wide = businesses.slice(0, 2);
  const compact = businesses.slice(2, 6);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
      {/* Wide cards (col-span-3 each on lg) */}
      {wide.map((biz, i) => (
        <motion.div
          key={biz.id}
          className="sm:col-span-1 lg:col-span-3"
          initial={reduce ? {} : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <BusinessCard business={biz} wide />
        </motion.div>
      ))}

      {/* Compact cards (col-span-2 each on lg — 3 per row) */}
      {compact.map((biz, i) => (
        <motion.div
          key={biz.id}
          className="lg:col-span-2"
          initial={reduce ? {} : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.15 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
        >
          <BusinessCard business={biz} />
        </motion.div>
      ))}
    </div>
  );
}

function BusinessCard({ business, wide }: { business: Business; wide?: boolean }) {
  return (
    <Link href={`/businesses/${business.slug}`} className="group block h-full">
      <div
        className="card card-hover h-full flex flex-col p-6"
        style={{ background: "#FDFCFF" }}
      >
        {/* Logo & Name */}
        <div className="flex items-start gap-4 mb-5">
          {/* Logo area */}
          <div
            className={`rounded-xl bg-purple-50 border border-lavender-300 flex items-center justify-center shrink-0 overflow-hidden ${
              wide ? "w-16 h-16" : "w-12 h-12"
            }`}
          >
            {business.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={business.logo} alt={business.name} className="w-full h-full object-cover" />
            ) : (
              <span className={`font-serif font-bold text-purple-600 ${wide ? "text-2xl" : "text-lg"}`}>
                {business.name[0]}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1.5">
              <h3
                className={`font-semibold text-foreground group-hover:text-purple-600 transition-colors duration-200 truncate ${
                  wide ? "text-base" : "text-sm"
                }`}
              >
                {business.name}
              </h3>
              {business.isFeatured && (
                <Star className="h-3.5 w-3.5 text-amber-400 shrink-0 fill-amber-400" />
              )}
            </div>
            {business.category && (
              <Badge variant="secondary" className="text-xs">{business.category.name}</Badge>
            )}
          </div>
        </div>

        {/* Description */}
        <p className={`text-muted flex-1 leading-relaxed ${wide ? "text-sm" : "text-xs"}`}>
          {truncate(business.tagline ?? business.description ?? "Discover this women-owned business.", wide ? 130 : 90)}
        </p>

        {/* Owner */}
        <div className="mt-5 pt-4 border-t border-lavender-300 flex items-center justify-between">
          <span className="text-xs text-muted">
            by {business.owner.name ?? "Member"}
          </span>
          <span className="text-xs font-semibold text-purple-600 group-hover:text-purple-700 transition-colors">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
