"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Search, MapPin, Filter, Star, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials, truncate } from "@/lib/utils";
import type { MemberProfile, Category } from "@prisma/client";

interface MembersDirectoryClientProps {
  members: MemberProfile[];
  total: number;
  page: number;
  industries: Category[];
  searchParams: { q?: string; city?: string; industry?: string; page?: string };
}

export function MembersDirectoryClient({
  members, total, page, industries, searchParams,
}: MembersDirectoryClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(searchParams.q ?? "");

  const updateSearch = (updates: Record<string, string>) => {
    const params = new URLSearchParams();
    if (searchParams.q && !("q" in updates)) params.set("q", searchParams.q);
    if (searchParams.city && !("city" in updates)) params.set("city", searchParams.city);
    if (searchParams.industry && !("industry" in updates)) params.set("industry", searchParams.industry);
    Object.entries(updates).forEach(([k, v]) => { if (v) params.set(k, v); else params.delete(k); });
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const totalPages = Math.ceil(total / 24);
  const hasFilters = !!(searchParams.q || searchParams.city || searchParams.industry);

  return (
    <div className="min-h-screen bg-lavender-50">
      {/* Header */}
      <div className="bg-purple-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-semibold text-white mb-2">Members Directory</h1>
          <p className="text-white/75 text-lg">
            Connect with {total.toLocaleString()} inspiring women in our community.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters */}
        <div className="bg-white rounded-2xl shadow-card p-5 mb-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, skills, headline..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && updateSearch({ q: query })}
              className="pl-10"
            />
          </div>
          <Select value={searchParams.industry ?? ""} onValueChange={(v) => updateSearch({ industry: v === "all" ? "" : v })}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="All Industries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map((i) => (
                <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => updateSearch({ q: query })} className="shrink-0">
            <Search className="h-4 w-4 mr-2" /> Search
          </Button>
          {hasFilters && (
            <Button variant="ghost" onClick={() => { setQuery(""); router.push(pathname); }} className="shrink-0 text-muted-foreground">
              Clear
            </Button>
          )}
        </div>

        {/* Results */}
        {members.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-12 w-12 text-purple-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No members found</h3>
            <p className="text-muted-foreground">Try adjusting your search filters.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              Showing {(page - 1) * 24 + 1}–{Math.min(page * 24, total)} of {total} members
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
              {members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`${pathname}?${new URLSearchParams({ ...searchParams, page: String(p) })}`}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      p === page
                        ? "bg-purple-600 text-white"
                        : "bg-white text-muted-foreground hover:bg-purple-50 hover:text-purple-700 border border-border"
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

function MemberCard({ member }: { member: MemberProfile }) {
  return (
    <Link href={`/members/${member.slug}`} className="group block">
      <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
        <div className="relative mb-3">
          <Avatar className="h-16 w-16 ring-2 ring-purple-100 group-hover:ring-purple-300 transition-all">
            <AvatarImage src={member.photo ?? undefined} />
            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
          </Avatar>
          {member.isFeatured && (
            <Star className="absolute -top-1 -right-1 h-4 w-4 text-amber-400 fill-amber-400" />
          )}
        </div>
        <h4 className="font-semibold text-sm text-foreground group-hover:text-purple-700 transition-colors line-clamp-1">
          {member.name}
        </h4>
        {member.headline && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{truncate(member.headline, 50)}</p>
        )}
        {member.city && (
          <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{member.city}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
