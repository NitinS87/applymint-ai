import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

/**
 * Get all domains with their subdomains
 */
export async function getDomains() {
  try {
    const domains = await db.domain.findMany({
      include: {
        subdomains: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return domains;
  } catch (error) {
    console.error("Error fetching domains:", error);
    throw error;
  }
}

/**
 * Get a domain by ID with its subdomains
 */
export async function getDomainById(id: string) {
  try {
    const domain = await db.domain.findUnique({
      where: { id },
      include: {
        subdomains: true,
      },
    });

    return domain;
  } catch (error) {
    console.error(`Error fetching domain with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Get a domain by name
 */
export async function getDomainByName(name: string) {
  try {
    const domain = await db.domain.findUnique({
      where: { name },
      include: {
        subdomains: true,
      },
    });

    return domain;
  } catch (error) {
    console.error(`Error fetching domain with name ${name}:`, error);
    throw error;
  }
}

/**
 * Create a new domain
 */
export async function createDomain(data: {
  name: string;
  description?: string;
}) {
  try {
    const domain = await db.domain.create({
      data,
    });

    return domain;
  } catch (error) {
    console.error("Error creating domain:", error);
    throw error;
  }
}

/**
 * Create a new subdomain
 */
export async function createSubdomain(data: {
  name: string;
  description?: string;
  domainId: string;
}) {
  try {
    const subdomain = await db.subdomain.create({
      data,
    });

    return subdomain;
  } catch (error) {
    console.error("Error creating subdomain:", error);
    throw error;
  }
}

/**
 * Update an existing domain
 */
export async function updateDomain(id: string, data: Prisma.DomainUpdateInput) {
  try {
    const domain = await db.domain.update({
      where: { id },
      data,
      include: {
        subdomains: true,
      },
    });

    return domain;
  } catch (error) {
    console.error(`Error updating domain with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a domain
 */
export async function deleteDomain(id: string) {
  try {
    await db.domain.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Error deleting domain with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Get domains with the most job listings
 */
export async function getPopularDomains(limit = 5) {
  try {
    const domains = await db.domain.findMany({
      where: {
        jobs: {
          some: {
            isActive: true,
          },
        },
      },
      include: {
        _count: {
          select: {
            jobs: {
              where: {
                isActive: true,
              },
            },
          },
        },
      },
      orderBy: {
        jobs: {
          _count: "desc",
        },
      },
      take: limit,
    });

    return domains;
  } catch (error) {
    console.error("Error fetching popular domains:", error);
    throw error;
  }
}

/**
 * Get all domains with job counts
 * Useful for displaying domain categories with the number of jobs in each
 */
export async function getDomainsWithJobCounts() {
  try {
    const domains = await db.domain.findMany({
      include: {
        _count: {
          select: {
            jobs: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return domains.map((domain) => ({
      id: domain.id,
      name: domain.name,
      description: domain.description,
      jobCount: domain._count.jobs,
    }));
  } catch (error) {
    console.error("Error fetching domains with job counts:", error);
    throw error;
  }
}
