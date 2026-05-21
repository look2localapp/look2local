import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

// POST /api/upload
// Accepts: multipart/form-data with "file" field
// Optional: "type" field = "shop_image" | "banner" | "product" | "reel"
// Returns: { url, publicId, width, height, format }

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) ?? "product";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const validVideoTypes = ["video/mp4", "video/mov", "video/avi", "video/webm"];
    const isVideo = validVideoTypes.includes(file.type);
    const isImage = validImageTypes.includes(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json({
        error: "Invalid file type. Use JPG, PNG, WebP, or MP4/MOV for videos."
      }, { status: 400 });
    }

    // 5MB limit for images, 50MB for videos
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({
        error: `File too large. Max ${isVideo ? "50MB for videos" : "5MB for images"}.`
      }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Folder structure: look2local/{type}/
    const folder = `look2local/${type}`;

    // Upload options
    const uploadOptions = {
      folder,
      resource_type: isVideo ? "video" : "image",
      quality: "auto",
      fetch_format: "auto",
      ...(isImage && type !== "reel" ? {
        transformation: [
          { quality: "auto", fetch_format: "auto" },
          { width: type === "banner" ? 1200 : 800, crop: "limit" },
        ],
      } : {}),
    } as const;

    // Upload via buffer as base64
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, uploadOptions);

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      resourceType: result.resource_type,
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}

// Set max body size for large video uploads
export const config = {
  api: {
    bodyParser: false,
  },
};
