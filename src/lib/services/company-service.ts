import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

/**
 * Get all companies with optional filtering
 */
export async function getCompanies({
  page = 1,
  pageSize = 10,
  search,
  industry,
  orderBy = "name",
  orderDirection = "asc",
}: {
  page?: number;
  pageSize?: number;
  search?: string;
  industry?: string;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}) {
  // Calculate pagination
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  // Build where clause based on filters
  const where: Prisma.CompanyWhereInput = {};

  // Add search filter
  if (search) {
    where.OR = [
      {
        name: {
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
    ];
  }

  // Add industry filter
  if (industry) {
    where.industry = {
      has: industry,
    };
  }

  // Determine orderBy clause
  let orderByClause: Prisma.CompanyOrderByWithRelationInput = {};

  if (orderBy === "name") {
    orderByClause.name = orderDirection;
  } else if (orderBy === "location") {
    orderByClause.location = orderDirection;
  } else {
    // Default sorting by name
    orderByClause.name = "asc";
  }

  try {
    // Get total count for pagination
    const totalCompanies = await db.company.count({ where });

    // Get companies with pagination, filtering, and sorting
    const companies = await db.company.findMany({
      where,
      skip,
      take,
      orderBy: orderByClause,
    });

    return {
      companies,
      pagination: {
        total: totalCompanies,
        pageCount: Math.ceil(totalCompanies / pageSize),
        page,
        pageSize,
      },
    };
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
}

/**
 * Get a single company by ID
 */
export async function getCompanyById(id: string) {
  try {
    const company = await db.company.findUnique({
      where: { id },
      include: {
        jobs: {
          where: {
            isActive: true,
          },
          include: {
            domains: true,
            skills: {
              include: {
                skill: true,
              },
            },
          },
        },
      },
    });

    return company;
  } catch (error) {
    console.error(`Error fetching company with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new company
 */
export async function createCompany(data: Prisma.CompanyCreateInput) {
  try {
    const company = await db.company.create({
      data,
    });

    return company;
  } catch (error) {
    console.error("Error creating company:", error);
    throw error;
  }
}

/**
 * Update an existing company
 */
export async function updateCompany(
  id: string,
  data: Prisma.CompanyUpdateInput,
) {
  try {
    const company = await db.company.update({
      where: { id },
      data,
    });

    return company;
  } catch (error) {
    console.error(`Error updating company with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a company
 */
export async function deleteCompany(id: string) {
  try {
    await db.company.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Error deleting company with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Get companies with the most active job listings
 */
export async function getTopCompanies(limit = 5) {
  try {
    const companies = await db.company.findMany({
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

    return companies;
  } catch (error) {
    console.error("Error fetching top companies:", error);
    throw error;
  }
}
