import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlusCircle, Tag, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/shared/status-chip";
import { Card } from "@/components/ui/card";
import { MARKET_CATEGORY_LABELS } from "@/lib/constants";
import { formatPrice, formatDate } from "@/lib/utils";
import { MarketplaceItemActions } from "@/components/dashboard/marketplace-item-actions";

export const metadata = { title: "Marketplace — Dashboard" };

export default async function DashboardMarketplacePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const items = await db.marketItem.findMany({
    where: { sellerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      reviewLogs: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  return (
    <div className="min-h-screen bg-lavender-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-serif font-semibold text-foreground">My Listings</h1>
              <p className="text-muted-foreground text-sm">{items.length} item{items.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <Link href="/dashboard/marketplace/new">
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" /> New Listing
            </Button>
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-border/50">
            <Tag className="h-12 w-12 text-purple-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No listings yet</h3>
            <p className="text-muted-foreground mb-6">List items to sell in the community marketplace.</p>
            <Link href="/dashboard/marketplace/new">
              <Button>Create First Listing</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const lastLog = item.reviewLogs[0];
              return (
                <Card key={item.id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">{item.title}</h3>
                        <StatusChip status={item.status} size="sm" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {MARKET_CATEGORY_LABELS[item.category]} · {item.saleStatus}
                        {item.price ? ` · ${formatPrice(item.price, item.currency)}` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Listed {formatDate(item.createdAt)}</p>
                      {lastLog?.comment && (lastLog.state === "CHANGES_REQUESTED" || lastLog.state === "REJECTED") && (
                        <div className="mt-2 p-2 bg-rose-50 border border-rose-200 rounded-lg">
                          <p className="text-xs text-rose-700">{lastLog.comment}</p>
                        </div>
                      )}
                    </div>
                    <MarketplaceItemActions item={item} />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
