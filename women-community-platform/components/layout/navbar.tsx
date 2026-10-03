"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  Users, Building2, ShoppingBag, Calendar, Info, Menu, X,
  Bell, LogOut, Settings, LayoutDashboard, Shield, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";

const navLinks = [
  { label: "Members",     href: "/members",     icon: Users },
  { label: "Businesses",  href: "/businesses",  icon: Building2 },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { label: "Events",      href: "/events",      icon: Calendar },
  { label: "About",       href: "/about",       icon: Info },
];

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdmin    = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";
  const isApproved = session?.user?.status === "APPROVED";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-lavender-100/95 backdrop-blur-md border-b border-lavender-300 shadow-card"
          : "bg-lavender-100 border-b border-lavender-300/60"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center h-16">
            <Image
              src="/logo-wow.png"
              alt="Women of Wisdom"
              width={140}
              height={64}
              className="h-16 w-auto object-contain rounded-lg"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all duration-200",
                    active
                      ? "text-purple-600 font-semibold"
                      : "text-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-purple-500"
                      style={{ animation: "fade-in 0.2s ease-out" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {session?.user ? (
              <>
                {/* Notifications */}
                <Link
                  href="/dashboard/notifications"
                  className="p-2 rounded-full hover:bg-lavender-200 transition-colors relative"
                >
                  <Bell className="h-4 w-4 text-muted" />
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-lavender-200 transition-colors"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={session.user.image ?? undefined} />
                      <AvatarFallback className="text-xs bg-purple-100 text-purple-700">
                        {getInitials(session.user.name ?? session.user.email ?? "U")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground hidden sm:block max-w-[100px] truncate">
                      {session.user.name ?? session.user.email}
                    </span>
                    <ChevronDown className="h-3 w-3 text-muted" />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-1.5 z-20 w-52 rounded-2xl border border-lavender-300 bg-white shadow-card-hover p-1">
                        <div className="px-3 py-2 border-b border-lavender-300 mb-1">
                          <p className="text-xs text-muted">Signed in as</p>
                          <p className="text-sm font-semibold text-foreground truncate">{session.user.email}</p>
                        </div>
                        {isApproved && (
                          <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-purple-50 text-foreground hover:text-purple-700 transition-colors">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                          </Link>
                        )}
                        {isAdmin && (
                          <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-purple-50 text-foreground hover:text-purple-700 transition-colors">
                            <Shield className="h-4 w-4" />
                            Admin Panel
                          </Link>
                        )}
                        <Link href="/dashboard/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-purple-50 text-foreground hover:text-purple-700 transition-colors">
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                        <div className="border-t border-lavender-300 mt-1 pt-1">
                          <button
                            onClick={() => { signOut({ callbackUrl: "/" }); setUserMenuOpen(false); }}
                            className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-red-50 text-red-600 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="hidden sm:flex text-muted hover:text-foreground">
                    Sign in
                  </Button>
                </Link>
                <Link href="/join">
                  <Button size="sm" className="bg-purple-600 text-white hover:bg-purple-700 hover:scale-[1.02] rounded-full">
                    Join WOW
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-lavender-200 transition-colors"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-lavender-300 bg-lavender-100 pb-4 px-4">
          <nav className="flex flex-col gap-1 pt-3">
            {navLinks.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    active
                      ? "bg-purple-100 text-purple-700 font-semibold"
                      : "text-muted hover:bg-lavender-200 hover:text-foreground"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
            {!session?.user && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-lavender-300">
                <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">Sign in</Button>
                </Link>
                <Link href="/join" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-purple-600 text-white hover:bg-purple-700">Join WOW</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
