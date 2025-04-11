import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

/**
 * Get all skills with optional filtering
 */
export async function getSkills({
  page = 1,
  pageSize = 50,
  category,
  search,
  orderBy = "name",
  orderDirection = "asc",
}: {
  page?: number;
  pageSize?: number;
  category?: string;
  search?: string;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}) {
  // Calculate pagination
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  // Build where clause based on filters
  const where: Prisma.SkillWhereInput = {};

  // Add category filter
  if (category) {
    where.category = category;
  }

  // Add search filter
  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  // Determine orderBy clause
  let orderByClause: Prisma.SkillOrderByWithRelationInput = {};

  if (orderBy === "name") {
    orderByClause.name = orderDirection;
  } else if (orderBy === "category") {
    orderByClause.category = orderDirection;
  } else {
    // Default sorting by name
    orderByClause.name = "asc";
  }

  try {
    // Get total count for pagination
    const totalSkills = await db.skill.count({ where });

    // Get skills with pagination, filtering, and sorting
    const skills = await db.skill.findMany({
      where,
      skip,
      take,
      orderBy: orderByClause,
    });

    return {
      skills,
      pagination: {
        total: totalSkills,
        pageCount: Math.ceil(totalSkills / pageSize),
        page,
        pageSize,
      },
    };
  } catch (error) {
    console.error("Error fetching skills:", error);
    throw error;
  }
}

/**
 * Get a single skill by ID
 */
export async function getSkillById(id: string) {
  try {
    const skill = await db.skill.findUnique({
      where: { id },
    });

    return skill;
  } catch (error) {
    console.error(`Error fetching skill with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Get a skill by name
 */
export async function getSkillByName(name: string) {
  try {
    const skill = await db.skill.findUnique({
      where: { name },
    });

    return skill;
  } catch (error) {
    console.error(`Error fetching skill with name ${name}:`, error);
    throw error;
  }
}

/**
 * Create a new skill
 */
export async function createSkill(data: Prisma.SkillCreateInput) {
  try {
    const skill = await db.skill.create({
      data,
    });

    return skill;
  } catch (error) {
    console.error("Error creating skill:", error);
    throw error;
  }
}

/**
 * Update an existing skill
 */
export async function updateSkill(id: string, data: Prisma.SkillUpdateInput) {
  try {
    const skill = await db.skill.update({
      where: { id },
      data,
    });

    return skill;
  } catch (error) {
    console.error(`Error updating skill with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a skill
 */
export async function deleteSkill(id: string) {
  try {
    await db.skill.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Error deleting skill with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Get most used skills in job listings
 */
export async function getPopularSkills(limit = 10) {
  try {
    const skills = await db.skill.findMany({
      where: {
        jobs: {
          some: {
            job: {
              isActive: true,
            },
          },
        },
      },
      include: {
        _count: {
          select: {
            jobs: {
              where: {
                job: {
                  isActive: true,
                },
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

    return skills;
  } catch (error) {
    console.error("Error fetching popular skills:", error);
    throw error;
  }
}
