"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Shield, UserX, UserCheck, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusChip } from "@/components/shared/status-chip";
import { getInitials, timeAgo } from "@/lib/utils";
import { approveMember, rejectMember } from "@/lib/actions/review";
import Link from "next/link";
import type { User, MemberProfile } from "@prisma/client";

type UserWithProfile = User & {
  profile: Pick<MemberProfile, "name" | "city" | "slug"> | null;
};

export function AdminMembersClient({ users }: { users: UserWithProfile[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = users.filter((u) => {
    const name = u.profile?.name ?? u.name ?? u.email ?? "";
    const matchesQuery = !query || name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter === "all" || u.status === roleFilter;
    return matchesQuery && matchesRole;
  });

  return (
    <div className="min-h-screen bg-lavender-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-semibold text-foreground">Members</h1>
            <p className="text-muted-foreground text-sm">{users.length} total users</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-card p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search members..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10" />
          </div>
          <div className="flex gap-2">
            {["all", "PENDING", "APPROVED", "REJECTED", "SUSPENDED"].map((s) => (
              <button
                key={s}
                onClick={() => setRoleFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  roleFilter === s ? "bg-purple-600 text-white" : "bg-gray-100 text-muted-foreground hover:bg-purple-50"
                }`}
              >
                {s === "all" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="divide-y divide-border/50">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">No members found.</div>
            ) : (
              filtered.map((user) => (
                <MemberRow key={user.id} user={user} onRefresh={() => router.refresh()} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MemberRow({ user, onRefresh }: { user: UserWithProfile; onRefresh: () => void }) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors">
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarFallback className="text-xs">{getInitials(user.profile?.name ?? user.name ?? "U")}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {user.profile?.name ?? user.name ?? "Unnamed"}
        </p>
        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        {user.profile?.city && <p className="text-xs text-muted-foreground">{user.profile.city}</p>}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <Badge variant={user.role === "ADMIN" ? "default" : user.role === "MEMBER" ? "teal" : "secondary"} className="text-xs hidden sm:flex">
          {user.role}
        </Badge>
        <StatusChip status={user.status} size="sm" />
        <span className="text-xs text-muted-foreground hidden md:block">{timeAgo(user.createdAt)}</span>
        {user.status === "PENDING" && (
          <Button
            size="sm"
            variant="teal"
            className="h-7 text-xs gap-1"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              await approveMember(user.id);
              setLoading(false);
              onRefresh();
            }}
          >
            <UserCheck className="h-3.5 w-3.5" />
            Approve
          </Button>
        )}
        {user.status === "APPROVED" && (
          <Button
            size="sm"
            variant="destructive"
            className="h-7 text-xs gap-1"
            disabled={loading}
            onClick={async () => {
              if (!confirm("Suspend this member?")) return;
              setLoading(true);
              await rejectMember(user.id, "Account suspended by admin.");
              setLoading(false);
              onRefresh();
            }}
          >
            <UserX className="h-3.5 w-3.5" />
            Suspend
          </Button>
        )}
      </div>
    </div>
  );
}
