import { db } from "@/lib/db";
import { Metadata } from "next";
import { BusinessesDirectoryClient } from "@/components/businesses/businesses-directory-client";

export const metadata: Metadata = {
  title: "Business Directory",
  description: "Discover women-owned businesses offering products, services and more.",
};

export const revalidate = 60;

interface SearchParams {
  q?: string;
  category?: string;
  page?: string;
}

export default async function BusinessesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");
  const take = 18;
  const skip = (page - 1) * take;

  const where = {
    status: "PUBLISHED",
    ...(params.q
      ? {
          OR: [
            { name: { contains: params.q } },
            { description: { contains: params.q } },
            { tagline: { contains: params.q } },
          ],
        }
      : {}),
    ...(params.category ? { categoryId: params.category } : {}),
  };

  const [businesses, total, categories] = await Promise.all([
    db.business.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { featuredOrder: "asc" }, { createdAt: "desc" }],
      take,
      skip,
      include: {
        owner: { select: { name: true } },
        category: true,
        tags: true,
        _count: { select: { offerings: true } },
      },
    }),
    db.business.count({ where }),
    db.category.findMany({ where: { type: "business" }, orderBy: { name: "asc" } }),
  ]);

  return (
    <BusinessesDirectoryClient
      businesses={businesses}
      total={total}
      page={page}
      categories={categories}
      searchParams={params}
    />
  );
}
