"use client";

import React from "react";
import { Certificate, Trophy, GraduationCap } from "@phosphor-icons/react";
import { ComicStickerBadge } from "./ComicSkulls";
import { useLanguage } from "@/context/LanguageContext";
import { SiteContent } from "@/lib/firebase";

interface CredentialsGridProps {
  credentialsSection: SiteContent["credentialsSection"];
}

export function CredentialsGrid({ credentialsSection }: CredentialsGridProps) {
  const { lang } = useLanguage();
  const { heading, subheading, certs, awards, education } = credentialsSection;

  return (
    <section id="credentials" className="py-16 sm:py-24 bg-[#F5EFE6] border-b-4 border-black">
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

        {/* 3 High-Contrast Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Certifications */}
          <div className="border-4 border-black bg-white shadow-ink-lg p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 border-2 border-black bg-[#CCFF00] flex items-center justify-center shadow-[2px_2px_0px_#000000]">
                  <Certificate size={22} weight="bold" />
                </div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 border border-black bg-black text-white">
                  {lang === "en" ? "INDUSTRY CERTS" : "SERTİFİKALAR"}
                </span>
              </div>
              <h3 className="text-xl font-extrabold uppercase tracking-tight text-black mb-4">
                {lang === "en" ? "Official Certifications" : "Resmi Sertifikalar"}
              </h3>

              <div className="space-y-3 font-mono text-xs">
                {certs.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-3 border-2 border-black bg-[#F5EFE6] shadow-[2px_2px_0px_#000000]"
                  >
                    <div className="font-bold text-black text-sm">
                      {cert.title[lang] || cert.title.en}
                    </div>
                    <div className="text-black/70 mt-0.5">
                      {cert.issuer[lang] || cert.issuer.en}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Industry Awards */}
          <div className="border-4 border-black bg-[#70D6FF] shadow-ink-lg p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 border-2 border-black bg-white flex items-center justify-center shadow-[2px_2px_0px_#000000]">
                  <Trophy size={22} weight="bold" />
                </div>
                <ComicStickerBadge
                  text={lang === "en" ? "EXCELLENCE" : "BAŞARI"}
                  color="orange"
                  rotate="rotate-3"
                />
              </div>
              <h3 className="text-xl font-extrabold uppercase tracking-tight text-black mb-4">
                {lang === "en" ? "Awards & Recognition" : "Ödüller ve Başarılar"}
              </h3>

              <div className="space-y-4 font-mono text-xs">
                {awards.map((award) => (
                  <div key={award.id} className="p-4 border-2 border-black bg-white shadow-ink">
                    <div className="inline-block px-2 py-0.5 border border-black bg-[#FF5400] text-white font-bold mb-1">
                      {award.year}
                    </div>
                    <div className="font-bold text-black text-sm">
                      {award.title[lang] || award.title.en}
                    </div>
                    <p className="mt-1 text-black/80 font-sans text-xs leading-relaxed">
                      {award.desc[lang] || award.desc.en}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Higher Education */}
          <div className="border-4 border-black bg-white shadow-ink-lg p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 border-2 border-black bg-[#FF70A6] flex items-center justify-center shadow-[2px_2px_0px_#000000]">
                  <GraduationCap size={22} weight="bold" />
                </div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 border border-black bg-black text-white">
                  {lang === "en" ? "ACADEMIC" : "AKADEMİK"}
                </span>
              </div>
              <h3 className="text-xl font-extrabold uppercase tracking-tight text-black mb-4">
                {lang === "en" ? "Academic Degrees" : "Akademik Eğitim"}
              </h3>

              <div className="space-y-4 font-mono text-xs">
                {education.map((edu) => (
                  <div key={edu.id} className="p-4 border-2 border-black bg-[#F4EBD9] shadow-ink">
                    <div className="text-xs font-bold text-[#FF5400]">{edu.period}</div>
                    <div className="font-bold text-black text-sm mt-1">
                      {edu.school[lang] || edu.school.en}
                    </div>
                    <div className="text-black/80 mt-1 font-sans text-xs">
                      {edu.degree[lang] || edu.degree.en}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
