"use client";

import React from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import "@uploadthing/react/styles.css";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  endpoint: "serverImage" | "messageFile" | "profileImage";
  value: string;
  onChange: (url?: string) => void;
}

const FileUpload = ({ endpoint, onChange, value }: FileUploadProps) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div
        className={cn(
          "relative h-24 w-24",
          endpoint === "profileImage" && "h-64 w-72 mx-auto"
        )}
      >
        <Image
          fill
          src={value}
          alt="upload"
          className={cn(
            "rounded-full",
            endpoint === "profileImage" && "rounded-md"
          )}
        />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {value}
        </a>
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
      className={cn("", endpoint === "profileImage" && "bg-zinc-900/75")}
    />
  );
};

export default FileUpload;
