"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/lib/actions/auth";
import { Eye, EyeOff, CheckCircle, ArrowRight } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  bio: z.string().optional(),
  consent: z.boolean().refine((v) => v, "You must accept the terms and conditions"),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof registerSchema>;

export default function JoinPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { consent: false },
  });

  const onSubmit = async (data: FormData) => {
    setServerError("");
    const result = await registerUser({
      ...data,
      consent: String(data.consent) as "true",
    });
    if (result.error) {
      setServerError(result.error);
    } else {
      // Sign in immediately after registration
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      setSuccess(true);
      setTimeout(() => router.push("/pending"), 1500);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-lavender-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-card p-8 max-w-md w-full text-center" style={{ border: "1px solid #E4E0F7" }}>
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">Registration Successful!</h2>
          <p className="text-muted-foreground">
            Your application is under review. We&apos;ll notify you once approved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lavender-200 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-950 mb-4" style={{ boxShadow: "0 4px 16px rgba(30,27,75,0.30)" }}>
            <span className="text-white font-serif font-bold">W</span>
          </Link>
          <h1 className="text-3xl font-serif font-semibold text-foreground mb-2">Join Women&apos;s Circle</h1>
          <p className="text-muted-foreground">
            Already a member?{" "}
            <Link href="/login" className="text-purple-600 font-semibold hover:text-purple-700 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-card p-8">
          {serverError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Basic Info */}
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 text-muted-foreground">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" placeholder="Jane Smith" {...register("name")} />
                  {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" placeholder="jane@example.com" {...register("email")} />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Optional Details */}
            <div className="border-t border-border pt-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-muted-foreground">
                About You (optional)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" placeholder="+1 234 567 8900" {...register("phone")} />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="New York" {...register("city")} />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" placeholder="USA" {...register("country")} />
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Short Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us a little about yourself..."
                  rows={3}
                  {...register("bio")}
                />
              </div>
            </div>

            {/* Consent */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="consent"
                {...register("consent")}
                className="mt-0.5 rounded border-lavender-300 w-4 h-4 text-purple-600 focus:ring-purple-500"
              />
              <Label htmlFor="consent" className="text-sm font-normal text-muted-foreground cursor-pointer">
                I agree to the{" "}
                <Link href="/terms" className="text-purple-600 hover:underline font-semibold">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-purple-600 hover:underline font-semibold">Privacy Policy</Link>,
                and consent to my profile being visible in the community directory.
              </Label>
            </div>
            {errors.consent && <p className="text-xs text-red-600 -mt-3">{errors.consent.message}</p>}

            <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Create Account"}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
