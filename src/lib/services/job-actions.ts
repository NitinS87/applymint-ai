"use server";

import { redirect } from "next/navigation";
import { getJobById, incrementJobClickCount } from "@/lib/services/job-service";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { z } from "zod";

// Schema for job creation and updates
const jobSchema = z.object({
  title: z.string().min(3),
  companyId: z.string(),
  description: z.string().min(20),
  responsibilities: z.string().optional(),
  requirements: z.string().optional(),
  preferredSkills: z.string().optional(),
  location: z.string().optional(),
  locationType: z.string(),
  salary: z.number().optional(),
  salaryMax: z.number().optional(),
  salaryCurrency: z.string().default("USD"),
  salaryPeriod: z.string(),
  jobType: z.string(),
  experienceLevel: z.string(),
  applicationLink: z.string().url(),
  applicationDeadline: z.date().optional(),
  domains: z.array(z.string()).min(1),
  subdomains: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

/**
 * Track job application click and redirect to the application link
 */
export async function trackJobApply(jobId: string) {
  try {
    // Get the current user (if logged in)
    const { userId } = await auth();

    // Increment the job click count
    await incrementJobClickCount(jobId);

    // Get the job details to find the application link
    const job = await getJobById(jobId);

    if (!job) {
      throw new Error("Job not found");
    }

    // Track application in database if user is logged in
    if (userId) {
      // Import here to avoid circular dependencies
      const { db } = await import("@/lib/db");

      // Check if application already exists
      const existingApplication = await db.application.findUnique({
        where: {
          userId_jobId: {
            userId,
            jobId,
          },
        },
      });

      if (existingApplication) {
        // Update existing application
        await db.application.update({
          where: {
            id: existingApplication.id,
          },
          data: {
            clickedAt: new Date(),
            updatedAt: new Date(),
          },
        });
      } else {
        // Create new application
        await db.application.create({
          data: {
            userId,
            jobId,
            status: "CLICKED",
            clickedAt: new Date(),
            statusUpdatedAt: new Date(),
          },
        });
      }
    }

    // Redirect to the application link
    redirect(job.applicationLink);
  } catch (error) {
    console.error("Error tracking job application:", error);
    // Fallback to a generic application URL if there's an error
    redirect("/jobs");
  }
}

/**
 * Create a new job listing
 */
export async function createJob(formData: z.infer<typeof jobSchema>) {
  try {
    // Validate form data
    const data = jobSchema.parse(formData);

    // Get current user from Clerk
    const { userId } = await auth();

    // Check admin permissions
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Create the job in the database
    const job = await db.job.create({
      data: {
        title: data.title,
        description: data.description,
        responsibilities: data.responsibilities,
        requirements: data.requirements,
        preferredSkills: data.preferredSkills,
        companyId: data.companyId,
        location: data.location,
        locationType: data.locationType,
        salary: data.salary,
        salaryMax: data.salaryMax,
        salaryCurrency: data.salaryCurrency,
        salaryPeriod: data.salaryPeriod,
        jobType: data.jobType,
        experienceLevel: data.experienceLevel,
        applicationLink: data.applicationLink,
        applicationDeadline: data.applicationDeadline,
        postedDate: new Date(),
        isActive: data.isActive,
        // Connect domains
        domains: {
          connect: data.domains.map((id) => ({ id })),
        },
        // Connect subdomains if provided
        subdomains: data.subdomains?.length
          ? {
              connect: data.subdomains.map((id) => ({ id })),
            }
          : undefined,
      },
    });

    // Connect skills if provided
    if (data.skills?.length) {
      // Create job-skill connections
      await Promise.all(
        data.skills.map(async (skillId) => {
          await db.jobSkill.create({
            data: {
              jobId: job.id,
              skillId,
              isPrimary: false,
            },
          });
        }),
      );
    }

    // Revalidate the jobs page to show the new job
    revalidatePath("/admin/jobs");
    revalidatePath("/jobs");

    return { success: true, job };
  } catch (error) {
    console.error("Error creating job:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create job",
    };
  }
}

/**
 * Update a job's social media image URL
 */
export async function updateJobImageUrl(jobId: string, imageUrl: string) {
  try {
    // Get current user from Clerk
    const { userId } = await auth();

    // Check admin permissions
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Update the job with the image URL
    const updatedJob = await db.job.update({
      where: { id: jobId },
      data: {
        imageUrl,
      },
    });

    // Generate a QR code URL for the job application
    // You could implement this here or in a separate function

    // Revalidate the job pages
    revalidatePath(`/jobs/${jobId}`);
    revalidatePath("/admin/jobs");

    return { success: true, job: updatedJob };
  } catch (error) {
    console.error("Error updating job image:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update job image",
    };
  }
}
