import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, User, Shield, Bell, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Settings — Dashboard" };

export default async function DashboardSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, name: true, createdAt: true, role: true },
  });

  const settingsGroups = [
    {
      title: "Account",
      items: [
        { label: "Profile", description: "Update your member profile", href: "/dashboard/profile", icon: User },
        { label: "Business", description: "Manage your business listing", href: "/dashboard/business", icon: Shield },
        { label: "Notifications", description: "View your notifications", href: "/dashboard/notifications", icon: Bell },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-lavender-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-serif font-semibold text-foreground">Settings</h1>
        </div>

        {/* User Info */}
        <Card className="p-5 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <User className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{user?.name ?? "Member"}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground mt-1 capitalize">
                Role: {user?.role?.toLowerCase()}
              </p>
            </div>
          </div>
        </Card>

        {/* Settings Groups */}
        {settingsGroups.map((group) => (
          <div key={group.title} className="mb-6">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
              {group.title}
            </h2>
            <Card>
              <CardContent className="p-0">
                {group.items.map((item, idx) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between gap-4 p-4 hover:bg-gray-50/50 transition-colors ${idx < group.items.length - 1 ? "border-b border-border/50" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-lavender-100 flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
