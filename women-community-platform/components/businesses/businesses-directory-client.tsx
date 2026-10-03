"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Search, Building2, Star, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { truncate } from "@/lib/utils";
import type { Business, Category, BusinessTag } from "@prisma/client";

type BusinessWithRelations = Business & {
  owner: { name: string | null };
  category: Category | null;
  tags: BusinessTag[];
  _count: { offerings: number };
};

interface BusinessesDirectoryClientProps {
  businesses: BusinessWithRelations[];
  total: number;
  page: number;
  categories: Category[];
  searchParams: { q?: string; category?: string; page?: string };
}

export function BusinessesDirectoryClient({
  businesses, total, page, categories, searchParams,
}: BusinessesDirectoryClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(searchParams.q ?? "");

  const updateSearch = (updates: Record<string, string>) => {
    const params = new URLSearchParams();
    if (searchParams.q && !("q" in updates)) params.set("q", searchParams.q);
    if (searchParams.category && !("category" in updates)) params.set("category", searchParams.category);
    Object.entries(updates).forEach(([k, v]) => { if (v) params.set(k, v); });
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const totalPages = Math.ceil(total / 18);

  return (
    <div className="min-h-screen bg-lavender-50">
      {/* Header */}
      <div className="bg-purple-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-semibold text-white mb-2">Business Directory</h1>
          <p className="text-white/75 text-lg">
            Discover {total.toLocaleString()} women-owned businesses in our community.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-card p-5 mb-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search businesses..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && updateSearch({ q: query })}
              className="pl-10"
            />
          </div>
          <Select value={searchParams.category ?? ""} onValueChange={(v) => updateSearch({ category: v === "all" ? "" : v })}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => updateSearch({ q: query })} className="shrink-0">
            <Search className="h-4 w-4 mr-2" /> Search
          </Button>
        </div>

        {businesses.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="h-12 w-12 text-purple-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No businesses found</h3>
            <p className="text-muted-foreground">Try a different search or category.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              Showing {(page - 1) * 18 + 1}–{Math.min(page * 18, total)} of {total} businesses
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((biz) => (
                <BusinessCard key={biz.id} business={biz} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`${pathname}?${new URLSearchParams({ ...searchParams, page: String(p) })}`}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      p === page
                        ? "bg-purple-600 text-white"
                        : "bg-white text-muted-foreground hover:bg-purple-50 border border-border"
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

function BusinessCard({ business }: { business: BusinessWithRelations }) {
  return (
    <Link href={`/businesses/${business.slug}`} className="group block">
      <div className="card card-hover h-full">
        {/* Banner */}
        {business.banner && (
          <div className="aspect-video bg-lavender-100 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={business.banner} alt={business.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-lavender-100 flex items-center justify-center shrink-0 overflow-hidden">
              {business.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={business.logo} alt={business.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-serif font-bold text-xl text-purple-600">{business.name[0]}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-foreground group-hover:text-purple-700 transition-colors truncate">
                  {business.name}
                </h3>
                {business.isFeatured && <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 shrink-0" />}
              </div>
              {business.category && (
                <Badge variant="secondary" className="text-xs mt-1">{business.category.name}</Badge>
              )}
            </div>
          </div>

          {business.tagline && (
            <p className="text-sm font-medium text-foreground mb-2">{business.tagline}</p>
          )}
          {business.description && (
            <p className="text-sm text-muted-foreground">
              {truncate(business.description, 100)}
            </p>
          )}

          {business.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {business.tags.slice(0, 3).map((t) => (
                <span key={t.id} className="text-xs bg-lavender-100 text-purple-600 px-2 py-0.5 rounded-full">{t.tag}</span>
              ))}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
            <span>by {business.owner.name ?? "Member"}</span>
            {business._count.offerings > 0 && (
              <span className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {business._count.offerings} offering{business._count.offerings !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
