"use server";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { mockJobs } from "@/app/jobs/mock-data";

/**
 * Server action to track when a user clicks the Apply button on a job posting.
 * This would log the interaction and then redirect the user to the application page.
 */
export async function trackJobApply(jobId: string, formData: FormData) {
  const { userId } = await auth();

  try {
    // Find the job in our mock data for demonstration
    // In a real app, this would use Prisma to find the job in the database
    const job = mockJobs.find((job) => job.id === jobId);

    if (!job) {
      throw new Error("Job not found");
    }

    // In a real app, this would create a record in the database
    console.log(`User ${userId || "anonymous"} clicked apply for job ${jobId}`);

    // For logged-in users, we would track this in their application history
    if (userId) {
      // Example of what would happen in a real app with Prisma
      /*
      await db.application.create({
        data: {
          userId,
          jobId,
          status: "CLICKED",
          applicationUrl: job.applicationLink,
        },
      });
      
      // Update job's click statistics
      await db.job.update({
        where: { id: jobId },
        data: {
          clickCount: {
            increment: 1,
          },
        },
      });
      */
    }

    // Redirect the user to the external application page
    redirect(job.applicationLink);
  } catch (error) {
    console.error("Error tracking job application click:", error);
    // In a real app, we might want to handle this error differently
    // For now, still redirect to the application link
    const job = mockJobs.find((job) => job.id === jobId);
    if (job) {
      redirect(job.applicationLink);
    } else {
      // If we can't find the job for some reason, redirect back to the jobs page
      redirect("/jobs");
    }
  }
}
