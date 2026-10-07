"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Database, CloudCheck, ArrowSquareOut } from "@phosphor-icons/react";
import { getFirebaseDiagnostics, SiteContent } from "@/lib/firebase";
import { useLanguage } from "@/context/LanguageContext";

interface FirebaseControlDeckProps {
  content: SiteContent;
  source: "firestore" | "local-cache";
}

export function FirebaseControlDeck({
  content,
  source,
}: FirebaseControlDeckProps) {
  const { lang } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [clientTimestamp, setClientTimestamp] = useState<string>("SYNC_INITIALIZING");
  const diagnostics = getFirebaseDiagnostics();
  const projects = content.caseStudiesSection.items;

  useEffect(() => {
    setMounted(true);
    setClientTimestamp(new Date().toISOString());
  }, []);

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects[0]?.id || "unicowallet-fintech"
  );

  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0];

  return (
    <section id="firebase-deck" className="py-16 sm:py-24 bg-[#F5EFE6] border-b-4 border-black">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Section Heading: Stacked, NO split-header, NO eyebrow */}
        <div className="mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-black">
            {lang === "en"
              ? "FIREBASE CLOUD FIRESTORE & HEADLESS CMS"
              : "FIREBASE CLOUD FIRESTORE & BAĞIMSIZ CMS"}
          </h2>
          <p className="mt-2 text-base text-black/80 font-medium max-w-[65ch]">
            {lang === "en"
              ? "Live cloud architecture console bound to project berkay-58575: synchronizing portfolio collections, system metrics, and administrative state in real time."
              : "berkay-58575 projesine bağlı canlı bulut mimarisi konsolu: portfolyo koleksiyonlarını, sistem metriklerini ve yönetim durumunu gerçek zamanlı senkronize eder."}
          </p>
        </div>

        {/* Split Control Deck Frame */}
        <div className="border-4 border-black bg-white shadow-ink-xl p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Cloud Telemetry & Project Status */}
            <div className="lg:col-span-5 space-y-6">
              <div className="border-3 border-black bg-[#CCFF00] p-4 shadow-ink">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CloudCheck size={20} weight="bold" />
                    <span className="font-mono text-xs font-bold uppercase">
                      {lang === "en" ? "LIVE CLOUD BINDING" : "CANLI BULUT BAĞLANTISI"}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 border border-black bg-black text-[#CCFF00] font-mono text-[10px] font-bold">
                    ONLINE
                  </span>
                </div>
                <div className="font-extrabold text-2xl uppercase tracking-tight">
                  {diagnostics.projectId}
                </div>
                <div className="font-mono text-xs text-black/80 mt-1">
                  Primary Data Region : us-central1 (Firestore)
                </div>
              </div>

              {/* Status Tickers */}
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 border-2 border-black bg-[#F4EBD9] flex items-center justify-between">
                  <span className="font-bold">
                    {lang === "en" ? "ACTIVE STORAGE ENGINE:" : "AKTİF DEPOLAMA MOTORU:"}
                  </span>
                  <span className="font-bold uppercase px-2 py-0.5 border border-black bg-white">
                    {source === "firestore" ? "Cloud Firestore (Live)" : "Local Persistent Cache"}
                  </span>
                </div>

                <div className="p-3 border-2 border-black bg-[#F4EBD9] flex items-center justify-between">
                  <span className="font-bold">
                    {lang === "en" ? "FIRESTORE SYNC STATUS:" : "FIRESTORE SENKRONİZASYON:"}
                  </span>
                  <span className="font-bold text-[#FF5400] text-sm">
                    {mounted ? diagnostics.firestoreStatus : "INITIALIZED"}
                  </span>
                </div>

                <div className="p-3 border-2 border-black bg-[#F4EBD9] flex items-center justify-between">
                  <span className="font-bold">
                    {lang === "en" ? "HOSTING DEPLOYMENT:" : "HOSTING DAĞITIMI:"}
                  </span>
                  <span className="font-bold text-black">Firebase Hosting Ready</span>
                </div>
              </div>

              {/* Official Firebase Console Link */}
              <div className="pt-2">
                <a
                  href={diagnostics.consoleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border-3 border-black bg-[#F5EFE6] font-mono text-xs font-bold uppercase tracking-wider shadow-ink hover:bg-[#e6ddcf] transition-all"
                >
                  <span>{lang === "en" ? "OFFICIAL FIREBASE CONSOLE" : "RESMİ FIREBASE KONSOLU"}</span>
                  <ArrowSquareOut size={16} weight="bold" />
                </a>
              </div>
            </div>

            {/* Right Column: Live Document Inspector Terminal */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="border-3 border-black bg-black text-[#CCFF00] p-3 flex items-center justify-between font-mono text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <Terminal size={18} weight="bold" />
                    <span>FIRESTORE RECORD : /settings/site_content</span>
                  </div>
                  <span className="text-white text-[10px]">READ_ONLY_INSPECTOR</span>
                </div>

                {/* Project Selector Pills */}
                <div className="border-x-3 border-b-3 border-black bg-[#F4EBD9] p-3 flex flex-wrap gap-2">
                  {projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProjectId(p.id)}
                      type="button"
                      className={`px-2.5 py-1 border-2 border-black font-mono text-[11px] font-bold uppercase transition-all cursor-pointer ${
                        p.id === selectedProjectId
                          ? "bg-[#FF5400] text-white shadow-[2px_2px_0px_#000000]"
                          : "bg-white text-black hover:bg-black/5"
                      }`}
                    >
                      {p.id}
                    </button>
                  ))}
                </div>

                {/* JSON Terminal Screen */}
                <div className="border-x-3 border-b-3 border-black bg-[#1A1A1A] text-[#70D6FF] p-4 font-mono text-xs overflow-x-auto max-h-[340px] select-text">
                  <pre className="leading-relaxed" suppressHydrationWarning>
                    {JSON.stringify(
                      {
                        _id: selectedProject?.id,
                        title: selectedProject?.title[lang] || selectedProject?.title.en,
                        category: selectedProject?.category[lang] || selectedProject?.category.en,
                        client: selectedProject?.client[lang] || selectedProject?.client.en,
                        period: selectedProject?.period,
                        role: selectedProject?.role[lang] || selectedProject?.role.en,
                        techStack: selectedProject?.techStack,
                        architectureDetails:
                          selectedProject?.architectureDetails[lang] ||
                          selectedProject?.architectureDetails.en,
                        activeLanguage: lang,
                        syncTimestamp: mounted ? clientTimestamp : "SYNC_INITIALIZING",
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>

              {/* Terminal Footer Bar */}
              <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between font-mono text-xs font-bold text-black/70">
                <span>CLOUD FIRESTORE REST API CLIENT</span>
                <span>STATUS 200 OK</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
