"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Tag } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MARKET_CATEGORY_LABELS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { MarketItem } from "@prisma/client";

interface MarketplaceHighlightsProps {
  items: MarketItem[];
}

export function MarketplaceHighlights({ items }: MarketplaceHighlightsProps) {
  const reduce = useReducedMotion();

  return (
    <section className="py-16 md:py-24" style={{ background: "#F0EEFF" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="section-label">Community marketplace</span>
            <h2 className="section-heading">Browse listings</h2>
            <p className="section-subheading">
              Items shared by community members — pre-loved, moving-out, and more.
            </p>
          </div>
          <Link href="/marketplace" className="shrink-0">
            <Button variant="secondary" className="gap-2">
              Browse all <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-lavender-300">
            <ShoppingBag className="h-10 w-10 text-purple-400 mx-auto mb-4" />
            <p className="text-muted">Marketplace listings will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={reduce ? {} : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <MarketItemCard item={item} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function MarketItemCard({ item }: { item: MarketItem }) {
  const images = JSON.parse(item.images) as string[];
  const primaryImage = images[0];

  return (
    <Link href={`/marketplace/${item.slug}`} className="group block">
      <div className="card card-hover overflow-hidden" style={{ borderRadius: "12px" }}>
        {/* Image */}
        <div className="aspect-square bg-lavender-200 overflow-hidden">
          {primaryImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primaryImage}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Tag className="h-8 w-8 text-purple-400" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-4">
          <Badge variant="secondary" className="text-xs mb-2">
            {MARKET_CATEGORY_LABELS[item.category]}
          </Badge>
          <h3 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-purple-600 transition-colors duration-200">
            {item.title}
          </h3>
          {item.price && (
            <p className="text-base font-bold text-purple-600 mt-1.5 font-serif">
              {formatPrice(item.price, item.currency)}
            </p>
          )}
          {item.location && (
            <p className="text-xs text-muted mt-1">{item.location}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
