import { MainLayout } from "@/components/layout/main-layout";
import { JobFilter } from "@/components/jobs/job-filter";
import { JobCard } from "@/components/jobs/job-card";
import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { getJobs } from "@/lib/services/job-service";
import { getDomains } from "@/lib/services/domain-service";
import { getSkills } from "@/lib/services/skill-service";
import type { Domain, Job, Skill } from "@/lib/types";

export const metadata = {
  title: "Find Jobs | ApplyMint AI",
  description:
    "Browse and filter job opportunities across various domains and industries. Connect with official job application pages on company career websites.",
};

/**
 * Adapter function to ensure database domain objects match the expected Domain type
 */
function adaptDomains(domains: any[]): Domain[] {
  return domains.map((domain) => ({
    ...domain,
    description: domain.description || undefined,
    subdomains:
      domain.subdomains?.map((subdomain: any) => ({
        ...subdomain,
        description: subdomain.description || undefined,
      })) || [],
  }));
}

/**
 * Adapter function to ensure database skill objects match the expected Skill type
 */
function adaptSkills(skills: any[]): Skill[] {
  return skills.map((skill) => ({
    ...skill,
    category: skill.category || undefined,
    jobs: [],
  }));
}

/**
 * Adapter function to ensure database job objects match the expected Job type
 */
function adaptJobs(jobs: any[]): Job[] {
  return jobs.map((job) => ({
    ...job,
    applications: job.applications || [],
    responsibilities: job.responsibilities || undefined,
    requirements: job.requirements || undefined,
    preferredSkills: job.preferredSkills || undefined,
    location: job.location || undefined,
    applicationDeadline: job.applicationDeadline || undefined,
    imageUrl: job.imageUrl || undefined,
    qrCodeUrl: job.qrCodeUrl || undefined,
  }));
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Get current page from search params or default to 1
  const page = Number(searchParams.page) || 1;
  const pageSize = DEFAULT_PAGE_SIZE;

  // Get domain filter from search params
  const domainFilter =
    typeof searchParams.domain === "string" ? searchParams.domain : undefined;

  // Get skill filter from search params
  const skillFilter =
    typeof searchParams.skill === "string" ? searchParams.skill : undefined;

  // Get job type filter from search params
  const jobTypeFilter =
    typeof searchParams.jobType === "string" ? searchParams.jobType : undefined;

  // Get experience level filter from search params
  const experienceLevelFilter =
    typeof searchParams.experienceLevel === "string"
      ? searchParams.experienceLevel
      : undefined;

  // Get location type filter from search params
  const locationTypeFilter =
    typeof searchParams.locationType === "string"
      ? searchParams.locationType
      : undefined;

  // Get search query from search params
  const searchQuery =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  // Get salary range filters from search params
  const minSalary =
    typeof searchParams.minSalary === "string"
      ? Number(searchParams.minSalary)
      : undefined;

  const maxSalary =
    typeof searchParams.maxSalary === "string"
      ? Number(searchParams.maxSalary)
      : undefined;

  // Get sort options from search params
  const sortBy =
    typeof searchParams.sortBy === "string"
      ? searchParams.sortBy
      : "postedDate";
  const sortDir =
    typeof searchParams.sortDir === "string"
      ? searchParams.sortDir === "asc"
        ? "asc"
        : "desc"
      : "desc";

  // Fetch jobs with filters, pagination, and sorting
  const jobsResult = await getJobs({
    page,
    pageSize,
    domain: domainFilter,
    skill: skillFilter,
    jobType: jobTypeFilter,
    experienceLevel: experienceLevelFilter,
    locationType: locationTypeFilter,
    search: searchQuery,
    minSalary,
    maxSalary,
    orderBy: sortBy,
    orderDirection: sortDir as "asc" | "desc",
  }) as { jobs: Job[]; pagination: { total: number; pageCount: number; page: number; pageSize: number } };
  const { jobs: dbJobs, pagination } = jobsResult;

  // Fetch domains and skills for the filter component
  const dbDomains = await getDomains();
  const { skills: dbSkills } = await getSkills({ pageSize: 100 });

  // Adapt database objects to match the expected types
  const jobs = adaptJobs(dbJobs);
  const domains = adaptDomains(dbDomains);
  const skills = adaptSkills(dbSkills);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">Find Your Next Opportunity</h1>
        <p className="text-muted-foreground">
          Browse and filter job opportunities across various domains and
          industries.
        </p>
      </div>

      <div className="mb-8">
        <JobFilter domains={domains} skills={skills} />
      </div>

      <div className="mb-6">
        <p className="text-muted-foreground text-sm">
          {pagination.total} jobs found
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Pagination */}
      {pagination.pageCount > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled={page <= 1} asChild>
              <a href={`?page=${page - 1}`}>Previous</a>
            </Button>

            {Array.from({ length: pagination.pageCount }).map((_, i) => (
              <Button
                key={i}
                variant={page === i + 1 ? "default" : "outline"}
                size="sm"
                asChild
              >
                <a href={`?page=${i + 1}`}>{i + 1}</a>
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              disabled={page >= pagination.pageCount}
              asChild
            >
              <a href={`?page=${page + 1}`}>Next</a>
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
}
