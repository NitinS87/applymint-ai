import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

/**
 * Get all jobs with filtering, pagination, and sorting
 * Support for admin features by including optional isActive filter
 */
export async function getJobs({
  page = 1,
  pageSize = 10,
  domain,
  skill,
  jobType,
  experienceLevel,
  locationType,
  search,
  minSalary,
  maxSalary,
  orderBy = "postedDate",
  orderDirection = "desc",
  includeInactive = false,
  limit,
}: {
  page?: number;
  pageSize?: number;
  domain?: string;
  skill?: string;
  jobType?: string;
  experienceLevel?: string;
  locationType?: string;
  search?: string;
  minSalary?: number;
  maxSalary?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  includeInactive?: boolean;
  limit?: number;
}) {
  // Calculate pagination unless a limit is provided
  const skip = limit ? undefined : (page - 1) * pageSize;
  const take = limit || pageSize;

  // Build where clause based on filters
  const where: Prisma.JobWhereInput = {
    // Only include active jobs for regular users, include all for admins
    isActive: includeInactive ? undefined : true,
  };

  // Add domain filter
  if (domain) {
    where.domains = {
      some: {
        name: domain,
      },
    };
  }

  // Add skill filter
  if (skill) {
    where.skills = {
      some: {
        skill: {
          name: skill,
        },
      },
    };
  }

  // Add jobType filter
  if (jobType) {
    where.jobType = jobType;
  }

  // Add experienceLevel filter
  if (experienceLevel) {
    where.experienceLevel = experienceLevel;
  }

  // Add locationType filter
  if (locationType) {
    where.locationType = locationType;
  }

  // Add salary range filter
  if (minSalary) {
    where.salary = {
      gte: minSalary,
    };
  }

  if (maxSalary) {
    where.salaryMax = {
      lte: maxSalary,
    };
  }

  // Add search filter
  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        company: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  // Determine orderBy clause
  let orderByClause: Prisma.JobOrderByWithRelationInput = {};

  if (orderBy === "salary") {
    orderByClause.salary = orderDirection;
  } else if (orderBy === "postedDate") {
    orderByClause.postedDate = orderDirection;
  } else if (orderBy === "title") {
    orderByClause.title = orderDirection;
  } else if (orderBy === "viewCount") {
    orderByClause.viewCount = orderDirection;
  } else {
    // Default sorting by posted date
    orderByClause.postedDate = "desc";
  }

  try {
    // Get total count for pagination
    const totalJobs = await db.job.count({ where });

    // Get jobs with pagination, filtering, and sorting
    const jobs = await db.job.findMany({
      where,
      include: {
        company: true,
        domains: true,
        subdomains: { include: { domain: true } }, // updated
        skills: {
          include: {
            skill: true,
          },
        },
        applications: {
          select: {
            id: true,
          },
        },
      },
      skip,
      take,
      orderBy: orderByClause,
    });

    // If a limit was provided, don't return pagination info
    if (limit) {
      return jobs;
    }

    return {
      jobs,
      pagination: {
        total: totalJobs,
        pageCount: Math.ceil(totalJobs / pageSize),
        page,
        pageSize,
      },
    };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
}

/**
 * Get a single job by ID
 */
export async function getJobById(id: string) {
  try {
    const job = await db.job.findUnique({
      where: { id },
      include: {
        company: true,
        domains: true,
        subdomains: { include: { domain: true } }, // updated
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    return job;
  } catch (error) {
    console.error(`Error fetching job with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Increment job view count
 */
export async function incrementJobViewCount(id: string) {
  try {
    await db.job.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    console.error(`Error incrementing view count for job ${id}:`, error);
    throw error;
  }
}

/**
 * Increment job click count (application link clicks)
 */
export async function incrementJobClickCount(id: string) {
  try {
    await db.job.update({
      where: { id },
      data: {
        clickCount: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    console.error(`Error incrementing click count for job ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new job listing
 */
export async function createJob(data: Prisma.JobCreateInput) {
  try {
    const job = await db.job.create({
      data,
      include: {
        company: true,
        domains: true,
        subdomains: true,
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    return job;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
}

/**
 * Update an existing job listing
 */
export async function updateJob(id: string, data: Prisma.JobUpdateInput) {
  try {
    const job = await db.job.update({
      where: { id },
      data,
      include: {
        company: true,
        domains: true,
        subdomains: true,
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    return job;
  } catch (error) {
    console.error(`Error updating job with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a job listing
 */
export async function deleteJob(id: string) {
  try {
    await db.job.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Error deleting job with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Get similar jobs based on domain and skills
 */
export async function getSimilarJobs(jobId: string, limit = 3) {
  try {
    // First, get the current job to extract domains and skills
    const currentJob = await db.job.findUnique({
      where: { id: jobId },
      include: {
        domains: true,
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!currentJob) {
      throw new Error("Job not found");
    }

    // Extract domain IDs and skill IDs
    const domainIds = currentJob.domains.map((domain) => domain.id);
    const skillIds = currentJob.skills.map((jobSkill) => jobSkill.skillId);

    // Find similar jobs based on domains and skills
    const similarJobs = await db.job.findMany({
      where: {
        id: { not: jobId }, // Exclude current job
        isActive: true,
        OR: [
          // Jobs with similar domains
          {
            domains: {
              some: {
                id: {
                  in: domainIds,
                },
              },
            },
          },
          // Jobs with similar skills
          {
            skills: {
              some: {
                skillId: {
                  in: skillIds,
                },
              },
            },
          },
        ],
      },
      include: {
        company: true,
        domains: true,
        subdomains: { include: { domain: true } }, // updated
        skills: {
          include: {
            skill: true,
          },
        },
      },
      take: limit,
    });

    return similarJobs;
  } catch (error) {
    console.error(`Error fetching similar jobs for job ${jobId}:`, error);
    throw error;
  }
}
