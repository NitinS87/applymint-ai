import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/main-layout";
import { ROUTES } from "@/lib/constants";

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-secondary/20 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Find Your Next Career Move with{" "}
            <span className="text-primary">ApplyMint AI</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Connect with jobs in your domain, discover opportunities, and level up your career with
            personalized recommendations and AI-powered job matching.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href={ROUTES.JOBS}>
              <Button size="lg" className="gap-2">
                Browse Jobs
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={ROUTES.SIGN_UP}>
              <Button variant="outline" size="lg">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Why ApplyMint AI?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-medium">Domain-Focused Job Search</h3>
              <p className="text-muted-foreground">
                Find jobs specifically in your domain with our advanced filtering and industry
                categorization. Focus on opportunities that match your expertise.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-medium">Official Application Links</h3>
              <p className="text-muted-foreground">
                Connect directly to official job postings on company websites. No middlemen, just direct
                links to apply with confidence.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
                  <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z" />
                  <path d="M5 18v2" />
                  <path d="M19 18v2" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-medium">AI-Powered Recommendations</h3>
              <p className="text-muted-foreground">
                Receive personalized job recommendations based on your profile, skills, and search
                history. Discover opportunities you might have missed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Ready to find your next opportunity?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/90">
            Join thousands of professionals who've found their dream jobs through ApplyMint AI.
          </p>
          <div className="mt-8">
            <Link href={ROUTES.SIGN_UP}>
              <Button
                size="lg"
                variant="secondary"
                className="bg-background text-primary hover:bg-background/90"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Domains Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Browse Jobs by Domain
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {domainItems.map((domain) => (
              <Link
                key={domain.name}
                href={`${ROUTES.JOBS}?domain=${encodeURIComponent(domain.name)}`}
                className="flex flex-col items-center rounded-lg border bg-card p-4 text-center transition-colors hover:border-primary hover:bg-card/50"
              >
                <span className="mb-2 text-3xl">{domain.icon}</span>
                <span className="text-sm font-medium">{domain.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

const domainItems = [
  { name: "Technology", icon: "👨‍💻" },
  { name: "Healthcare", icon: "🏥" },
  { name: "Finance", icon: "💰" },
  { name: "Education", icon: "🎓" },
  { name: "Marketing", icon: "📊" },
  { name: "Design", icon: "🎨" },
  { name: "Engineering", icon: "🔧" },
  { name: "Sales", icon: "🤝" },
  { name: "Legal", icon: "⚖️" },
  { name: "Science", icon: "🔬" },
  { name: "Hospitality", icon: "🏨" },
  { name: "Media", icon: "📱" },
  { name: "Retail", icon: "🛍️" },
  { name: "Construction", icon: "🏗️" },
  { name: "Manufacturing", icon: "🏭" },
];
