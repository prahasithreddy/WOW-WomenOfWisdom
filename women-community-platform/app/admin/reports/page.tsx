import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { BarChart2, Users, Building2, Calendar, ShoppingBag, MessageSquare, ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const metadata = { title: "Reports — Admin" };

export default async function AdminReportsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) redirect("/");

  const [
    totalMembers, pendingMembers, approvedMembers, suspendedMembers,
    totalBusinesses, publishedBusinesses, draftBusinesses,
    totalEvents, publishedEvents,
    totalListings, availableListings, soldListings,
    totalEnquiries, totalRegistrations,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { status: "PENDING" } }),
    db.user.count({ where: { status: "APPROVED" } }),
    db.user.count({ where: { status: "SUSPENDED" } }),
    db.business.count(),
    db.business.count({ where: { status: "PUBLISHED" } }),
    db.business.count({ where: { status: "DRAFT" } }),
    db.event.count(),
    db.event.count({ where: { status: "PUBLISHED" } }),
    db.marketItem.count(),
    db.marketItem.count({ where: { saleStatus: "AVAILABLE" } }),
    db.marketItem.count({ where: { saleStatus: "SOLD" } }),
    db.enquiry.count(),
    db.eventRegistration.count(),
  ]);

  const stats = [
    {
      title: "Members",
      icon: Users,
      data: [
        { label: "Total", value: totalMembers },
        { label: "Approved", value: approvedMembers },
        { label: "Pending", value: pendingMembers },
        { label: "Suspended", value: suspendedMembers },
      ],
    },
    {
      title: "Businesses",
      icon: Building2,
      data: [
        { label: "Total", value: totalBusinesses },
        { label: "Published", value: publishedBusinesses },
        { label: "Draft", value: draftBusinesses },
      ],
    },
    {
      title: "Events",
      icon: Calendar,
      data: [
        { label: "Total", value: totalEvents },
        { label: "Published", value: publishedEvents },
        { label: "Registrations", value: totalRegistrations },
      ],
    },
    {
      title: "Marketplace",
      icon: ShoppingBag,
      data: [
        { label: "Total Listings", value: totalListings },
        { label: "Available", value: availableListings },
        { label: "Sold", value: soldListings },
      ],
    },
    {
      title: "Engagement",
      icon: MessageSquare,
      data: [
        { label: "Total Enquiries", value: totalEnquiries },
        { label: "Event Registrations", value: totalRegistrations },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-lavender-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-semibold text-foreground">Reports</h1>
            <p className="text-muted-foreground text-sm">Platform metrics and statistics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <section.icon className="h-4 w-4 text-purple-600" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {section.data.map((item) => (
                    <div key={item.label} className="bg-lavender-50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-foreground">{item.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
