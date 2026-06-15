"use client";

import { useDropzone } from "react-dropzone";

export default function Dropzone() {
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      accept: { "image/*": [".jpg", ".png", ".webp"] },
      maxSize: 5 * 1024 * 1024, // 5MB
      maxFiles: 1
    });

  return (
    <div
      {...getRootProps()}
      style={{
        border: `2px dashed ${isDragActive ? "#7F77DD" : "#ccc"}`,
        borderRadius: 8,
        padding: 32,
        textAlign: "center",
        cursor: "pointer",
        background: isDragActive ? "#EEEDFE" : "transparent",
        transition: "all .2s"
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop file here...</p>
      ) : (
        <p>Drag file or click to select</p>
      )}
      {acceptedFiles[0] && <p>{acceptedFiles[0].name}</p>}
    </div>
  );
}
