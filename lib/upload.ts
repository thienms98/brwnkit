import {
  generateUploadButton,
  generateUploadDropzone
} from "@uploadthing/react";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/upload/core";
import { UploadThingError } from "uploadthing/server";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>({
    url: "/api/upload"
  });

export async function upload(
  file: File,
  onProgress?: (progress: number) => void
) {
  try {
    const [res] = await uploadFiles("blobUploader", {
      files: [file],
      onUploadProgress: ({ progress }) => onProgress?.(progress)
    });
    return { url: res.ufsUrl };
  } catch (err) {
    if (err instanceof UploadThingError) {
      throw new Error(err.message); // "Unauthorized", "Forbidden", v.v.
    }
    throw new Error("Upload failed");
  }
}
