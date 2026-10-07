"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { MetricRibbon } from "@/components/MetricRibbon";
import { CaseStudyPanels } from "@/components/CaseStudyPanels";
import { ArsenalBento } from "@/components/ArsenalBento";
import { LabShowcase } from "@/components/LabShowcase";
import { ManifestoSection } from "@/components/ManifestoSection";
import { FirebaseControlDeck } from "@/components/FirebaseControlDeck";
import { CredentialsGrid } from "@/components/CredentialsGrid";
import { FooterSection } from "@/components/FooterSection";
import { ComicSkullLoader } from "@/components/ComicSkullLoader";
import { SmoothScroll } from "@/components/SmoothScroll";
import {
  SiteContent,
  DEFAULT_SITE_CONTENT,
  fetchSiteContent,
  SITE_CONTENT_LOCAL_STORAGE_KEY,
} from "@/lib/firebase";

export default function Home() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [source, setSource] = useState<"firestore" | "local-cache">("local-cache");
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    let isCancelled = false;

    fetchSiteContent().then((res) => {
      if (!isCancelled) {
        setContent(res.content);
        setSource(res.source);
        // Delightful minimum display time (500ms) to ensure smooth animated transition and eliminate text flashes
        setTimeout(() => {
          if (!isCancelled) {
            setIsLoading(false);
          }
        }, 500);
      }
    });

    const handleStorage = (e: StorageEvent) => {
      if (e.key === SITE_CONTENT_LOCAL_STORAGE_KEY && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (updated && updated.hero && updated.sectionsOrder) {
            setContent(updated);
          }
        } catch (err) {
          console.warn("Storage sync failed:", err);
        }
      }
    };

    window.addEventListener("storage", handleStorage);

    // Developer easter egg console log
    console.log(
      "%c[SYSTEM_ARCHITECT] Berkay Acar Core Runtime Loaded. %c\n- Type /terminal or press Konami Code (↑ ↑ ↓ ↓ ← → ← → B A) for interactive CLI.\n- Visit /status for live subsystem telemetry.",
      "color: #000; background: #CCFF00; font-weight: bold; font-size: 12px; padding: 4px;",
      "color: #FF5400; font-family: monospace; font-size: 11px;"
    );

    // Konami code detection
    const konamiSequence = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase() === "b" ? "b" : e.key.toLowerCase() === "a" ? "a" : e.key;
      if (key === konamiSequence[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiSequence.length) {
          konamiIndex = 0;
          window.location.href = "/terminal";
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      isCancelled = true;
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      style={{
        backgroundColor: content.theme?.canvasBg || "#F5EFE6",
      }}
      className="min-h-[100dvh] flex flex-col text-black transition-colors duration-300"
    >
      {/* Butter-Smooth Lenis Scroll Controller */}
      <SmoothScroll />

      {/* Retro Comic Skate Skull Boot Loader */}
      <ComicSkullLoader isLoading={isLoading} />

      {/* Top Navbar with Language Toggle (Zero Admin Triggers) */}
      <Navbar
        resumeUrl={content.resumeUrl}
        email={content.footerSection?.email}
      />

      {/* Main Page Flow dynamically ordered by CMS sectionsOrder */}
      <main className="flex-1">
        {(content.sectionsOrder || DEFAULT_SITE_CONTENT.sectionsOrder)
          .filter((s) => s.visible)
          .map((s) => {
            switch (s.id) {
              case "hero":
                return <HeroSection key="hero" hero={content.hero} />;
              case "metrics":
                return <MetricRibbon key="metrics" metrics={content.metrics} />;
              case "caseStudies":
                return (
                  <CaseStudyPanels
                    key="caseStudies"
                    caseStudiesSection={content.caseStudiesSection}
                  />
                );
              case "bento":
                return (
                  <ArsenalBento
                    key="bento"
                    bentoSection={content.bentoSection}
                  />
                );
              case "labs":
                return (
                  <LabShowcase
                    key="labs"
                    labSection={content.labSection}
                  />
                );
              case "manifesto":
                return (
                  <ManifestoSection
                    key="manifesto"
                    manifestoSection={content.manifestoSection}
                  />
                );
              case "firebaseDeck":
                return (
                  <FirebaseControlDeck
                    key="firebaseDeck"
                    content={content}
                    source={source}
                  />
                );
              case "credentials":
                return (
                  <CredentialsGrid
                    key="credentials"
                    credentialsSection={content.credentialsSection}
                  />
                );
              default:
                return null;
            }
          })}

        {/* Closing Footer & Direct Dispatch */}
        <FooterSection footerSection={content.footerSection} />
      </main>
    </div>
  );
}
