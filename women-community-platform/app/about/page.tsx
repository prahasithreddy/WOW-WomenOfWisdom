import { Metadata } from "next";
import Link from "next/link";
import { Heart, Users, Shield, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Women of Wisdom — our mission, values, and community.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">

      {/* Hero — deep violet */}
      <section
        className="relative py-24 text-center overflow-hidden grain-overlay"
        style={{ background: "#2D1B69" }}
      >
        <div className="h-px w-full absolute top-0 left-0 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

        {/* Ambient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.15) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-8">
            <Heart className="h-7 w-7 text-purple-300" />
          </div>
          <p
            className="text-purple-400 font-bold uppercase mb-4"
            style={{ fontSize: "0.68rem", letterSpacing: "0.18em" }}
          >
            Our story
          </p>
          <h1
            className="font-serif font-bold text-lavender-100 mb-6"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.03em" }}
          >
            About Women of Wisdom
          </h1>
          <p className="text-violet-200 text-lg leading-relaxed max-w-xl mx-auto">
            A premium membership community connecting women professionals, entrepreneurs,
            and changemakers to grow, collaborate, and thrive together.
          </p>
        </div>

        <div className="h-px w-full absolute bottom-0 left-0 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      </section>

      {/* Mission values */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="section-label">What we stand for</span>
            <h2 className="section-heading">Built on three pillars</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Community first",
                description: "Every feature is designed to strengthen connections between women, making networking natural and meaningful.",
                iconBg: "bg-purple-100",
                iconColor: "text-purple-600",
              },
              {
                icon: Shield,
                title: "Safe & verified",
                description: "Every member is reviewed by our team, ensuring a trusted, high-quality community for everyone.",
                iconBg: "bg-lavender-200",
                iconColor: "text-violet-600",
              },
              {
                icon: Sparkles,
                title: "Empowering growth",
                description: "From business directories to events and marketplace listings, we give women the platform to shine.",
                iconBg: "bg-rose-100",
                iconColor: "text-rose-500",
              },
            ].map((item) => (
              <div key={item.title} className="text-center group">
                <div className={`w-14 h-14 rounded-2xl ${item.iconBg} flex items-center justify-center mx-auto mb-5 transition-transform duration-300 group-hover:-translate-y-1`}>
                  <item.icon className={`h-7 w-7 ${item.iconColor}`} />
                </div>
                <h3 className="text-xl font-serif font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted leading-relaxed text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center" style={{ background: "#F0EEFF" }}>
        <div className="max-w-xl mx-auto px-4">
          <span className="section-label">Join us</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4" style={{ letterSpacing: "-0.03em" }}>
            Ready to join the circle?
          </h2>
          <p className="text-muted mb-10 leading-relaxed">
            Become part of a curated community of ambitious, inspiring women.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/join">
              <Button size="lg" className="gap-2">
                Become a member <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/members">
              <Button size="lg" variant="secondary">Explore community</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
