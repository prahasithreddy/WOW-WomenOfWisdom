"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

const enquirySchema = z.object({
  senderName: z.string().min(2, "Name is required"),
  senderEmail: z.string().email("Valid email is required"),
  senderPhone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type EnquiryData = z.infer<typeof enquirySchema>;

interface EnquiryFormProps {
  targetType: string;
  targetId: string;
  recipientName?: string;
  onSuccess?: () => void;
}

export function EnquiryForm({ targetType, targetId, recipientName, onSuccess }: EnquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EnquiryData>({
    resolver: zodResolver(enquirySchema),
  });

  const onSubmit = async (data: EnquiryData) => {
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, targetType, targetId }),
      });
      if (!res.ok) throw new Error("Failed to send enquiry");
      setSubmitted(true);
      onSuccess?.();
    } catch {
      alert("Failed to send. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
          <CheckCircle className="h-6 w-6 text-teal-600" />
        </div>
        <h3 className="font-semibold text-foreground">Enquiry Sent!</h3>
        <p className="text-sm text-muted-foreground">
          Your message has been sent{recipientName ? ` to ${recipientName}` : ""}. They will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="senderName">Your Name</Label>
        <Input id="senderName" placeholder="Jane Smith" {...register("senderName")} />
        {errors.senderName && <p className="text-xs text-red-600 mt-1">{errors.senderName.message}</p>}
      </div>
      <div>
        <Label htmlFor="senderEmail">Email Address</Label>
        <Input id="senderEmail" type="email" placeholder="jane@example.com" {...register("senderEmail")} />
        {errors.senderEmail && <p className="text-xs text-red-600 mt-1">{errors.senderEmail.message}</p>}
      </div>
      <div>
        <Label htmlFor="senderPhone">Phone (optional)</Label>
        <Input id="senderPhone" type="tel" placeholder="+1 234 567 8900" {...register("senderPhone")} />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Hi, I'd like to learn more about..."
          rows={4}
          {...register("message")}
        />
        {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Enquiry"}
      </Button>
    </form>
  );
}
