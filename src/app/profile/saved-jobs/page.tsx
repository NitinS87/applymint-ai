import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { JobCard } from "@/components/jobs/job-card";
import { getSavedJobs, unsaveJob } from "./actions";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Saved Jobs List Component with error boundary
async function SavedJobsList() {
  const { success, data: jobs, message } = await getSavedJobs();

  if (!success) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">{message || "Failed to load saved jobs"}</p>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="p-8 text-center">
        <h3 className="mb-2 text-xl font-medium">No saved jobs yet</h3>
        <p className="text-muted-foreground mb-4">
          Browse jobs and save the ones you're interested in to view them later
        </p>
        <Button asChild>
          <Link href={ROUTES.JOBS}>Browse Jobs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {jobs.map((job) => {
        return (
          <JobCard
            key={job!.id}
            job={job as any}
            isSaved={true}
            onUnsave={async (jobId) => {
              "use server";
              await unsaveJob(jobId);
            }}
          />
        );
      })}
    </div>
  );
}

export default async function SavedJobsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect(ROUTES.SIGN_IN);
  }

  return (
    <div className="container max-w-4xl py-6">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href={ROUTES.PROFILE}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Saved Jobs</h1>
      </div>

      <Separator className="mb-6" />

      <Suspense
        fallback={<p className="p-4 text-center">Loading saved jobs...</p>}
      >
        <SavedJobsList />
      </Suspense>
    </div>
  );
}
