"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-lavender-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo / Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-950 mb-5"
            style={{ boxShadow: "0 4px 16px rgba(15,10,5,0.30)" }}
          >
            <span className="text-purple-300 font-serif font-bold text-lg">W</span>
          </Link>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2" style={{ letterSpacing: "-0.03em" }}>
            Welcome back
          </h1>
          <p className="text-muted text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/join" className="text-purple-600 font-semibold hover:text-purple-700 hover:underline">
              Join WOW
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8" style={{ boxShadow: "0 4px 24px rgba(26,18,8,0.10), 0 1px 3px rgba(26,18,8,0.06)", border: "1px solid #E8E0D0" }}>
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-foreground font-medium">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="mt-1.5 border-lavender-300 bg-lavender-50 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                <Link href="/forgot-password" className="text-xs text-purple-600 hover:text-purple-700 hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="border-lavender-300 bg-lavender-50 focus:border-purple-400 focus:ring-purple-400"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full gap-2 mt-2" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-lavender-300">
            <p className="text-xs text-muted text-center mb-3">Demo accounts</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setEmail("admin@womenofwisdom.com"); setPassword("admin123456"); }}
                className="text-xs bg-purple-50 text-purple-700 rounded-xl px-3 py-2.5 hover:bg-purple-100 transition-colors font-semibold border border-purple-200"
              >
                Admin demo
              </button>
              <button
                type="button"
                onClick={() => { setEmail("member@womenofwisdom.com"); setPassword("member123456"); }}
                className="text-xs bg-lavender-200 text-violet-600 rounded-xl px-3 py-2.5 hover:bg-lavender-300 transition-colors font-semibold border border-lavender-300"
              >
                Member demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-lavender-200 flex items-center justify-center">
        <div className="animate-pulse text-muted">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
