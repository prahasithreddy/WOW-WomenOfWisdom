"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

interface StatsSectionProps {
  stats: {
    members: number;
    businesses: number;
    events: number;
    listings: number;
  };
}

const statItems = [
  { key: "members"    as const, label: "Active members",        suffix: "+" },
  { key: "businesses" as const, label: "Women-owned businesses", suffix: "+" },
  { key: "events"     as const, label: "Events hosted",          suffix: "+" },
  { key: "listings"   as const, label: "Marketplace listings",   suffix: "+" },
];

function useCountUp(target: number, duration = 1400, start = false) {
  const [count, setCount] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!start || reduce) {
      setCount(target);
      return;
    }
    if (target === 0) return;

    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start, reduce]);

  return count;
}

function StatCounter({ value, label, suffix }: { value: number; label: string; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const count = useCountUp(value, 1400, started);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="px-6 lg:px-10 first:pl-0 py-4 group">
      {/* Purple left accent line */}
      <div className="w-8 h-0.5 bg-purple-500 mb-6 transition-all duration-300 group-hover:w-14" />

      {/* Animated number */}
      <p
        className="font-serif font-bold text-lavender-100 leading-none mb-2"
        style={{
          fontSize: "clamp(3rem, 5vw, 4.5rem)",
          letterSpacing: "-0.04em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {count > 0 ? count.toLocaleString() : "0"}
        <span className="text-purple-400">{suffix}</span>
      </p>

      {/* Label */}
      <p className="text-violet-200 text-sm font-medium">{label}</p>
    </div>
  );
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section
      className="relative overflow-hidden grain-overlay"
      style={{ background: "#1E1B4B" }}
    >
      {/* Subtle warm purple radial glow */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">

        {/* Section label */}
        <p
          className="text-purple-400 font-bold uppercase mb-10"
          style={{ fontSize: "0.68rem", letterSpacing: "0.16em" }}
        >
          By the numbers
        </p>

        {/* Animated stat counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-violet-700">
          {statItems.map((item) => (
            <StatCounter
              key={item.key}
              value={stats[item.key]}
              label={item.label}
              suffix={item.suffix}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
