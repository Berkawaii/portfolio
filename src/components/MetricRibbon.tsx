"use client";

import React from "react";
import { UsersThree, TrendDown, Robot, Lightning, ClockCounterClockwise } from "@phosphor-icons/react";
import { useLanguage } from "@/context/LanguageContext";
import { MetricItem } from "@/lib/firebase";

interface MetricRibbonProps {
  metrics: MetricItem[];
}

const ICON_MAP = [UsersThree, TrendDown, Robot, Lightning, ClockCounterClockwise];

export function MetricRibbon({ metrics }: MetricRibbonProps) {
  const { lang } = useLanguage();

  return (
    <section className="relative z-20 py-8 bg-[#F5EFE6] border-y-4 border-black">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {metrics.map((metric, idx) => {
            const Icon = ICON_MAP[idx % ICON_MAP.length];
            return (
              <div
                key={metric.id || idx}
                className={`border-4 border-black p-4 shadow-ink flex flex-col justify-between ${metric.bgColor} transition-transform hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 border-2 border-black bg-white text-black flex items-center justify-center shadow-[2px_2px_0px_#000000]">
                    <Icon size={18} weight="bold" />
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 border border-black bg-black text-white">
                    {lang === "en" ? "IMPACT" : "ETKİ"}
                  </span>
                </div>
                <div>
                  <div className="text-3xl lg:text-2xl xl:text-3xl font-extrabold tracking-tight text-black leading-none">
                    {metric.value}
                  </div>
                  <div className="mt-1 font-bold text-xs uppercase tracking-tight text-black">
                    {metric.label[lang] || metric.label.en}
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-black/75 leading-tight">
                    {metric.detail[lang] || metric.detail.en}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
