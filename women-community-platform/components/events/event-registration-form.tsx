"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const registrationSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  quantity: z.number().min(1).max(10),
});

type FormData = z.infer<typeof registrationSchema>;

interface EventRegistrationFormProps {
  eventId: string;
  eventTitle: string;
  isFree: boolean;
  price: number | null;
  currency: string;
  isFull: boolean;
}

export function EventRegistrationForm({
  eventId, eventTitle, isFree, price, currency, isFull,
}: EventRegistrationFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { quantity: 1 },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, eventId }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      alert("Registration failed. Please try again.");
    }
  };

  if (isFull) {
    return (
      <div className="text-center py-4">
        <p className="text-rose-600 font-semibold">This event is sold out.</p>
        <p className="text-sm text-muted-foreground mt-1">Join the waitlist below.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
          <CheckCircle className="h-6 w-6 text-teal-600" />
        </div>
        <h3 className="font-semibold text-foreground">You&apos;re Registered!</h3>
        <p className="text-sm text-muted-foreground">
          Check your email for confirmation and calendar invite.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold text-foreground mb-1">Register for this Event</h3>
      {!isFree && price && (
        <p className="text-sm text-muted-foreground mb-4">
          {formatPrice(price, currency)} per ticket
        </p>
      )}
      {isFree && <p className="text-sm text-teal-600 font-medium mb-4">Free Entry</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <Label htmlFor="reg-name">Your Name</Label>
          <Input id="reg-name" placeholder="Jane Smith" {...register("name")} />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="reg-email">Email Address</Label>
          <Input id="reg-email" type="email" placeholder="jane@example.com" {...register("email")} />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="reg-phone">Phone (optional)</Label>
          <Input id="reg-phone" type="tel" placeholder="+1 234 567 8900" {...register("phone")} />
        </div>
        <div>
          <Label htmlFor="reg-qty">Number of Tickets</Label>
          <Input
            id="reg-qty"
            type="number"
            min={1}
            max={10}
            {...register("quantity", { valueAsNumber: true })}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : isFree ? "Register (Free)" : "Proceed to Register"}
        </Button>
      </form>
    </div>
  );
}
