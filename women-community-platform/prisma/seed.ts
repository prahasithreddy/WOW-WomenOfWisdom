import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Categories
  const industryCategories = [
    "Technology", "Healthcare", "Finance", "Education", "Marketing",
    "Legal", "Real Estate", "Retail", "Food & Beverage", "Fashion",
    "Arts & Culture", "Consulting", "Media & Entertainment", "Non-Profit", "Other",
  ];

  const businessCategories = [
    "Wellness & Beauty", "Food & Catering", "Consulting & Coaching",
    "Legal Services", "Marketing & PR", "Technology & IT",
    "Finance & Accounting", "Education & Training", "Fashion & Clothing",
    "Arts & Crafts", "Event Planning", "Real Estate", "Healthcare", "Other",
  ];

  for (const name of industryCategories) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await prisma.category.upsert({
      where: { slug: `industry-${slug}` },
      update: {},
      create: { type: "industry", name, slug: `industry-${slug}` },
    });
  }

  for (const name of businessCategories) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await prisma.category.upsert({
      where: { slug: `biz-${slug}` },
      update: {},
      create: { type: "business", name, slug: `biz-${slug}` },
    });
  }

  console.log("✅ Categories created");

  // Admin user
  const adminHash = await bcrypt.hash("admin123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@womenscircle.com" },
    update: {},
    create: {
      email: "admin@womenscircle.com",
      name: "Admin User",
      passwordHash: adminHash,
      role: "ADMIN",
      status: "APPROVED",
      emailVerified: new Date(),
    },
  });

  await prisma.memberProfile.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      slug: "admin-user",
      name: "Admin User",
      headline: "Platform Administrator",
      status: "PUBLISHED",
    },
  });

  console.log("✅ Admin user created: admin@womenscircle.com / admin123456");

  // Demo member
  const memberHash = await bcrypt.hash("member123456", 12);
  const member = await prisma.user.upsert({
    where: { email: "member@womenscircle.com" },
    update: {},
    create: {
      email: "member@womenscircle.com",
      name: "Jane Smith",
      passwordHash: memberHash,
      role: "MEMBER",
      status: "APPROVED",
      emailVerified: new Date(),
    },
  });

  const memberProfile = await prisma.memberProfile.upsert({
    where: { userId: member.id },
    update: {},
    create: {
      userId: member.id,
      slug: "jane-smith-demo",
      name: "Jane Smith",
      headline: "Entrepreneur & Marketing Expert",
      bio: "Passionate about helping women entrepreneurs grow their businesses through strategic marketing and community connections.",
      city: "New York",
      country: "USA",
      isFeatured: true,
      featuredOrder: 1,
      status: "PUBLISHED",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&auto=format&fit=crop",
    },
  });

  console.log("✅ Demo member created: member@womenscircle.com / member123456");

  // Demo business
  const bizCategory = await prisma.category.findFirst({ where: { type: "business", name: "Marketing & PR" } });
  const business = await prisma.business.upsert({
    where: { slug: "jane-smith-marketing" },
    update: {},
    create: {
      ownerId: member.id,
      name: "Smith Marketing Co.",
      slug: "jane-smith-marketing",
      tagline: "Strategic marketing for women-owned businesses",
      description: "Full-service marketing agency specializing in brand strategy, digital marketing, and community engagement for small businesses and entrepreneurs.",
      categoryId: bizCategory?.id,
      contactJson: JSON.stringify({ email: "hello@smithmarketing.com", phone: "+1 555 0100" }),
      location: "New York, NY",
      isFeatured: true,
      featuredOrder: 1,
      status: "PUBLISHED",
      logo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&q=80&auto=format&fit=crop",
    },
  });

  // Business offerings
  await prisma.businessOffering.createMany({
    data: [
      {
        businessId: business.id,
        type: "SERVICE",
        title: "Brand Strategy Package",
        description: "Complete brand audit, positioning, and strategy development.",
        price: 1500,
        status: "PUBLISHED",
      },
      {
        businessId: business.id,
        type: "SERVICE",
        title: "Social Media Management",
        description: "Monthly social media management for Instagram, LinkedIn, and Twitter.",
        price: 800,
        priceLabel: "$800/month",
        status: "PUBLISHED",
      },
      {
        businessId: business.id,
        type: "PRODUCT",
        title: "Marketing Starter Kit",
        description: "Digital templates, brand guide, and content calendar.",
        price: 99,
        status: "PUBLISHED",
      },
    ],
  });

  console.log("✅ Demo business created");

  // Demo events
  const futureDate1 = new Date();
  futureDate1.setDate(futureDate1.getDate() + 7);
  const futureDate1End = new Date(futureDate1);
  futureDate1End.setHours(futureDate1End.getHours() + 2);

  const futureDate2 = new Date();
  futureDate2.setDate(futureDate2.getDate() + 14);
  const futureDate2End = new Date(futureDate2);
  futureDate2End.setHours(futureDate2End.getHours() + 3);

  const futureDate3 = new Date();
  futureDate3.setDate(futureDate3.getDate() + 21);
  const futureDate3End = new Date(futureDate3);
  futureDate3End.setHours(futureDate3End.getHours() + 4);

  await prisma.event.upsert({
    where: { slug: "women-tech-leadership-summit" },
    update: { banner: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&auto=format&fit=crop" },
    create: {
      organiserId: member.id,
      title: "Women in Tech Leadership Summit",
      slug: "women-tech-leadership-summit",
      type: "CORPORATE",
      description: "A day-long summit bringing together women leaders in technology. Featuring keynotes, workshops, and networking sessions.",
      startsAt: futureDate1,
      endsAt: futureDate1End,
      timezone: "America/New_York",
      venue: "Midtown Conference Center, New York",
      capacity: 200,
      isFree: false,
      price: 75,
      isPinnedHome: true,
      status: "PUBLISHED",
      banner: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&auto=format&fit=crop",
    },
  });

  await prisma.event.upsert({
    where: { slug: "wellness-mindfulness-workshop" },
    update: { banner: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80&auto=format&fit=crop" },
    create: {
      organiserId: member.id,
      title: "Wellness & Mindfulness Workshop",
      slug: "wellness-mindfulness-workshop",
      type: "CULTURAL",
      description: "Join us for an afternoon of wellness, meditation, and mindfulness practices designed for busy professional women.",
      startsAt: futureDate2,
      endsAt: futureDate2End,
      timezone: "America/New_York",
      venue: "Serenity Wellness Studio",
      capacity: 30,
      isFree: true,
      isPinnedHome: false,
      status: "PUBLISHED",
      banner: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80&auto=format&fit=crop",
    },
  });

  await prisma.event.upsert({
    where: { slug: "virtual-networking-entrepreneurship" },
    update: { banner: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=80&auto=format&fit=crop" },
    create: {
      organiserId: admin.id,
      title: "Virtual Networking: Entrepreneurship & Investment",
      slug: "virtual-networking-entrepreneurship",
      type: "WEBINAR",
      description: "Connect with investors and fellow entrepreneurs in this exclusive virtual networking event.",
      startsAt: futureDate3,
      endsAt: futureDate3End,
      timezone: "UTC",
      isOnline: true,
      onlineUrl: "https://zoom.us/j/demo",
      capacity: 100,
      isFree: false,
      price: 25,
      isPinnedHome: false,
      status: "PUBLISHED",
      banner: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=80&auto=format&fit=crop",
    },
  });

  console.log("✅ Demo events created");

  // Demo marketplace items
  await prisma.marketItem.upsert({
    where: { slug: "sony-a7iii-camera-kit" },
    update: {
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80&auto=format&fit=crop",
      ]),
    },
    create: {
      sellerId: member.id,
      title: "Professional Camera Kit — Sony A7III",
      slug: "sony-a7iii-camera-kit",
      category: "USED_ITEMS",
      condition: "LIKE_NEW",
      price: 2200,
      currency: "USD",
      location: "New York, NY",
      description: "Sony A7III with 2 lenses (24-70mm f/2.8 and 85mm f/1.8), 3 batteries, and original box. Used for 6 months.",
      saleStatus: "AVAILABLE",
      status: "PUBLISHED",
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80&auto=format&fit=crop",
      ]),
    },
  });

  await prisma.marketItem.upsert({
    where: { slug: "flexispot-standing-desk" },
    update: {
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80&auto=format&fit=crop",
      ]),
    },
    create: {
      sellerId: member.id,
      title: "Ergonomic Standing Desk (Flexispot)",
      slug: "flexispot-standing-desk",
      category: "MOVING_OUT",
      condition: "GOOD",
      price: 350,
      currency: "USD",
      location: "Brooklyn, NY",
      description: "Electric height-adjustable standing desk. 60\"x24\" surface. Moving sale — must go!",
      saleStatus: "AVAILABLE",
      status: "PUBLISHED",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80&auto=format&fit=crop",
      ]),
    },
  });

  console.log("✅ Demo marketplace items created");

  console.log("\n🎉 Seed complete! You can now log in with:");
  console.log("   Admin: admin@womenscircle.com / admin123456");
  console.log("   Member: member@womenscircle.com / member123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
