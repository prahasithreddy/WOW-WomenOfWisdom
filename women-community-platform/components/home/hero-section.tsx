"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const avatars = [
  { initials: "AS", bg: "#A78BFA", color: "#1E1B4B" },
  { initials: "MK", bg: "#C4B5FD", color: "#2D1B69" },
  { initials: "TR", bg: "#8B5CF6", color: "#F8F7FF" },
  { initials: "PL", bg: "#7C3AED", color: "#EDE9FE" },
  { initials: "RJ", bg: "#6D28D9", color: "#C4B5FD" },
];

export function HeroSection() {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.12,
      },
    },
  };

  const item = {
    hidden: reduce ? {} : { opacity: 0, y: 22 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  };

  return (
    <section className="relative overflow-hidden min-h-[100dvh] flex items-center">

      {/* Full-bleed background photo */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=1920&q=85&auto=format&fit=crop"
          alt="Woman in orange shirt working on laptop — Women of Wisdom community"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Deep violet cinematic overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(30,27,75,0.94) 0%, rgba(45,27,105,0.82) 55%, rgba(75,40,137,0.50) 100%)",
          }}
        />
        {/* Subtle purple ambient glow from top-right */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[500px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at top right, rgba(139,92,246,0.20) 0%, transparent 65%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <motion.div
          className="max-w-2xl"
          variants={container}
          initial="hidden"
          animate="show"
        >

          {/* Eyebrow */}
          <motion.span
            variants={item}
            className="block text-purple-300 mb-6 font-semibold uppercase"
            style={{ fontSize: "0.72rem", letterSpacing: "0.18em" }}
          >
            A Premium Women&apos;s Membership Community
          </motion.span>

          {/* Display headline */}
          <motion.h1
            variants={item}
            className="font-serif font-bold text-lavender-100 leading-[1.02] mb-7"
            style={{
              fontSize: "clamp(3rem, 6vw, 5.5rem)",
              letterSpacing: "-0.04em",
            }}
          >
            Connect, Grow{" "}
            <span className="italic text-purple-300">&amp; Thrive</span>{" "}
            Together
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={item}
            className="text-lavender-300 leading-relaxed mb-10 max-w-lg"
            style={{ fontSize: "1.1rem" }}
          >
            Join a curated community of women professionals, entrepreneurs, and
            changemakers. Discover businesses, attend events, and build
            connections that last.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-wrap gap-4">
            <Link href="/join">
              <Button
                size="lg"
                className="bg-purple-500 text-white font-bold hover:bg-purple-400 hover:scale-[1.02] rounded-full gap-2"
                style={{ boxShadow: "0 4px 24px rgba(139,92,246,0.45)" }}
              >
                Become a Member
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/members">
              <Button
                size="lg"
                variant="ghost"
                className="text-lavender-100 border border-lavender-100/30 hover:bg-lavender-100/10 rounded-full"
              >
                Explore Community
              </Button>
            </Link>
          </motion.div>

          {/* Social proof avatars */}
          <motion.div variants={item} className="flex items-center gap-4 mt-12">
            <div className="flex -space-x-2">
              {avatars.map(({ initials, bg, color }, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                  style={{ background: bg, color, borderColor: "#1E1B4B" }}
                >
                  {initials}
                </div>
              ))}
            </div>
            <p className="text-sm text-lavender-300">
              <span className="text-lavender-100 font-semibold">500+</span> women already connected
            </p>
          </motion.div>
        </motion.div>

        {/* Floating stats card — anchored bottom-right */}
        <motion.div
          className="absolute bottom-12 right-6 lg:right-12 hidden md:block"
          initial={reduce ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="rounded-2xl p-5 w-64"
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(167,139,250,0.25)",
              boxShadow: "0 8px 32px rgba(30,27,75,0.35)",
            }}
          >
            <p
              className="text-purple-300 font-semibold mb-3 uppercase"
              style={{ fontSize: "0.65rem", letterSpacing: "0.14em" }}
            >
              Community at a glance
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "500+", label: "Members" },
                { value: "120+", label: "Businesses" },
                { value: "80+",  label: "Events" },
                { value: "300+", label: "Listings" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-lavender-100 font-serif font-bold text-xl leading-none">{stat.value}</p>
                  <p className="text-violet-200 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
