"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Send, Eye } from "lucide-react";
import { submitForReview } from "@/lib/actions/review";
import Link from "next/link";
import type { Event } from "@prisma/client";

export function EventActions({ event }: { event: Event }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const canSubmit = ["DRAFT", "CHANGES_REQUESTED"].includes(event.status);
  const isPublished = event.status === "PUBLISHED";

  return (
    <div className="flex gap-2 shrink-0">
      {isPublished && (
        <Link href={`/events/${event.slug}`} target="_blank">
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
            await submitForReview("event", event.id);
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
