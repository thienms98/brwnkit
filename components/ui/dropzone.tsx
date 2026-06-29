"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface DropzoneProps {
  value?: string | null;
  onChange?: (file: File | null) => void;
}

const ERROR_MESSAGES: Record<string, string> = {
  "file-too-large": "File exceeds 5MB limit",
  "file-invalid-type": "Only .jpg, .png, .webp are accepted",
  "too-many-files": "Please select only 1 file"
};

export default function Dropzone({ value, onChange }: DropzoneProps) {
  const [preview, setPreview] = useState<string | null>(value ?? null);

  const onDrop = useCallback(
    (accepted: File[]) => {
      const file = accepted[0] ?? null;
      onChange?.(file);
      if (file) {
        const url = URL.createObjectURL(file);
        setPreview(url);
      }
    },
    [onChange]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
    fileRejections,
    open
  } = useDropzone({
    // accept: { "image/*": [".jpg", ".png", ".webp"] },
    // maxSize: 5 * 1024 * 1024,
    maxFiles: 1,
    noClick: !!preview,
    onDrop
  });

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    onChange?.(null);
  };

  const errorMessage = fileRejections[0]?.errors[0]?.code
    ? (ERROR_MESSAGES[fileRejections[0].errors[0].code] ?? "Invalid file")
    : null;

  return (
    <div className="flex flex-col gap-2">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg text-center transition-all duration-200",
          preview ? "p-2 cursor-default" : "p-8 cursor-pointer",
          isDragActive && "border-[#7F77DD] bg-[#EEEDFE]",
          errorMessage && !isDragActive && "border-red-400",
          !isDragActive && !errorMessage && "border-gray-300"
        )}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="relative inline-block">
            <Image
              src={preview}
              alt="Preview"
              width={160}
              height={160}
              className="max-h-40 max-w-full rounded-md block"
            />
            <button
              type="button"
              onClick={handleClear}
              aria-label="Remove image"
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              ✕
            </button>
            <button
              type="button"
              onClick={open}
              className="mt-2 text-xs text-[#7F77DD] hover:underline block w-full text-center bg-transparent border-none cursor-pointer"
            >
              Change image
            </button>
          </div>
        ) : isDragActive ? (
          <p className="m-0 text-[#7F77DD]">Drop file here...</p>
        ) : (
          <p className="m-0 text-gray-400">Drag & drop or click to select</p>
        )}
      </div>

      {errorMessage && <p className="text-xs text-red-400">{errorMessage}</p>}

      {preview && acceptedFiles[0] && !errorMessage && (
        <p className="text-xs text-gray-400">{acceptedFiles[0].name}</p>
      )}
    </div>
  );
}
