"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface ComicImageWithSkeletonProps extends Omit<ImageProps, "onLoad" | "onError"> {
  aspectRatioClass?: string;
  schematicLabel?: string;
  badgeLabel?: { en: string; tr: string };
  containerClassName?: string;
  onLoadingChange?: (isLoading: boolean) => void;
}

export function ComicImageWithSkeleton({
  src,
  alt,
  aspectRatioClass = "aspect-[16/9]",
  schematicLabel,
  badgeLabel,
  containerClassName = "",
  className = "",
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 600px",
  onLoadingChange,
  ...rest
}: ComicImageWithSkeletonProps) {
  const { lang } = useLanguage();
  const currentSrc = typeof src === "string" ? src : "";
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  // Derived loading state: if currentSrc is non-empty and hasn't finished loading yet
  const isLoading = Boolean(currentSrc && loadedSrc !== currentSrc && !isError);

  const handleLoad = () => {
    setLoadedSrc(currentSrc);
    setIsError(false);
    onLoadingChange?.(false);
  };

  const handleError = () => {
    setIsError(true);
    setLoadedSrc(currentSrc);
    onLoadingChange?.(false);
  };

  const labelText =
    badgeLabel?.[lang] ||
    badgeLabel?.en ||
    (lang === "en" ? "LOADING SCHEMATIC..." : "GÖRSEL YÜKLENİYOR...");

  return (
    <div
      className={`relative ${aspectRatioClass} w-full bg-[#EFE8DC] overflow-hidden select-none ${containerClassName}`}
    >
      {/* Neo-brutalist Comic Skeleton Overlay */}
      <div
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center p-4 transition-opacity duration-300 pointer-events-none ${
          isLoading ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden={!isLoading}
      >
        {/* Background Comic Textures */}
        <div className="absolute inset-0 comic-hatch opacity-30" />
        <div className="absolute inset-0 comic-shimmer-box opacity-60" />

        {/* Top Technical HUD bar */}
        <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between font-mono text-[9px] sm:text-[10px] font-bold text-black/70 uppercase">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#FF5400] animate-ping" />
            <span className="truncate max-w-[220px]">
              {schematicLabel ? `SCHEMATIC // ${schematicLabel}` : "BUFFERING ASSET"}
            </span>
          </div>
          <span className="hidden sm:inline-block px-1.5 py-0.5 border border-black bg-white/90 text-black text-[9px]">
            16:9 RENDER
          </span>
        </div>

        {/* Center Comic Badge with Technical Spinner */}
        <div className="relative border-3 border-black bg-[#FFE600] px-3.5 py-2 sm:px-4 sm:py-2.5 shadow-ink flex items-center gap-2.5 sm:gap-3 max-w-[90%]">
          <svg
            className="w-4 h-4 animate-spin text-black shrink-0"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-95"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="font-mono text-[11px] sm:text-xs font-black uppercase tracking-wider text-black truncate">
            {labelText}
          </span>
        </div>

        {/* Bottom Scanner Progress Strip */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between font-mono text-[9px] font-bold text-black/60 uppercase">
          <span className="hidden xs:inline">SYNCHRONIZING STREAM</span>
          <div className="h-1.5 w-24 sm:w-32 border border-black bg-white overflow-hidden ml-auto">
            <div className="h-full bg-[#FF5400] animate-pulse w-3/4" />
          </div>
        </div>
      </div>

      {/* Target Artwork Image */}
      <Image
        key={currentSrc}
        src={isError ? "/assets/comic_realtime_engine.jpg" : src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover transition-opacity duration-300 ease-out ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${className}`}
        onLoad={handleLoad}
        onError={handleError}
        {...rest}
      />
    </div>
  );
}
