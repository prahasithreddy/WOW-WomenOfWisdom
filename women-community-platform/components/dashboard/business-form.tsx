"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusChip } from "@/components/shared/status-chip";
import { submitForReview } from "@/lib/actions/review";
import { Save, Send, AlertCircle, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Business, Category, BusinessOffering, BusinessTag, ReviewLog } from "@prisma/client";

type BusinessWithRelations = Business & {
  offerings: BusinessOffering[];
  tags: BusinessTag[];
  reviewLogs: ReviewLog[];
};

const schema = z.object({
  name: z.string().min(2, "Business name is required"),
  tagline: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  hours: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface BusinessFormProps {
  business: BusinessWithRelations | null;
  categories: Category[];
  userId: string;
}

export function BusinessForm({ business, categories, userId }: BusinessFormProps) {
  const router = useRouter();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  const contact = business ? JSON.parse(business.contactJson) : {};

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: business?.name ?? "",
      tagline: business?.tagline ?? "",
      description: business?.description ?? "",
      categoryId: business?.categoryId ?? "",
      contactEmail: contact.email ?? "",
      contactPhone: contact.phone ?? "",
      location: business?.location ?? "",
      website: business?.website ?? "",
      hours: business?.hours ?? "",
    },
  });

  const onSave = async (data: FormData) => {
    setSaveError("");
    try {
      const res = await fetch("/api/dashboard/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId }),
      });
      if (!res.ok) throw new Error();
      setSaveSuccess(true);
      router.refresh();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSaveError("Failed to save. Please try again.");
    }
  };

  const handleSubmitReview = async () => {
    if (!business) return;
    await submitForReview("business", business.id);
    router.refresh();
    alert("Submitted for review!");
  };

  const canSubmit = business && ["DRAFT", "CHANGES_REQUESTED"].includes(business.status);
  const lastLog = business?.reviewLogs[0];

  return (
    <div className="min-h-screen bg-lavender-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-serif font-semibold text-foreground">My Business</h1>
              <p className="text-muted-foreground text-sm">Manage your business profile</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {business && <StatusChip status={business.status} />}
            {business?.status === "PUBLISHED" && (
              <Link href={`/businesses/${business.slug}`} target="_blank">
                <Button variant="secondary" size="sm">View Live</Button>
              </Link>
            )}
          </div>
        </div>

        {lastLog?.comment && (lastLog.state === "CHANGES_REQUESTED" || lastLog.state === "REJECTED") && (
          <div className="mb-6 bg-rose-50 border border-rose-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-rose-600 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-rose-800 mb-1">Admin Feedback</h3>
                <p className="text-sm text-rose-700">{lastLog.comment}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSave)} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Business Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Business Name *</Label>
                <Input id="name" placeholder="My Business Name" {...register("name")} />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" placeholder="A short, catchy description" {...register("tagline")} />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={watch("categoryId") ?? ""} onValueChange={(v) => setValue("categoryId", v)}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell customers about your business..."
                  rows={4}
                  {...register("description")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Contact & Location</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail">Business Email</Label>
                  <Input id="contactEmail" type="email" {...register("contactEmail")} />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Business Phone</Label>
                  <Input id="contactPhone" type="tel" {...register("contactPhone")} />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location/Address</Label>
                <Input id="location" placeholder="City, State" {...register("location")} />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" type="url" placeholder="https://" {...register("website")} />
              </div>
              <div>
                <Label htmlFor="hours">Opening Hours</Label>
                <Input id="hours" placeholder="Mon–Fri 9am–5pm" {...register("hours")} />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            {canSubmit && (
              <Button type="button" variant="teal" onClick={handleSubmitReview} className="gap-2">
                <Send className="h-4 w-4" />
                Submit for Review
              </Button>
            )}
          </div>
          {saveSuccess && <p className="text-sm text-teal-600 font-medium">Saved!</p>}
          {saveError && <p className="text-sm text-red-600">{saveError}</p>}
        </form>
      </div>
    </div>
  );
}
