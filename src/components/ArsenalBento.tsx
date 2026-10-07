"use client";

import React from "react";
import {
  Code,
  DeviceMobile,
  Robot,
  Database,
  LockKey,
} from "@phosphor-icons/react";
import { ComicStickerBadge } from "./ComicSkulls";
import { useLanguage } from "@/context/LanguageContext";
import { SiteContent } from "@/lib/firebase";

interface ArsenalBentoProps {
  bentoSection: SiteContent["bentoSection"];
}

const ICON_MAP = [Code, DeviceMobile, Robot, Database, LockKey];

export function ArsenalBento({ bentoSection }: ArsenalBentoProps) {
  const { lang } = useLanguage();
  const { heading, subheading, cells } = bentoSection;

  return (
    <section id="arsenal" className="py-16 sm:py-24 bg-[#F5EFE6] border-b-4 border-black">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Section Heading: Stacked, NO split-header, NO eyebrow */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-black">
            {heading[lang] || heading.en}
          </h2>
          <p className="mt-2 text-base text-black/80 font-medium max-w-[65ch]">
            {subheading[lang] || subheading.en}
          </p>
        </div>

        {/* 5-Cell Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {cells.map((cell, idx) => {
            const Icon = ICON_MAP[idx % ICON_MAP.length];
            const colSpanClass =
              cell.colSpanDesktop === 7
                ? "lg:col-span-7"
                : cell.colSpanDesktop === 5
                ? "lg:col-span-5"
                : "lg:col-span-4";

            return (
              <div
                key={cell.id || idx}
                className={`${colSpanClass} relative border-4 border-black ${cell.bgColor} ${cell.textColor} p-6 sm:p-8 shadow-ink-lg flex flex-col justify-between overflow-hidden`}
              >
                {cell.colSpanDesktop === 7 && (
                  <div className="absolute inset-0 comic-halftone opacity-20 pointer-events-none" />
                )}
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-10 h-10 border-2 border-black bg-black text-white flex items-center justify-center shadow-[2px_2px_0px_#000000]">
                      <Icon size={22} weight="bold" />
                    </div>
                    <ComicStickerBadge
                      text={cell.tag[lang] || cell.tag.en}
                      color={idx === 0 ? "lime" : idx === 2 ? "pink" : "yellow"}
                      rotate={idx % 2 === 0 ? "rotate-2" : "-rotate-3"}
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight leading-snug mb-3">
                    {cell.title[lang] || cell.title.en}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed mb-6 ${
                      cell.textColor === "text-white" ? "text-white/90" : "text-black/85"
                    }`}
                  >
                    {cell.summary[lang] || cell.summary.en}
                  </p>
                </div>
                <div className="relative z-10 flex flex-wrap gap-2 pt-4 border-t-2 border-black/40">
                  {cell.pills.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 border-2 border-black bg-white text-black font-mono text-xs font-bold shadow-[2px_2px_0px_#000000]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
