"use client";

import Link from "next/link";
import { 
  User, Building2, ShoppingBag, Calendar, Bell, MessageSquare,
  CheckCircle, Clock, AlertCircle, PlusCircle, ArrowRight, Sparkles, Settings,
  CalendarCheck, Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusChip } from "@/components/shared/status-chip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, formatDate, timeAgo } from "@/lib/utils";
import type { MemberProfile, Business, MarketItem, Event, Enquiry } from "@prisma/client";

interface DashboardUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
  status: string;
}

interface DashboardOverviewProps {
  user: DashboardUser;
  profile: MemberProfile | null;
  business: Business | null;
  marketItems: MarketItem[];
  events: Event[];
  enquiries: Enquiry[];
  unreadNotifications: number;
}

export function DashboardOverview({
  user, profile, business, marketItems, events, enquiries, unreadNotifications,
}: DashboardOverviewProps) {
  // Profile completeness
  const profileComplete = profile
    ? ([profile.photo, profile.headline, profile.bio, profile.city, profile.phone].filter(Boolean).length / 5) * 100
    : 0;

  const quickLinks = [
    { label: "Edit Profile", href: "/dashboard/profile", icon: User, color: "bg-purple-100 text-purple-600" },
    { label: "My Business", href: "/dashboard/business", icon: Building2, color: "bg-teal-100 text-teal-600" },
    { label: "My Listings", href: "/dashboard/marketplace", icon: ShoppingBag, color: "bg-rose-100 text-rose-600" },
    { label: "My Events", href: "/dashboard/events", icon: Calendar, color: "bg-amber-100 text-amber-600" },
    { label: "Enquiries", href: "/dashboard/enquiries", icon: MessageSquare, color: "bg-lavender-200 text-purple-600" },
    { label: "Notifications", href: "/dashboard/notifications", icon: Bell, color: "bg-blue-50 text-blue-600" },
    { label: "Registrations", href: "/dashboard/registrations", icon: CalendarCheck, color: "bg-emerald-100 text-emerald-600" },
    { label: "Saved Items", href: "/dashboard/saved", icon: Bookmark, color: "bg-orange-100 text-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-lavender-50">
      {/* Header */}
      <div className="bg-purple-gradient py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 ring-2 ring-white/30">
                <AvatarImage src={user.image ?? undefined} />
                <AvatarFallback className="text-lg bg-white/20 text-white">
                  {getInitials(user.name ?? user.email ?? "M")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white/70 text-sm">Welcome back,</p>
                <h1 className="text-2xl font-serif font-semibold text-white">
                  {user.name ?? "Member"}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {unreadNotifications > 0 && (
                <Link href="/dashboard/notifications">
                  <Button variant="ghost" className="text-white border border-white/20 hover:bg-white/10 relative gap-2">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full text-xs text-white flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                    Notifications
                  </Button>
                </Link>
              )}
              <Link href="/dashboard/settings">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Quick Links */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href} className="group">
              <div className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 text-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${link.color}`}>
                  <link.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-foreground group-hover:text-purple-700 transition-colors">
                  {link.label}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Profile Completeness */}
        {profile && profileComplete < 100 && (
          <Card className="border-l-4 border-l-amber-400">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Complete Your Profile</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    A complete profile helps other members connect with you.
                  </p>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-amber-400 h-2 rounded-full transition-all"
                        style={{ width: `${profileComplete}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-amber-600">{Math.round(profileComplete)}%</span>
                  </div>
                  <Link href="/dashboard/profile">
                    <Button size="sm" variant="lavender">
                      Complete Profile <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Status */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-600" />
                  My Profile
                </CardTitle>
                {profile && <StatusChip status={profile.status} />}
              </div>
            </CardHeader>
            <CardContent>
              {!profile ? (
                <div className="text-sm text-muted-foreground mb-3">
                  Create your public member profile to appear in the directory.
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  {profile.headline && <p className="text-muted-foreground">{profile.headline}</p>}
                  <div className="flex gap-2 flex-wrap">
                    {profile.city && <span className="badge-lavender">{profile.city}</span>}
                  </div>
                  {(profile.status === "CHANGES_REQUESTED" || profile.status === "REJECTED") && (
                    <div className="mt-3 p-3 bg-rose-50 rounded-xl border border-rose-200">
                      <p className="text-xs text-rose-700 font-medium">Action required</p>
                      <Link href="/dashboard/profile">
                        <Button size="sm" className="mt-2 gap-1" variant="secondary">
                          Revise & Resubmit <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
              <div className="mt-4 pt-3 border-t border-border">
                <Link href="/dashboard/profile">
                  <Button size="sm" variant="ghost" className="gap-1 p-0 h-auto text-purple-600">
                    {profile ? "Edit Profile" : "Create Profile"} <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Business Status */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-teal-600" />
                  My Business
                </CardTitle>
                {business && <StatusChip status={business.status} />}
              </div>
            </CardHeader>
            <CardContent>
              {!business ? (
                <p className="text-sm text-muted-foreground mb-4">
                  List your business in our directory to reach the community.
                </p>
              ) : (
                <div className="text-sm">
                  <p className="font-medium text-foreground">{business.name}</p>
                  {business.tagline && <p className="text-muted-foreground mt-0.5">{business.tagline}</p>}
                </div>
              )}
              <div className="mt-4 pt-3 border-t border-border">
                <Link href="/dashboard/business">
                  <Button size="sm" variant="ghost" className="gap-1 p-0 h-auto text-teal-600">
                    {business ? "Manage Business" : "Add Business"} <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Market Items */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-rose-600" />
                  Marketplace Listings
                </CardTitle>
                <Link href="/dashboard/marketplace/new">
                  <Button size="sm" variant="ghost" className="gap-1 text-xs h-7">
                    <PlusCircle className="h-3 w-3" /> New
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {marketItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">No listings yet.</p>
              ) : (
                <div className="space-y-3">
                  {marketItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</p>
                      </div>
                      <StatusChip status={item.status} size="sm" />
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-3 pt-3 border-t border-border">
                <Link href="/dashboard/marketplace">
                  <Button size="sm" variant="ghost" className="gap-1 p-0 h-auto text-rose-600">
                    All listings <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Enquiries */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-purple-600" />
                Recent Enquiries
              </CardTitle>
            </CardHeader>
            <CardContent>
              {enquiries.length === 0 ? (
                <p className="text-sm text-muted-foreground">No enquiries yet.</p>
              ) : (
                <div className="space-y-3">
                  {enquiries.slice(0, 3).map((enq) => (
                    <div key={enq.id} className="flex items-start gap-3">
                      <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${enq.status === "UNREAD" ? "bg-purple-500" : "bg-gray-300"}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{enq.senderName}</p>
                        <p className="text-xs text-muted-foreground truncate">{enq.message}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(enq.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-3 pt-3 border-t border-border">
                <Link href="/dashboard/enquiries">
                  <Button size="sm" variant="ghost" className="gap-1 p-0 h-auto text-purple-600">
                    View all <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
