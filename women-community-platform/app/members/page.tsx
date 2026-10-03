import { db } from "@/lib/db";
import { Metadata } from "next";
import { MembersDirectoryClient } from "@/components/members/members-directory-client";

export const metadata: Metadata = {
  title: "Members Directory",
  description: "Connect with inspiring women professionals and entrepreneurs in our community.",
};

export const revalidate = 60;

interface SearchParams {
  q?: string;
  city?: string;
  industry?: string;
  page?: string;
}

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");
  const take = 24;
  const skip = (page - 1) * take;

  const where = {
    status: "PUBLISHED",
    ...(params.q
      ? {
          OR: [
            { name: { contains: params.q } },
            { headline: { contains: params.q } },
            { bio: { contains: params.q } },
          ],
        }
      : {}),
    ...(params.city ? { city: { contains: params.city } } : {}),
    ...(params.industry ? { industryId: params.industry } : {}),
  };

  const [members, total, industries] = await Promise.all([
    db.memberProfile.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { featuredOrder: "asc" }, { createdAt: "desc" }],
      take,
      skip,
    }),
    db.memberProfile.count({ where }),
    db.category.findMany({ where: { type: "industry" }, orderBy: { name: "asc" } }),
  ]);

  return (
    <MembersDirectoryClient
      members={members}
      total={total}
      page={page}
      industries={industries}
      searchParams={params}
    />
  );
}
