"use client";

import React from "react";
import Image from "next/image";
import { ArrowDownRight, GithubLogo } from "@phosphor-icons/react";
import { ComicStickerBadge } from "./ComicSkulls";
import { useLanguage } from "@/context/LanguageContext";
import { SiteContent } from "@/lib/firebase";

interface HeroSectionProps {
  hero: SiteContent["hero"];
}

export function HeroSection({ hero }: HeroSectionProps) {
  const { lang } = useLanguage();

  return (
    <section className="relative min-h-[calc(100dvh-4.5rem)] flex items-center justify-center pt-8 pb-12 sm:pt-12 sm:pb-16 overflow-hidden">
      {/* Subtle comic halftone background layer */}
      <div className="absolute inset-0 comic-halftone-light opacity-50 pointer-events-none" />

      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Text & Actions (Max 4 elements: Eyebrow, Headline, Subtext, CTAs) */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-5">
            {/* 1. Eyebrow */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 bg-black text-[#CCFF00] border-2 border-black shadow-[2px_2px_0px_#000000]">
                {hero.eyebrow[lang] || hero.eyebrow.en}
              </span>
            </div>

            {/* 2. Headline (Max 2 lines desktop) */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold uppercase tracking-tight leading-[0.95] text-black">
              {hero.headline[lang] || hero.headline.en}
            </h1>

            {/* 3. Subtext (Max 20 words, max 4 lines) */}
            <p className="text-base sm:text-lg font-medium text-black/85 leading-relaxed max-w-[54ch]">
              {hero.subtext[lang] || hero.subtext.en}
            </p>

            {/* 4. CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#architecture"
                className="inline-flex items-center gap-2 px-6 py-3.5 border-4 border-black bg-[#FF5400] text-white font-mono text-sm font-bold uppercase tracking-wider shadow-ink hover:shadow-ink-lg hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
              >
                <span>{hero.primaryCta[lang] || hero.primaryCta.en}</span>
                <ArrowDownRight size={18} weight="bold" />
              </a>

              <a
                href={
                  hero.githubUrl
                    ? (hero.githubUrl.startsWith("http://") || hero.githubUrl.startsWith("https://")
                        ? hero.githubUrl
                        : `https://${hero.githubUrl}`)
                    : "https://github.com/Berkawaii"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 border-4 border-black bg-white text-black font-mono text-sm font-bold uppercase tracking-wider shadow-ink hover:shadow-ink-lg hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
              >
                <GithubLogo size={18} weight="bold" />
                <span>GITHUB</span>
              </a>
            </div>
          </div>

          {/* Right Column: Comic Ink Frame with Real Generated Mascot Art */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[440px]">
              {/* Playful Comic Sticker Badges pinned to corners */}
              <div className="absolute -top-4 -left-4 z-20">
                <ComicStickerBadge
                  text={
                    hero.badgeTopLeft?.[lang] ||
                    hero.badgeTopLeft?.en ||
                    (lang === "en" ? "LET'S GO!" : "BAŞLAYALIM!")
                  }
                  color="orange"
                  rotate="-rotate-6"
                />
              </div>
              <div className="absolute -bottom-4 -right-2 z-20">
                <ComicStickerBadge
                  text={
                    hero.badgeBottomRight?.[lang] ||
                    hero.badgeBottomRight?.en ||
                    (lang === "en" ? "STAY POSITIVE" : "POZİTİF KAL")
                  }
                  color="pink"
                  rotate="rotate-3"
                />
              </div>
              <div className="absolute top-6 -right-6 z-20 hidden sm:block">
                <ComicStickerBadge
                  text={
                    hero.badgeTopRight?.[lang] ||
                    hero.badgeTopRight?.en ||
                    (lang === "en" ? "ROCK SOLID" : "KAYA GİBİ")
                  }
                  color="lime"
                  rotate="rotate-12"
                />
              </div>

              {/* Main Comic Art Box */}
              <div className="relative border-4 border-black bg-white shadow-ink-xl p-3">
                <div className="relative aspect-square w-full border-2 border-black overflow-hidden bg-[#F5EFE6]">
                  <Image
                    src={hero.imagePath || "/assets/comic_hero_mascot.jpg"}
                    alt="Berkay Acar skate-punk cyber-architect mascot illustration"
                    fill
                    sizes="(max-width: 768px) 100vw, 440px"
                    priority
                    className="object-cover"
                  />
                </div>
                {/* Comic Strip Caption Bar */}
                <div className="mt-3 pt-2 border-t-2 border-black flex items-center justify-between font-mono text-xs font-bold uppercase">
                  <span>{hero.captionFigure?.[lang] || hero.captionFigure?.en}</span>
                  <span className="text-[#FF5400]">{hero.captionLocation?.[lang] || hero.captionLocation?.en}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
