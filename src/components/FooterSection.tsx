"use client";

import React from "react";
import Link from "next/link";
import {
  EnvelopeSimple,
  Phone,
  MapPin,
  LinkedinLogo,
  GithubLogo,
} from "@phosphor-icons/react";
import { ComicSkaterSkull, ComicStickerBadge } from "./ComicSkulls";
import { useLanguage } from "@/context/LanguageContext";
import { SiteContent } from "@/lib/firebase";

interface FooterSectionProps {
  footerSection: SiteContent["footerSection"];
}

export function FooterSection({ footerSection }: FooterSectionProps) {
  const { lang } = useLanguage();
  const {
    eyebrow,
    headline,
    subtext,
    ctaText,
    email,
    phone,
    location,
    roleSummary,
  } = footerSection;

  return (
    <footer id="contact" className="relative bg-black text-white pt-16 pb-12 overflow-hidden">
      {/* Halftone texture overlay */}
      <div className="absolute inset-0 opacity-10 comic-halftone pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="border-4 border-white bg-white text-black p-8 sm:p-12 shadow-[8px_8px_0px_#FF5400] mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              {/* Eyebrow */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 bg-black text-[#FF5400] border-2 border-black">
                  {eyebrow[lang] || eyebrow.en}
                </span>
                <ComicStickerBadge
                  text={
                    footerSection.dialogueBadge?.[lang] ||
                    footerSection.dialogueBadge?.en ||
                    (lang === "en" ? "OPEN FOR DIALOGUE" : "İLETİŞİME AÇIK")
                  }
                  color="lime"
                  rotate="-rotate-2"
                />
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-black leading-none">
                {headline[lang] || headline.en}
              </h2>

              <p className="text-sm sm:text-base text-black/85 font-medium max-w-[55ch] leading-relaxed">
                {subtext[lang] || subtext.en}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-4">
              <a
                href={`mailto:${email}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 border-4 border-black bg-[#FF5400] text-white font-mono text-sm font-bold uppercase tracking-wider shadow-ink hover:bg-[#e04a00] active:translate-x-0.5 active:translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
              >
                <EnvelopeSimple size={20} weight="bold" />
                <span>{ctaText[lang] || ctaText.en}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Lower Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t-2 border-white/20 font-mono text-xs">
          {/* Identity */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-white bg-[#FF5400] flex items-center justify-center text-white">
                <ComicSkaterSkull className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-sm uppercase tracking-tight">
                BERKAY ACAR
              </span>
            </div>
            <p className="text-white/70 text-[11px] leading-relaxed">
              {roleSummary[lang] || roleSummary.en}
            </p>
          </div>

          {/* Direct Channels */}
          <div className="space-y-2">
            <div className="font-bold uppercase text-white/50 text-[11px]">
              {lang === "en" ? "COMMUNICATION CHANNELS:" : "İLETİŞİM KANALLARI:"}
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <EnvelopeSimple size={16} className="text-[#FF5400]" weight="bold" />
              <a href={`mailto:${email}`} className="hover:underline">
                {email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Phone size={16} className="text-[#70D6FF]" weight="bold" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin size={16} className="text-[#CCFF00]" weight="bold" />
              <span>{location[lang] || location.en}</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-2">
            <div className="font-bold uppercase text-white/50 text-[11px]">
              {footerSection.socialHeading?.[lang] ||
                footerSection.socialHeading?.en ||
                (lang === "en" ? "ONLINE PRESENCE:" : "ÇEVRİMİÇİ PROFİLLER:")}
            </div>
            <div className="flex flex-wrap gap-3">
              {footerSection.linkedinUrl !== "" && (
                <a
                  href={
                    footerSection.linkedinUrl
                      ? (footerSection.linkedinUrl.startsWith("http://") || footerSection.linkedinUrl.startsWith("https://")
                          ? footerSection.linkedinUrl
                          : `https://${footerSection.linkedinUrl}`)
                      : "https://linkedin.com/in/berkayacar"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/40 bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <LinkedinLogo size={16} weight="bold" />
                  <span>LinkedIn</span>
                </a>
              )}
              {footerSection.githubUrl !== "" && (
                <a
                  href={
                    footerSection.githubUrl
                      ? (footerSection.githubUrl.startsWith("http://") || footerSection.githubUrl.startsWith("https://")
                          ? footerSection.githubUrl
                          : `https://${footerSection.githubUrl}`)
                      : "https://github.com/berkayacar"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/40 bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <GithubLogo size={16} weight="bold" />
                  <span>GitHub</span>
                </a>
              )}
            </div>

            {/* System Status & Terminal Links */}
            <div className="pt-2 flex flex-wrap items-center gap-3 font-mono text-[11px] text-white/50">
              <Link
                href="/status"
                className="hover:text-[#CCFF00] hover:underline flex items-center gap-1.5 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-[#00D000] inline-block shadow-[0_0_6px_#00D000]" />
                <span>{lang === "en" ? "SYSTEM STATUS" : "SİSTEM DURUMU"}</span>
              </Link>
              <span>•</span>
              <Link
                href="/terminal"
                className="hover:text-[#70D6FF] hover:underline transition-colors"
              >
                {lang === "en" ? "CLI CONSOLE" : "KOMUT SATIRI"}
              </Link>
              <span>•</span>
              <Link
                href="/502"
                className="hover:text-[#FF70A6] hover:underline transition-colors"
              >
                502
              </Link>
              <span>•</span>
              <Link
                href="/403"
                className="hover:text-[#FF0055] hover:underline transition-colors"
              >
                403
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
