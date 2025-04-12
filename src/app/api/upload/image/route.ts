import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@clerk/nextjs/server";

/**
 * POST handler for job image uploads
 * This endpoint accepts image uploads and stores them using Vercel Blob
 */
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user from Clerk
    const { userId } = await auth();

    // Check if user is authenticated as admin
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the image file from the request
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 },
      );
    }

    // Upload to Vercel Blob storage
    const blob = await put(file.name, file, {
      access: "public",
      contentType: file.type,
    });

    // Return the blob URL to the client
    return NextResponse.json({
      url: blob.url,
      success: true,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 },
    );
  }
}
