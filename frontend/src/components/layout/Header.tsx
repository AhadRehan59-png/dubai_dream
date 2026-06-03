"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { cn, formatDisplayName } from "@/lib/utils";
import HydrationSafeIcon from "@/components/ui/HydrationSafeIcon";

const navLinks = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/dashboard/wallet", label: "Wallet" },
  { href: "/dashboard/tickets", label: "Tickets" },
  { href: "/winners", label: "Winners" },
  { href: "/categories", label: "Categories" },
];

interface HeaderUser {
  firstName: string;
  email: string;
  role: string;
}

interface HeaderProps {
  user: HeaderUser | null;
}

export default function Header({ user: initialUser }: HeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<HeaderUser | null>(initialUser);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { authenticated: false }))
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser({
            firstName: data.user.firstName,
            email: data.user.email,
            role: data.user.role,
          });
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(initialUser));
  }, [pathname, initialUser]);

  const displayName = user ? formatDisplayName(user.firstName) : "";

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-1">
          <span className="text-2xl font-black tracking-tighter text-white">
            <span className="text-pink">D</span> DREAM
          </span>
          <span className="text-2xl font-black tracking-tighter text-white">
            DUBAI
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium text-white/80 transition-colors hover:text-white",
                pathname === link.href && "border-b-2 border-pink pb-0.5 text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <span className="text-sm text-white/70">
                Hi, <span className="text-white">{displayName}</span>
              </span>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="rounded-full border border-pink/40 px-4 py-2 text-sm font-medium text-pink transition hover:bg-pink/10"
                >
                  Admin
                </Link>
              )}
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-full border border-white/30 px-5 py-2 text-sm font-medium text-white transition hover:border-white hover:bg-white/5"
                >
                  <HydrationSafeIcon icon={LogOut} size={16} />
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-full border border-white/30 px-5 py-2 text-sm font-medium text-white transition hover:border-white hover:bg-white/5"
            >
              Login/Sign-up
            </Link>
          )}
          <Link
            href="/cart"
            className="flex items-center gap-2 rounded-full bg-blue px-5 py-2 text-sm font-bold text-white transition hover:bg-blue/80"
          >
            <HydrationSafeIcon icon={ShoppingBag} size={16} />
            CART
          </Link>
          <div className="ml-2 flex gap-2">
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="App Store"
              className="h-8 opacity-80 transition hover:opacity-100"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Google Play"
              className="h-8 opacity-80 transition hover:opacity-100"
            />
          </div>
        </div>

        <button
          className="lg:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <HydrationSafeIcon icon={X} size={24} />
          ) : (
            <HydrationSafeIcon icon={Menu} size={24} />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/50 bg-black px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/80"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-2">
              {user ? (
                <>
                  <span className="flex flex-1 items-center text-sm text-white/70">
                    Hi, {displayName}
                  </span>
                  <form action="/api/auth/logout" method="POST" className="flex-1">
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-white/30 py-2 text-sm"
                    >
                      <HydrationSafeIcon icon={LogOut} size={16} />
                      Logout
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex-1 rounded-full border border-white/30 py-2 text-center text-sm"
                >
                  Login
                </Link>
              )}
              <Link
                href="/cart"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-blue py-2 text-sm font-bold"
              >
                <HydrationSafeIcon icon={ShoppingBag} size={16} /> CART
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
