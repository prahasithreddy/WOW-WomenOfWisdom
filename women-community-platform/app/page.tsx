import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { EventFeed } from "@/components/home/event-feed";
import { FeaturedBusinesses } from "@/components/home/featured-businesses";
import { MarketplaceHighlights } from "@/components/home/marketplace-highlights";
import { FeaturedMembers } from "@/components/home/featured-members";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { db } from "@/lib/db";

export const revalidate = 60; // ISR: revalidate every minute

async function getHomeData() {
  const [events, businesses, marketItems, members, stats] = await Promise.all([
    db.event.findMany({
      where: {
        status: "PUBLISHED",
        endsAt: { gt: new Date() },
      },
      orderBy: [{ isPinnedHome: "desc" }, { startsAt: "asc" }],
      take: 3,
    }),
    db.business.findMany({
      where: { status: "PUBLISHED", isFeatured: true },
      orderBy: { featuredOrder: "asc" },
      take: 6,
      include: {
        owner: { select: { name: true } },
        category: true,
      },
    }),
    db.marketItem.findMany({
      where: { status: "PUBLISHED", saleStatus: "AVAILABLE" },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    db.memberProfile.findMany({
      where: { status: "PUBLISHED", isFeatured: true },
      orderBy: { featuredOrder: "asc" },
      take: 6,
    }),
    Promise.all([
      db.user.count({ where: { status: "APPROVED" } }),
      db.business.count({ where: { status: "PUBLISHED" } }),
      db.event.count({ where: { status: "PUBLISHED" } }),
      db.marketItem.count({ where: { status: "PUBLISHED" } }),
    ]),
  ]);

  return {
    events,
    businesses,
    marketItems,
    members,
    stats: {
      members: stats[0],
      businesses: stats[1],
      events: stats[2],
      listings: stats[3],
    },
  };
}

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <div className="flex flex-col">
      <HeroSection />
      <StatsSection stats={data.stats} />
      <EventFeed events={data.events} />
      <FeaturedBusinesses businesses={data.businesses} />
      <MarketplaceHighlights items={data.marketItems} />
      <FeaturedMembers members={data.members} />
      <NewsletterSection />
    </div>
  );
}
