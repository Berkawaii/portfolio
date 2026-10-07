"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "tr";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("berkay_portfolio_lang") as Language;
      if (stored === "en" || stored === "tr") {
        setLangState(stored);
      } else if (typeof navigator !== "undefined") {
        // Auto-detect browser default
        const browserLang = navigator.language?.toLowerCase() || "";
        if (browserLang.startsWith("tr")) {
          setLangState("tr");
        } else {
          setLangState("en");
        }
      }
    } catch (e) {
      console.error("Language detection error:", e);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem("berkay_portfolio_lang", newLang);
    } catch (e) {
      console.error("Failed to store language preference:", e);
    }
  };

  const toggleLang = () => {
    setLang(lang === "en" ? "tr" : "en");
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
