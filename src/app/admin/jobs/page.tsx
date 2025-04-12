import { Metadata } from "next";
import Link from "next/link";
import { getJobs } from "@/lib/services/job-service";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AdminJobsTable } from "@/components/admin/jobs/admin-jobs-table";

export const metadata: Metadata = {
  title: "Admin - Job Management",
  description: "Manage job listings on ApplyMint AI",
};

export default async function AdminJobsPage() {
  // Fetch all jobs for the admin dashboard
  const jobs = await getJobs({
    limit: 100,
    includeInactive: true,
  });

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Management</h1>
          <p className="text-muted-foreground mt-2">
            View, edit and create job listings for the platform
          </p>
        </div>
        <Link href="/admin/jobs/new">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Add New Job</span>
          </Button>
        </Link>
      </div>

      <AdminJobsTable jobs={jobs as any} />
    </div>
  );
}
