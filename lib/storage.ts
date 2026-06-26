import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTaskSnapshot
} from "firebase/storage";
import { storage } from "./firebase";

// ————————————————————————————————————————
// Types
// ————————————————————————————————————————

export interface UploadOptions {
  /** Callback tiến độ upload (0–100) */
  onProgress?: (progress: number) => void;
}

export interface UploadResult {
  url: string;
  path: string;
}

// ————————————————————————————————————————
// Helpers
// ————————————————————————————————————————
async function uploadFile(
  path: string,
  file: File | Blob,
  options?: UploadOptions
): Promise<UploadResult> {
  const storageRef = ref(storage, path);

  if (options?.onProgress) {
    // Dùng resumable upload để theo dõi progress
    await new Promise<void>((resolve, reject) => {
      const task = uploadBytesResumable(storageRef, file);

      task.on(
        "state_changed",
        (snapshot: UploadTaskSnapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          options.onProgress!(progress);
        },
        reject,
        resolve
      );
    });
  } else {
    await uploadBytes(storageRef, file);
  }

  const url = await getDownloadURL(storageRef);
  return { url, path };
}

export async function uploadModel(
  file: File | Blob,
  fileName: string,
  options?: UploadOptions
): Promise<UploadResult> {
  const path = `models/${Date.now()}_${fileName}`;
  return uploadFile(path, file, options);
}

export async function uploadImage(
  file: File | Blob,
  fileName: string,
  options?: UploadOptions
): Promise<UploadResult> {
  const path = `images/${Date.now()}_${fileName}`;
  return uploadFile(path, file, options);
}

export async function getFileURL(path: string): Promise<string> {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
}

export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}
