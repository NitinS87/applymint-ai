"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { mockJobs } from "@/app/jobs/mock-data";
import { ROUTES } from "@/lib/constants";

// In-memory store for saved jobs in development (would use database in production)
let savedJobs: { userId: string; jobId: string; savedAt: Date }[] = [];

/**
 * Get saved jobs for the current user
 */
export async function getSavedJobs() {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    // In a real app, this would use Prisma to query the database
    // const userSavedJobs = await db.savedJob.findMany({
    //   where: { userId },
    //   include: { job: true },
    // });

    // Using our in-memory store for development
    const userSavedJobIds = savedJobs
      .filter((job) => job.userId === userId)
      .map((job) => job.jobId);

    // Get full job details for saved jobs
    const userSavedJobs = userSavedJobIds
      .map((jobId) => mockJobs.find((job) => job.id === jobId))
      .filter(Boolean);

    return { success: true, data: userSavedJobs };
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    return { success: false, message: "Failed to fetch saved jobs" };
  }
}

/**
 * Check if a job is saved by the current user
 */
export async function isJobSaved(jobId: string) {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  try {
    // In a real app, this would use Prisma to query the database
    // const savedJob = await db.savedJob.findUnique({
    //   where: {
    //     userId_jobId: {
    //       userId,
    //       jobId,
    //     },
    //   },
    // });

    // Using our in-memory store for development
    const savedJob = savedJobs.find(
      (job) => job.userId === userId && job.jobId === jobId,
    );

    return Boolean(savedJob);
  } catch (error) {
    console.error("Error checking if job is saved:", error);
    return false;
  }
}

/**
 * Save a job for the current user
 */
export async function saveJob(jobId: string) {
  const { userId } = await auth();

  if (!userId) {
    // Redirect to sign-in if not authenticated
    redirect(ROUTES.SIGN_IN);
  }

  try {
    // Check if job exists
    const job = mockJobs.find((job) => job.id === jobId);

    if (!job) {
      return { success: false, message: "Job not found" };
    }

    // In a real app, this would use Prisma to save to the database
    // await db.savedJob.create({
    //   data: {
    //     userId,
    //     jobId,
    //   },
    // });

    // Using our in-memory store for development
    // First check if it's already saved
    const alreadySaved = savedJobs.some(
      (job) => job.userId === userId && job.jobId === jobId,
    );

    if (!alreadySaved) {
      savedJobs.push({
        userId,
        jobId,
        savedAt: new Date(),
      });
    }

    // Revalidate related pages to update the UI
    revalidatePath(ROUTES.SAVED_JOBS);
    revalidatePath(ROUTES.JOBS);
    revalidatePath(ROUTES.JOB_DETAILS(jobId));

    return { success: true, message: "Job saved successfully" };
  } catch (error) {
    console.error("Error saving job:", error);
    return { success: false, message: "Failed to save job" };
  }
}

/**
 * Unsave a job for the current user
 */
export async function unsaveJob(jobId: string) {
  const { userId } = await auth();

  if (!userId) {
    // Redirect to sign-in if not authenticated
    redirect(ROUTES.SIGN_IN);
  }

  try {
    // In a real app, this would use Prisma to delete from the database
    // await db.savedJob.delete({
    //   where: {
    //     userId_jobId: {
    //       userId,
    //       jobId,
    //     },
    //   },
    // });

    // Using our in-memory store for development
    savedJobs = savedJobs.filter(
      (job) => !(job.userId === userId && job.jobId === jobId),
    );

    // Revalidate related pages to update the UI
    revalidatePath(ROUTES.SAVED_JOBS);
    revalidatePath(ROUTES.JOBS);
    revalidatePath(ROUTES.JOB_DETAILS(jobId));

    return { success: true, message: "Job removed from saved jobs" };
  } catch (error) {
    console.error("Error removing saved job:", error);
    return { success: false, message: "Failed to remove job from saved jobs" };
  }
}
