import { notFound } from "next/navigation";
import Image from "next/image";
import {
  Briefcase,
  Building,
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  Share2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ROUTES } from "@/lib/constants";
import { formatDate, formatRelativeDate, formatSalaryRange } from "@/lib/utils";
import { trackJobApply } from "@/app/jobs/[id]/actions";

// Importing mock data for demonstration
// In a real app, we would fetch this from the database
import { mockJobs } from "@/app/jobs/mock-data";

export const metadata = {
  title: "Job Details | ApplyMint AI",
  description:
    "View detailed job information and apply directly on the company website.",
};

export default async function JobDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  // In a real app, we would fetch the job data from the database
  const job = mockJobs.find((job) => job.id === id);

  if (!job) {
    notFound();
  }

  // Generate dynamic metadata for SEO
  metadata.title = `${job.title} at ${job.company.name} | ApplyMint AI`;
  metadata.description = `Apply for ${job.title} position at ${job.company.name}. ${job.description.substring(0, 150)}...`;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={ROUTES.HOME}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={ROUTES.JOBS}>Jobs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={ROUTES.COMPANY_DETAILS(job.companyId)}>
              {job.company.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{job.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{job.title}</h1>
              <div className="mt-2 flex items-center gap-2">
                <Building className="text-muted-foreground h-4 w-4" />
                <a
                  href={job.company.website || "#"}
                  className="text-muted-foreground hover:text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {job.company.name}
                </a>
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              aria-label="Share job"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            <Badge variant="outline">{job.jobType}</Badge>
            <Badge variant="outline">{job.experienceLevel}</Badge>
            <Badge variant="outline">{job.locationType}</Badge>
            {job.domains.map((domain) => (
              <Badge key={domain.id} variant="outline">
                {domain.name}
              </Badge>
            ))}
          </div>

          <div className="bg-card mb-6 grid grid-cols-1 gap-4 rounded-lg border p-4 sm:grid-cols-2">
            {(job.salary || job.salaryMax) && (
              <div>
                <p className="text-sm font-medium">Salary</p>
                <p className="text-muted-foreground flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  <span>
                    {formatSalaryRange(
                      job.salary,
                      job.salaryMax,
                      job.salaryCurrency,
                      job.salaryPeriod,
                    )}
                  </span>
                </p>
              </div>
            )}

            {job.location && (
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium">Posted</p>
              <p className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatRelativeDate(job.postedDate)}</span>
              </p>
            </div>

            {job.applicationDeadline && (
              <div>
                <p className="text-sm font-medium">Application Deadline</p>
                <p className="text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(job.applicationDeadline)}</span>
                </p>
              </div>
            )}
          </div>

          {/* Job Description */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Description</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p>{job.description}</p>
              <p>
                We are looking for a talented professional to join our team. The
                ideal candidate will have experience in the field and be
                passionate about delivering high-quality work.
              </p>
            </div>
          </div>

          {/* Job Responsibilities */}
          {job.responsibilities && (
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">Responsibilities</h2>
              <div className="prose dark:prose-invert max-w-none">
                <ul>
                  {job.responsibilities.split("\n").map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                  <li>Lead and deliver projects from concept to completion</li>
                  <li>Collaborate with cross-functional teams</li>
                  <li>Stay updated with industry trends and technologies</li>
                  <li>Provide mentorship to junior team members</li>
                  <li>Participate in code reviews and technical discussions</li>
                </ul>
              </div>
            </div>
          )}

          {/* Job Requirements */}
          {job.requirements && (
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">Requirements</h2>
              <div className="prose dark:prose-invert max-w-none">
                <ul>
                  {job.requirements.split("\n").map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                  <li>3+ years of relevant industry experience</li>
                  <li>Bachelor's degree or equivalent practical experience</li>
                  <li>Strong problem-solving and analytical skills</li>
                  <li>Excellent communication and teamwork abilities</li>
                  <li>Proficiency in relevant tools and technologies</li>
                </ul>
              </div>
            </div>
          )}

          {/* Required Skills */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((jobSkill) => (
                <Badge
                  key={jobSkill.id}
                  variant={jobSkill.isPrimary ? "default" : "outline"}
                >
                  {jobSkill.skill.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Preferred Skills */}
          {job.preferredSkills && (
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">Preferred Skills</h2>
              <div className="prose dark:prose-invert max-w-none">
                <ul>
                  {job.preferredSkills.split("\n").map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                  <li>Experience with cloud platforms (AWS, Azure, GCP)</li>
                  <li>Knowledge of agile development methodologies</li>
                  <li>Understanding of CI/CD pipelines</li>
                  <li>Previous experience in a similar industry</li>
                </ul>
              </div>
            </div>
          )}

          {/* About the company */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">
              About {job.company.name}
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p>{job.company.description}</p>
              <p>
                {job.company.name} is a leading company in{" "}
                {job.company.industry.join(", ")}. We are committed to
                innovation and excellence in all aspects of our business.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            <div className="bg-card rounded-lg border p-6">
              <h2 className="mb-4 text-lg font-semibold">Apply for this job</h2>
              <p className="text-muted-foreground mb-4 text-sm">
                This job application will redirect you to the company's official
                career page.
              </p>
              <form action={trackJobApply.bind(null, job.id)}>
                <Button className="w-full gap-2" size="lg" type="submit">
                  Apply Now
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </form>
              <p className="text-muted-foreground mt-2 text-xs">
                By clicking "Apply Now", you will be redirected to{" "}
                {job.company.name}'s official application page.
              </p>
            </div>

            <div className="bg-card rounded-lg border p-6">
              <h2 className="mb-4 text-lg font-semibold">
                Company Information
              </h2>
              <div className="mb-4 flex items-center gap-3">
                {job.company.logo ? (
                  <div className="bg-background relative h-16 w-16 overflow-hidden rounded-md border">
                    <Image
                      src={job.company.logo}
                      alt={job.company.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                ) : (
                  <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-md border">
                    <Building className="text-primary h-8 w-8" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{job.company.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {job.company.location || "Location not specified"}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Industry: </span>
                  <span className="text-muted-foreground">
                    {job.company.industry.join(", ")}
                  </span>
                </div>
                {job.company.size && (
                  <div>
                    <span className="font-medium">Company Size: </span>
                    <span className="text-muted-foreground">
                      {job.company.size}
                    </span>
                  </div>
                )}
                {job.company.website && (
                  <div>
                    <span className="font-medium">Website: </span>
                    <a
                      href={job.company.website}
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit website
                    </a>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <Button variant="outline" className="w-full" asChild>
                <a href={ROUTES.COMPANY_DETAILS(job.companyId)}>
                  View Company Profile
                </a>
              </Button>
            </div>

            <div className="bg-card rounded-lg border p-6">
              <h2 className="mb-4 text-lg font-semibold">Similar Jobs</h2>
              <p className="text-muted-foreground text-sm">
                Coming soon. We'll show similar job opportunities here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
