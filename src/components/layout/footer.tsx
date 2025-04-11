import Link from "next/link";
import { MessageCircle, Mail, Github } from "lucide-react";

import { ROUTES } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Link href={ROUTES.HOME} className="flex items-center gap-2">
              <span className="text-primary text-xl font-bold">ApplyMint</span>
              <span className="text-xl font-semibold">AI</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Connect with jobs in your domain, discover opportunities, and
              level up your career.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium">For Job Seekers</h3>
            <ul className="text-muted-foreground flex flex-col gap-2 text-sm">
              <li>
                <Link href={ROUTES.JOBS} className="hover:text-primary">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href={ROUTES.COMPANIES} className="hover:text-primary">
                  Browse Companies
                </Link>
              </li>
              <li>
                <Link
                  href={`${ROUTES.JOBS}?filter=remote`}
                  className="hover:text-primary"
                >
                  Remote Jobs
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-primary">
                  Career Resources
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium">Company</h3>
            <ul className="text-muted-foreground flex flex-col gap-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium">Connect</h3>
            <ul className="text-muted-foreground flex list-none flex-col gap-2 text-sm">
              <li>
                <a
                  href="mailto:support@applymint.ai"
                  className="hover:text-primary flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>Contact Us</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/applymint-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/applymint_ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                  <span>Twitter</span>
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/applymintai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Discord</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-muted-foreground mt-8 border-t pt-8 text-center text-sm">
          <p>&copy; {currentYear} ApplyMint AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
