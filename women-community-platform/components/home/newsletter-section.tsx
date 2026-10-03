"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const reduce = useReducedMotion();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section
      className="relative overflow-hidden grain-overlay"
      style={{ background: "#2D1B69" }}
    >
      {/* Purple ambient glow */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(139,92,246,0.18) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at bottom right, rgba(167,139,250,0.10) 0%, transparent 70%)",
        }}
      />

      {/* Purple top border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">

        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Section label */}
          <p
            className="text-purple-400 font-bold uppercase mb-5"
            style={{ fontSize: "0.68rem", letterSpacing: "0.18em" }}
          >
            Stay in the loop
          </p>

          {/* Large editorial headline */}
          <h2
            className="font-serif font-bold text-lavender-100 mb-5"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              letterSpacing: "-0.03em",
              lineHeight: "1.05",
            }}
          >
            The community,{" "}
            <span className="italic text-purple-300">delivered.</span>
          </h2>

          <p className="text-violet-200 mb-10 max-w-md mx-auto leading-relaxed" style={{ fontSize: "1.05rem" }}>
            New members, upcoming events, business spotlights — all in one beautifully curated weekly update.
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-2.5 text-lavender-100">
              <CheckCircle className="h-5 w-5 text-purple-400" />
              <span className="font-medium">You&apos;re subscribed. Welcome to the circle.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
              {/* Dark purple input with purple focus ring */}
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 rounded-full px-5 py-3 text-sm text-lavender-100 placeholder:text-violet-300 bg-violet-800 border border-violet-600 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400 transition-colors duration-200"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full px-6 py-3 text-sm font-semibold text-violet-950 bg-purple-400 hover:bg-purple-300 hover:scale-[1.02] transition-all duration-200"
                style={{ boxShadow: "0 4px 16px rgba(139,92,246,0.35)" }}
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-violet-300 text-xs mt-5">No spam. Unsubscribe anytime.</p>
        </motion.div>
      </div>

      {/* Purple bottom border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
    </section>
  );
}
