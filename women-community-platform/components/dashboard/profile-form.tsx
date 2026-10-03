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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { submitForReview } from "@/lib/actions/review";
import { ArrowRight, Save, Send, History, AlertCircle } from "lucide-react";
import type { MemberProfile, Category, ReviewLog } from "@prisma/client";
import Link from "next/link";

const profileSchema = z.object({
  name: z.string().min(2),
  headline: z.string().optional(),
  bio: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  industryId: z.string().optional(),
  visibilityPhone: z.boolean(),
  visibilityEmail: z.boolean(),
});

type FormData = z.infer<typeof profileSchema>;

type ProfileWithLogs = MemberProfile & { reviewLogs: ReviewLog[] };

interface ProfileFormProps {
  profile: ProfileWithLogs | null;
  categories: Category[];
  userId: string;
}

export function ProfileForm({ profile, categories, userId }: ProfileFormProps) {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting, isDirty } } = useForm<FormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name ?? "",
      headline: profile?.headline ?? "",
      bio: profile?.bio ?? "",
      city: profile?.city ?? "",
      country: profile?.country ?? "",
      phone: profile?.phone ?? "",
      website: profile?.website ?? "",
      linkedin: profile?.linkedin ?? "",
      instagram: profile?.instagram ?? "",
      twitter: profile?.twitter ?? "",
      industryId: profile?.industryId ?? "",
      visibilityPhone: profile?.visibilityPhone ?? false,
      visibilityEmail: profile?.visibilityEmail ?? false,
    },
  });

  const onSave = async (data: FormData) => {
    setSaveError("");
    try {
      const res = await fetch("/api/dashboard/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId }),
      });
      if (!res.ok) throw new Error();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSaveError("Failed to save. Please try again.");
    }
  };

  const handleSubmitForReview = async () => {
    if (!profile) return;
    const result = await submitForReview("member_profile", profile.id);
    if (result.success) alert("Submitted for review! You'll be notified once approved.");
    else alert(result.error ?? "Failed to submit.");
  };

  const canSubmit = profile && ["DRAFT", "CHANGES_REQUESTED", "REJECTED"].includes(profile.status);
  const lastReviewLog = profile?.reviewLogs[0];

  return (
    <div className="min-h-screen bg-lavender-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-serif font-semibold text-foreground">My Profile</h1>
            <p className="text-muted-foreground text-sm">Manage your public member profile</p>
          </div>
          <div className="flex items-center gap-3">
            {profile && <StatusChip status={profile.status} />}
            {profile?.status === "PUBLISHED" && (
              <Link href={`/members/${profile.slug}`} target="_blank">
                <Button variant="secondary" size="sm">View Live</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Admin Feedback */}
        {lastReviewLog && (lastReviewLog.state === "CHANGES_REQUESTED" || lastReviewLog.state === "REJECTED") && (
          <div className="mb-6 bg-rose-50 border border-rose-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-rose-600 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-rose-800 mb-1">
                  {lastReviewLog.state === "CHANGES_REQUESTED" ? "Changes Requested" : "Submission Rejected"}
                </h3>
                {lastReviewLog.comment && (
                  <p className="text-sm text-rose-700">{lastReviewLog.comment}</p>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSave)} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar placeholder */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-2 ring-purple-100">
                  <AvatarImage src={undefined} />
                  <AvatarFallback className="text-lg">{getInitials(watch("name") || "M")}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">Profile Photo</p>
                  <p className="text-xs text-muted-foreground">Photo upload coming soon</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="headline">Headline</Label>
                  <Input id="headline" placeholder="e.g. Marketing Director & Entrepreneur" {...register("headline")} />
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" placeholder="Tell us about yourself..." rows={4} {...register("bio")} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" {...register("phone")} />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...register("city")} />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" {...register("country")} />
                </div>
              </div>
              <div>
                <Label>Industry</Label>
                <Select value={watch("industryId") ?? ""} onValueChange={(v) => setValue("industryId", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardHeader><CardTitle>Links & Social</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" type="url" placeholder="https://yourwebsite.com" {...register("website")} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input id="linkedin" type="url" placeholder="https://linkedin.com/in/..." {...register("linkedin")} />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input id="instagram" type="url" placeholder="https://instagram.com/..." {...register("instagram")} />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter / X</Label>
                  <Input id="twitter" type="url" placeholder="https://twitter.com/..." {...register("twitter")} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader><CardTitle>Visibility Settings</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="visPhone"
                  {...register("visibilityPhone")}
                  className="rounded border-input w-4 h-4"
                />
                <Label htmlFor="visPhone" className="font-normal cursor-pointer">
                  Show my phone number publicly
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="visEmail"
                  {...register("visibilityEmail")}
                  className="rounded border-input w-4 h-4"
                />
                <Label htmlFor="visEmail" className="font-normal cursor-pointer">
                  Show my email address publicly
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            {canSubmit && (
              <Button
                type="button"
                variant="teal"
                onClick={handleSubmitForReview}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                Submit for Review
              </Button>
            )}
          </div>

          {saveSuccess && (
            <p className="text-sm text-teal-600 font-medium">Changes saved successfully!</p>
          )}
          {saveError && <p className="text-sm text-red-600">{saveError}</p>}
        </form>
      </div>
    </div>
  );
}
