"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  House,
  HardDrives,
  EnvelopeSimple,
  ArrowBendUpLeft,
  WarningOctagon,
  Terminal,
} from "@phosphor-icons/react";
import { ComicSkaterSkull, ComicStickerBadge } from "@/components/ComicSkulls";
import { useLanguage } from "@/context/LanguageContext";

export default function NotFound() {
  const { lang, setLang } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [clientPath, setClientPath] = useState("");
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setClientPath(window.location.pathname);
      setTimestamp(new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC");
    }
  }, []);

  return (
    <div className="min-h-[100dvh] bg-[#F5EFE6] text-black font-sans flex flex-col justify-between relative selection:bg-[#FF5400] selection:text-white overflow-hidden">
      {/* Halftone texture overlay */}
      <div className="absolute inset-0 comic-halftone-light opacity-50 pointer-events-none" />

      {/* Top Minimal Navigation Bar */}
      <header className="relative z-10 w-full bg-[#F5EFE6] border-b-4 border-black">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-black"
          >
            <div className="w-10 h-10 border-2 border-black bg-[#FF5400] flex items-center justify-center shadow-ink transition-transform group-hover:-translate-y-0.5">
              <ComicSkaterSkull className="w-8 h-8" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg uppercase tracking-tight leading-none">
                BERKAY ACAR
              </span>
              <span className="font-mono text-[11px] font-bold uppercase text-black/70 leading-tight">
                {lang === "en" ? "SYSTEM SAFETY NET" : "GÜVENLİK AĞI"}
              </span>
            </div>
          </Link>

          {/* Right Language Switcher + Home CTA */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border-2 border-black bg-white shadow-ink p-0.5">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2 py-1 font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                  lang === "en" ? "bg-black text-white" : "bg-transparent text-black hover:bg-black/5"
                }`}
              >
                EN
              </button>
              <div className="w-[1px] h-4 bg-black/30 mx-0.5" />
              <button
                type="button"
                onClick={() => setLang("tr")}
                className={`px-2 py-1 font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                  lang === "tr" ? "bg-black text-[#CCFF00]" : "bg-transparent text-black hover:bg-black/5"
                }`}
              >
                TR
              </button>
            </div>

            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-white text-black font-mono text-xs font-bold uppercase tracking-wider shadow-ink hover:bg-black/5 transition-all"
            >
              <House size={16} weight="bold" />
              <span>{lang === "en" ? "HOME" : "ANA SAYFA"}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Neo-Brutalist 404 Arena */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-[880px] w-full border-4 border-black bg-white shadow-ink-xl relative overflow-hidden">
          {/* Top Panel Bar */}
          <div className="border-b-4 border-black bg-[#CCFF00] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 border-2 border-black bg-[#FF5400] inline-block shadow-[1px_1px_0px_#000000]" />
              <span className="w-3 h-3 border-2 border-black bg-white inline-block shadow-[1px_1px_0px_#000000]" />
              <span className="w-3 h-3 border-2 border-black bg-black inline-block shadow-[1px_1px_0px_#000000]" />
              <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-black ml-2">
                ERR_CODE: 404_PAGE_NOT_FOUND
              </span>
            </div>

            <ComicStickerBadge
              text={lang === "en" ? "OFF THE GRID" : "YÖRÜNGEDEN ÇIKTI"}
              color="orange"
              rotate="rotate-1"
            />
          </div>

          <div className="p-6 sm:p-10 lg:p-12 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Massive 404 Typography with Skater Mascot */}
              <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-4 border-3 border-black bg-[#F5EFE6] shadow-ink relative">
                <div className="absolute -top-3 -right-3 z-10">
                  <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 bg-black text-[#CCFF00] border border-black shadow-[2px_2px_0px_#000000]">
                    NULL_PTR
                  </span>
                </div>

                <div className="text-7xl sm:text-8xl lg:text-9xl font-extrabold tracking-tighter text-black leading-none select-none">
                  4<span className="text-[#FF5400]">0</span>4
                </div>

                <div className="mt-3 flex items-center justify-center gap-2">
                  <div className="w-12 h-12 border-2 border-black bg-[#CCFF00] flex items-center justify-center shadow-ink">
                    <ComicSkaterSkull className="w-10 h-10" />
                  </div>
                  <div className="text-left font-mono text-[11px] font-bold leading-tight">
                    <div className="text-black">SIGNAL COLLISION</div>
                    <div className="text-black/60">PACKET VOID</div>
                  </div>
                </div>
              </div>

              {/* Headline & Explanation */}
              <div className="md:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 border-2 border-black bg-black text-[#CCFF00] font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_#000000]">
                  <WarningOctagon size={16} weight="bold" />
                  <span>
                    {lang === "en" ? "LOST IN CYBERSPACE" : "SİBER BOŞLUKTA KAYIP"}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight leading-[0.95] text-black">
                  {lang === "en"
                    ? "YOU SKATED OFF THE SYSTEM GRID."
                    : "SİSTEM YÖRÜNGESİNDEN DIŞARI KAYDIN."}
                </h1>

                <p className="text-sm sm:text-base font-medium text-black/85 leading-relaxed">
                  {lang === "en"
                    ? "The endpoint or document coordinates you navigated to do not exist in the routing table, were purged during cluster consolidation, or got lost in the void."
                    : "Ulaşmaya çalıştığınız bağlantı veya sistem koordinatları yönlendirme tablosunda bulunmuyor, küme optimizasyonu sırasında taşındı veya boşluğa düştü."}
                </p>
              </div>
            </div>

            {/* Monospace Diagnostics Terminal */}
            <div className="border-3 border-black bg-[#111111] text-white p-4 font-mono text-xs shadow-ink space-y-1.5 overflow-x-auto">
              <div className="flex items-center justify-between pb-2 border-b border-white/20 text-white/50 text-[11px] uppercase">
                <span className="flex items-center gap-1.5">
                  <Terminal size={14} weight="bold" className="text-[#CCFF00]" />
                  TELEMETRY DIAGNOSTIC DUMP
                </span>
                <span className="text-[#CCFF00]">STATUS : 404_NOT_FOUND</span>
              </div>
              <div className="text-white/90 pt-1">
                <span className="text-[#FF5400] font-bold">TARGET_URI    : </span>
                <span>{mounted ? clientPath || "/unknown-route" : "/..."}</span>
              </div>
              <div className="text-white/90">
                <span className="text-[#70D6FF] font-bold">TIMESTAMP     : </span>
                <span>{mounted ? timestamp : "2026-10-07 12:00:00 UTC"}</span>
              </div>
              <div className="text-white/90">
                <span className="text-[#CCFF00] font-bold">PACKET_LOSS   : </span>
                <span>100% (NO ROUTE DESCRIPTOR LOCATED IN MEMORY)</span>
              </div>
              <div className="text-white/70 text-[11px] pt-1">
                ADVICE : Re-route incoming traffic to mission control index or query architectural blueprints.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3.5 border-4 border-black bg-[#CCFF00] text-black font-mono text-xs sm:text-sm font-bold uppercase tracking-wider shadow-ink hover:shadow-ink-lg hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
              >
                <ArrowBendUpLeft size={18} weight="bold" />
                <span>{lang === "en" ? "RETURN TO MISSION CONTROL" : "ANA MERKEZE DÖN"}</span>
              </Link>

              <Link
                href="/#architecture"
                className="inline-flex items-center gap-2 px-6 py-3.5 border-4 border-black bg-white text-black font-mono text-xs sm:text-sm font-bold uppercase tracking-wider shadow-ink hover:shadow-ink-lg hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
              >
                <HardDrives size={18} weight="bold" />
                <span>{lang === "en" ? "EXPLORE ARCHITECTURE" : "MİMARİYİ İNCELE"}</span>
              </Link>

              <a
                href="mailto:acar.berkai@gmail.com?subject=Broken%20Route%20Report"
                className="inline-flex items-center gap-2 px-5 py-3.5 border-4 border-black bg-[#FF5400] text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider shadow-ink hover:shadow-ink-lg hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all focus:outline-none focus:ring-2 focus:ring-black cursor-pointer ml-auto"
              >
                <EnvelopeSimple size={18} weight="bold" />
                <span>{lang === "en" ? "DISPATCH REPORT" : "RAPOR İLET"}</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Comic Footer Bar */}
      <footer className="relative z-10 w-full bg-black text-white border-t-4 border-black py-4 px-4 sm:px-6">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="text-white/70">
            SYSTEM DISPATCH // 404 RESILIENT FAILSAFE // BERKAY ACAR
          </div>
          <div className="text-[#CCFF00] font-bold">
            ENGINEERED WITH HARDCORE DISCIPLINE
          </div>
        </div>
      </footer>
    </div>
  );
}
