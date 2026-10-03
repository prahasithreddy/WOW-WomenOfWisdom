"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, PlusCircle, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@prisma/client";

export function AdminCategoriesClient({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState("business");
  const [loading, setLoading] = useState(false);

  const grouped = categories.reduce((acc, cat) => {
    if (!acc[cat.type]) acc[cat.type] = [];
    acc[cat.type].push(cat);
    return acc;
  }, {} as Record<string, Category[]>);

  const handleAdd = async () => {
    if (!name.trim()) return;
    setLoading(true);
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type }),
    });
    setName("");
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-lavender-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-serif font-semibold text-foreground">Categories</h1>
        </div>

        {/* Add Category */}
        <Card className="mb-8">
          <CardHeader><CardTitle className="text-base">Add Category</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="industry">Industry</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
              <Button onClick={handleAdd} disabled={loading || !name.trim()} className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Categories List */}
        <div className="space-y-6">
          {Object.entries(grouped).map(([grpType, cats]) => (
            <Card key={grpType}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 capitalize">
                  <Tag className="h-4 w-4 text-purple-600" />
                  {grpType} Categories ({cats.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {cats.map((cat) => (
                    <Badge key={cat.id} variant="secondary" className="text-sm">
                      {cat.name}
                    </Badge>
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
