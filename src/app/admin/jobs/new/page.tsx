import { Metadata } from "next";
import { JobForm } from "@/components/admin/jobs/job-form";
import { getCompanies } from "@/lib/services/company-service";
import { getDomains } from "@/lib/services/domain-service";
import { getSkills } from "@/lib/services/skill-service";

export const metadata: Metadata = {
  title: "Add New Job - Admin",
  description: "Add a new job listing to ApplyMint AI",
};

export default async function NewJobPage() {
  // Fetch necessary data for the form
  const [companies, domains, skills] = await Promise.all([
    getCompanies(),
    getDomains(),
    getSkills({}),
  ]);

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">Add New Job</h1>
        <JobForm
          companies={companies}
          domains={domains as any}
          skills={skills as any}
        />
      </div>
    </div>
  );
}
