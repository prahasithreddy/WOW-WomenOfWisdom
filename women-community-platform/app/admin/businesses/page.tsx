import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Building2, ExternalLink, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Businesses — Admin" };

export default async function AdminBusinessesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) redirect("/");

  const businesses = await db.business.findMany({
    include: { owner: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  const statusIcon = (status: string) => {
    if (status === "PUBLISHED") return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />;
    if (status === "REJECTED") return <XCircle className="h-3.5 w-3.5 text-red-500" />;
    return <Clock className="h-3.5 w-3.5 text-amber-400" />;
  };

  return (
    <div className="min-h-screen bg-lavender-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-semibold text-foreground">Businesses</h1>
            <p className="text-sm text-muted-foreground">{businesses.length} total</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {businesses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Building2 className="h-10 w-10 mb-3 opacity-30" />
                <p>No businesses yet</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {businesses.map((biz) => (
                  <div key={biz.id} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                        <Building2 className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{biz.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {biz.owner.name} · {biz.owner.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <p className="text-xs text-muted-foreground hidden sm:block">{formatDate(biz.createdAt)}</p>
                      <div className="flex items-center gap-1.5">
                        {statusIcon(biz.status)}
                        <span className="text-xs text-muted-foreground capitalize">{biz.status.toLowerCase()}</span>
                      </div>
                      {biz.status === "PUBLISHED" && (
                        <Link
                          href={`/businesses/${biz.slug}`}
                          target="_blank"
                          className="text-purple-600 hover:text-purple-700"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      )}
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
