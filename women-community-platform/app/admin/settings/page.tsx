import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Settings, Database, Shield, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Settings — Admin" };

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) redirect("/");

  return (
    <div className="min-h-screen bg-lavender-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-serif font-semibold text-foreground">Settings</h1>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="h-4 w-4 text-purple-600" />
                Database
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Provider</span>
                  <Badge variant="secondary">SQLite</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>ORM</span>
                  <Badge variant="secondary">Prisma v5</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <Badge variant="teal">Connected</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-teal-600" />
                Authentication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Provider</span>
                  <Badge variant="secondary">NextAuth.js v5</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Session</span>
                  <Badge variant="secondary">JWT</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>2FA</span>
                  <Badge variant="ghost">Not configured</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="h-4 w-4 text-purple-600" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Provider</span>
                  <Badge variant="ghost">Not configured</Badge>
                </div>
                <p className="text-xs mt-2 bg-amber-50 text-amber-700 p-3 rounded-lg">
                  Configure Resend, SendGrid, or Amazon SES in your .env file to enable transactional emails.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                Platform Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Platform Name</span>
                  <span className="font-medium text-foreground">Women&apos;s Circle</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Framework</span>
                  <Badge variant="secondary">Next.js 16</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Version</span>
                  <Badge variant="secondary">1.0.0 MVP</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
