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
import { MARKET_CATEGORY_LABELS, MARKET_CONDITION_LABELS } from "@/lib/constants";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  title: z.string().min(3, "Title is required"),
  category: z.string(),
  condition: z.string(),
  price: z.number().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function NewMarketItemForm({ userId }: { userId: string }) {
  const router = useRouter();
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { category: "USED_ITEMS", condition: "GOOD" },
  });

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/dashboard/marketplace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, userId }),
    });
    if (res.ok) {
      router.push("/dashboard/marketplace");
      router.refresh();
    } else {
      alert("Failed to create listing.");
    }
  };

  return (
    <div className="min-h-screen bg-lavender-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/marketplace" className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-serif font-semibold text-foreground">New Listing</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Item Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input id="title" placeholder="e.g. Sony Camera Kit" {...register("title")} />
                {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={watch("category")} onValueChange={(v) => setValue("category", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(MARKET_CATEGORY_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Condition</Label>
                  <Select value={watch("condition")} onValueChange={(v) => setValue("condition", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(MARKET_CONDITION_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("price", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="New York, NY" {...register("location")} />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your item, condition, included accessories..."
                  rows={4}
                  {...register("description")}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save as Draft"}
            </Button>
            <Link href="/dashboard/marketplace">
              <Button type="button" variant="secondary">Cancel</Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
