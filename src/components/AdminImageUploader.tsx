"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadSimple, Trash, Image as ImageIcon, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { uploadImageFile } from "@/lib/firebase";

interface AdminImageUploaderProps {
  label: string;
  imagePath?: string;
  fallbackPath?: string;
  onChange: (path: string) => void;
  aspectRatio?: "square" | "video";
}

export function AdminImageUploader({
  label,
  imagePath,
  fallbackPath = "/assets/comic_hero_mascot.jpg",
  onChange,
  aspectRatio = "video",
}: AdminImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayPath = imagePath || fallbackPath;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 5MB recommended
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("FILE EXCEEDS 5MB LIMIT. Please select a smaller image.");
      setTimeout(() => setErrorMsg(""), 4000);
      return;
    }

    setIsUploading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const uploadedUrl = await uploadImageFile(file);
      onChange(uploadedUrl);
      setSuccessMsg("IMAGE UPLOADED SUCCESSFULLY!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMsg("Upload failed. You can paste a direct image URL below.");
      setTimeout(() => setErrorMsg(""), 5000);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="border-2 border-black bg-white p-3.5 shadow-ink space-y-3">
      <div className="flex items-center justify-between">
        <label className="font-mono text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
          <ImageIcon size={16} weight="bold" className="text-[#FF5400]" />
          <span>{label}</span>
        </label>
        {imagePath && (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1 px-2 py-0.5 border border-black bg-[#FF70A6] text-black font-mono text-[10px] font-bold uppercase hover:bg-[#f35894] cursor-pointer"
          >
            <Trash size={12} weight="bold" />
            <span>RESET TO DEFAULT</span>
          </button>
        )}
      </div>

      {/* Preview and Upload Action Area */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Thumbnail Preview */}
        <div
          className={`relative border-2 border-black bg-[#F5EFE6] overflow-hidden shrink-0 shadow-[2px_2px_0px_#000000] ${
            aspectRatio === "square" ? "w-24 h-24" : "w-36 h-20"
          }`}
        >
          {displayPath ? (
            <Image
              src={displayPath}
              alt="Artwork preview"
              fill
              sizes="144px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-black/40 font-mono text-[10px]">
              <ImageIcon size={24} weight="bold" />
              <span>NO IMAGE</span>
            </div>
          )}
        </div>

        {/* Upload Button & Controls */}
        <div className="flex-1 space-y-2 w-full">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-[#CCFF00] text-black font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_#000000] hover:bg-[#b8e600] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <UploadSimple size={16} weight="bold" />
              <span>{isUploading ? "UPLOADING..." : "UPLOAD NEW IMAGE"}</span>
            </button>

            <span className="font-mono text-[11px] text-black/60">
              PNG, JPG, WEBP, SVG (Max 5MB)
            </span>
          </div>

          {/* Feedback Badges */}
          {successMsg && (
            <div className="font-mono text-[11px] font-bold text-green-700 flex items-center gap-1">
              <CheckCircle size={14} weight="bold" />
              <span>{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="font-mono text-[11px] font-bold text-red-600 flex items-center gap-1">
              <WarningCircle size={14} weight="bold" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Manual URL / Path Input */}
          <div className="pt-1">
            <input
              type="text"
              value={imagePath || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Or paste image URL / local asset path (e.g. /assets/my_image.jpg)"
              className="w-full px-2.5 py-1 border border-black bg-[#F5EFE6] font-mono text-[11px] font-medium placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-[#FF5400]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
