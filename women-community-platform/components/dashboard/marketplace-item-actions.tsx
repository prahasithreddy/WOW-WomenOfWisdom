"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Send, Eye } from "lucide-react";
import { submitForReview } from "@/lib/actions/review";
import Link from "next/link";
import type { MarketItem } from "@prisma/client";

export function MarketplaceItemActions({ item }: { item: MarketItem }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const canSubmit = ["DRAFT", "CHANGES_REQUESTED"].includes(item.status);
  const isPublished = item.status === "PUBLISHED";

  return (
    <div className="flex gap-2 shrink-0">
      {isPublished && (
        <Link href={`/marketplace/${item.slug}`} target="_blank">
          <Button size="sm" variant="secondary" className="gap-1">
            <Eye className="h-3.5 w-3.5" /> View
          </Button>
        </Link>
      )}
      {canSubmit && (
        <Button
          size="sm"
          variant="teal"
          className="gap-1"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            await submitForReview("market_item", item.id);
            setLoading(false);
            router.refresh();
          }}
        >
          <Send className="h-3.5 w-3.5" />
          {loading ? "Submitting..." : "Submit"}
        </Button>
      )}
    </div>
  );
}
