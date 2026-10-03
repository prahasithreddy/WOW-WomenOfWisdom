import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MessageSquare, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";

export const metadata = { title: "Enquiries — Dashboard" };

export default async function DashboardEnquiriesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const business = await db.business.findFirst({ where: { ownerId: session.user.id } });

  const enquiries = await db.enquiry.findMany({
    where: {
      OR: [
        ...(business ? [{ targetId: business.id }] : []),
        { senderId: session.user.id },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const received = enquiries.filter((e) => business && e.targetId === business.id);
  const sent = enquiries.filter((e) => e.senderId === session.user.id);

  return (
    <div className="min-h-screen bg-lavender-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-serif font-semibold text-foreground">Enquiries</h1>
        </div>

        {/* Received */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Received ({received.length})
          </h2>
          {received.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl border border-border/50">
              <MessageSquare className="h-8 w-8 text-purple-300 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No enquiries received yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {received.map((enq) => (
                <Card key={enq.id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm text-foreground">{enq.senderName}</h4>
                        {enq.status === "UNREAD" && (
                          <Badge variant="blush" className="text-xs">New</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{enq.senderEmail}</p>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{enq.message}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Clock className="h-3.5 w-3.5" />
                      {timeAgo(enq.createdAt)}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <a
                      href={`mailto:${enq.senderEmail}?subject=Re: Enquiry`}
                      className="text-xs text-purple-600 font-medium hover:underline"
                    >
                      Reply via email →
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sent */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Sent ({sent.length})
          </h2>
          {sent.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl border border-border/50">
              <p className="text-muted-foreground text-sm">No enquiries sent yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sent.map((enq) => (
                <Card key={enq.id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <Badge variant="secondary" className="text-xs mb-2 capitalize">
                        To: {enq.targetType.replace("_", " ")}
                      </Badge>
                      <p className="text-sm text-muted-foreground leading-relaxed">{enq.message}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Clock className="h-3.5 w-3.5" />
                      {timeAgo(enq.createdAt)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
