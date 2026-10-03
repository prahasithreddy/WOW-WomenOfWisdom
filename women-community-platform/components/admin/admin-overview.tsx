"use client";

import Link from "next/link";
import {
  Users, Building2, Calendar, ShoppingBag, Clock, CheckCircle,
  ArrowRight, Shield, AlertCircle, BarChart2, Settings, Tag, Star, Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials, timeAgo } from "@/lib/utils";
import type { User, MemberProfile } from "@prisma/client";

type UserWithProfile = User & {
  profile: Pick<MemberProfile, "name" | "city" | "headline"> | null;
};

interface AdminOverviewProps {
  stats: {
    pendingMembers: number;
    pendingContent: number;
    totalMembers: number;
    totalBusinesses: number;
    totalEvents: number;
    totalListings: number;
  };
  recentRegistrations: UserWithProfile[];
}

const adminNav = [
  { label: "Approvals", href: "/admin/approvals", icon: CheckCircle, color: "bg-teal-100 text-teal-600", badge: "queue" as const },
  { label: "Members", href: "/admin/members", icon: Users, color: "bg-purple-100 text-purple-600" },
  { label: "Businesses", href: "/admin/businesses", icon: Building2, color: "bg-lavender-200 text-purple-600" },
  { label: "Events", href: "/admin/events", icon: Calendar, color: "bg-amber-100 text-amber-600" },
  { label: "Featured", href: "/admin/featured", icon: Star, color: "bg-yellow-100 text-yellow-600" },
  { label: "Reports", href: "/admin/reports", icon: BarChart2, color: "bg-blue-100 text-blue-600" },
  { label: "Categories", href: "/admin/categories", icon: Tag, color: "bg-pink-100 text-pink-600" },
  { label: "Audit Log", href: "/admin/audit", icon: Activity, color: "bg-slate-100 text-slate-600" },
  { label: "Settings", href: "/admin/settings", icon: Settings, color: "bg-gray-100 text-gray-600" },
];

export function AdminOverview({ stats, recentRegistrations }: AdminOverviewProps) {
  const totalPending = stats.pendingMembers + stats.pendingContent;

  return (
    <div className="min-h-screen bg-lavender-50">
      {/* Header */}
      <div className="bg-purple-900 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-semibold text-white">Admin Dashboard</h1>
              <p className="text-purple-300 text-sm">Women&apos;s Community Platform</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Alert */}
        {totalPending > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
              <p className="text-amber-800 font-medium">
                {totalPending} item{totalPending !== 1 ? "s" : ""} awaiting your review
              </p>
            </div>
            <Link href="/admin/approvals">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white gap-1">
                Review Now <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Pending Review", value: totalPending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Active Members", value: stats.totalMembers, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Live Businesses", value: stats.totalBusinesses, icon: Building2, color: "text-teal-600", bg: "bg-teal-50" },
            { label: "Upcoming Events", value: stats.totalEvents, icon: Calendar, color: "text-purple-600", bg: "bg-lavender-100" },
            { label: "Market Listings", value: stats.totalListings, icon: ShoppingBag, color: "text-rose-600", bg: "bg-rose-50" },
            { label: "Pending Members", value: stats.pendingMembers, icon: Users, color: "text-amber-600", bg: "bg-amber-50" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-2`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {adminNav.map((item) => (
            <Link key={item.href} href={item.href} className="group">
              <Card className="hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
                <CardContent className="p-5 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground group-hover:text-purple-700 transition-colors">
                      {item.label}
                    </p>
                    {item.badge === "queue" && totalPending > 0 && (
                      <Badge variant="warning" className="text-xs mt-0.5">{totalPending} pending</Badge>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto shrink-0 group-hover:text-purple-600" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Registrations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                Pending Member Approvals
              </CardTitle>
              <Link href="/admin/approvals">
                <Button variant="ghost" size="sm" className="gap-1 text-purple-600">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentRegistrations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending approvals.</p>
            ) : (
              <div className="space-y-3">
                {recentRegistrations.map((user) => (
                  <div key={user.id} className="flex items-center justify-between gap-3 py-2.5 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className="text-xs">
                          {getInitials(user.profile?.name ?? user.name ?? user.email ?? "U")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.profile?.name ?? user.name ?? user.email}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        {user.profile?.city && (
                          <p className="text-xs text-muted-foreground">{user.profile.city}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground">{timeAgo(user.createdAt)}</span>
                      <Link href={`/admin/approvals?userId=${user.id}`}>
                        <Button size="sm" className="h-7 text-xs gap-1">
                          Review <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
