"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Pin, X, PlusCircle, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import type { MemberProfile, Business, Event } from "@prisma/client";

interface FeaturedManagerProps {
  featuredMembers: MemberProfile[];
  featuredBusinesses: Business[];
  pinnedEvents: Event[];
  allMembers: MemberProfile[];
  allBusinesses: Business[];
  allEvents: Event[];
}

export function FeaturedManager({
  featuredMembers, featuredBusinesses, pinnedEvents,
  allMembers, allBusinesses, allEvents,
}: FeaturedManagerProps) {
  const router = useRouter();

  const toggleFeaturedMember = async (profileId: string, isFeatured: boolean) => {
    await fetch(`/api/admin/featured/member`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId, isFeatured }),
    });
    router.refresh();
  };

  const toggleFeaturedBusiness = async (businessId: string, isFeatured: boolean) => {
    await fetch(`/api/admin/featured/business`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId, isFeatured }),
    });
    router.refresh();
  };

  const togglePinnedEvent = async (eventId: string, isPinned: boolean) => {
    await fetch(`/api/admin/featured/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, isPinned }),
    });
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-lavender-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-semibold text-foreground">Featured Management</h1>
            <p className="text-muted-foreground text-sm">Curate what appears on the homepage</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Featured Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                Featured Members ({featuredMembers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {featuredMembers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No featured members. Add some below.</p>
                ) : (
                  featuredMembers.map((m) => (
                    <div key={m.id} className="flex items-center justify-between gap-3 p-3 bg-lavender-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{getInitials(m.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-foreground">{m.name}</p>
                          {m.headline && <p className="text-xs text-muted-foreground">{m.headline}</p>}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => toggleFeaturedMember(m.id, false)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
              {allMembers.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Add member</p>
                  <div className="flex flex-wrap gap-2">
                    {allMembers.slice(0, 10).map((m) => (
                      <button
                        key={m.id}
                        onClick={() => toggleFeaturedMember(m.id, true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-border rounded-full hover:bg-purple-50 hover:border-purple-200 transition-colors"
                      >
                        <PlusCircle className="h-3 w-3" />
                        {m.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Featured Businesses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                Featured Businesses ({featuredBusinesses.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {featuredBusinesses.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No featured businesses.</p>
                ) : (
                  featuredBusinesses.map((b) => (
                    <div key={b.id} className="flex items-center justify-between gap-3 p-3 bg-lavender-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-foreground">{b.name}</p>
                        {b.tagline && <p className="text-xs text-muted-foreground">{b.tagline}</p>}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => toggleFeaturedBusiness(b.id, false)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
              {allBusinesses.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Add business</p>
                  <div className="flex flex-wrap gap-2">
                    {allBusinesses.slice(0, 10).map((b) => (
                      <button
                        key={b.id}
                        onClick={() => toggleFeaturedBusiness(b.id, true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-border rounded-full hover:bg-purple-50 hover:border-purple-200 transition-colors"
                      >
                        <PlusCircle className="h-3 w-3" />
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pinned Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pin className="h-4 w-4 text-purple-600" />
                Pinned Home Events ({pinnedEvents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {pinnedEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No pinned events.</p>
                ) : (
                  pinnedEvents.map((e) => (
                    <div key={e.id} className="flex items-center justify-between gap-3 p-3 bg-lavender-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-foreground">{e.title}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(e.startsAt)}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => togglePinnedEvent(e.id, false)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
              {allEvents.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Pin event to homepage</p>
                  <div className="flex flex-wrap gap-2">
                    {allEvents.slice(0, 10).map((e) => (
                      <button
                        key={e.id}
                        onClick={() => togglePinnedEvent(e.id, true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-border rounded-full hover:bg-purple-50 hover:border-purple-200 transition-colors"
                      >
                        <PlusCircle className="h-3 w-3" />
                        {e.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
