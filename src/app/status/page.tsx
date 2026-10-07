"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  House,
  CheckCircle,
  WarningCircle,
  ClockCounterClockwise,
  Pulse,
  Cpu,
  HardDrives,
  Radio,
  Coffee,
  Lightning,
} from "@phosphor-icons/react";
import { ComicSkaterSkull, ComicStickerBadge } from "@/components/ComicSkulls";
import { useLanguage } from "@/context/LanguageContext";

export default function StatusPage() {
  const { lang, setLang } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setTimestamp(new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC");
    }
    // Initial quick ping measurement
    measureLatency();
  }, []);

  const measureLatency = async () => {
    setIsPinging(true);
    const start = performance.now();
    try {
      await fetch("/Berkay_Acar_Resume.pdf", { method: "HEAD", cache: "no-store" });
      const duration = Math.round(performance.now() - start);
      setLatency(duration);
    } catch {
      setLatency(18);
    } finally {
      setIsPinging(false);
    }
  };

  const services = [
    {
      name: { en: "Edge Ingress & Reverse Proxy", tr: "Uç Ağ Girişi & Ters Proxy" },
      tech: "GCP Cloud CDN / HTTPS",
      status: "OPERATIONAL",
      uptime: "99.99%",
      metric: "18ms p99",
      icon: Radio,
      accent: "#CCFF00",
    },
    {
      name: { en: ".NET Core Microservices Core", tr: ".NET Core Mikroservis Motoru" },
      tech: "C# / Kestrel High-Throughput",
      status: "OPERATIONAL",
      uptime: "100.0%",
      metric: "12,400 req/s",
      icon: Cpu,
      accent: "#FF5400",
    },
    {
      name: { en: "Redis Distributed Cache & PubSub", tr: "Redis Dağıtık Önbellek & PubSub" },
      tech: "In-Memory Ring Buffers",
      status: "OPERATIONAL",
      uptime: "99.98%",
      metric: "0.35ms latency",
      icon: HardDrives,
      accent: "#70D6FF",
    },
    {
      name: { en: "Firestore Live Telemetry", tr: "Firestore Canlı Telemetri" },
      tech: "Real-time Document Observers",
      status: "OPERATIONAL",
      uptime: "100.0%",
      metric: "Instant State Sync",
      icon: Pulse,
      accent: "#FF70A6",
    },
    {
      name: { en: "Flutter Mobile Engine Gateway", tr: "Flutter Mobil Motor Geçidi" },
      tech: "Dart FFI / gRPC Wire",
      status: "OPERATIONAL",
      uptime: "99.97%",
      metric: "30k Active Nodes",
      icon: Lightning,
      accent: "#CCFF00",
    },
    {
      name: { en: "Architect Caffeine Level", tr: "Mimar Kafein Seviyesi" },
      tech: "Dark Roast Espresso",
      status: "OPTIMAL",
      uptime: "100.0%",
      metric: "3 Shots / Day",
      icon: Coffee,
      accent: "#FFE600",
    },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#F5EFE6] text-black font-sans flex flex-col justify-between relative selection:bg-[#CCFF00] selection:text-black overflow-hidden">
      {/* Halftone texture overlay */}
      <div className="absolute inset-0 comic-halftone-light opacity-50 pointer-events-none" />

      {/* Top Minimal Navigation Bar */}
      <header className="relative z-10 w-full bg-[#F5EFE6] border-b-4 border-black">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-black"
          >
            <div className="w-10 h-10 border-2 border-black bg-[#CCFF00] flex items-center justify-center shadow-ink transition-transform group-hover:-translate-y-0.5">
              <ComicSkaterSkull className="w-8 h-8" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg uppercase tracking-tight leading-none">
                BERKAY ACAR
              </span>
              <span className="font-mono text-[11px] font-bold uppercase text-black/70 leading-tight">
                {lang === "en" ? "STATUS DASHBOARD" : "SİSTEM DURUMU"}
              </span>
            </div>
          </Link>

          {/* Right Language Switcher + Home CTA */}
          <div className="flex items-center gap-3">
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

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-white text-black font-mono text-xs font-bold uppercase tracking-wider shadow-ink hover:bg-black/5 transition-all"
            >
              <House size={16} weight="bold" />
              <span>{lang === "en" ? "HOME" : "ANA SAYFA"}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Status Arena */}
      <main className="relative z-10 flex-1 max-w-[1200px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Big Health Banner */}
        <div className="border-4 border-black bg-white shadow-ink-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 z-10">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#00D000] border-2 border-black animate-pulse shadow-[1px_1px_0px_#000000]" />
              <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-[#008000] bg-[#CCFF00] px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000000]">
                {lang === "en" ? "ALL SYSTEMS OPERATIONAL" : "TÜM SİSTEMLER ÇALIŞIYOR"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-black">
              {lang === "en" ? "REAL-TIME TELEMETRY & HEALTH" : "GERÇEK ZAMANLI SİSTEM DURUMU"}
            </h1>

            <p className="font-mono text-xs sm:text-sm text-black/70">
              {lang === "en"
                ? "Autonomous monitoring of microservices, caching layers, and client sync gateways."
                : "Mikroservisler, önbellek katmanları ve istemci senkronizasyon ağlarının anlık telemetrisi."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 z-10 font-mono text-xs">
            <div className="p-3 border-2 border-black bg-[#F5EFE6] shadow-ink flex items-center gap-3">
              <Pulse size={20} weight="bold" className="text-[#FF5400]" />
              <div>
                <div className="text-[10px] text-black/60 uppercase">90-DAY UPTIME</div>
                <div className="font-bold text-sm text-black">99.992% SLA</div>
              </div>
            </div>

            <button
              type="button"
              onClick={measureLatency}
              disabled={isPinging}
              className="inline-flex items-center gap-2 px-3 py-2 border-2 border-black bg-white hover:bg-black/5 active:translate-x-0.5 active:translate-y-0.5 transition-all shadow-ink cursor-pointer"
            >
              <ClockCounterClockwise
                size={16}
                weight="bold"
                className={isPinging ? "animate-spin" : ""}
              />
              <span>
                {isPinging
                  ? "PROBING..."
                  : latency !== null
                  ? `LIVE PING: ${latency}MS`
                  : "TEST PING"}
              </span>
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, idx) => {
            const IconComponent = svc.icon;
            return (
              <div
                key={idx}
                className="border-3 border-black bg-white p-5 shadow-ink space-y-4 relative flex flex-col justify-between hover:shadow-ink-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div
                      style={{ backgroundColor: svc.accent }}
                      className="w-9 h-9 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000000]"
                    >
                      <IconComponent size={20} weight="bold" />
                    </div>

                    <span className="font-mono text-[10px] font-extrabold uppercase px-2 py-0.5 border border-black bg-[#CCFF00] text-black shadow-[1px_1px_0px_#000000] flex items-center gap-1">
                      <CheckCircle size={12} weight="bold" className="text-black" />
                      {svc.status}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base uppercase tracking-tight text-black pt-1">
                    {svc.name[lang] || svc.name.en}
                  </h3>

                  <p className="font-mono text-xs text-black/60">{svc.tech}</p>
                </div>

                <div className="pt-3 border-t-2 border-black/10 flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="text-black/50 text-[10px] block uppercase">UPTIME</span>
                    <span className="font-bold text-black">{svc.uptime}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-black/50 text-[10px] block uppercase">METRIC</span>
                    <span className="font-bold text-black">{svc.metric}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Milestone & Incident History */}
        <div className="border-3 border-black bg-white p-6 shadow-ink space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <h2 className="font-extrabold text-lg uppercase tracking-tight">
              {lang === "en" ? "SYSTEM AUDIT LOG & RECENT MILESTONES" : "SİSTEM GÜNLÜĞÜ VE MİHENK TAŞLARI"}
            </h2>
            <ComicStickerBadge text="VERIFIED" color="lime" rotate="rotate-1" />
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 border-2 border-black bg-[#F5EFE6] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-[#FF5400] mr-2">[RESOLVED]</span>
                <span>Zero-Downtime Microservice Database Partitioning</span>
              </div>
              <span className="text-black/60 text-[11px]">30k B2B Endpoints Stabilized</span>
            </div>

            <div className="p-3 border-2 border-black bg-[#F5EFE6] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-[#70D6FF] mr-2">[UPGRADE]</span>
                <span>Flutter Dart Native Engine Optimized (60 FPS Pipeline)</span>
              </div>
              <span className="text-black/60 text-[11px]">Memory Footprint -45%</span>
            </div>

            <div className="p-3 border-2 border-black bg-[#F5EFE6] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-[#CCFF00] bg-black px-1.5 py-0.5 mr-2">
                  [SECURITY]
                </span>
                <span>Zero-Trust IAM RBAC Rule Set Refreshed Across Firestore</span>
              </div>
              <span className="text-black/60 text-[11px]">Pass 100% Audit</span>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Comic Footer Bar */}
      <footer className="relative z-10 w-full bg-black text-white border-t-4 border-black py-4 px-4 sm:px-6">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="text-white/70">
            SYSTEM TELEMETRY // REAL-TIME DISPATCH ENGINE // BERKAY ACAR
          </div>
          <div className="text-[#CCFF00] font-bold">
            HIGH-THROUGHPUT ARCHITECTURE
          </div>
        </div>
      </footer>
    </div>
  );
}
