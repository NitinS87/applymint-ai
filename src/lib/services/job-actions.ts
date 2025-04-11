"use server";

import { redirect } from "next/navigation";
import { getJobById, incrementJobClickCount } from "@/lib/services/job-service";
import { auth } from "@clerk/nextjs/server";

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
