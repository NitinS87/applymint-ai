import Link from "next/link";
import { FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/main-layout";
import { ROUTES } from "@/lib/constants";

export const metadata = {
  title: "Job Not Found | ApplyMint AI",
  description: "The job listing you are looking for cannot be found or has been removed.",
};

export default function JobNotFound() {
  return (
    <MainLayout>
      <div className="container flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-6 rounded-full bg-primary/10 p-6">
          <FileQuestion className="h-12 w-12 text-primary" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">Job Not Found</h1>
        <p className="mb-8 max-w-md text-muted-foreground">
          The job listing you are looking for cannot be found or has been removed from
          our platform.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild variant="default">
            <Link href={ROUTES.JOBS}>
              Browse Jobs
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={ROUTES.HOME}>
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}