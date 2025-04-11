"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Menu, Search, Briefcase, Building2, X } from "lucide-react";
import { useState } from "react";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navItems = [
    { href: ROUTES.JOBS, label: "Jobs", icon: Briefcase },
    { href: ROUTES.COMPANIES, label: "Companies", icon: Building2 },
  ];

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">ApplyMint</span>
            <span className="text-xl font-semibold">AI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex">
            <ul className="flex items-center gap-6">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary",
                      pathname === item.href ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="hidden md:flex">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>

          <ModeToggle />

          <SignedIn>
            <UserButton
              afterSignOutUrl={ROUTES.HOME}
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-8 w-8",
                },
              }}
            />
          </SignedIn>

          <SignedOut>
            <div className="hidden gap-2 md:flex">
              <Link href={ROUTES.SIGN_IN}>
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href={ROUTES.SIGN_UP}>
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          </SignedOut>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="container flex h-16 items-center justify-between px-4">
            <Link href={ROUTES.HOME} className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">ApplyMint</span>
              <span className="text-xl font-semibold">AI</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="container mt-8 px-4">
            <ul className="flex flex-col gap-6">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={toggleMobileMenu}
                    className={cn(
                      "flex items-center gap-2 text-lg font-medium transition-colors hover:text-primary",
                      pathname === item.href ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <div className="mt-4 flex flex-col gap-3">
                  <SignedOut>
                    <Link href={ROUTES.SIGN_IN} onClick={toggleMobileMenu}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href={ROUTES.SIGN_UP} onClick={toggleMobileMenu}>
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </SignedOut>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}