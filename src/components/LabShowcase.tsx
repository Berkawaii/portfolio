"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GithubLogo, Globe, ArrowSquareOut } from "@phosphor-icons/react";
import { ComicStickerBadge } from "./ComicSkulls";
import { useLanguage } from "@/context/LanguageContext";
import { SiteContent } from "@/lib/firebase";

interface LabShowcaseProps {
  labSection: SiteContent["labSection"];
}

export function LabShowcase({ labSection }: LabShowcaseProps) {
  const { lang } = useLanguage();
  const { heading, subheading, items } = labSection;

  const [activeId, setActiveId] = useState(items[0]?.id || "cruwells-vox");
  const current = items.find((p) => p.id === activeId) || items[0];

  if (!current) return null;

  return (
    <section id="lab" className="py-16 sm:py-24 bg-[#F5EFE6] border-b-4 border-black">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Section Heading: Stacked, NO split-header, NO eyebrow */}
        <div className="mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-black">
            {heading[lang] || heading.en}
          </h2>
          <p className="mt-2 text-base text-black/80 font-medium max-w-[65ch]">
            {subheading[lang] || subheading.en}
          </p>
        </div>

        {/* Tab Controls: Comic Skate Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          {items.map((p) => {
            const isActive = p.id === activeId;
            return (
              <button
                key={p.id}
                onClick={() => setActiveId(p.id)}
                type="button"
                className={`px-5 py-2.5 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider border-3 border-black transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#FF5400] text-white shadow-ink translate-x-0.5 translate-y-0.5"
                    : "bg-white text-black shadow-ink hover:bg-[#F4EBD9]"
                }`}
              >
                {p.tabLabel?.[lang] ||
                  p.tabLabel?.en ||
                  `${p.title[lang]?.split(" ")[0] || p.title.en.split(" ")[0]} : ${p.badgeText[lang] || p.badgeText.en}`}
              </button>
            );
          })}
        </div>

        {/* Interactive Lab Console Frame */}
        <div className="border-4 border-black bg-white shadow-ink-xl p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Panel */}
            <div className="lg:col-span-6 relative">
              <div className="border-3 border-black bg-[#F5EFE6] shadow-ink overflow-hidden">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={current.imagePath || "/assets/comic_realtime_engine.jpg"}
                    alt={`${current.title[lang] || current.title.en} artwork`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 600px"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="mt-2 p-2 border-2 border-black bg-[#70D6FF] font-mono text-xs font-bold uppercase flex items-center justify-between">
                <span>{lang === "en" ? "LAB EXPERIMENT STATUS" : "LAB DENEY DURUMU"}</span>
                <span>{lang === "en" ? "PRODUCTION READY" : "ÜRETİME HAZIR"}</span>
              </div>
            </div>

            {/* Spec Console */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-2">
                <ComicStickerBadge
                  text={current.badgeText[lang] || current.badgeText.en}
                  color="pink"
                  rotate="-rotate-2"
                />
                <span className="font-mono text-xs font-bold text-black/70">
                  {current.period}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black">
                {current.title[lang] || current.title.en}
              </h3>

              <p className="text-sm sm:text-base text-black/85 leading-relaxed">
                {current.summary[lang] || current.summary.en}
              </p>

              {/* Architectural Spec Card */}
              <div className="border-2 border-black bg-[#F4EBD9] p-4 shadow-ink">
                <div className="font-mono text-xs font-bold uppercase text-[#FF5400] mb-1">
                  {lang === "en" ? "SYSTEM ARCHITECTURE SPEC:" : "SİSTEM MİMARİSİ ÖZELLİKLERİ:"}
                </div>
                <div className="font-mono text-xs text-black/90 leading-relaxed">
                  {current.architectureDetails[lang] || current.architectureDetails.en}
                </div>
              </div>

              {/* Impact / Metric Bullets */}
              {(() => {
                const metrics = (
                  lang === "en"
                    ? (current.impactMetricsEn?.length ? current.impactMetricsEn : current.impactMetricsTr)
                    : (current.impactMetricsTr?.length ? current.impactMetricsTr : current.impactMetricsEn)
                )?.filter((m) => m && m.trim().length > 0) || [];

                if (metrics.length === 0) return null;

                return (
                  <div className="space-y-1.5 pt-2">
                    {metrics.map((metric, idx) => (
                      <div key={idx} className="flex items-start gap-2 font-mono text-xs text-black/90">
                        <span className="font-bold text-[#FF5400]">::</span>
                        <span>{metric}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Stack Pills */}
              <div className="pt-2 flex flex-wrap gap-2">
                {current.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 border-2 border-black bg-white font-mono text-xs font-bold shadow-[2px_2px_0px_#000000]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Project Action Links (GitHub & Live Web) */}
              {(current.githubUrl || current.liveUrl) && (
                <div className="pt-3 border-t-2 border-black flex flex-wrap items-center gap-3">
                  {current.githubUrl && (
                    <a
                      href={current.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 border-2 border-black bg-white text-black font-mono text-xs font-bold uppercase shadow-ink hover:bg-[#F4EBD9] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                    >
                      <GithubLogo size={16} weight="bold" />
                      <span>{lang === "en" ? "GITHUB REPO" : "GITHUB DEPOSU"}</span>
                      <ArrowSquareOut size={14} weight="bold" />
                    </a>
                  )}
                  {current.liveUrl && (
                    <a
                      href={current.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 border-2 border-black bg-[#CCFF00] text-black font-mono text-xs font-bold uppercase shadow-ink hover:bg-[#b8e600] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                    >
                      <Globe size={16} weight="bold" />
                      <span>{lang === "en" ? "LIVE EXPERIMENT" : "CANLI DENEYİ GÖR"}</span>
                      <ArrowSquareOut size={14} weight="bold" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
