"use client";

import React, { useEffect, useState } from "react";
import { ComicSkaterSkull, ComicStickerBadge } from "./ComicSkulls";
import { useLanguage } from "@/context/LanguageContext";

interface ComicSkullLoaderProps {
  isLoading: boolean;
  onFinish?: () => void;
}

export function ComicSkullLoader({ isLoading, onFinish }: ComicSkullLoaderProps) {
  const { lang } = useLanguage();
  const [progress, setProgress] = useState(12);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  const statusLogs = {
    en: [
      "[01/04] BOOTING DISTRIBUTED KERNEL & MEMORY POOLS...",
      "[02/04] SYNCHRONIZING CLOUD FIRESTORE @ BERKAY-58575...",
      "[03/04] HYDRATING HIGH-CONCURRENCY ARCHITECTURE DECK...",
      "[04/04] ZERO BLOAT VERIFIED : READY FOR DISPATCH",
    ],
    tr: [
      "[01/04] DAĞITIK ÇEKİRDEK VE BELLEK HAVUZLARI BAŞLATILIYOR...",
      "[02/04] CLOUD FIRESTORE @ BERKAY-58575 SENKRONİZE EDİLİYOR...",
      "[03/04] YÜKSEK HACİMLİ SİSTEM MİMARİSİ YÜKLENİYOR...",
      "[04/04] SIFIR HANTALLIK ONAYLANDI : ÇALIŞMA ALANI HAZIR",
    ],
  };

  useEffect(() => {
    // Smooth progress increment
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        const jump = Math.floor(Math.random() * 18) + 12;
        return Math.min(prev + jump, 95);
      });
    }, 180);

    const logInterval = setInterval(() => {
      setStatusIndex((prev) => (prev < 3 ? prev + 1 : prev));
    }, 280);

    return () => {
      clearInterval(interval);
      clearInterval(logInterval);
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setProgress(100);
      setStatusIndex(3);
      const timer = setTimeout(() => {
        setIsFading(true);
        const hideTimer = setTimeout(() => {
          setIsVisible(false);
          if (onFinish) onFinish();
        }, 450);
        return () => clearTimeout(hideTimer);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isLoading, onFinish]);

  if (!isVisible) return null;

  const currentLogs = statusLogs[lang] || statusLogs.en;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#F5EFE6] px-4 transition-all duration-500 ease-out select-none ${
        isFading ? "opacity-0 pointer-events-none scale-102" : "opacity-100"
      }`}
    >
      {/* Halftone Screen Background */}
      <div className="absolute inset-0 comic-halftone opacity-25 pointer-events-none" />

      {/* Retro Comic Container Box */}
      <div className="relative z-10 w-full max-w-[620px] border-4 border-black bg-white p-6 sm:p-8 shadow-[12px_12px_0px_#000000] animate-comic-pulse">
        {/* Top Comic Header Bar */}
        <div className="flex items-center justify-between border-b-3 border-black pb-4 mb-6">
          <ComicStickerBadge
            text={lang === "en" ? "SYSTEM INITIALIZING" : "SİSTEM BAŞLATILIYOR"}
            color="lime"
            rotate="-rotate-2"
          />
          <span className="font-mono text-xs font-bold uppercase tracking-widest px-2.5 py-1 bg-black text-[#70D6FF] border-2 border-black">
            FIRESTORE : LIVE
          </span>
        </div>

        {/* Centerpiece: Animated Comic Skate Skull */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <div className="relative flex-shrink-0 animate-comic-bob">
            <div className="p-3 border-3 border-black bg-[#FF5400] shadow-[4px_4px_0px_#000000]">
              <ComicSkaterSkull className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
            </div>
            {/* Retro Sparkle Badge */}
            <div className="absolute -top-3 -right-3 px-2 py-0.5 border-2 border-black bg-[#CCFF00] font-mono text-[10px] font-extrabold uppercase shadow-[2px_2px_0px_#000000] rotate-6">
              V2.4
            </div>
          </div>

          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#FF5400]">
              BERKAY ACAR : RUNTIME CORE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black leading-none">
              {lang === "en" ? "LOADING ARCHITECTURE..." : "MİMARİ YÜKLENİYOR..."}
            </h2>
            <p className="font-mono text-xs text-black/70">
              {lang === "en"
                ? "Synchronizing portfolio state with Firestore database."
                : "Portfolyo mimarisi Firestore veri tabanıyla senkronize ediliyor."}
            </p>
          </div>
        </div>

        {/* Thick Brutalist Progress Bar */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between font-mono text-xs font-bold uppercase">
            <span>{lang === "en" ? "BUFFER HYDRATION" : "ÖNBELLEK SENKRONİZASYONU"}</span>
            <span className="px-2 py-0.5 border border-black bg-[#F4EBD9]">
              {progress}%
            </span>
          </div>

          <div className="h-6 w-full border-3 border-black bg-[#F4EBD9] p-0.5 overflow-hidden">
            <div
              className="h-full bg-[#FF5400] border-r-2 border-black animate-comic-stripes transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Terminal Status Ticker */}
        <div className="border-3 border-black bg-[#1A1A1A] text-[#70D6FF] p-3.5 font-mono text-xs space-y-1">
          <div className="text-[10px] text-[#CCFF00] uppercase font-bold flex items-center justify-between border-b border-white/20 pb-1 mb-1.5">
            <span>CONSOLE OUTPUT</span>
            <span className="animate-pulse">● LIVE STREAM</span>
          </div>
          <div className="truncate font-semibold">
            {currentLogs[statusIndex]}
          </div>
        </div>

        {/* Shimmer Preview Pill Strip */}
        <div className="mt-5 pt-4 border-t-2 border-black/20 grid grid-cols-3 gap-2">
          <div className="h-8 border-2 border-black comic-shimmer-box flex items-center justify-center font-mono text-[10px] font-bold text-black/50 uppercase">
            {lang === "en" ? "MICROSERVICES" : "MİKROSERVİS"}
          </div>
          <div className="h-8 border-2 border-black comic-shimmer-box flex items-center justify-center font-mono text-[10px] font-bold text-black/50 uppercase">
            {lang === "en" ? "TELEMETRY" : "TELEMETRİ"}
          </div>
          <div className="h-8 border-2 border-black comic-shimmer-box flex items-center justify-center font-mono text-[10px] font-bold text-black/50 uppercase">
            {lang === "en" ? "R&D LABS" : "AR-GE LAB"}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Reusable Comic Skull Shimmer Skeleton for cards and panels
 */
export function ComicSkullSkeleton({
  height = "h-48",
  className = "",
}: {
  height?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative border-4 border-black bg-white shadow-ink overflow-hidden p-6 flex flex-col justify-between ${height} ${className}`}
    >
      <div className="absolute inset-0 comic-shimmer-box pointer-events-none opacity-80" />
      <div className="relative z-10 flex items-center justify-between">
        <div className="h-4 w-28 border border-black bg-[#F4EBD9]" />
        <ComicSkaterSkull className="w-8 h-8 opacity-30 text-black" />
      </div>
      <div className="relative z-10 space-y-2">
        <div className="h-6 w-3/4 border border-black bg-[#F4EBD9]" />
        <div className="h-4 w-full border border-black bg-[#F4EBD9]/60" />
        <div className="h-4 w-2/3 border border-black bg-[#F4EBD9]/60" />
      </div>
    </div>
  );
}
