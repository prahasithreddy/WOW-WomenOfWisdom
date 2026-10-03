import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MapPin, Tag, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EnquiryForm } from "@/components/shared/enquiry-form";
import { MARKET_CATEGORY_LABELS, MARKET_CONDITION_LABELS } from "@/lib/constants";
import { formatPrice, parseJson, formatDate } from "@/lib/utils";

export const revalidate = 60;

interface Params { slug: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await db.marketItem.findUnique({ where: { slug } });
  return { title: item?.title ?? "Item", description: item?.description ?? "" };
}

export default async function MarketItemPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  const item = await db.marketItem.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      seller: {
        include: {
          profile: { select: { slug: true, name: true, photo: true, headline: true } },
        },
      },
    },
  });

  if (!item) notFound();

  const images = parseJson<string[]>(item.images, []);

  return (
    <div className="min-h-screen bg-lavender-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-0 overflow-hidden">
              {/* Image Gallery */}
              {images.length > 0 ? (
                <div>
                  <div className="aspect-square bg-lavender-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={images[0]} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  {images.length > 1 && (
                    <div className="flex gap-2 p-4 overflow-x-auto">
                      {images.slice(1).map((img, i) => (
                        <div key={i} className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-lavender-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img} alt={`${item.title} ${i + 2}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square bg-lavender-100 flex items-center justify-center">
                  <Tag className="h-16 w-16 text-purple-300" />
                </div>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary">{MARKET_CATEGORY_LABELS[item.category]}</Badge>
                <Badge variant="ghost">{MARKET_CONDITION_LABELS[item.condition]}</Badge>
                <Badge variant={item.saleStatus === "AVAILABLE" ? "teal" : "blush"}>
                  {item.saleStatus === "AVAILABLE" ? "Available" : item.saleStatus === "RESERVED" ? "Reserved" : "Sold"}
                </Badge>
              </div>
              <h1 className="text-2xl font-serif font-semibold text-foreground mb-2">{item.title}</h1>
              {item.price && (
                <p className="text-2xl font-bold text-purple-700 mb-4">{formatPrice(item.price, item.currency)}</p>
              )}
              {item.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 text-teal-500" />
                  {item.location}
                </div>
              )}
              {item.description && (
                <div className="pt-4 border-t border-border">
                  <h2 className="font-semibold text-foreground mb-2">Description</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{item.description}</p>
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Listed {formatDate(item.createdAt)}
                {item.expiresAt && ` · Expires ${formatDate(item.expiresAt)}`}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {item.seller.profile && (
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-3">Seller</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm">
                      {item.seller.name?.[0] ?? "S"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{item.seller.name}</p>
                    {item.seller.profile.headline && (
                      <p className="text-xs text-muted-foreground">{item.seller.profile.headline}</p>
                    )}
                  </div>
                </div>
              </Card>
            )}

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Contact Seller</h3>
              <EnquiryForm
                targetType="market_item"
                targetId={item.id}
                recipientName={item.seller.name ?? "Seller"}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
