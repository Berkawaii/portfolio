"use client";

import React from "react";
import { ComicSkaterSkull } from "./ComicSkulls";
import { useLanguage } from "@/context/LanguageContext";
import { SiteContent } from "@/lib/firebase";

interface ManifestoSectionProps {
  manifestoSection: SiteContent["manifestoSection"];
}

export function ManifestoSection({ manifestoSection }: ManifestoSectionProps) {
  const { lang } = useLanguage();
  const { eyebrow, headline, subtext, rules } = manifestoSection;

  return (
    <section id="manifesto" className="relative py-16 sm:py-24 bg-[#FF5400] text-white border-b-4 border-black overflow-hidden">
      {/* Authentic Halftone Pattern */}
      <div className="absolute inset-0 comic-halftone opacity-20 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="border-4 border-black bg-white text-black p-8 sm:p-12 shadow-ink-xl">
          {/* Eyebrow */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 bg-black text-[#CCFF00] border-2 border-black">
              {eyebrow[lang] || eyebrow.en}
            </span>
            <ComicSkaterSkull className="w-8 h-8 text-black" />
          </div>

          {/* Bold Graphic Manifesto Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-black leading-none mb-6">
            {headline[lang] || headline.en}
          </h2>

          <p className="text-base sm:text-lg text-black/85 font-medium leading-relaxed max-w-[65ch] mb-10">
            {subtext[lang] || subtext.en}
          </p>

          {/* 3 Pillars in Comic Panel Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rules.map((rule) => (
              <div
                key={rule.number}
                className={`border-3 border-black ${rule.bgColor} p-5 shadow-ink flex flex-col justify-between`}
              >
                <div>
                  <div className="font-mono text-xs font-bold text-black mb-1">
                    {rule.ruleCode}
                  </div>
                  <h3 className="font-extrabold text-xl uppercase tracking-tight text-black mb-2">
                    {rule.title[lang] || rule.title.en}
                  </h3>
                  <p className="text-xs sm:text-sm text-black/80 leading-relaxed">
                    {rule.desc[lang] || rule.desc.en}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t-2 border-black font-mono text-[11px] font-bold text-black/60">
                  {rule.tag[lang] || rule.tag.en}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
