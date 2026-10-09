"use client";

import React from "react";
import {
  HardDrives,
  Cpu,
  TerminalWindow,
  EnvelopeSimple,
  Globe,
  FilePdf,
} from "@phosphor-icons/react";
import { ComicSkaterSkull } from "./ComicSkulls";
import { useLanguage } from "@/context/LanguageContext";

interface NavbarProps {
  resumeUrl?: string;
  email?: string;
}

export function Navbar({
  resumeUrl = "/Berkay_Acar_Resume.pdf",
  email = "acar.berkai@gmail.com",
}: NavbarProps) {
  const { lang, setLang } = useLanguage();
  const targetResumeUrl =
    !resumeUrl || resumeUrl === "/berkay_acar_cv.pdf" || resumeUrl.endsWith("_cv.pdf")
      ? "/Berkay_Acar_Resume.pdf"
      : resumeUrl;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F5EFE6] border-b-4 border-black">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <a
          href="#"
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
              {lang === "en" ? "FULL STACK & MOBILE ENGINEER" : "FULL STACK & MOBİL MÜHENDİS"}
            </span>
          </div>
        </a>

        {/* Desktop Single-Line Navigation */}
        <nav className="hidden md:flex items-center gap-6 font-mono text-xs font-bold uppercase tracking-wider">
          <a
            href="#projects"
            className="flex items-center gap-1.5 hover:text-[#FF5400] transition-colors focus:outline-none focus:ring-1 focus:ring-black"
          >
            <HardDrives size={16} weight="bold" />
            <span>{lang === "en" ? "Work & Projects" : "Projeler"}</span>
          </a>
          <a
            href="#arsenal"
            className="flex items-center gap-1.5 hover:text-[#FF5400] transition-colors focus:outline-none focus:ring-1 focus:ring-black"
          >
            <Cpu size={16} weight="bold" />
            <span>{lang === "en" ? "Skills" : "Yetenekler"}</span>
          </a>
          <a
            href="#lab"
            className="flex items-center gap-1.5 hover:text-[#FF5400] transition-colors focus:outline-none focus:ring-1 focus:ring-black"
          >
            <TerminalWindow size={16} weight="bold" />
            <span>{lang === "en" ? "R&D Lab" : "Ar-Ge Lab"}</span>
          </a>
        </nav>

        {/* Right Actions: Language Switcher + Resume Download + Contact CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Bilingual Language Switcher */}
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

          {/* Resume Download CTA */}
          <a
            href={targetResumeUrl}
            download="Berkay_Acar_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 border-2 border-black bg-[#CCFF00] text-black font-mono text-xs font-bold uppercase tracking-wider shadow-ink hover:bg-[#b8e600] active:translate-x-0.5 active:translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
            title={lang === "en" ? "Download Resume (PDF)" : "Özgeçmişi İndir (PDF)"}
          >
            <FilePdf size={16} weight="bold" />
            <span>{lang === "en" ? "RESUME" : "ÖZGEÇMİŞ"}</span>
          </a>

          {/* Contact CTA */}
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 border-2 border-black bg-[#FF5400] text-white font-mono text-xs font-bold uppercase tracking-wider shadow-ink hover:bg-[#e04a00] active:translate-x-0.5 active:translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
          >
            <EnvelopeSimple size={16} weight="bold" />
            <span className="hidden sm:inline">{lang === "en" ? "GET IN TOUCH" : "İLETİŞİME GEÇ"}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
