import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Bookmark, ExternalLink, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Saved Items — Dashboard" };

export default async function DashboardSavedPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const saved = await db.savedItem.findMany({
    where: { userId: session.user.id },
    include: { marketItem: { select: { title: true, slug: true, price: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-lavender-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-semibold text-foreground">Saved Items</h1>
            <p className="text-sm text-muted-foreground">{saved.length} saved</p>
          </div>
        </div>

        {saved.length === 0 ? (
          <Card className="p-12 text-center">
            <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground font-medium">Nothing saved yet</p>
            <p className="text-sm text-muted-foreground mt-1">Bookmark marketplace items to find them here.</p>
            <div className="mt-4">
              <Link href="/marketplace" className="text-purple-600 text-sm hover:underline">
                Browse Marketplace
              </Link>
            </div>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {saved.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-lavender-100 flex items-center justify-center">
                        <ShoppingBag className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.marketItem.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.marketItem.price ? `$${item.marketItem.price}` : "Free"} · Saved {formatDate(item.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/marketplace/${item.marketItem.slug}`}
                      className="text-purple-600 hover:text-purple-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
