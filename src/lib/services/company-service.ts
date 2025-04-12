import { db } from "@/lib/db";

/**
 * Get all companies
 */
export async function getCompanies() {
  try {
    const companies = await db.company.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return companies;
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
}

/**
 * Get a company by ID
 */
export async function getCompanyById(id: string) {
  try {
    const company = await db.company.findUnique({
      where: { id },
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
export async function createCompany(data: {
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  industry: string[];
  size?: string;
  location?: string;
}) {
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
  data: {
    name?: string;
    logo?: string;
    website?: string;
    description?: string;
    industry?: string[];
    size?: string;
    location?: string;
  },
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
