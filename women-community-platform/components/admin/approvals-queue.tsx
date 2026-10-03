"use client";

import { useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, User, Building2, Calendar, ShoppingBag, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { approveMember, rejectMember, adminReview } from "@/lib/actions/review";
import { getInitials, formatDate, timeAgo } from "@/lib/utils";
import { useRouter } from "next/navigation";
import type { User as UserType, MemberProfile, Business, Event, MarketItem, Category } from "@prisma/client";

type UserWithProfile = UserType & { profile: MemberProfile | null };
type ProfileWithUser = MemberProfile & { user: { email: string } };
type BusinessWithOwner = Business & { owner: { email: string; name: string | null }; category: Category | null };
type EventWithOrganiser = Event & { organiser: { email: string; name: string | null } };
type MarketWithSeller = MarketItem & { seller: { email: string; name: string | null } };

interface ApprovalsQueueProps {
  pendingMembers: UserWithProfile[];
  pendingProfiles: ProfileWithUser[];
  pendingBusinesses: BusinessWithOwner[];
  pendingEvents: EventWithOrganiser[];
  pendingMarket: MarketWithSeller[];
}

export function ApprovalsQueue({
  pendingMembers, pendingProfiles, pendingBusinesses, pendingEvents, pendingMarket,
}: ApprovalsQueueProps) {
  const router = useRouter();
  const total = pendingMembers.length + pendingProfiles.length + pendingBusinesses.length + pendingEvents.length + pendingMarket.length;

  return (
    <div className="min-h-screen bg-lavender-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-semibold text-foreground">Approvals Queue</h1>
          <p className="text-muted-foreground mt-1">
            {total} item{total !== 1 ? "s" : ""} awaiting review
          </p>
        </div>

        <Tabs defaultValue="members">
          <TabsList className="mb-6 w-full sm:w-auto">
            <TabsTrigger value="members" className="gap-1.5">
              <User className="h-3.5 w-3.5" />
              Members
              {pendingMembers.length > 0 && <Badge variant="blush" className="ml-1 text-xs">{pendingMembers.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="profiles">Profiles {pendingProfiles.length > 0 && `(${pendingProfiles.length})`}</TabsTrigger>
            <TabsTrigger value="businesses">
              <Building2 className="h-3.5 w-3.5" />
              Businesses {pendingBusinesses.length > 0 && `(${pendingBusinesses.length})`}
            </TabsTrigger>
            <TabsTrigger value="events">Events {pendingEvents.length > 0 && `(${pendingEvents.length})`}</TabsTrigger>
            <TabsTrigger value="market">Marketplace {pendingMarket.length > 0 && `(${pendingMarket.length})`}</TabsTrigger>
          </TabsList>

          {/* Pending Members */}
          <TabsContent value="members">
            {pendingMembers.length === 0 ? (
              <EmptyState message="No pending member approvals." />
            ) : (
              <div className="space-y-4">
                {pendingMembers.map((user) => (
                  <MemberApprovalCard
                    key={user.id}
                    user={user}
                    onAction={() => router.refresh()}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profiles */}
          <TabsContent value="profiles">
            {pendingProfiles.length === 0 ? (
              <EmptyState message="No pending profile submissions." />
            ) : (
              <div className="space-y-4">
                {pendingProfiles.map((profile) => (
                  <ContentApprovalCard
                    key={profile.id}
                    title={profile.name}
                    subtitle={profile.user.email}
                    description={profile.bio ?? profile.headline ?? ""}
                    entityType="member_profile"
                    entityId={profile.id}
                    onAction={() => router.refresh()}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Businesses */}
          <TabsContent value="businesses">
            {pendingBusinesses.length === 0 ? (
              <EmptyState message="No pending business submissions." />
            ) : (
              <div className="space-y-4">
                {pendingBusinesses.map((biz) => (
                  <ContentApprovalCard
                    key={biz.id}
                    title={biz.name}
                    subtitle={`by ${biz.owner.name ?? biz.owner.email}`}
                    description={biz.description ?? biz.tagline ?? ""}
                    badge={biz.category?.name}
                    entityType="business"
                    entityId={biz.id}
                    onAction={() => router.refresh()}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Events */}
          <TabsContent value="events">
            {pendingEvents.length === 0 ? (
              <EmptyState message="No pending event submissions." />
            ) : (
              <div className="space-y-4">
                {pendingEvents.map((event) => (
                  <ContentApprovalCard
                    key={event.id}
                    title={event.title}
                    subtitle={`by ${event.organiser.name ?? event.organiser.email}`}
                    description={event.description ?? ""}
                    badge={event.type}
                    entityType="event"
                    entityId={event.id}
                    onAction={() => router.refresh()}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Marketplace */}
          <TabsContent value="market">
            {pendingMarket.length === 0 ? (
              <EmptyState message="No pending marketplace submissions." />
            ) : (
              <div className="space-y-4">
                {pendingMarket.map((item) => (
                  <ContentApprovalCard
                    key={item.id}
                    title={item.title}
                    subtitle={`by ${item.seller.name ?? item.seller.email}`}
                    description={item.description ?? ""}
                    badge={item.category}
                    entityType="market_item"
                    entityId={item.id}
                    onAction={() => router.refresh()}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12 bg-white rounded-2xl border border-border/50">
      <CheckCircle className="h-10 w-10 text-teal-300 mx-auto mb-3" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

function MemberApprovalCard({
  user, onAction,
}: { user: UserWithProfile; onAction: () => void }) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  const handleApprove = async () => {
    setLoading("approve");
    await approveMember(user.id, comment);
    setLoading(null);
    onAction();
  };

  const handleReject = async () => {
    if (!comment) { alert("Please provide a reason for rejection."); return; }
    setLoading("reject");
    await rejectMember(user.id, comment);
    setLoading(null);
    onAction();
  };

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12 ring-2 ring-purple-100 shrink-0">
          <AvatarFallback>{getInitials(user.profile?.name ?? user.name ?? user.email ?? "U")}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h3 className="font-semibold text-foreground">{user.profile?.name ?? user.name ?? "No name"}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {user.profile?.city && <p className="text-xs text-muted-foreground">{user.profile.city}</p>}
              {user.profile?.headline && <p className="text-xs text-muted-foreground mt-1">{user.profile.headline}</p>}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {timeAgo(user.createdAt)}
            </div>
          </div>

          {user.profile?.bio && (
            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{user.profile.bio}</p>
          )}

          <div className="mt-4 space-y-3">
            <Textarea
              placeholder="Optional: comment or reason for rejection..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              className="text-sm"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="teal"
                className="gap-1.5"
                onClick={handleApprove}
                disabled={!!loading}
              >
                <CheckCircle className="h-3.5 w-3.5" />
                {loading === "approve" ? "Approving..." : "Approve"}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="gap-1.5 text-amber-700 border-amber-200 hover:bg-amber-50"
                onClick={async () => {
                  if (!comment) { alert("Please add a comment for changes requested."); return; }
                  setLoading("reject");
                  await adminReview("member_profile", user.profile?.id ?? user.id, "changes", comment);
                  setLoading(null);
                  onAction();
                }}
                disabled={!!loading}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                Request Changes
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="gap-1.5"
                onClick={handleReject}
                disabled={!!loading}
              >
                <XCircle className="h-3.5 w-3.5" />
                {loading === "reject" ? "Rejecting..." : "Reject"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ContentApprovalCard({
  title, subtitle, description, badge, entityType, entityId, onAction,
}: {
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
  entityType: "member_profile" | "business" | "market_item" | "event";
  entityId: string;
  onAction: () => void;
}) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (decision: "approve" | "changes" | "reject") => {
    if (decision !== "approve" && !comment) {
      alert("Please add a comment.");
      return;
    }
    setLoading(decision);
    await adminReview(entityType, entityId, decision, comment);
    setLoading(null);
    onAction();
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground">{title}</h3>
            {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{description}</p>
      )}
      <div className="space-y-3">
        <Textarea
          placeholder="Optional comment / reason..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
          className="text-sm"
        />
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" variant="teal" className="gap-1.5" onClick={() => handleAction("approve")} disabled={!!loading}>
            <CheckCircle className="h-3.5 w-3.5" />
            {loading === "approve" ? "Publishing..." : "Approve & Publish"}
          </Button>
          <Button size="sm" variant="secondary" className="gap-1.5 text-amber-700 border-amber-200 hover:bg-amber-50" onClick={() => handleAction("changes")} disabled={!!loading}>
            <AlertTriangle className="h-3.5 w-3.5" />
            Request Changes
          </Button>
          <Button size="sm" variant="destructive" className="gap-1.5" onClick={() => handleAction("reject")} disabled={!!loading}>
            <XCircle className="h-3.5 w-3.5" />
            Reject
          </Button>
        </div>
      </div>
    </Card>
  );
}
