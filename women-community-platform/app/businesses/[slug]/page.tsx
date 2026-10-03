import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MapPin, Globe, Phone, Mail, Clock, Tag, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EnquiryForm } from "@/components/shared/enquiry-form";
import { parseJson, formatPrice, getInitials } from "@/lib/utils";
import Link from "next/link";

export const revalidate = 60;

interface Params { slug: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const biz = await db.business.findUnique({ where: { slug } });
  return {
    title: biz?.name ?? "Business",
    description: biz?.tagline ?? biz?.description ?? "",
  };
}

export default async function BusinessDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  const business = await db.business.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      owner: {
        include: {
          profile: { select: { slug: true, name: true, photo: true, headline: true } },
        },
      },
      category: true,
      tags: true,
      offerings: { where: { status: "PUBLISHED" } },
    },
  });

  if (!business) notFound();

  const contact = parseJson<Record<string, string>>(business.contactJson, {});
  const social = parseJson<Record<string, string>>(business.socialJson, {});

  return (
    <div className="min-h-screen bg-lavender-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        {business.banner && (
          <div className="rounded-2xl overflow-hidden aspect-[3/1] bg-lavender-100 mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={business.banner} alt={business.name} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Header */}
            <Card className="p-8">
              <div className="flex items-start gap-5">
                <div className="w-20 h-20 rounded-2xl bg-lavender-100 flex items-center justify-center shrink-0 overflow-hidden">
                  {business.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={business.logo} alt={business.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-serif font-bold text-3xl text-purple-600">{business.name[0]}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-serif font-semibold text-foreground mb-1">{business.name}</h1>
                  {business.tagline && (
                    <p className="text-muted-foreground italic">{business.tagline}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {business.category && (
                      <Badge variant="secondary">{business.category.name}</Badge>
                    )}
                    {business.tags.slice(0, 5).map((t) => (
                      <Badge key={t.id} variant="outline">{t.tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {business.description && (
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-muted-foreground leading-relaxed">{business.description}</p>
                </div>
              )}
            </Card>

            {/* Offerings */}
            {business.offerings.length > 0 && (
              <Card className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <ShoppingBag className="h-5 w-5 text-purple-600" />
                  <h2 className="text-xl font-serif font-semibold">Products & Services</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {business.offerings.map((offering) => {
                    const imgs = parseJson<string[]>(offering.images, []);
                    return (
                      <div key={offering.id} className="rounded-xl border border-border p-4 hover:border-purple-200 transition-colors">
                        {imgs[0] && (
                          <div className="aspect-video rounded-lg bg-lavender-50 overflow-hidden mb-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={imgs[0]} alt={offering.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Badge variant={offering.type === "PRODUCT" ? "default" : "teal"} className="text-xs mb-1">
                              {offering.type === "PRODUCT" ? "Product" : "Service"}
                            </Badge>
                            <h4 className="font-semibold text-sm text-foreground">{offering.title}</h4>
                            {offering.description && (
                              <p className="text-xs text-muted-foreground mt-1">{offering.description}</p>
                            )}
                          </div>
                          {offering.price && (
                            <p className="text-base font-bold text-purple-700 shrink-0">
                              {offering.priceLabel ?? formatPrice(offering.price)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Contact Info */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Contact</h3>
              <div className="space-y-3 text-sm">
                {contact.phone && (
                  <a href={`tel:${contact.phone}`} className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors">
                    <Phone className="h-4 w-4 text-purple-400 shrink-0" />
                    {contact.phone}
                  </a>
                )}
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors">
                    <Mail className="h-4 w-4 text-teal-500 shrink-0" />
                    {contact.email}
                  </a>
                )}
                {business.website && (
                  <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-muted-foreground hover:text-purple-600 transition-colors">
                    <Globe className="h-4 w-4 text-purple-400 shrink-0" />
                    {business.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
                {business.location && (
                  <div className="flex items-center gap-2.5 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-teal-500 shrink-0" />
                    {business.location}
                  </div>
                )}
                {business.hours && (
                  <div className="flex items-start gap-2.5 text-muted-foreground">
                    <Clock className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>{business.hours}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Owner */}
            {business.owner.profile && (
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Owner</h3>
                <Link href={`/members/${business.owner.profile.slug}`} className="group flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={business.owner.profile.photo ?? undefined} />
                    <AvatarFallback>{getInitials(business.owner.profile.name ?? "")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm text-foreground group-hover:text-purple-700 transition-colors">
                      {business.owner.profile.name}
                    </p>
                    {business.owner.profile.headline && (
                      <p className="text-xs text-muted-foreground">{business.owner.profile.headline}</p>
                    )}
                  </div>
                </Link>
              </Card>
            )}

            {/* Enquiry */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Send Enquiry</h3>
              <EnquiryForm
                targetType="business"
                targetId={business.id}
                recipientName={business.name}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
