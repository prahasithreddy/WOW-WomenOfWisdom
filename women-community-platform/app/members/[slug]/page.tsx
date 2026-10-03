import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MapPin, Globe, ExternalLink, Building2, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EnquiryForm } from "@/components/shared/enquiry-form";
import { getInitials, parseJson } from "@/lib/utils";
import Link from "next/link";

export const revalidate = 60;

interface Params { slug: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const profile = await db.memberProfile.findUnique({ where: { slug } });
  return {
    title: profile?.name ?? "Member",
    description: profile?.bio ?? `Connect with ${profile?.name} on Women's Circle`,
  };
}

export default async function MemberProfilePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  
  const profile = await db.memberProfile.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      user: { select: { createdAt: true } },
      industry: true,
    },
  });

  if (!profile) notFound();

  const business = await db.business.findFirst({
    where: { ownerId: profile.userId, status: "PUBLISHED" },
    include: { category: true },
  });

  const interests = parseJson<string[]>(profile.interests, []);
  const skills = parseJson<string[]>(profile.skills, []);

  return (
    <div className="min-h-screen bg-lavender-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Card */}
        <Card className="p-8 mb-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <Avatar className="h-24 w-24 ring-4 ring-purple-100">
                <AvatarImage src={profile.photo ?? undefined} />
                <AvatarFallback className="text-2xl">{getInitials(profile.name)}</AvatarFallback>
              </Avatar>
              {profile.isFeatured && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
                  <Star className="h-3.5 w-3.5 text-white fill-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-serif font-semibold text-foreground">{profile.name}</h1>
                  {profile.headline && (
                    <p className="text-muted-foreground mt-1">{profile.headline}</p>
                  )}
                </div>
                {profile.isFeatured && (
                  <Badge variant="default" className="hidden sm:flex gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    Featured
                  </Badge>
                )}
              </div>

              {/* Location & Industry */}
              <div className="flex flex-wrap gap-3 mt-3">
                {profile.city && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-purple-400" />
                    <span>{profile.city}{profile.country ? `, ${profile.country}` : ""}</span>
                  </div>
                )}
                {profile.industry && (
                  <Badge variant="secondary">{profile.industry.name}</Badge>
                )}
              </div>

              {/* Social Links */}
              <div className="flex gap-2 mt-4">
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" aria-label="Website"
                    className="p-2 rounded-full bg-lavender-100 text-purple-600 hover:bg-lavender-200 transition-colors">
                    <Globe className="h-4 w-4" />
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                    className="p-2 rounded-full bg-lavender-100 text-purple-600 hover:bg-lavender-200 transition-colors">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {profile.instagram && (
                  <a href={profile.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                    className="p-2 rounded-full bg-lavender-100 text-purple-600 hover:bg-lavender-200 transition-colors">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {profile.twitter && (
                  <a href={profile.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter/X"
                    className="p-2 rounded-full bg-lavender-100 text-purple-600 hover:bg-lavender-200 transition-colors">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">About</h3>
              <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {/* Skills & Interests */}
          {(skills.length > 0 || interests.length > 0) && (
            <div className="mt-6 pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-5">
              {skills.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {interests.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <Badge key={interest} variant="teal">{interest}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Business */}
          {business && (
            <div className="md:col-span-2">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-4 w-4 text-purple-600" />
                  <h3 className="font-semibold text-foreground">Business</h3>
                </div>
                <Link href={`/businesses/${business.slug}`} className="group flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-lavender-100 flex items-center justify-center shrink-0">
                    {business.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={business.logo} alt={business.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span className="font-serif font-bold text-purple-600">{business.name[0]}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-purple-700 transition-colors">{business.name}</h4>
                    {business.category && <Badge variant="secondary" className="text-xs mt-1">{business.category.name}</Badge>}
                    {business.tagline && <p className="text-sm text-muted-foreground mt-1">{business.tagline}</p>}
                  </div>
                </Link>
              </Card>
            </div>
          )}

          {/* Connect */}
          <div className={business ? "md:col-span-1" : "md:col-span-3 max-w-md"}>
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Send a Message</h3>
              <EnquiryForm
                targetType="member"
                targetId={profile.id}
                recipientName={profile.name}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
