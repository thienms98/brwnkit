import { ROLE } from "@/generated/prisma/enums";
import { getAuth } from "@/lib/auth";
import { NextRequest } from "next/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: NextRequest) => {
  return getAuth(req);
};

export const ourFileRouter = {
  blobUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1
    },
    blob: { maxFileSize: "256MB", maxFileCount: 1 }
  })
    .middleware(async ({ req }) => {
      try {
        const { role, sub } = auth(req);
        if (role !== ROLE.ADMIN) throw new UploadThingError("Forbidden");

        return { userId: sub };
      } catch {
        throw new UploadThingError("Unauthorized");
      }
    })
    .onUploadComplete(async ({ metadata }) => {
      return { uploadedBy: metadata.userId };
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
