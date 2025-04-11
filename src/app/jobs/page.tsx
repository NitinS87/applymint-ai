import { MainLayout } from "@/components/layout/main-layout";
import { JobFilter } from "@/components/jobs/job-filter";
import { JobCard } from "@/components/jobs/job-card";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { DOMAIN_CATEGORIES, DEFAULT_PAGE_SIZE } from "@/lib/constants";

export const metadata = {
  title: "Find Jobs | ApplyMint AI",
  description: "Browse and filter job opportunities across various domains and industries. Connect with official job application pages on company career websites.",
};

// Mocked data for demonstration purposes
// In a real app, this would be fetched from the database
const mockDomains = DOMAIN_CATEGORIES.map((category, index) => ({
  id: `domain-${index + 1}`,
  name: category.name,
  description: `Jobs related to ${category.name}`,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

const mockSkills = [
  { id: "skill-1", name: "JavaScript", category: "Technical Skills", createdAt: new Date(), updatedAt: new Date() },
  { id: "skill-2", name: "React", category: "Technical Skills", createdAt: new Date(), updatedAt: new Date() },
  { id: "skill-3", name: "Python", category: "Technical Skills", createdAt: new Date(), updatedAt: new Date() },
  { id: "skill-4", name: "SQL", category: "Technical Skills", createdAt: new Date(), updatedAt: new Date() },
  { id: "skill-5", name: "Project Management", category: "Soft Skills", createdAt: new Date(), updatedAt: new Date() },
  { id: "skill-6", name: "Communication", category: "Soft Skills", createdAt: new Date(), updatedAt: new Date() },
  { id: "skill-7", name: "Leadership", category: "Soft Skills", createdAt: new Date(), updatedAt: new Date() },
  { id: "skill-8", name: "Problem Solving", category: "Soft Skills", createdAt: new Date(), updatedAt: new Date() },
];

// Mocked job listings for demonstration
const mockCompanies = [
  {
    id: "company-1",
    name: "Tech Innovations Inc.",
    logo: null,
    website: "https://techinnovations.example.com",
    description: "A leading technology company",
    industry: ["Technology"],
    location: "San Francisco, CA",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "company-2",
    name: "Health Solutions",
    logo: null,
    website: "https://healthsolutions.example.com",
    description: "Healthcare technology provider",
    industry: ["Healthcare", "Technology"],
    location: "Boston, MA",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "company-3",
    name: "FinTech Global",
    logo: null,
    website: "https://fintechglobal.example.com",
    description: "Financial technology services",
    industry: ["Finance", "Technology"],
    location: "New York, NY",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockJobs = Array.from({ length: 12 }).map((_, i) => {
  const companyIndex = i % mockCompanies.length;
  const company = mockCompanies[companyIndex];
  
  const domains = [mockDomains[i % mockDomains.length]];
  
  // Add secondary domain sometimes
  if (i % 3 === 0) {
    const secondDomainIndex = (i + 1) % mockDomains.length;
    domains.push(mockDomains[secondDomainIndex]);
  }
  
  const jobSkills = mockSkills
    .slice(0, 3 + (i % 4))
    .map(skill => ({
      id: `job-skill-${i}-${skill.id}`,
      jobId: `job-${i + 1}`,
      skillId: skill.id,
      skill,
      isPrimary: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  
  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
  const experienceLevels = ["Entry", "Mid", "Senior", "Lead", "Executive"];
  const locationTypes = ["Remote", "Hybrid", "On-site"];
  
  return {
    id: `job-${i + 1}`,
    title: [
      "Senior Frontend Developer",
      "Data Scientist",
      "Product Manager",
      "DevOps Engineer",
      "UX Designer",
      "Marketing Specialist",
      "Project Manager",
      "Sales Representative",
    ][i % 8],
    description: "We are looking for a talented professional to join our team. The ideal candidate will have experience in...",
    companyId: company.id,
    company,
    location: ["San Francisco, CA", "New York, NY", "Remote", "Boston, MA", "London, UK"][i % 5],
    locationType: locationTypes[i % 3],
    salary: 80000 + (i * 10000),
    salaryMax: 100000 + (i * 20000),
    salaryCurrency: "USD",
    salaryPeriod: "YEARLY",
    jobType: jobTypes[i % 4],
    experienceLevel: experienceLevels[i % 5],
    applicationLink: "https://example.com/apply",
    applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
    postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i % 14)), // 0-13 days ago
    domains,
    subdomains: [],
    skills: jobSkills,
    applications: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    viewCount: Math.floor(Math.random() * 100),
    clickCount: Math.floor(Math.random() * 50),
    imageUrl: null,
    qrCodeUrl: null,
  };
});

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // In a real app, these would come from search params and be passed to the database query
  const page = Number(searchParams.page) || 1;
  const pageSize = DEFAULT_PAGE_SIZE;
  const totalJobs = mockJobs.length;
  const totalPages = Math.ceil(totalJobs / pageSize);
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedJobs = mockJobs.slice(startIndex, endIndex);

  // This would be handled by a server action or API route in a real app
  const handleFilterChange = (filters: any) => {
    console.log("Filters changed:", filters);
    // Would update the URL with search params and trigger a re-fetch
  };

  const handleApplyClick = (jobId: string) => {
    console.log(`User clicked apply for job ${jobId}`);
    // In a real app, this would track the click and potentially redirect
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold">Find Your Next Opportunity</h1>
          <p className="text-muted-foreground">
            Browse and filter job opportunities across various domains and industries.
          </p>
        </div>

        <div className="mb-8">
          <JobFilter 
            domains={mockDomains}
            skills={mockSkills}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {totalJobs} jobs found
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onApply={() => handleApplyClick(job.id)}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                asChild
              >
                <a href={`?page=${page - 1}`}>Previous</a>
              </Button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
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
                disabled={page >= totalPages}
                asChild
              >
                <a href={`?page=${page + 1}`}>Next</a>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </MainLayout>
  );
}