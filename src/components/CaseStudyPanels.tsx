"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle } from "@phosphor-icons/react";
import { ComicStickerBadge } from "./ComicSkulls";
import { useLanguage } from "@/context/LanguageContext";
import { SiteContent } from "@/lib/firebase";

interface CaseStudyPanelsProps {
  caseStudiesSection: SiteContent["caseStudiesSection"];
}

export function CaseStudyPanels({ caseStudiesSection }: CaseStudyPanelsProps) {
  const { lang } = useLanguage();
  const { heading, subheading, items } = caseStudiesSection;

  const featuredItem = items[0];
  const secondaryItems = items.slice(1);

  return (
    <section id="architecture" className="py-16 sm:py-24 bg-[#F5EFE6] border-b-4 border-black">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Section Heading: Stacked cleanly, NO split-header, NO eyebrow */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-black">
            {heading[lang] || heading.en}
          </h2>
          <p className="mt-2 text-base text-black/80 font-medium max-w-[65ch]">
            {subheading[lang] || subheading.en}
          </p>
        </div>

        {/* Featured Case Study 1: UniCoWallet Full Comic Hero Panel */}
        {featuredItem && (
          <div className="border-4 border-black bg-white shadow-ink-xl p-6 sm:p-8 mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left: Graphic Comic Novel Panel Art */}
              <div className="lg:col-span-6 relative">
                <div className="absolute -top-3 -left-3 z-10">
                  <ComicStickerBadge
                    text={featuredItem.category[lang] || featuredItem.category.en}
                    color="orange"
                    rotate="-rotate-3"
                  />
                </div>
                <div className="border-3 border-black overflow-hidden bg-[#F5EFE6] shadow-ink">
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src={featuredItem.imagePath || "/assets/comic_unicowallet.jpg"}
                      alt={`${featuredItem.title[lang] || featuredItem.title.en} artwork`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 600px"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="mt-2 px-3 py-1.5 border-2 border-black bg-[#CCFF00] font-mono text-xs font-bold uppercase flex items-center justify-between">
                  <span>{featuredItem.client[lang] || featuredItem.client.en}</span>
                  <span>{featuredItem.period}</span>
                </div>
              </div>

              {/* Right: Technical Architecture Breakdown */}
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-block px-2.5 py-0.5 border border-black bg-black text-white font-mono text-xs font-bold uppercase">
                  {featuredItem.role[lang] || featuredItem.role.en}
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black leading-tight">
                  {featuredItem.title[lang] || featuredItem.title.en}
                </h3>
                <p className="text-sm sm:text-base text-black/80 leading-relaxed">
                  {featuredItem.summary[lang] || featuredItem.summary.en}
                </p>

                {/* Architecture Details Box */}
                <div className="border-2 border-black bg-[#F4EBD9] p-3 shadow-ink">
                  <div className="font-mono text-xs font-bold uppercase text-[#FF5400] mb-1">
                    {lang === "en" ? "ARCHITECTURE DETAILS:" : "MİMARİ DETAYLAR:"}
                  </div>
                  <div className="font-mono text-xs text-black/85 leading-relaxed">
                    {featuredItem.architectureDetails[lang] || featuredItem.architectureDetails.en}
                  </div>
                </div>

                {/* Impact Metrics */}
                <div className="space-y-1.5 pt-1">
                  {(lang === "en"
                    ? featuredItem.impactMetricsEn
                    : featuredItem.impactMetricsTr
                  ).map((metric, i) => (
                    <div key={i} className="flex items-start gap-2 font-mono text-xs text-black/90">
                      <CheckCircle size={16} weight="fill" className="text-[#FF5400] shrink-0 mt-0.5" />
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Pills */}
                <div className="pt-2">
                  <div className="font-mono text-xs font-bold uppercase text-black/70 mb-2">
                    {lang === "en" ? "PRODUCTION STACK:" : "ÜRETİM TEKNOLOJİLERİ:"}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {featuredItem.techStack.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 border-2 border-black bg-white font-mono text-xs font-bold shadow-[2px_2px_0px_#000000]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Asymmetric Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {secondaryItems.map((item) => (
            <div
              key={item.id}
              className="border-4 border-black bg-white shadow-ink-lg p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-2.5 py-0.5 border border-black bg-[#70D6FF] font-mono text-xs font-bold uppercase">
                    {item.category[lang] || item.category.en}
                  </span>
                  <span className="font-mono text-xs font-bold text-black/75">
                    {item.period}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-black mb-3">
                  {item.title[lang] || item.title.en}
                </h3>
                {item.imagePath && (
                  <div className="relative aspect-[16/9] w-full border-2 border-black overflow-hidden mb-4 bg-[#F5EFE6] shadow-[2px_2px_0px_#000000]">
                    <Image
                      src={item.imagePath}
                      alt={`${item.title[lang] || item.title.en} artwork`}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover"
                    />
                  </div>
                )}
                <p className="text-sm text-black/80 leading-relaxed mb-4">
                  {item.summary[lang] || item.summary.en}
                </p>

                <ul className="space-y-2 mb-6 font-mono text-xs">
                  {(lang === "en" ? item.impactMetricsEn : item.impactMetricsTr).map((metric, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle size={16} weight="fill" className="text-[#FF5400] shrink-0 mt-0.5" />
                      <span>{metric}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t-2 border-black flex flex-wrap gap-2">
                {item.techStack.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 border-2 border-black bg-[#F5EFE6] font-mono text-[11px] font-bold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
