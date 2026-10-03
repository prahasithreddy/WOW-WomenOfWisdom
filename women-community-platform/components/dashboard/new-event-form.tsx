"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EVENT_TYPE_LABELS } from "@/lib/constants";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  title: z.string().min(3, "Title required"),
  type: z.string(),
  description: z.string().optional(),
  startsAt: z.string().min(1, "Start date required"),
  endsAt: z.string().min(1, "End date required"),
  timezone: z.string(),
  venue: z.string().optional(),
  isOnline: z.boolean(),
  capacity: z.number().optional(),
  isFree: z.boolean(),
  price: z.number().optional(),
});

type FormData = z.infer<typeof schema>;

export function NewEventForm({ userId }: { userId: string }) {
  const router = useRouter();
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "OTHER",
      timezone: "America/New_York",
      isOnline: false,
      isFree: true,
    },
  });

  const isFree = watch("isFree");
  const isOnline = watch("isOnline");

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/dashboard/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, userId }),
    });
    if (res.ok) {
      router.push("/dashboard/events");
      router.refresh();
    } else {
      alert("Failed to create event.");
    }
  };

  return (
    <div className="min-h-screen bg-lavender-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/events" className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-serif font-semibold text-foreground">New Event</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Event Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title *</Label>
                <Input id="title" placeholder="Women in Tech Summit" {...register("title")} />
                {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <Label>Event Type</Label>
                <Select value={watch("type")} onValueChange={(v) => setValue("type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(EVENT_TYPE_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell attendees about your event..."
                  rows={4}
                  {...register("description")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Date & Location</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startsAt">Start Date & Time *</Label>
                  <Input id="startsAt" type="datetime-local" {...register("startsAt")} />
                  {errors.startsAt && <p className="text-xs text-red-600 mt-1">{errors.startsAt.message}</p>}
                </div>
                <div>
                  <Label htmlFor="endsAt">End Date & Time *</Label>
                  <Input id="endsAt" type="datetime-local" {...register("endsAt")} />
                  {errors.endsAt && <p className="text-xs text-red-600 mt-1">{errors.endsAt.message}</p>}
                </div>
              </div>
              <div>
                <Label>Timezone</Label>
                <Select value={watch("timezone")} onValueChange={(v) => setValue("timezone", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "Europe/London", "UTC"].map((tz) => (
                      <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isOnline"
                  {...register("isOnline")}
                  className="rounded w-4 h-4"
                />
                <Label htmlFor="isOnline" className="font-normal cursor-pointer">This is an online event</Label>
              </div>
              {!isOnline && (
                <div>
                  <Label htmlFor="venue">Venue</Label>
                  <Input id="venue" placeholder="Conference Center, City" {...register("venue")} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Ticketing</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isFree"
                  {...register("isFree")}
                  className="rounded w-4 h-4"
                />
                <Label htmlFor="isFree" className="font-normal cursor-pointer">This is a free event</Label>
              </div>
              {!isFree && (
                <div>
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="25.00"
                    {...register("price", { valueAsNumber: true })}
                  />
                </div>
              )}
              <div>
                <Label htmlFor="capacity">Capacity (optional)</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="Leave empty for unlimited"
                  {...register("capacity", { valueAsNumber: true })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save as Draft"}
            </Button>
            <Link href="/dashboard/events">
              <Button type="button" variant="secondary">Cancel</Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
