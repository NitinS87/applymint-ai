import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

/**
 * Get all domains
 */
export async function getDomains() {
  try {
    const domains = await db.domain.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        subdomains: true,
      },
    });

    return domains;
  } catch (error) {
    console.error("Error fetching domains:", error);
    throw error;
  }
}

/**
 * Get a single domain by ID with its subdomains
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
export async function createDomain(data: Prisma.DomainCreateInput) {
  try {
    const domain = await db.domain.create({
      data,
      include: {
        subdomains: true,
      },
    });

    return domain;
  } catch (error) {
    console.error("Error creating domain:", error);
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
