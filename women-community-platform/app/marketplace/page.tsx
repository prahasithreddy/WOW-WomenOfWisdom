import { db } from "@/lib/db";
import { Metadata } from "next";
import Link from "next/link";
import { Search, ShoppingBag, Tag, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MARKET_CATEGORY_LABELS, MARKET_CONDITION_LABELS } from "@/lib/constants";
import { formatPrice, parseJson } from "@/lib/utils";
import type { MarketItem } from "@prisma/client";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Browse used items and moving-out sales from community members.",
};

export const revalidate = 60;

interface SearchParams { category?: string; page?: string }

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");
  const take = 20;
  const skip = (page - 1) * take;

  const where = {
    status: "PUBLISHED",
    saleStatus: "AVAILABLE",
    ...(params.category && params.category !== "all" ? { category: params.category } : {}),
  };

  const [items, total] = await Promise.all([
    db.marketItem.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      skip,
    }),
    db.marketItem.count({ where }),
  ]);

  const totalPages = Math.ceil(total / take);

  return (
    <div className="min-h-screen bg-lavender-50">
      {/* Header */}
      <div className="bg-purple-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-serif font-semibold text-white mb-2">Marketplace</h1>
              <p className="text-white/75 text-lg">{total} items available from community members</p>
            </div>
            <Link href="/dashboard/marketplace/new">
              <Button className="bg-white text-purple-700 hover:bg-white/90">
                List an Item
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[{ key: "all", label: "All Items" }, ...Object.entries(MARKET_CATEGORY_LABELS).map(([k, v]) => ({ key: k, label: v }))].map(({ key, label }) => (
            <Link
              key={key}
              href={`/marketplace${key !== "all" ? `?category=${key}` : ""}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                (params.category === key) || (!params.category && key === "all")
                  ? "bg-purple-600 text-white"
                  : "bg-white text-muted-foreground hover:bg-purple-50 border border-border"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-12 w-12 text-purple-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No items available</h3>
            <p className="text-muted-foreground mb-6">Be the first to list something!</p>
            <Link href="/dashboard/marketplace/new">
              <Button>List an Item</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {items.map((item) => <MarketItemCard key={item.id} item={item} />)}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/marketplace?${new URLSearchParams({ ...params, page: String(p) })}`}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium ${
                      p === page ? "bg-purple-600 text-white" : "bg-white text-muted-foreground border border-border"
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

function MarketItemCard({ item }: { item: MarketItem }) {
  const images = parseJson<string[]>(item.images, []);

  return (
    <Link href={`/marketplace/${item.slug}`} className="group block">
      <div className="card card-hover">
        <div className="aspect-square bg-lavender-100 overflow-hidden">
          {images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Tag className="h-8 w-8 text-purple-300" />
            </div>
          )}
        </div>
        <div className="p-4">
          <Badge variant="secondary" className="text-xs mb-2">
            {MARKET_CATEGORY_LABELS[item.category]}
          </Badge>
          <h3 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-purple-700 transition-colors">
            {item.title}
          </h3>
          <div className="flex items-center justify-between mt-2">
            {item.price ? (
              <p className="font-bold text-purple-700">{formatPrice(item.price, item.currency)}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Price on request</p>
            )}
            <Badge variant="ghost" className="text-xs">{MARKET_CONDITION_LABELS[item.condition]}</Badge>
          </div>
          {item.location && (
            <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {item.location}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
