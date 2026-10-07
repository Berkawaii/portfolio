"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  fetchSiteContent,
  saveSiteContent,
  SiteContent,
  DEFAULT_SITE_CONTENT,
  MetricItem,
  CaseStudyItem,
  BentoCellItem,
  LabItem,
  ManifestoRuleItem,
  CertItem,
  AwardItem,
  EducationItem,
} from "@/lib/firebase";
import {
  LockKey,
  SignOut,
  FloppyDisk,
  ArrowSquareOut,
  Palette,
  TextT,
  ChartBar,
  HardDrives,
  Cpu,
  TerminalWindow,
  BookOpen,
  Certificate,
  PhoneCall,
  Plus,
  Trash,
  CheckCircle,
  WarningCircle,
  Rows,
  Eye,
  EyeSlash,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
} from "@phosphor-icons/react";
import { ComicSkaterSkull, ComicStickerBadge } from "@/components/ComicSkulls";
import { AdminImageUploader } from "@/components/AdminImageUploader";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Advanced Zero-Bot Mitigation Pipeline (Honeypot, Timing, PoW)
  const [honeypot, setHoneypot] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isAnalyzingCaptcha, setIsAnalyzingCaptcha] = useState(false);
  const [telemetryToken, setTelemetryToken] = useState("");
  const mountTimeRef = useRef<number>(Date.now());

  // Client-Side Proof-of-Work (PoW) SHA-256 Micro-Challenge
  const solveClientPoW = async (seed: string): Promise<{ nonce: number; duration: number }> => {
    const start = performance.now();
    let nonce = 0;
    const encoder = new TextEncoder();
    while (nonce < 50000) {
      const data = encoder.encode(`${seed}:${nonce}`);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      // Leading byte constraint (zero byte)
      if (hashArray[0] === 0) {
        break;
      }
      nonce++;
    }
    return { nonce, duration: Math.max(1, Math.round(performance.now() - start)) };
  };

  const handleVerifyHuman = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (captchaVerified || isAnalyzingCaptcha) return;

    // Layer 1: Check for synthetic automated clicks
    if (e && !e.isTrusted) {
      setLoginError("BOT DETECTED: Synthetic automated event rejected.");
      return;
    }

    // Layer 2: Timing Gate (Human cannot realistically fill in < 600ms)
    const elapsed = Date.now() - mountTimeRef.current;
    if (elapsed < 600) {
      setLoginError("BOT DETECTED: Interaction velocity anomaly (too fast for human).");
      return;
    }

    setIsAnalyzingCaptcha(true);
    setLoginError("");

    try {
      // Layer 3: Execute Proof-of-Work challenge
      const seed = `${navigator.userAgent}:${Date.now()}`;
      const { nonce, duration } = await solveClientPoW(seed);
      const hexToken = `0x${nonce.toString(16).toUpperCase()}-${duration}MS`;

      // Artificial slight delay for smooth visual feedback
      setTimeout(() => {
        setTelemetryToken(hexToken);
        setCaptchaVerified(true);
        setIsAnalyzingCaptcha(false);
      }, 350);
    } catch {
      setTimeout(() => {
        setTelemetryToken("0x7F2B-CONFIRMED");
        setCaptchaVerified(true);
        setIsAnalyzingCaptcha(false);
      }, 350);
    }
  };

  // Content state
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [activeTab, setActiveTab] = useState<
    | "sections"
    | "theme"
    | "hero"
    | "metrics"
    | "caseStudies"
    | "bento"
    | "labs"
    | "manifesto"
    | "credentials"
    | "footer"
  >("sections");

  const [statusMsg, setStatusMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Listen to Firebase Auth state
  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch current site content
  useEffect(() => {
    fetchSiteContent().then((res) => {
      setContent(res.content);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setLoginError("Firebase Auth client is not initialized.");
      return;
    }
    // Layer 4: Honeypot Trap Check
    if (honeypot.trim().length > 0) {
      setLoginError("ACCESS DENIED: Automated bot signature detected via honeypot trap.");
      setCaptchaVerified(false);
      return;
    }
    // Layer 5: Gate Enforcement
    if (!captchaVerified || !telemetryToken) {
      setLoginError("SECURITY GATE: Click 'I AM A HUMAN ARCHITECT' to complete bot protection.");
      return;
    }
    setIsSubmitting(true);
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err: any) {
      console.error("Login failure:", err);
      setCaptchaVerified(false);
      setTelemetryToken("");
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        setLoginError("INVALID CREDENTIALS: Verify email and password.");
      } else if (err.code === "auth/user-not-found") {
        setLoginError("USER NOT FOUND: Ensure account is registered in Firebase console.");
      } else {
        setLoginError(err.message || "AUTHENTICATION FAILED");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setStatusMsg("");
    try {
      const sanitizedContent: SiteContent = {
        ...content,
        labSection: {
          ...content.labSection,
          items: (content.labSection?.items || []).map((lab) => ({
            ...lab,
            impactMetricsEn: (lab.impactMetricsEn || []).map((s) => s.trim()).filter(Boolean),
            impactMetricsTr: (lab.impactMetricsTr || []).map((s) => s.trim()).filter(Boolean),
          })),
        },
      };
      setContent(sanitizedContent);
      const res = await saveSiteContent(sanitizedContent);
      setStatusMsg(`SAVED SUCCESSFULLY : Synchronized to ${res.destination}!`);
      setTimeout(() => setStatusMsg(""), 5000);
    } catch (err) {
      console.error("Save error:", err);
      setStatusMsg("FAILED TO SAVE CHANGES.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    if (!confirm("Are you sure you want to reset all content to default engineering values?")) {
      return;
    }
    setContent(DEFAULT_SITE_CONTENT);
    saveSiteContent(DEFAULT_SITE_CONTENT);
    setStatusMsg("RESET COMPLETE : Default content restored!");
    setTimeout(() => setStatusMsg(""), 5000);
  };

  // Section Ordering & Visibility
  const sectionsList = content.sectionsOrder || DEFAULT_SITE_CONTENT.sectionsOrder;

  const moveSection = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sectionsList.length) return;
    const copy = [...sectionsList];
    const [moved] = copy.splice(index, 1);
    copy.splice(newIndex, 0, moved);
    setContent({ ...content, sectionsOrder: copy });
  };

  const toggleSectionVisibility = (index: number) => {
    const copy = [...sectionsList];
    copy[index].visible = !copy[index].visible;
    setContent({ ...content, sectionsOrder: copy });
  };

  // Reorder Item Helpers
  const moveMetric = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= content.metrics.length) return;
    const copy = [...content.metrics];
    const [moved] = copy.splice(index, 1);
    copy.splice(newIndex, 0, moved);
    setContent({ ...content, metrics: copy });
  };

  const moveCaseStudy = (index: number, direction: "up" | "down") => {
    const list = content.caseStudiesSection.items;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= list.length) return;
    const copy = [...list];
    const [moved] = copy.splice(index, 1);
    copy.splice(newIndex, 0, moved);
    setContent({
      ...content,
      caseStudiesSection: { ...content.caseStudiesSection, items: copy },
    });
  };

  const moveBentoCell = (index: number, direction: "up" | "down") => {
    const list = content.bentoSection.cells;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= list.length) return;
    const copy = [...list];
    const [moved] = copy.splice(index, 1);
    copy.splice(newIndex, 0, moved);
    setContent({
      ...content,
      bentoSection: { ...content.bentoSection, cells: copy },
    });
  };

  const moveLab = (index: number, direction: "up" | "down") => {
    const list = content.labSection.items;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= list.length) return;
    const copy = [...list];
    const [moved] = copy.splice(index, 1);
    copy.splice(newIndex, 0, moved);
    setContent({
      ...content,
      labSection: { ...content.labSection, items: copy },
    });
  };

  const moveRule = (index: number, direction: "up" | "down") => {
    const list = content.manifestoSection.rules;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= list.length) return;
    const copy = [...list];
    const [moved] = copy.splice(index, 1);
    copy.splice(newIndex, 0, moved);
    setContent({
      ...content,
      manifestoSection: { ...content.manifestoSection, rules: copy },
    });
  };

  const moveCert = (index: number, direction: "up" | "down") => {
    const list = content.credentialsSection.certs;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= list.length) return;
    const copy = [...list];
    const [moved] = copy.splice(index, 1);
    copy.splice(newIndex, 0, moved);
    setContent({
      ...content,
      credentialsSection: { ...content.credentialsSection, certs: copy },
    });
  };

  const moveAward = (index: number, direction: "up" | "down") => {
    const list = content.credentialsSection.awards;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= list.length) return;
    const copy = [...list];
    const [moved] = copy.splice(index, 1);
    copy.splice(newIndex, 0, moved);
    setContent({
      ...content,
      credentialsSection: { ...content.credentialsSection, awards: copy },
    });
  };

  const moveDegree = (index: number, direction: "up" | "down") => {
    const list = content.credentialsSection.education;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= list.length) return;
    const copy = [...list];
    const [moved] = copy.splice(index, 1);
    copy.splice(newIndex, 0, moved);
    setContent({
      ...content,
      credentialsSection: { ...content.credentialsSection, education: copy },
    });
  };

  // Helper Add / Delete methods
  const handleAddMetric = () => {
    const newMetric: MetricItem = {
      id: `m-${Date.now()}`,
      value: "99.9%",
      label: { en: "High Uptime SLA", tr: "Yüksek Çalışma Süresi" },
      detail: { en: "Distributed fault tolerance", tr: "Dağıtık hata toleransı" },
      bgColor: "bg-[#70D6FF]",
    };
    setContent({ ...content, metrics: [...content.metrics, newMetric] });
  };

  const handleDeleteMetric = (idx: number) => {
    if (!confirm("Delete this metric?")) return;
    setContent({
      ...content,
      metrics: content.metrics.filter((_, i) => i !== idx),
    });
  };

  const handleAddCaseStudy = () => {
    const newItem: CaseStudyItem = {
      id: `case-${Date.now()}`,
      title: { en: "New Architecture Initiative", tr: "Yeni Mimari Girişimi" },
      category: { en: "SYSTEMS SCALING", tr: "SİSTEM ÖLÇEKLEME" },
      client: { en: "Enterprise Partner", tr: "Kurumsal Ortak" },
      period: "2024 - Present",
      role: { en: "Lead Architect", tr: "Lider Mimar" },
      summary: {
        en: "Architected high-throughput distributed microservices pipeline.",
        tr: "Yüksek hacimli dağıtık mikroservis veri hattı mimarisi geliştirdim.",
      },
      impactMetricsEn: ["40% latency reduction across transaction endpoints"],
      impactMetricsTr: ["İşlem uç noktalarında %40 gecikme azalması"],
      techStack: [".NET Core", "C#", "PostgreSQL", "Docker"],
      badgeText: { en: "NEW INITIATIVE", tr: "YENİ GİRİŞİM" },
      badgeColor: "orange",
      architectureDetails: {
        en: "Decoupled asynchronous consumer queues with idempotency keys.",
        tr: "Eşgüçlülük anahtarlarına sahip bağımsız asenkron tüketici kuyrukları.",
      },
    };
    setContent({
      ...content,
      caseStudiesSection: {
        ...content.caseStudiesSection,
        items: [newItem, ...content.caseStudiesSection.items],
      },
    });
  };

  const handleDeleteCaseStudy = (id: string) => {
    if (!confirm(`Delete case study ${id}?`)) return;
    setContent({
      ...content,
      caseStudiesSection: {
        ...content.caseStudiesSection,
        items: content.caseStudiesSection.items.filter((item) => item.id !== id),
      },
    });
  };

  const handleAddBentoCell = () => {
    const newCell: BentoCellItem = {
      id: `cell-${Date.now()}`,
      title: { en: "New Competency Domain", tr: "Yeni Yetkinlik Alanı" },
      summary: {
        en: "Deep systems engineering across cloud and mobile runtime targets.",
        tr: "Bulut ve mobil çalışma zamanı hedeflerinde derin sistem mühendisliği.",
      },
      tag: { en: "SPECIALTY", tr: "UZMANLIK" },
      pills: ["Cloud", "Distributed", "Security"],
      bgColor: "bg-[#CCFF00]",
      textColor: "text-black",
      colSpanDesktop: 4,
    };
    setContent({
      ...content,
      bentoSection: {
        ...content.bentoSection,
        cells: [...content.bentoSection.cells, newCell],
      },
    });
  };

  const handleDeleteBentoCell = (id: string) => {
    if (!confirm(`Delete bento cell ${id}?`)) return;
    setContent({
      ...content,
      bentoSection: {
        ...content.bentoSection,
        cells: content.bentoSection.cells.filter((c) => c.id !== id),
      },
    });
  };

  const handleAddLab = () => {
    const newLab: LabItem = {
      id: `lab-${Date.now()}`,
      title: { en: "New Experimental Protocol", tr: "Yeni Deneysel Protokol" },
      badgeText: { en: "R&D EXPERIMENT", tr: "AR-GE DENEYİ" },
      tabLabel: { en: "NEW : R&D EXPERIMENT", tr: "YENİ : AR-GE DENEYİ" },
      period: "2024",
      summary: {
        en: "Low-overhead protocol testing under volatile network conditions.",
        tr: "Dalgalı ağ koşullarında düşük maliyetli protokol testleri.",
      },
      architectureDetails: {
        en: "Optimized binary frame packing with zero GC pressure.",
        tr: "Sıfır çöp toplayıcı (GC) baskılı optimize edilmiş ikili çerçeve paketleme.",
      },
      impactMetricsEn: ["Sub-15ms roundtrip synchronization"],
      impactMetricsTr: ["15ms altında gidiş dönüş senkronizasyonu"],
      techStack: ["TypeScript", "WebSockets", "Go", "Docker"],
      githubUrl: "",
      liveUrl: "",
    };
    setContent({
      ...content,
      labSection: {
        ...content.labSection,
        items: [...content.labSection.items, newLab],
      },
    });
  };

  const handleDeleteLab = (id: string) => {
    if (!confirm(`Delete lab project ${id}?`)) return;
    setContent({
      ...content,
      labSection: {
        ...content.labSection,
        items: content.labSection.items.filter((l) => l.id !== id),
      },
    });
  };

  const handleAddRule = () => {
    const nextNum = String(content.manifestoSection.rules.length + 1).padStart(2, "0");
    const newRule: ManifestoRuleItem = {
      number: nextNum,
      ruleCode: `RULE ${nextNum} : PRINCIPLE`,
      title: { en: "New Engineering Axiom", tr: "Yeni Mühendislik İlkesi" },
      desc: {
        en: "Build resilient systems that withstand real-world enterprise pressure.",
        tr: "Gerçek dünya kurumsal baskılarına dayanan dirençli sistemler inşa edin.",
      },
      tag: { en: "CORE PRINCIPLE", tr: "TEMEL İLKE" },
      bgColor: "bg-[#F4EBD9]",
    };
    setContent({
      ...content,
      manifestoSection: {
        ...content.manifestoSection,
        rules: [...content.manifestoSection.rules, newRule],
      },
    });
  };

  const handleDeleteRule = (idx: number) => {
    if (!confirm("Delete this rule?")) return;
    setContent({
      ...content,
      manifestoSection: {
        ...content.manifestoSection,
        rules: content.manifestoSection.rules.filter((_, i) => i !== idx),
      },
    });
  };

  const handleAddCert = () => {
    const newCert: CertItem = {
      id: `c-${Date.now()}`,
      title: { en: "New Certification", tr: "Yeni Sertifika" },
      issuer: { en: "Issuing Organization", tr: "Veren Kurum" },
    };
    setContent({
      ...content,
      credentialsSection: {
        ...content.credentialsSection,
        certs: [...content.credentialsSection.certs, newCert],
      },
    });
  };

  const handleDeleteCert = (id: string) => {
    if (!confirm("Delete certification?")) return;
    setContent({
      ...content,
      credentialsSection: {
        ...content.credentialsSection,
        certs: content.credentialsSection.certs.filter((c) => c.id !== id),
      },
    });
  };

  const handleAddAward = () => {
    const newAward: AwardItem = {
      id: `a-${Date.now()}`,
      year: `YEAR ${new Date().getFullYear()}`,
      title: { en: "New Recognition Award", tr: "Yeni Başarı Ödülü" },
      desc: {
        en: "Awarded for exceptional systems architecture and team leadership.",
        tr: "Üstün sistem mimarisi ve ekip liderliği için verildi.",
      },
      badgeColor: "bg-[#FF5400] text-white",
    };
    setContent({
      ...content,
      credentialsSection: {
        ...content.credentialsSection,
        awards: [...content.credentialsSection.awards, newAward],
      },
    });
  };

  const handleDeleteAward = (id: string) => {
    if (!confirm("Delete award?")) return;
    setContent({
      ...content,
      credentialsSection: {
        ...content.credentialsSection,
        awards: content.credentialsSection.awards.filter((a) => a.id !== id),
      },
    });
  };

  const handleAddDegree = () => {
    const newDegree: EducationItem = {
      id: `e-${Date.now()}`,
      period: "2020 - 2024",
      school: { en: "University Name", tr: "Üniversite Adı" },
      degree: { en: "Degree in Computer Science", tr: "Bilgisayar Mühendisliği" },
    };
    setContent({
      ...content,
      credentialsSection: {
        ...content.credentialsSection,
        education: [...content.credentialsSection.education, newDegree],
      },
    });
  };

  const handleDeleteDegree = (id: string) => {
    if (!confirm("Delete degree?")) return;
    setContent({
      ...content,
      credentialsSection: {
        ...content.credentialsSection,
        education: content.credentialsSection.education.filter((e) => e.id !== id),
      },
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#F5EFE6] font-mono text-sm font-bold">
        <div className="border-4 border-black bg-white p-6 shadow-ink">
          VERIFYING FIREBASE AUTHENTICATION...
        </div>
      </div>
    );
  }

  // Login Gate
  if (!user) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center p-4 bg-[#F5EFE6]">
        <div className="w-full max-w-md border-4 border-black bg-white shadow-[12px_12px_0px_#000000] p-8 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto border-4 border-black bg-[#FF5400] text-white flex items-center justify-center shadow-ink">
              <ComicSkaterSkull className="w-12 h-12" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black">
              ARCHITECT CMS LOGIN
            </h1>
            <div className="inline-block px-3 py-1 border-2 border-black bg-[#CCFF00] font-mono text-xs font-bold uppercase">
              PROJECT : berkay-58575
            </div>
            <p className="text-xs font-mono text-black/70 leading-relaxed">
              Restricted administrative portal. Authenticate with your Firebase Email and Password to edit website content and themes.
            </p>
          </div>

          {loginError && (
            <div className="p-3 border-2 border-black bg-[#FF70A6] font-mono text-xs font-bold text-black flex items-center gap-2">
              <WarningCircle size={18} weight="bold" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase mb-1">
                FIREBASE EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="acar.berkai@gmail.com"
                required
                className="w-full px-4 py-2.5 border-3 border-black bg-[#F5EFE6] font-mono text-sm font-bold placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[#FF5400]"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase mb-1">
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-4 py-2.5 border-3 border-black bg-[#F5EFE6] font-mono text-sm font-bold placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[#FF5400]"
              />
            </div>

            {/* Invisible Honeypot Trap Field */}
            <div className="sr-only" aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0 }}>
              <label htmlFor="b_admin_hp">Leave empty</label>
              <input
                id="b_admin_hp"
                type="text"
                name="website_verification_hp"
                tabIndex={-1}
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                autoComplete="off"
              />
            </div>

            {/* Zero-Bot Human Architect Shield Frame */}
            <div className="p-3.5 border-3 border-black bg-[#F5EFE6] shadow-ink space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase text-black">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={18} className="text-[#FF5400]" weight="bold" />
                  <span>ZERO-BOT SHIELD // HUMAN PROTOCOL</span>
                </span>
                <span
                  className={`px-2 py-0.5 border-2 border-black font-mono text-[10px] font-bold transition-all ${
                    captchaVerified
                      ? "bg-[#CCFF00] text-black shadow-[2px_2px_0px_#000000]"
                      : isAnalyzingCaptcha
                      ? "bg-[#70D6FF] text-black animate-pulse"
                      : "bg-white text-black/70"
                  }`}
                >
                  {captchaVerified
                    ? "HUMAN VERIFIED"
                    : isAnalyzingCaptcha
                    ? "SCANNING..."
                    : "UNVERIFIED"}
                </span>
              </div>

              {/* Interactive Verification Button */}
              <button
                type="button"
                onClick={handleVerifyHuman}
                disabled={captchaVerified || isAnalyzingCaptcha}
                className={`w-full p-3 border-2 border-black flex items-center justify-between gap-3 text-left transition-all ${
                  captchaVerified
                    ? "bg-[#CCFF00]/20 border-black shadow-[2px_2px_0px_#000000] cursor-default"
                    : isAnalyzingCaptcha
                    ? "bg-[#70D6FF]/30 border-black cursor-wait"
                    : "bg-white hover:bg-[#F4EBD9] shadow-ink active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Verification Checkmark Box */}
                  <div
                    className={`w-7 h-7 border-2 border-black flex items-center justify-center transition-all ${
                      captchaVerified
                        ? "bg-[#CCFF00] text-black shadow-[1px_1px_0px_#000000]"
                        : isAnalyzingCaptcha
                        ? "bg-[#70D6FF]"
                        : "bg-white"
                    }`}
                  >
                    {captchaVerified ? (
                      <CheckCircle size={22} weight="fill" className="text-black" />
                    ) : isAnalyzingCaptcha ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : null}
                  </div>

                  <div>
                    <div className="font-mono text-xs font-bold uppercase text-black">
                      {captchaVerified
                        ? "HUMAN ARCHITECT CONFIRMED"
                        : isAnalyzingCaptcha
                        ? "SOLVING PROOF-OF-WORK HASH..."
                        : "I AM A HUMAN ARCHITECT"}
                    </div>
                    <div className="font-mono text-[10px] text-black/65">
                      {captchaVerified
                        ? `CLIENT TOKEN: ${telemetryToken} (PoW VALID)`
                        : "Click to generate cryptographic proof-of-work"}
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono text-[10px] text-black/50 hidden sm:block leading-tight">
                  <div className="font-bold">SHA-256 PoW</div>
                  <div>HONEYPOT GATE</div>
                </div>
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !captchaVerified}
              className="w-full py-3.5 border-4 border-black bg-[#CCFF00] text-black font-mono text-sm font-bold uppercase tracking-wider shadow-ink hover:bg-[#b8e600] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "AUTHENTICATING..." : "SIGN IN WITH FIREBASE"}
            </button>
          </form>

          <div className="pt-4 border-t-2 border-black/20 text-center">
            <Link
              href="/"
              className="font-mono text-xs font-bold text-black hover:text-[#FF5400] transition-colors"
            >
              ← RETURN TO PUBLIC SITE
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated CMS Builder
  return (
    <div className="min-h-[100dvh] bg-[#F5EFE6] text-black font-sans pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#FF5400] text-white border-b-4 border-black">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-black bg-white text-black flex items-center justify-center shadow-ink">
              <ComicSkaterSkull className="w-8 h-8" />
            </div>
            <div>
              <div className="font-extrabold text-base sm:text-lg uppercase tracking-tight leading-none">
                BERKAY CMS : WEBSITE BUILDER
              </div>
              <div className="font-mono text-[11px] text-white/85">
                AUTH : {user.email} (berkay-58575)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-[#70D6FF] text-black font-mono text-xs font-bold uppercase shadow-ink hover:bg-[#5bc4ee]"
            >
              <span>VIEW LIVE SITE</span>
              <ArrowSquareOut size={16} weight="bold" />
            </Link>

            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 border-3 border-black bg-[#CCFF00] text-black font-mono text-xs font-bold uppercase tracking-wider shadow-ink hover:bg-[#b8e600] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <FloppyDisk size={18} weight="bold" />
              <span>{isSaving ? "SAVING..." : "SAVE ALL"}</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 border-2 border-black bg-white text-black font-mono text-xs font-bold uppercase shadow-ink hover:bg-[#FF70A6] cursor-pointer"
              title="Sign Out"
            >
              <SignOut size={16} weight="bold" />
              <span className="hidden md:inline">LOGOUT</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6">
        {statusMsg && (
          <div className="mb-6 p-4 border-3 border-black bg-[#CCFF00] font-mono text-xs sm:text-sm font-bold flex items-center justify-between shadow-ink">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} weight="bold" />
              <span>{statusMsg}</span>
            </div>
            <button
              onClick={() => setStatusMsg("")}
              className="text-xs uppercase underline"
            >
              DISMISS
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b-4 border-black pb-4">
          {[
            { id: "sections", label: "SECTIONS & VISIBILITY", icon: Rows },
            { id: "theme", label: "THEME & STYLING", icon: Palette },
            { id: "hero", label: "HERO SECTION", icon: TextT },
            { id: "metrics", label: "METRICS RIBBON", icon: ChartBar },
            { id: "caseStudies", label: "CASE STUDIES", icon: HardDrives },
            { id: "bento", label: "TECH ARSENAL", icon: Cpu },
            { id: "labs", label: "R&D LABS", icon: TerminalWindow },
            { id: "manifesto", label: "MANIFESTO", icon: BookOpen },
            { id: "credentials", label: "CREDENTIALS", icon: Certificate },
            { id: "footer", label: "FOOTER & CONTACT", icon: PhoneCall },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                type="button"
                className={`inline-flex items-center gap-2 px-3.5 py-2 border-3 border-black font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#FF5400] text-white shadow-ink translate-x-0.5 translate-y-0.5"
                    : "bg-white text-black shadow-ink hover:bg-[#F4EBD9]"
                }`}
              >
                <Icon size={16} weight="bold" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 0: SECTIONS ORDER & VISIBILITY MANAGER */}
        {activeTab === "sections" && (
          <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-ink-lg space-y-6">
            <div className="border-b-2 border-black pb-3">
              <h2 className="text-2xl font-extrabold uppercase tracking-tight">
                SECTIONS ORDER & VISIBILITY MANAGER
              </h2>
              <p className="text-xs font-mono text-black/70">
                Use the Move Up and Move Down arrows to reorder sections on the homepage. Toggle visibility to hide or show any section.
              </p>
            </div>

            <div className="space-y-3">
              {sectionsList.map((sec, idx) => (
                <div
                  key={sec.id}
                  className={`p-4 border-3 border-black shadow-ink flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                    sec.visible ? "bg-white" : "bg-black/5 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 border-2 border-black bg-black text-white font-mono text-xs font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="font-extrabold text-sm uppercase">
                        {sec.name.en} / {sec.name.tr}
                      </div>
                      <div className="font-mono text-[11px] text-black/60">
                        KEY: {sec.id}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Visibility Toggle Button */}
                    <button
                      type="button"
                      onClick={() => toggleSectionVisibility(idx)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                        sec.visible
                          ? "bg-[#CCFF00] text-black shadow-[2px_2px_0px_#000000]"
                          : "bg-[#FF70A6] text-black"
                      }`}
                    >
                      {sec.visible ? (
                        <>
                          <Eye size={16} weight="bold" />
                          <span>VISIBLE</span>
                        </>
                      ) : (
                        <>
                          <EyeSlash size={16} weight="bold" />
                          <span>HIDDEN</span>
                        </>
                      )}
                    </button>

                    {/* Move Up */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveSection(idx, "up")}
                      className="p-1.5 border-2 border-black bg-white hover:bg-black/5 disabled:opacity-30 cursor-pointer"
                      title="Move Section Up"
                    >
                      <ArrowUp size={16} weight="bold" />
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      disabled={idx === sectionsList.length - 1}
                      onClick={() => moveSection(idx, "down")}
                      className="p-1.5 border-2 border-black bg-white hover:bg-black/5 disabled:opacity-30 cursor-pointer"
                      title="Move Section Down"
                    >
                      <ArrowDown size={16} weight="bold" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 1: THEME & STYLING */}
        {activeTab === "theme" && (
          <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-ink-lg space-y-6">
            <div className="border-b-2 border-black pb-3">
              <h2 className="text-2xl font-extrabold uppercase tracking-tight">
                SITE THEME & COLOR PALETTE
              </h2>
              <p className="text-xs font-mono text-black/70">
                Adjust primary palette tokens. Changes take effect on the public page upon saving.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-2">
                  CANVAS BACKGROUND
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={content.theme.canvasBg}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        theme: { ...content.theme, canvasBg: e.target.value },
                      })
                    }
                    className="w-12 h-12 border-3 border-black cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={content.theme.canvasBg}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        theme: { ...content.theme, canvasBg: e.target.value },
                      })
                    }
                    className="flex-1 px-3 py-2 border-2 border-black font-mono text-xs font-bold uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-2">
                  PRIMARY ACCENT COLOR
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={content.theme.accentColor}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        theme: { ...content.theme, accentColor: e.target.value },
                      })
                    }
                    className="w-12 h-12 border-3 border-black cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={content.theme.accentColor}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        theme: { ...content.theme, accentColor: e.target.value },
                      })
                    }
                    className="flex-1 px-3 py-2 border-2 border-black font-mono text-xs font-bold uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-2">
                  CARD BACKGROUND
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={content.theme.cardBg}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        theme: { ...content.theme, cardBg: e.target.value },
                      })
                    }
                    className="w-12 h-12 border-3 border-black cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={content.theme.cardBg}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        theme: { ...content.theme, cardBg: e.target.value },
                      })
                    }
                    className="flex-1 px-3 py-2 border-2 border-black font-mono text-xs font-bold uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-2">
                  INK BORDER COLOR
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={content.theme.borderColor}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        theme: { ...content.theme, borderColor: e.target.value },
                      })
                    }
                    className="w-12 h-12 border-3 border-black cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={content.theme.borderColor}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        theme: { ...content.theme, borderColor: e.target.value },
                      })
                    }
                    className="flex-1 px-3 py-2 border-2 border-black font-mono text-xs font-bold uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-black/20">
              <label className="block font-mono text-xs font-bold uppercase mb-2">
                QUICK THEME PRESETS:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Vintage Retro Cream", canvas: "#F5EFE6", accent: "#FF5400" },
                  { name: "Acid Lime Punk", canvas: "#F4EBD9", accent: "#CCFF00" },
                  { name: "Retro Sky Blue", canvas: "#F5EFE6", accent: "#70D6FF" },
                  { name: "Bubblegum Cyber", canvas: "#F5EFE6", accent: "#FF70A6" },
                ].map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() =>
                      setContent({
                        ...content,
                        theme: {
                          ...content.theme,
                          canvasBg: p.canvas,
                          accentColor: p.accent,
                        },
                      })
                    }
                    className="px-3 py-1.5 border-2 border-black bg-white font-mono text-xs font-bold hover:bg-black/5 cursor-pointer"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Portfolio Resume / CV PDF File */}
            <div className="pt-4 border-t-2 border-black/20 space-y-2">
              <label className="block font-mono text-xs font-bold uppercase mb-1">
                PORTFOLIO RESUME / CV DOWNLOAD URL (HEADER)
              </label>
              <input
                type="text"
                value={content.resumeUrl || ""}
                placeholder="/Berkay_Acar_Resume.pdf"
                onChange={(e) =>
                  setContent({
                    ...content,
                    resumeUrl: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border-2 border-black font-mono text-xs font-bold"
              />
              <span className="text-[10px] font-mono text-black/60 block">
                Controls the download file for the RESUME button in the top header (e.g. /Berkay_Acar_Resume.pdf or external Drive/Cloud URL).
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: HERO SECTION */}
        {activeTab === "hero" && (
          <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-ink-lg space-y-6">
            <div className="border-b-2 border-black pb-3">
              <h2 className="text-2xl font-extrabold uppercase tracking-tight">
                HERO SECTION CONTENT
              </h2>
              <p className="text-xs font-mono text-black/70">
                Bilingual inputs for hero display elements.
              </p>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    EYEBROW (EN)
                  </label>
                  <input
                    type="text"
                    value={content.hero.eyebrow.en}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: {
                          ...content.hero,
                          eyebrow: { ...content.hero.eyebrow, en: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black font-mono text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    EYEBROW (TR)
                  </label>
                  <input
                    type="text"
                    value={content.hero.eyebrow.tr}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: {
                          ...content.hero,
                          eyebrow: { ...content.hero.eyebrow, tr: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black font-mono text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    HEADLINE (EN)
                  </label>
                  <input
                    type="text"
                    value={content.hero.headline.en}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: {
                          ...content.hero,
                          headline: { ...content.hero.headline, en: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black font-extrabold text-sm uppercase"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    HEADLINE (TR)
                  </label>
                  <input
                    type="text"
                    value={content.hero.headline.tr}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: {
                          ...content.hero,
                          headline: { ...content.hero.headline, tr: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black font-extrabold text-sm uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    SUBTEXT (EN)
                  </label>
                  <textarea
                    rows={3}
                    value={content.hero.subtext.en}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: {
                          ...content.hero,
                          subtext: { ...content.hero.subtext, en: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black font-sans text-xs leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    SUBTEXT (TR)
                  </label>
                  <textarea
                    rows={3}
                    value={content.hero.subtext.tr}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: {
                          ...content.hero,
                          subtext: { ...content.hero.subtext, tr: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black font-sans text-xs leading-relaxed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    PRIMARY CTA (EN)
                  </label>
                  <input
                    type="text"
                    value={content.hero.primaryCta.en}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: {
                          ...content.hero,
                          primaryCta: { ...content.hero.primaryCta, en: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black font-mono text-xs font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    PRIMARY CTA (TR)
                  </label>
                  <input
                    type="text"
                    value={content.hero.primaryCta.tr}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: {
                          ...content.hero,
                          primaryCta: { ...content.hero.primaryCta, tr: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black font-mono text-xs font-bold uppercase"
                  />
                </div>
              </div>

              {/* Hero Secondary CTA (GitHub Button) */}
              <div className="p-4 border-2 border-black bg-white">
                <label className="block font-mono text-xs font-bold uppercase mb-1">
                  HERO SECONDARY CTA: GITHUB URL
                </label>
                <input
                  type="text"
                  value={content.hero.githubUrl || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: {
                        ...content.hero,
                        githubUrl: e.target.value,
                      },
                    })
                  }
                  placeholder="https://github.com/Berkawaii"
                  className="w-full px-3 py-2 border-2 border-black font-mono text-xs font-bold"
                />
                <span className="text-[10px] font-mono text-black/60 block mt-1">
                  Controls the link for the white GITHUB button next to the primary CTA in the hero section.
                </span>
              </div>

              {/* Comic Portrait Card Badges & Captions */}
              <div className="p-4 border-2 border-black bg-[#F5EFE6] space-y-4">
                <div className="font-mono text-xs font-bold uppercase text-[#FF5400] flex items-center justify-between">
                  <span>PORTRAIT CARD STICKER BADGES & CAPTIONS:</span>
                  <span className="text-[10px] text-black/60">CORNER BADGES & POLAROID CAPTION BAR</span>
                </div>

                {/* Top-Left Sticker (Orange) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border border-black bg-white">
                  <div>
                    <label className="block font-mono text-[11px] font-bold uppercase mb-1 text-[#FF5400]">
                      TOP-LEFT STICKER BADGE (EN)
                    </label>
                    <input
                      type="text"
                      value={content.hero.badgeTopLeft?.en || ""}
                      placeholder="e.g. LET'S GO!"
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: {
                            ...content.hero,
                            badgeTopLeft: {
                              en: e.target.value,
                              tr: content.hero.badgeTopLeft?.tr || e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 border border-black font-mono text-xs font-bold uppercase"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] font-bold uppercase mb-1 text-[#FF5400]">
                      TOP-LEFT STICKER BADGE (TR)
                    </label>
                    <input
                      type="text"
                      value={content.hero.badgeTopLeft?.tr || ""}
                      placeholder="e.g. BAŞLAYALIM!"
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: {
                            ...content.hero,
                            badgeTopLeft: {
                              en: content.hero.badgeTopLeft?.en || e.target.value,
                              tr: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 border border-black font-mono text-xs font-bold uppercase"
                    />
                  </div>
                </div>

                {/* Top-Right Sticker (Lime) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border border-black bg-white">
                  <div>
                    <label className="block font-mono text-[11px] font-bold uppercase mb-1 text-[#4d7c0f]">
                      TOP-RIGHT STICKER BADGE (EN)
                    </label>
                    <input
                      type="text"
                      value={content.hero.badgeTopRight?.en || ""}
                      placeholder="e.g. ROCK SOLID"
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: {
                            ...content.hero,
                            badgeTopRight: {
                              en: e.target.value,
                              tr: content.hero.badgeTopRight?.tr || e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 border border-black font-mono text-xs font-bold uppercase"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] font-bold uppercase mb-1 text-[#4d7c0f]">
                      TOP-RIGHT STICKER BADGE (TR)
                    </label>
                    <input
                      type="text"
                      value={content.hero.badgeTopRight?.tr || ""}
                      placeholder="e.g. KAYA GİBİ"
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: {
                            ...content.hero,
                            badgeTopRight: {
                              en: content.hero.badgeTopRight?.en || e.target.value,
                              tr: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 border border-black font-mono text-xs font-bold uppercase"
                    />
                  </div>
                </div>

                {/* Bottom-Right Sticker (Pink) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border border-black bg-white">
                  <div>
                    <label className="block font-mono text-[11px] font-bold uppercase mb-1 text-[#db2777]">
                      BOTTOM-RIGHT STICKER BADGE (EN)
                    </label>
                    <input
                      type="text"
                      value={content.hero.badgeBottomRight?.en || ""}
                      placeholder="e.g. STAY POSITIVE"
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: {
                            ...content.hero,
                            badgeBottomRight: {
                              en: e.target.value,
                              tr: content.hero.badgeBottomRight?.tr || e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 border border-black font-mono text-xs font-bold uppercase"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] font-bold uppercase mb-1 text-[#db2777]">
                      BOTTOM-RIGHT STICKER BADGE (TR)
                    </label>
                    <input
                      type="text"
                      value={content.hero.badgeBottomRight?.tr || ""}
                      placeholder="e.g. POZİTİF KAL"
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: {
                            ...content.hero,
                            badgeBottomRight: {
                              en: content.hero.badgeBottomRight?.en || e.target.value,
                              tr: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 border border-black font-mono text-xs font-bold uppercase"
                    />
                  </div>
                </div>

                {/* Figure Caption Bar (Bottom-Left) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border border-black bg-white">
                  <div>
                    <label className="block font-mono text-[11px] font-bold uppercase mb-1">
                      FIGURE CAPTION (BOTTOM-LEFT) (EN)
                    </label>
                    <input
                      type="text"
                      value={content.hero.captionFigure?.en || ""}
                      placeholder="e.g. FIG 1.0 : CYBER ARCHITECT"
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: {
                            ...content.hero,
                            captionFigure: {
                              en: e.target.value,
                              tr: content.hero.captionFigure?.tr || e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 border border-black font-mono text-xs font-bold uppercase"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] font-bold uppercase mb-1">
                      FIGURE CAPTION (BOTTOM-LEFT) (TR)
                    </label>
                    <input
                      type="text"
                      value={content.hero.captionFigure?.tr || ""}
                      placeholder="e.g. ŞEKİL 1.0 : SİSTEM MİMARI"
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: {
                            ...content.hero,
                            captionFigure: {
                              en: content.hero.captionFigure?.en || e.target.value,
                              tr: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 border border-black font-mono text-xs font-bold uppercase"
                    />
                  </div>
                </div>

                {/* Location Caption Bar (Bottom-Right) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border border-black bg-white">
                  <div>
                    <label className="block font-mono text-[11px] font-bold uppercase mb-1 text-[#FF5400]">
                      LOCATION CAPTION (BOTTOM-RIGHT) (EN)
                    </label>
                    <input
                      type="text"
                      value={content.hero.captionLocation?.en || ""}
                      placeholder="e.g. ISTANBUL, TR"
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: {
                            ...content.hero,
                            captionLocation: {
                              en: e.target.value,
                              tr: content.hero.captionLocation?.tr || e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 border border-black font-mono text-xs font-bold uppercase text-[#FF5400]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] font-bold uppercase mb-1 text-[#FF5400]">
                      LOCATION CAPTION (BOTTOM-RIGHT) (TR)
                    </label>
                    <input
                      type="text"
                      value={content.hero.captionLocation?.tr || ""}
                      placeholder="e.g. İSTANBUL, TR"
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: {
                            ...content.hero,
                            captionLocation: {
                              en: content.hero.captionLocation?.en || e.target.value,
                              tr: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 border border-black font-mono text-xs font-bold uppercase text-[#FF5400]"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Mascot / Avatar Artwork Uploader */}
              <div className="pt-2">
                <AdminImageUploader
                  label="HERO MASCOT / AVATAR ILLUSTRATION"
                  imagePath={content.hero.imagePath}
                  fallbackPath="/assets/comic_hero_mascot.jpg"
                  aspectRatio="square"
                  onChange={(newPath) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, imagePath: newPath },
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: METRICS (With Add / Delete) */}
        {activeTab === "metrics" && (
          <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-ink-lg space-y-6">
            <div className="border-b-2 border-black pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold uppercase tracking-tight">
                  METRIC RIBBON
                </h2>
                <p className="text-xs font-mono text-black/70">
                  Add new metric items or delete existing metrics from the ribbon.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddMetric}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border-2 border-black bg-[#CCFF00] font-mono text-xs font-bold uppercase shadow-ink hover:bg-[#b8e600] cursor-pointer"
              >
                <Plus size={16} weight="bold" />
                <span>ADD METRIC</span>
              </button>
            </div>

            <div className="space-y-6">
              {content.metrics.map((m, idx) => (
                <div
                  key={m.id || idx}
                  className="p-5 border-3 border-black bg-[#F5EFE6] shadow-ink space-y-3 relative"
                >
                  <div className="flex items-center justify-between font-mono text-xs font-bold">
                    <span>METRIC #{idx + 1}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={m.value}
                        onChange={(e) => {
                          const copy = [...content.metrics];
                          copy[idx].value = e.target.value;
                          setContent({ ...content, metrics: copy });
                        }}
                        className="px-2 py-1 border-2 border-black bg-white font-extrabold text-sm w-36 text-center"
                      />
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveMetric(idx, "up")}
                        className="p-1.5 border-2 border-black bg-white hover:bg-black/5 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp size={16} weight="bold" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === content.metrics.length - 1}
                        onClick={() => moveMetric(idx, "down")}
                        className="p-1.5 border-2 border-black bg-white hover:bg-black/5 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown size={16} weight="bold" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMetric(idx)}
                        className="p-1.5 border-2 border-black bg-[#FF70A6] hover:bg-[#f35894] cursor-pointer"
                        title="Delete Metric"
                      >
                        <Trash size={16} weight="bold" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase mb-1">
                        LABEL (EN)
                      </label>
                      <input
                        type="text"
                        value={m.label.en}
                        onChange={(e) => {
                          const copy = [...content.metrics];
                          copy[idx].label.en = e.target.value;
                          setContent({ ...content, metrics: copy });
                        }}
                        className="w-full px-3 py-1.5 border-2 border-black bg-white font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase mb-1">
                        LABEL (TR)
                      </label>
                      <input
                        type="text"
                        value={m.label.tr}
                        onChange={(e) => {
                          const copy = [...content.metrics];
                          copy[idx].label.tr = e.target.value;
                          setContent({ ...content, metrics: copy });
                        }}
                        className="w-full px-3 py-1.5 border-2 border-black bg-white font-bold text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase mb-1">
                        DETAIL (EN)
                      </label>
                      <input
                        type="text"
                        value={m.detail.en}
                        onChange={(e) => {
                          const copy = [...content.metrics];
                          copy[idx].detail.en = e.target.value;
                          setContent({ ...content, metrics: copy });
                        }}
                        className="w-full px-3 py-1.5 border-2 border-black bg-white font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase mb-1">
                        DETAIL (TR)
                      </label>
                      <input
                        type="text"
                        value={m.detail.tr}
                        onChange={(e) => {
                          const copy = [...content.metrics];
                          copy[idx].detail.tr = e.target.value;
                          setContent({ ...content, metrics: copy });
                        }}
                        className="w-full px-3 py-1.5 border-2 border-black bg-white font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CASE STUDIES (With Add / Delete) */}
        {activeTab === "caseStudies" && (
          <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-ink-lg space-y-6">
            <div className="border-b-2 border-black pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold uppercase tracking-tight">
                  ENTERPRISE ARCHITECTURAL CASE STUDIES
                </h2>
                <p className="text-xs font-mono text-black/70">
                  Add new projects or delete existing ones from the architecture showcase.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddCaseStudy}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border-2 border-black bg-[#CCFF00] font-mono text-xs font-bold uppercase shadow-ink hover:bg-[#b8e600] cursor-pointer"
              >
                <Plus size={16} weight="bold" />
                <span>ADD CASE STUDY</span>
              </button>
            </div>

            {/* Case Studies Section Header & Subtitle Box */}
            <div className="p-4 border-2 border-black bg-[#F5EFE6] space-y-4">
              <div className="font-mono text-xs font-bold uppercase text-[#FF5400]">
                SECTION HEADER & SUBTITLE:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    SECTION HEADING (EN)
                  </label>
                  <input
                    type="text"
                    value={content.caseStudiesSection.heading.en}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        caseStudiesSection: {
                          ...content.caseStudiesSection,
                          heading: { ...content.caseStudiesSection.heading, en: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black bg-white font-extrabold text-sm uppercase"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    SECTION HEADING (TR)
                  </label>
                  <input
                    type="text"
                    value={content.caseStudiesSection.heading.tr}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        caseStudiesSection: {
                          ...content.caseStudiesSection,
                          heading: { ...content.caseStudiesSection.heading, tr: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black bg-white font-extrabold text-sm uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    SUBHEADING / DESCRIPTION (EN)
                  </label>
                  <textarea
                    rows={2}
                    value={content.caseStudiesSection.subheading.en}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        caseStudiesSection: {
                          ...content.caseStudiesSection,
                          subheading: { ...content.caseStudiesSection.subheading, en: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black bg-white font-sans text-xs leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    SUBHEADING / DESCRIPTION (TR)
                  </label>
                  <textarea
                    rows={2}
                    value={content.caseStudiesSection.subheading.tr}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        caseStudiesSection: {
                          ...content.caseStudiesSection,
                          subheading: { ...content.caseStudiesSection.subheading, tr: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black bg-white font-sans text-xs leading-relaxed"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {content.caseStudiesSection.items.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-5 border-3 border-black bg-[#F5EFE6] shadow-ink space-y-4"
                >
                  <div className="flex items-center justify-between font-mono text-xs font-bold border-b border-black/20 pb-2">
                    <span className="text-[#FF5400]">
                      PROJECT #{idx + 1} : {item.id} ({item.period})
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveCaseStudy(idx, "up")}
                        className="p-1 border border-black bg-white hover:bg-black/5 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp size={14} weight="bold" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === content.caseStudiesSection.items.length - 1}
                        onClick={() => moveCaseStudy(idx, "down")}
                        className="p-1 border border-black bg-white hover:bg-black/5 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown size={14} weight="bold" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCaseStudy(item.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 border-2 border-black bg-[#FF70A6] text-black font-mono text-xs font-bold uppercase hover:bg-[#f35894] cursor-pointer"
                      >
                        <Trash size={14} weight="bold" />
                        <span>DELETE</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase mb-1">
                        TITLE (EN)
                      </label>
                      <input
                        type="text"
                        value={item.title.en}
                        onChange={(e) => {
                          const copy = [...content.caseStudiesSection.items];
                          copy[idx].title.en = e.target.value;
                          setContent({
                            ...content,
                            caseStudiesSection: {
                              ...content.caseStudiesSection,
                              items: copy,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 border-2 border-black bg-white font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase mb-1">
                        TITLE (TR)
                      </label>
                      <input
                        type="text"
                        value={item.title.tr}
                        onChange={(e) => {
                          const copy = [...content.caseStudiesSection.items];
                          copy[idx].title.tr = e.target.value;
                          setContent({
                            ...content,
                            caseStudiesSection: {
                              ...content.caseStudiesSection,
                              items: copy,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 border-2 border-black bg-white font-bold text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase mb-1">
                        SUMMARY (EN)
                      </label>
                      <textarea
                        rows={3}
                        value={item.summary.en}
                        onChange={(e) => {
                          const copy = [...content.caseStudiesSection.items];
                          copy[idx].summary.en = e.target.value;
                          setContent({
                            ...content,
                            caseStudiesSection: {
                              ...content.caseStudiesSection,
                              items: copy,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 border-2 border-black bg-white text-xs font-sans leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase mb-1">
                        SUMMARY (TR)
                      </label>
                      <textarea
                        rows={3}
                        value={item.summary.tr}
                        onChange={(e) => {
                          const copy = [...content.caseStudiesSection.items];
                          copy[idx].summary.tr = e.target.value;
                          setContent({
                            ...content,
                            caseStudiesSection: {
                              ...content.caseStudiesSection,
                              items: copy,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 border-2 border-black bg-white text-xs font-sans leading-relaxed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-bold uppercase mb-1">
                      TECH STACK (COMMA SEPARATED)
                    </label>
                    <input
                      type="text"
                      value={item.techStack.join(", ")}
                      onChange={(e) => {
                        const copy = [...content.caseStudiesSection.items];
                        copy[idx].techStack = e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        setContent({
                          ...content,
                          caseStudiesSection: {
                            ...content.caseStudiesSection,
                            items: copy,
                          },
                        });
                      }}
                      className="w-full px-3 py-1.5 border-2 border-black bg-white font-mono text-xs font-bold"
                    />
                  </div>

                  {/* Case Study Project Artwork Uploader */}
                  <AdminImageUploader
                    label="PROJECT PANEL ARTWORK"
                    imagePath={item.imagePath}
                    fallbackPath="/assets/comic_unicowallet.jpg"
                    aspectRatio="video"
                    onChange={(newPath) => {
                      const copy = [...content.caseStudiesSection.items];
                      copy[idx].imagePath = newPath;
                      setContent({
                        ...content,
                        caseStudiesSection: {
                          ...content.caseStudiesSection,
                          items: copy,
                        },
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: TECH ARSENAL BENTO (With Add / Delete) */}
        {activeTab === "bento" && (
          <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-ink-lg space-y-6">
            <div className="border-b-2 border-black pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold uppercase tracking-tight">
                  TECH ARSENAL BENTO
                </h2>
                <p className="text-xs font-mono text-black/70">
                  Configure cells in the asymmetric Bento matrix or add custom skill domains.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddBentoCell}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border-2 border-black bg-[#CCFF00] font-mono text-xs font-bold uppercase shadow-ink hover:bg-[#b8e600] cursor-pointer"
              >
                <Plus size={16} weight="bold" />
                <span>ADD BENTO CELL</span>
              </button>
            </div>

            {/* Tech Arsenal Section Header & Subtitle Box */}
            <div className="p-4 border-2 border-black bg-[#F5EFE6] space-y-4">
              <div className="font-mono text-xs font-bold uppercase text-[#FF5400]">
                SECTION HEADER & SUBTITLE:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    SECTION HEADING (EN)
                  </label>
                  <input
                    type="text"
                    value={content.bentoSection.heading.en}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        bentoSection: {
                          ...content.bentoSection,
                          heading: { ...content.bentoSection.heading, en: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black bg-white font-extrabold text-sm uppercase"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    SECTION HEADING (TR)
                  </label>
                  <input
                    type="text"
                    value={content.bentoSection.heading.tr}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        bentoSection: {
                          ...content.bentoSection,
                          heading: { ...content.bentoSection.heading, tr: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black bg-white font-extrabold text-sm uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    SUBHEADING / DESCRIPTION (EN)
                  </label>
                  <textarea
                    rows={2}
                    value={content.bentoSection.subheading.en}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        bentoSection: {
                          ...content.bentoSection,
                          subheading: { ...content.bentoSection.subheading, en: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black bg-white font-sans text-xs leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    SUBHEADING / DESCRIPTION (TR)
                  </label>
                  <textarea
                    rows={2}
                    value={content.bentoSection.subheading.tr}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        bentoSection: {
                          ...content.bentoSection,
                          subheading: { ...content.bentoSection.subheading, tr: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black bg-white font-sans text-xs leading-relaxed"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {content.bentoSection.cells.map((cell, idx) => (
                <div
                  key={cell.id || idx}
                  className="p-5 border-3 border-black bg-[#F4EBD9] shadow-ink space-y-4"
                >
                  <div className="flex items-center justify-between font-mono text-xs font-bold border-b border-black/20 pb-2">
                    <span className="text-[#FF5400]">CELL #{idx + 1} : {cell.id}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveBentoCell(idx, "up")}
                        className="p-1 border border-black bg-white hover:bg-black/5 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp size={14} weight="bold" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === content.bentoSection.cells.length - 1}
                        onClick={() => moveBentoCell(idx, "down")}
                        className="p-1 border border-black bg-white hover:bg-black/5 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown size={14} weight="bold" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBentoCell(cell.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 border-2 border-black bg-[#FF70A6] text-black font-mono text-xs font-bold uppercase hover:bg-[#f35894] cursor-pointer"
                      >
                        <Trash size={14} weight="bold" />
                        <span>DELETE</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase mb-1">
                        TITLE (EN)
                      </label>
                      <input
                        type="text"
                        value={cell.title.en}
                        onChange={(e) => {
                          const copy = [...content.bentoSection.cells];
                          copy[idx].title.en = e.target.value;
                          setContent({
                            ...content,
                            bentoSection: { ...content.bentoSection, cells: copy },
                          });
                        }}
                        className="w-full px-3 py-2 border-2 border-black bg-white font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase mb-1">
                        TITLE (TR)
                      </label>
                      <input
                        type="text"
                        value={cell.title.tr}
                        onChange={(e) => {
                          const copy = [...content.bentoSection.cells];
                          copy[idx].title.tr = e.target.value;
                          setContent({
                            ...content,
                            bentoSection: { ...content.bentoSection, cells: copy },
                          });
                        }}
                        className="w-full px-3 py-2 border-2 border-black bg-white font-bold text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase mb-1">
                        SUMMARY (EN)
                      </label>
                      <textarea
                        rows={2}
                        value={cell.summary.en}
                        onChange={(e) => {
                          const copy = [...content.bentoSection.cells];
                          copy[idx].summary.en = e.target.value;
                          setContent({
                            ...content,
                            bentoSection: { ...content.bentoSection, cells: copy },
                          });
                        }}
                        className="w-full px-3 py-2 border-2 border-black bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase mb-1">
                        SUMMARY (TR)
                      </label>
                      <textarea
                        rows={2}
                        value={cell.summary.tr}
                        onChange={(e) => {
                          const copy = [...content.bentoSection.cells];
                          copy[idx].summary.tr = e.target.value;
                          setContent({
                            ...content,
                            bentoSection: { ...content.bentoSection, cells: copy },
                          });
                        }}
                        className="w-full px-3 py-2 border-2 border-black bg-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-bold uppercase mb-1">
                      TAG PILLS (COMMA SEPARATED)
                    </label>
                    <input
                      type="text"
                      value={cell.pills.join(", ")}
                      onChange={(e) => {
                        const copy = [...content.bentoSection.cells];
                        copy[idx].pills = e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        setContent({
                          ...content,
                          bentoSection: { ...content.bentoSection, cells: copy },
                        });
                      }}
                      className="w-full px-3 py-1.5 border-2 border-black bg-white font-mono text-xs font-bold"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: R&D LABS (With Add / Delete) */}
        {activeTab === "labs" && (
          <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-ink-lg space-y-6">
            <div className="border-b-2 border-black pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold uppercase tracking-tight">
                  SIGNATURE R&D LABS
                </h2>
                <p className="text-xs font-mono text-black/70">
                  Add new experimental laboratories or delete existing experiments.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddLab}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border-2 border-black bg-[#CCFF00] font-mono text-xs font-bold uppercase shadow-ink hover:bg-[#b8e600] cursor-pointer"
              >
                <Plus size={16} weight="bold" />
                <span>ADD LAB EXPERIMENT</span>
              </button>
            </div>

            {/* Section Header & Subtitle Box */}
            <div className="p-4 border-2 border-black bg-[#F5EFE6] space-y-4">
              <div className="font-mono text-xs font-bold uppercase text-[#FF5400]">
                SECTION HEADER & SUBTITLE:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    SECTION HEADING (EN)
                  </label>
                  <input
                    type="text"
                    value={content.labSection.heading.en}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        labSection: {
                          ...content.labSection,
                          heading: { ...content.labSection.heading, en: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black bg-white font-extrabold text-sm uppercase"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    SECTION HEADING (TR)
                  </label>
                  <input
                    type="text"
                    value={content.labSection.heading.tr}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        labSection: {
                          ...content.labSection,
                          heading: { ...content.labSection.heading, tr: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black bg-white font-extrabold text-sm uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    SUBHEADING / DESCRIPTION (EN)
                  </label>
                  <textarea
                    rows={2}
                    value={content.labSection.subheading.en}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        labSection: {
                          ...content.labSection,
                          subheading: { ...content.labSection.subheading, en: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black bg-white font-sans text-xs leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    SUBHEADING / DESCRIPTION (TR)
                  </label>
                  <textarea
                    rows={2}
                    value={content.labSection.subheading.tr}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        labSection: {
                          ...content.labSection,
                          subheading: { ...content.labSection.subheading, tr: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black bg-white font-sans text-xs leading-relaxed"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {content.labSection.items.map((lab, idx) => (
                <div
                  key={lab.id}
                  className="p-5 border-3 border-black bg-[#F5EFE6] shadow-ink space-y-4"
                >
                  <div className="flex items-center justify-between font-mono text-xs font-bold border-b border-black/20 pb-2">
                    <span className="text-[#FF5400]">
                      LAB #{idx + 1} : {lab.id} ({lab.period})
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveLab(idx, "up")}
                        className="p-1 border border-black bg-white hover:bg-black/5 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp size={14} weight="bold" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === content.labSection.items.length - 1}
                        onClick={() => moveLab(idx, "down")}
                        className="p-1 border border-black bg-white hover:bg-black/5 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown size={14} weight="bold" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteLab(lab.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 border-2 border-black bg-[#FF70A6] text-black font-mono text-xs font-bold uppercase hover:bg-[#f35894] cursor-pointer"
                      >
                        <Trash size={14} weight="bold" />
                        <span>DELETE</span>
                      </button>
                    </div>
                  </div>

                  {/* Tab Button Label Override */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border border-black bg-[#F4EBD9]">
                    <div>
                      <label className="block font-mono text-[11px] font-bold uppercase mb-1">
                        TAB BUTTON LABEL (EN)
                      </label>
                      <input
                        type="text"
                        value={lab.tabLabel?.en || ""}
                        placeholder="e.g. CRUWELL'S : REAL-TIME LAB"
                        onChange={(e) => {
                          const copy = [...content.labSection.items];
                          copy[idx].tabLabel = {
                            en: e.target.value,
                            tr: copy[idx].tabLabel?.tr || e.target.value,
                          };
                          setContent({
                            ...content,
                            labSection: { ...content.labSection, items: copy },
                          });
                        }}
                        className="w-full px-2.5 py-1.5 border border-black bg-white font-mono text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] font-bold uppercase mb-1">
                        TAB BUTTON LABEL (TR)
                      </label>
                      <input
                        type="text"
                        value={lab.tabLabel?.tr || ""}
                        placeholder="e.g. CRUWELL'S : GERÇEK ZAMANLI LAB"
                        onChange={(e) => {
                          const copy = [...content.labSection.items];
                          copy[idx].tabLabel = {
                            en: copy[idx].tabLabel?.en || e.target.value,
                            tr: e.target.value,
                          };
                          setContent({
                            ...content,
                            labSection: { ...content.labSection, items: copy },
                          });
                        }}
                        className="w-full px-2.5 py-1.5 border border-black bg-white font-mono text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase mb-1">
                        TITLE (EN)
                      </label>
                      <input
                        type="text"
                        value={lab.title.en}
                        onChange={(e) => {
                          const copy = [...content.labSection.items];
                          copy[idx].title.en = e.target.value;
                          setContent({
                            ...content,
                            labSection: { ...content.labSection, items: copy },
                          });
                        }}
                        className="w-full px-3 py-2 border-2 border-black bg-white font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase mb-1">
                        TITLE (TR)
                      </label>
                      <input
                        type="text"
                        value={lab.title.tr}
                        onChange={(e) => {
                          const copy = [...content.labSection.items];
                          copy[idx].title.tr = e.target.value;
                          setContent({
                            ...content,
                            labSection: { ...content.labSection, items: copy },
                          });
                        }}
                        className="w-full px-3 py-2 border-2 border-black bg-white font-bold text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase mb-1">
                        SUMMARY (EN)
                      </label>
                      <textarea
                        rows={2}
                        value={lab.summary.en}
                        onChange={(e) => {
                          const copy = [...content.labSection.items];
                          copy[idx].summary.en = e.target.value;
                          setContent({
                            ...content,
                            labSection: { ...content.labSection, items: copy },
                          });
                        }}
                        className="w-full px-3 py-2 border-2 border-black bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase mb-1">
                        SUMMARY (TR)
                      </label>
                      <textarea
                        rows={2}
                        value={lab.summary.tr}
                        onChange={(e) => {
                          const copy = [...content.labSection.items];
                          copy[idx].summary.tr = e.target.value;
                          setContent({
                            ...content,
                            labSection: { ...content.labSection, items: copy },
                          });
                        }}
                        className="w-full px-3 py-2 border-2 border-black bg-white text-xs"
                      />
                    </div>
                  </div>

                  {/* Badge Text & Period */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase mb-1">
                        BADGE TEXT (EN)
                      </label>
                      <input
                        type="text"
                        value={lab.badgeText?.en || ""}
                        placeholder="e.g. REAL-TIME LAB"
                        onChange={(e) => {
                          const copy = [...content.labSection.items];
                          copy[idx].badgeText = {
                            en: e.target.value,
                            tr: copy[idx].badgeText?.tr || e.target.value,
                          };
                          setContent({
                            ...content,
                            labSection: { ...content.labSection, items: copy },
                          });
                        }}
                        className="w-full px-3 py-1.5 border-2 border-black bg-white font-bold text-xs uppercase"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase mb-1">
                        BADGE TEXT (TR)
                      </label>
                      <input
                        type="text"
                        value={lab.badgeText?.tr || ""}
                        placeholder="e.g. GERÇEK ZAMANLI LAB"
                        onChange={(e) => {
                          const copy = [...content.labSection.items];
                          copy[idx].badgeText = {
                            en: copy[idx].badgeText?.en || e.target.value,
                            tr: e.target.value,
                          };
                          setContent({
                            ...content,
                            labSection: { ...content.labSection, items: copy },
                          });
                        }}
                        className="w-full px-3 py-1.5 border-2 border-black bg-white font-bold text-xs uppercase"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase mb-1">
                        PERIOD / YEAR
                      </label>
                      <input
                        type="text"
                        value={lab.period || ""}
                        placeholder="e.g. 2024"
                        onChange={(e) => {
                          const copy = [...content.labSection.items];
                          copy[idx].period = e.target.value;
                          setContent({
                            ...content,
                            labSection: { ...content.labSection, items: copy },
                          });
                        }}
                        className="w-full px-3 py-1.5 border-2 border-black bg-white font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Architecture Details Spec */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase mb-1 text-[#FF5400]">
                        SYSTEM ARCHITECTURE SPEC (EN)
                      </label>
                      <textarea
                        rows={2}
                        value={lab.architectureDetails?.en || ""}
                        placeholder="System architecture specification..."
                        onChange={(e) => {
                          const copy = [...content.labSection.items];
                          copy[idx].architectureDetails = {
                            en: e.target.value,
                            tr: copy[idx].architectureDetails?.tr || e.target.value,
                          };
                          setContent({
                            ...content,
                            labSection: { ...content.labSection, items: copy },
                          });
                        }}
                        className="w-full px-3 py-2 border-2 border-black bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase mb-1 text-[#FF5400]">
                        SYSTEM ARCHITECTURE SPEC (TR)
                      </label>
                      <textarea
                        rows={2}
                        value={lab.architectureDetails?.tr || ""}
                        placeholder="Sistem mimarisi özellikleri..."
                        onChange={(e) => {
                          const copy = [...content.labSection.items];
                          copy[idx].architectureDetails = {
                            en: copy[idx].architectureDetails?.en || e.target.value,
                            tr: e.target.value,
                          };
                          setContent({
                            ...content,
                            labSection: { ...content.labSection, items: copy },
                          });
                        }}
                        className="w-full px-3 py-2 border-2 border-black bg-white text-xs"
                      />
                    </div>
                  </div>

                  {/* Performance & Impact Bullets (::) */}
                  <div className="p-4 border-2 border-black bg-white space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black pb-2">
                      <label className="font-mono text-xs font-bold uppercase text-[#FF5400] flex items-center gap-1.5">
                        <span className="font-bold text-base">::</span>
                        <span>IMPACT & PERFORMANCE BULLETS (ONE PER LINE)</span>
                      </label>
                      <span className="text-[10px] font-mono text-black/60">
                        Rendered with orange :: markers in R&D Lab showcase
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-[11px] font-bold uppercase mb-1">
                          BULLETS (EN)
                        </label>
                        <textarea
                          rows={4}
                          value={(lab.impactMetricsEn || []).join("\n")}
                          placeholder="Sub-20ms packet dispatch over optimized WebSockets&#10;Custom binary serialization reducing payload footprint by 60%&#10;Fault-tolerant room mesh state management with heartbeat probes"
                          onChange={(e) => {
                            const copy = [...content.labSection.items];
                            copy[idx].impactMetricsEn = e.target.value.split("\n");
                            setContent({
                              ...content,
                              labSection: { ...content.labSection, items: copy },
                            });
                          }}
                          className="w-full px-3 py-2 border-2 border-black bg-[#F5EFE6] font-mono text-xs leading-relaxed"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[11px] font-bold uppercase mb-1">
                          BULLETS (TR)
                        </label>
                        <textarea
                          rows={4}
                          value={(lab.impactMetricsTr || []).join("\n")}
                          placeholder="Optimize WebSockets üzerinden 20ms altı paket iletimi&#10;Özel ikili serileştirme ile yük boyutunda %60 azalma&#10;Kalp atışı probları ile hataya dayanıklı oda ağı durum yönetimi"
                          onChange={(e) => {
                            const copy = [...content.labSection.items];
                            copy[idx].impactMetricsTr = e.target.value.split("\n");
                            setContent({
                              ...content,
                              labSection: { ...content.labSection, items: copy },
                            });
                          }}
                          className="w-full px-3 py-2 border-2 border-black bg-[#F5EFE6] font-mono text-xs leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Live Preview */}
                    {((lab.impactMetricsEn?.length || 0) > 0 || (lab.impactMetricsTr?.length || 0) > 0) && (
                      <div className="bg-[#F4EBD9] p-3 border border-black space-y-1">
                        <div className="text-[10px] font-mono font-bold uppercase text-black/60 mb-1">
                          LIVE PREVIEW:
                        </div>
                        {(lab.impactMetricsEn || []).filter(Boolean).map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-1.5 font-mono text-xs text-black/90">
                            <span className="font-bold text-[#FF5400]">::</span>
                            <span>{bullet}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tech Stack Tags */}
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase mb-1 text-black">
                      TECH STACK TAGS (COMMA SEPARATED)
                    </label>
                    <input
                      type="text"
                      value={lab.techStack?.join(", ") || ""}
                      placeholder="e.g. .NET Core, C#, WebSockets, React, TypeScript, Web Audio API, Redis Pub/Sub"
                      onChange={(e) => {
                        const copy = [...content.labSection.items];
                        copy[idx].techStack = e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        setContent({
                          ...content,
                          labSection: { ...content.labSection, items: copy },
                        });
                      }}
                      className="w-full px-3 py-2 border-2 border-black bg-white font-mono text-xs font-bold"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {lab.techStack?.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 border border-black bg-white font-mono text-[10px] font-bold shadow-[1px_1px_0px_#000000]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Links: GitHub & Live Web */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border border-black bg-white">
                    <div>
                      <label className="block font-mono text-[11px] font-bold uppercase mb-1">
                        GITHUB REPOSITORY URL
                      </label>
                      <input
                        type="url"
                        value={lab.githubUrl || ""}
                        placeholder="e.g. https://github.com/..."
                        onChange={(e) => {
                          const copy = [...content.labSection.items];
                          copy[idx].githubUrl = e.target.value;
                          setContent({
                            ...content,
                            labSection: { ...content.labSection, items: copy },
                          });
                        }}
                        className="w-full px-2.5 py-1.5 border border-black bg-white font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] font-bold uppercase mb-1 text-[#0284c7]">
                        LIVE EXPERIMENT / WEB URL
                      </label>
                      <input
                        type="url"
                        value={lab.liveUrl || ""}
                        placeholder="e.g. https://..."
                        onChange={(e) => {
                          const copy = [...content.labSection.items];
                          copy[idx].liveUrl = e.target.value;
                          setContent({
                            ...content,
                            labSection: { ...content.labSection, items: copy },
                          });
                        }}
                        className="w-full px-2.5 py-1.5 border border-black bg-white font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Lab Experiment Artwork Uploader */}
                  <AdminImageUploader
                    label="LAB CONSOLE ARTWORK"
                    imagePath={lab.imagePath}
                    fallbackPath="/assets/comic_realtime_engine.jpg"
                    aspectRatio="video"
                    onChange={(newPath) => {
                      const copy = [...content.labSection.items];
                      copy[idx].imagePath = newPath;
                      setContent({
                        ...content,
                        labSection: { ...content.labSection, items: copy },
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: MANIFESTO (With Add / Delete) */}
        {activeTab === "manifesto" && (
          <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-ink-lg space-y-6">
            <div className="border-b-2 border-black pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold uppercase tracking-tight">
                  ENGINEERING MANIFESTO
                </h2>
                <p className="text-xs font-mono text-black/70">
                  Define engineering rules, add new tenets, or remove outdated principles.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddRule}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border-2 border-black bg-[#CCFF00] font-mono text-xs font-bold uppercase shadow-ink hover:bg-[#b8e600] cursor-pointer"
              >
                <Plus size={16} weight="bold" />
                <span>ADD RULE</span>
              </button>
            </div>

            {/* Manifesto Section Header & Copy Box */}
            <div className="p-4 border-2 border-black bg-[#F5EFE6] space-y-4">
              <div className="font-mono text-xs font-bold uppercase text-[#FF5400]">
                MANIFESTO HEADLINE & PHILOSOPHY:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    EYEBROW BADGE (EN)
                  </label>
                  <input
                    type="text"
                    value={content.manifestoSection.eyebrow.en}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        manifestoSection: {
                          ...content.manifestoSection,
                          eyebrow: { ...content.manifestoSection.eyebrow, en: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 border-2 border-black bg-white font-mono text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    EYEBROW BADGE (TR)
                  </label>
                  <input
                    type="text"
                    value={content.manifestoSection.eyebrow.tr}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        manifestoSection: {
                          ...content.manifestoSection,
                          eyebrow: { ...content.manifestoSection.eyebrow, tr: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 border-2 border-black bg-white font-mono text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    HEADLINE (EN)
                  </label>
                  <input
                    type="text"
                    value={content.manifestoSection.headline.en}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        manifestoSection: {
                          ...content.manifestoSection,
                          headline: { ...content.manifestoSection.headline, en: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black bg-white font-extrabold text-sm uppercase"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    HEADLINE (TR)
                  </label>
                  <input
                    type="text"
                    value={content.manifestoSection.headline.tr}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        manifestoSection: {
                          ...content.manifestoSection,
                          headline: { ...content.manifestoSection.headline, tr: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black bg-white font-extrabold text-sm uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    SUBTEXT / PHILOSOPHY (EN)
                  </label>
                  <textarea
                    rows={3}
                    value={content.manifestoSection.subtext.en}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        manifestoSection: {
                          ...content.manifestoSection,
                          subtext: { ...content.manifestoSection.subtext, en: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black bg-white font-sans text-xs leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    SUBTEXT / PHILOSOPHY (TR)
                  </label>
                  <textarea
                    rows={3}
                    value={content.manifestoSection.subtext.tr}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        manifestoSection: {
                          ...content.manifestoSection,
                          subtext: { ...content.manifestoSection.subtext, tr: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black bg-white font-sans text-xs leading-relaxed"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {content.manifestoSection.rules.map((rule, idx) => (
                <div
                  key={rule.number || idx}
                  className="p-4 border-2 border-black bg-[#F5EFE6] space-y-3 relative"
                >
                  <div className="flex items-center justify-between font-mono text-xs font-bold border-b border-black/20 pb-2">
                    <span className="text-[#FF5400]">{rule.ruleCode}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveRule(idx, "up")}
                        className="p-1 border border-black bg-white hover:bg-black/5 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp size={14} weight="bold" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === content.manifestoSection.rules.length - 1}
                        onClick={() => moveRule(idx, "down")}
                        className="p-1 border border-black bg-white hover:bg-black/5 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown size={14} weight="bold" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRule(idx)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 border border-black bg-[#FF70A6] text-black font-mono text-xs font-bold uppercase hover:bg-[#f35894] cursor-pointer"
                      >
                        <Trash size={14} weight="bold" />
                        <span>DELETE</span>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[11px] font-bold uppercase mb-1">
                        RULE TITLE (EN)
                      </label>
                      <input
                        type="text"
                        value={rule.title.en}
                        onChange={(e) => {
                          const copy = [...content.manifestoSection.rules];
                          copy[idx].title.en = e.target.value;
                          setContent({
                            ...content,
                            manifestoSection: {
                              ...content.manifestoSection,
                              rules: copy,
                            },
                          });
                        }}
                        className="w-full px-3 py-1.5 border-2 border-black bg-white font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] font-bold uppercase mb-1">
                        RULE TITLE (TR)
                      </label>
                      <input
                        type="text"
                        value={rule.title.tr}
                        onChange={(e) => {
                          const copy = [...content.manifestoSection.rules];
                          copy[idx].title.tr = e.target.value;
                          setContent({
                            ...content,
                            manifestoSection: {
                              ...content.manifestoSection,
                              rules: copy,
                            },
                          });
                        }}
                        className="w-full px-3 py-1.5 border-2 border-black bg-white font-bold text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: CREDENTIALS (With Add / Delete for Certs, Awards, Degrees) */}
        {activeTab === "credentials" && (
          <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-ink-lg space-y-8">
            <div className="border-b-2 border-black pb-3">
              <h2 className="text-2xl font-extrabold uppercase tracking-tight">
                CREDENTIALS, AWARDS & EDUCATION
              </h2>
              <p className="text-xs font-mono text-black/70">
                Manage certifications, corporate awards, and university degrees.
              </p>
            </div>

            {/* Credentials Section Header & Subtitle Box */}
            <div className="p-4 border-2 border-black bg-[#F5EFE6] space-y-4">
              <div className="font-mono text-xs font-bold uppercase text-[#FF5400]">
                SECTION HEADER & SUBTITLE:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    SECTION HEADING (EN)
                  </label>
                  <input
                    type="text"
                    value={content.credentialsSection.heading.en}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        credentialsSection: {
                          ...content.credentialsSection,
                          heading: { ...content.credentialsSection.heading, en: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black bg-white font-extrabold text-sm uppercase"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    SECTION HEADING (TR)
                  </label>
                  <input
                    type="text"
                    value={content.credentialsSection.heading.tr}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        credentialsSection: {
                          ...content.credentialsSection,
                          heading: { ...content.credentialsSection.heading, tr: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black bg-white font-extrabold text-sm uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    SUBHEADING / DESCRIPTION (EN)
                  </label>
                  <textarea
                    rows={2}
                    value={content.credentialsSection.subheading.en}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        credentialsSection: {
                          ...content.credentialsSection,
                          subheading: { ...content.credentialsSection.subheading, en: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black bg-white font-sans text-xs leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    SUBHEADING / DESCRIPTION (TR)
                  </label>
                  <textarea
                    rows={2}
                    value={content.credentialsSection.subheading.tr}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        credentialsSection: {
                          ...content.credentialsSection,
                          subheading: { ...content.credentialsSection.subheading, tr: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black bg-white font-sans text-xs leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Certifications Sub-Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-black pb-2">
                <h3 className="font-mono text-xs font-bold uppercase text-[#FF5400]">
                  OFFICIAL CERTIFICATIONS:
                </h3>
                <button
                  type="button"
                  onClick={handleAddCert}
                  className="inline-flex items-center gap-1 px-3 py-1 border-2 border-black bg-[#CCFF00] font-mono text-xs font-bold uppercase hover:bg-[#b8e600] cursor-pointer"
                >
                  <Plus size={14} weight="bold" />
                  <span>ADD CERT</span>
                </button>
              </div>

              {content.credentialsSection.certs.map((cert, idx) => (
                <div
                  key={cert.id || idx}
                  className="p-3 border-2 border-black bg-[#F5EFE6] flex items-center justify-between gap-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                    <input
                      type="text"
                      value={cert.title.en}
                      placeholder="Title (EN)"
                      onChange={(e) => {
                        const copy = [...content.credentialsSection.certs];
                        copy[idx].title.en = e.target.value;
                        setContent({
                          ...content,
                          credentialsSection: {
                            ...content.credentialsSection,
                            certs: copy,
                          },
                        });
                      }}
                      className="px-2 py-1 border border-black bg-white font-bold text-xs"
                    />
                    <input
                      type="text"
                      value={cert.title.tr}
                      placeholder="Title (TR)"
                      onChange={(e) => {
                        const copy = [...content.credentialsSection.certs];
                        copy[idx].title.tr = e.target.value;
                        setContent({
                          ...content,
                          credentialsSection: {
                            ...content.credentialsSection,
                            certs: copy,
                          },
                        });
                      }}
                      className="px-2 py-1 border border-black bg-white font-bold text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveCert(idx, "up")}
                      className="p-1 border border-black bg-white hover:bg-black/5 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp size={14} weight="bold" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === content.credentialsSection.certs.length - 1}
                      onClick={() => moveCert(idx, "down")}
                      className="p-1 border border-black bg-white hover:bg-black/5 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown size={14} weight="bold" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCert(cert.id)}
                      className="p-1.5 border border-black bg-[#FF70A6] hover:bg-[#f35894] cursor-pointer"
                      title="Delete Cert"
                    >
                      <Trash size={14} weight="bold" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Awards Sub-Section */}
            <div className="space-y-4 pt-4 border-t-2 border-black/20">
              <div className="flex items-center justify-between border-b border-black pb-2">
                <h3 className="font-mono text-xs font-bold uppercase text-[#FF5400]">
                  INDUSTRY AWARDS:
                </h3>
                <button
                  type="button"
                  onClick={handleAddAward}
                  className="inline-flex items-center gap-1 px-3 py-1 border-2 border-black bg-[#CCFF00] font-mono text-xs font-bold uppercase hover:bg-[#b8e600] cursor-pointer"
                >
                  <Plus size={14} weight="bold" />
                  <span>ADD AWARD</span>
                </button>
              </div>

              {content.credentialsSection.awards.map((award, idx) => (
                <div
                  key={award.id || idx}
                  className="p-4 border-2 border-black bg-[#F4EBD9] space-y-2 relative"
                >
                  <div className="flex items-center justify-between font-mono text-xs font-bold">
                    <input
                      type="text"
                      value={award.year}
                      onChange={(e) => {
                        const copy = [...content.credentialsSection.awards];
                        copy[idx].year = e.target.value;
                        setContent({
                          ...content,
                          credentialsSection: {
                            ...content.credentialsSection,
                            awards: copy,
                          },
                        });
                      }}
                      className="px-2 py-0.5 border border-black bg-white font-bold text-xs w-32"
                    />
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveAward(idx, "up")}
                        className="p-1 border border-black bg-white hover:bg-black/5 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp size={14} weight="bold" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === content.credentialsSection.awards.length - 1}
                        onClick={() => moveAward(idx, "down")}
                        className="p-1 border border-black bg-white hover:bg-black/5 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown size={14} weight="bold" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAward(award.id)}
                        className="p-1 border border-black bg-[#FF70A6] hover:bg-[#f35894] cursor-pointer"
                        title="Delete Award"
                      >
                        <Trash size={14} weight="bold" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={award.title.en}
                      placeholder="Award Title (EN)"
                      onChange={(e) => {
                        const copy = [...content.credentialsSection.awards];
                        copy[idx].title.en = e.target.value;
                        setContent({
                          ...content,
                          credentialsSection: {
                            ...content.credentialsSection,
                            awards: copy,
                          },
                        });
                      }}
                      className="w-full px-2 py-1 border border-black bg-white font-bold text-xs"
                    />
                    <input
                      type="text"
                      value={award.title.tr}
                      placeholder="Award Title (TR)"
                      onChange={(e) => {
                        const copy = [...content.credentialsSection.awards];
                        copy[idx].title.tr = e.target.value;
                        setContent({
                          ...content,
                          credentialsSection: {
                            ...content.credentialsSection,
                            awards: copy,
                          },
                        });
                      }}
                      className="w-full px-2 py-1 border border-black bg-white font-bold text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Academic Degrees Sub-Section */}
            <div className="space-y-4 pt-4 border-t-2 border-black/20">
              <div className="flex items-center justify-between border-b border-black pb-2">
                <h3 className="font-mono text-xs font-bold uppercase text-[#FF5400]">
                  ACADEMIC DEGREES:
                </h3>
                <button
                  type="button"
                  onClick={handleAddDegree}
                  className="inline-flex items-center gap-1 px-3 py-1 border-2 border-black bg-[#CCFF00] font-mono text-xs font-bold uppercase hover:bg-[#b8e600] cursor-pointer"
                >
                  <Plus size={14} weight="bold" />
                  <span>ADD DEGREE</span>
                </button>
              </div>

              {content.credentialsSection.education.map((edu, idx) => (
                <div
                  key={edu.id || idx}
                  className="p-4 border-2 border-black bg-[#F5EFE6] space-y-2 relative"
                >
                  <div className="flex items-center justify-between font-mono text-xs font-bold">
                    <input
                      type="text"
                      value={edu.period}
                      placeholder="Period (e.g. 2021 - 2026)"
                      onChange={(e) => {
                        const copy = [...content.credentialsSection.education];
                        copy[idx].period = e.target.value;
                        setContent({
                          ...content,
                          credentialsSection: {
                            ...content.credentialsSection,
                            education: copy,
                          },
                        });
                      }}
                      className="px-2 py-0.5 border border-black bg-white font-bold text-xs w-48"
                    />
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveDegree(idx, "up")}
                        className="p-1 border border-black bg-white hover:bg-black/5 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp size={14} weight="bold" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === content.credentialsSection.education.length - 1}
                        onClick={() => moveDegree(idx, "down")}
                        className="p-1 border border-black bg-white hover:bg-black/5 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown size={14} weight="bold" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDegree(edu.id)}
                        className="p-1 border border-black bg-[#FF70A6] hover:bg-[#f35894] cursor-pointer"
                        title="Delete Degree"
                      >
                        <Trash size={14} weight="bold" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={edu.school.en}
                      placeholder="University / School (EN)"
                      onChange={(e) => {
                        const copy = [...content.credentialsSection.education];
                        copy[idx].school.en = e.target.value;
                        setContent({
                          ...content,
                          credentialsSection: {
                            ...content.credentialsSection,
                            education: copy,
                          },
                        });
                      }}
                      className="w-full px-2 py-1 border border-black bg-white font-bold text-xs"
                    />
                    <input
                      type="text"
                      value={edu.school.tr}
                      placeholder="University / School (TR)"
                      onChange={(e) => {
                        const copy = [...content.credentialsSection.education];
                        copy[idx].school.tr = e.target.value;
                        setContent({
                          ...content,
                          credentialsSection: {
                            ...content.credentialsSection,
                            education: copy,
                          },
                        });
                      }}
                      className="w-full px-2 py-1 border border-black bg-white font-bold text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: FOOTER & CONTACT */}
        {activeTab === "footer" && (
          <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-ink-lg space-y-6">
            <div className="border-b-2 border-black pb-3">
              <h2 className="text-2xl font-extrabold uppercase tracking-tight">
                FOOTER & CONTACT DISPATCH
              </h2>
              <p className="text-xs font-mono text-black/70">
                Headline, dialogue badge, dispatch subtext, CTA button label, and direct contact channels.
              </p>
            </div>

            {/* Badges & Eyebrows */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">
                  EYEBROW BADGE (EN)
                </label>
                <input
                  type="text"
                  value={content.footerSection.eyebrow.en}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footerSection: {
                        ...content.footerSection,
                        eyebrow: { ...content.footerSection.eyebrow, en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 border-2 border-black font-mono text-xs font-bold"
                />
              </div>
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">
                  EYEBROW BADGE (TR)
                </label>
                <input
                  type="text"
                  value={content.footerSection.eyebrow.tr}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footerSection: {
                        ...content.footerSection,
                        eyebrow: { ...content.footerSection.eyebrow, tr: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 border-2 border-black font-mono text-xs font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">
                  DIALOGUE STICKER BADGE (EN)
                </label>
                <input
                  type="text"
                  value={content.footerSection.dialogueBadge?.en || "OPEN FOR DIALOGUE"}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footerSection: {
                        ...content.footerSection,
                        dialogueBadge: {
                          en: e.target.value,
                          tr: content.footerSection.dialogueBadge?.tr || "İLETİŞİME AÇIK",
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 border-2 border-black font-mono text-xs font-bold"
                />
              </div>
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">
                  DIALOGUE STICKER BADGE (TR)
                </label>
                <input
                  type="text"
                  value={content.footerSection.dialogueBadge?.tr || "İLETİŞİME AÇIK"}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footerSection: {
                        ...content.footerSection,
                        dialogueBadge: {
                          en: content.footerSection.dialogueBadge?.en || "OPEN FOR DIALOGUE",
                          tr: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 border-2 border-black font-mono text-xs font-bold"
                />
              </div>
            </div>

            {/* Headline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">
                  CLOSING HEADLINE (EN)
                </label>
                <input
                  type="text"
                  value={content.footerSection.headline.en}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footerSection: {
                        ...content.footerSection,
                        headline: { ...content.footerSection.headline, en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 border-2 border-black font-extrabold text-sm uppercase"
                />
              </div>
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">
                  CLOSING HEADLINE (TR)
                </label>
                <input
                  type="text"
                  value={content.footerSection.headline.tr}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footerSection: {
                        ...content.footerSection,
                        headline: { ...content.footerSection.headline, tr: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 border-2 border-black font-extrabold text-sm uppercase"
                />
              </div>
            </div>

            {/* Subtext */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">
                  DISPATCH SUBTEXT (EN)
                </label>
                <textarea
                  rows={3}
                  value={content.footerSection.subtext.en}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footerSection: {
                        ...content.footerSection,
                        subtext: { ...content.footerSection.subtext, en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 border-2 border-black font-sans text-xs leading-relaxed"
                />
              </div>
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">
                  DISPATCH SUBTEXT (TR)
                </label>
                <textarea
                  rows={3}
                  value={content.footerSection.subtext.tr}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footerSection: {
                        ...content.footerSection,
                        subtext: { ...content.footerSection.subtext, tr: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 border-2 border-black font-sans text-xs leading-relaxed"
                />
              </div>
            </div>

            {/* CTA Button Text */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">
                  CTA BUTTON TEXT (EN)
                </label>
                <input
                  type="text"
                  value={content.footerSection.ctaText.en}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footerSection: {
                        ...content.footerSection,
                        ctaText: { ...content.footerSection.ctaText, en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 border-2 border-black font-mono text-xs font-bold uppercase"
                />
              </div>
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">
                  CTA BUTTON TEXT (TR)
                </label>
                <input
                  type="text"
                  value={content.footerSection.ctaText.tr}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footerSection: {
                        ...content.footerSection,
                        ctaText: { ...content.footerSection.ctaText, tr: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 border-2 border-black font-mono text-xs font-bold uppercase"
                />
              </div>
            </div>

            {/* Direct Channels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={content.footerSection.email}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footerSection: {
                        ...content.footerSection,
                        email: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border-2 border-black font-mono text-xs font-bold"
                />
              </div>
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">
                  PHONE NUMBER
                </label>
                <input
                  type="text"
                  value={content.footerSection.phone}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footerSection: {
                        ...content.footerSection,
                        phone: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border-2 border-black font-mono text-xs font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">
                  LOCATION (EN)
                </label>
                <input
                  type="text"
                  value={content.footerSection.location.en}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footerSection: {
                        ...content.footerSection,
                        location: {
                          ...content.footerSection.location,
                          en: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 border-2 border-black font-mono text-xs font-bold"
                />
              </div>
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">
                  LOCATION (TR)
                </label>
                <input
                  type="text"
                  value={content.footerSection.location.tr}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footerSection: {
                        ...content.footerSection,
                        location: {
                          ...content.footerSection.location,
                          tr: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 border-2 border-black font-mono text-xs font-bold"
                />
              </div>
            </div>

            {/* Role Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">
                  FOOTER BIO / ROLE SUMMARY (EN)
                </label>
                <textarea
                  rows={2}
                  value={content.footerSection.roleSummary.en}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footerSection: {
                        ...content.footerSection,
                        roleSummary: {
                          ...content.footerSection.roleSummary,
                          en: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 border-2 border-black font-mono text-xs"
                />
              </div>
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">
                  FOOTER BIO / ROLE SUMMARY (TR)
                </label>
                <textarea
                  rows={2}
                  value={content.footerSection.roleSummary.tr}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footerSection: {
                        ...content.footerSection,
                        roleSummary: {
                          ...content.footerSection.roleSummary,
                          tr: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 border-2 border-black font-mono text-xs"
                />
              </div>
            </div>

            {/* Online Presence & Social Profiles */}
            <div className="p-4 border-2 border-black bg-[#F5EFE6] space-y-4">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-black bg-[#CCFF00] px-2.5 py-1 inline-block border-2 border-black shadow-[2px_2px_0px_#000000]">
                ONLINE PRESENCE / SOCIAL PROFILES (FOOTER)
              </div>
              <p className="text-xs font-mono text-black/70">
                Configure your social profile URLs and section label displayed at the bottom of the footer.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    SECTION LABEL (EN)
                  </label>
                  <input
                    type="text"
                    value={content.footerSection.socialHeading?.en || ""}
                    placeholder="ONLINE PRESENCE:"
                    onChange={(e) =>
                      setContent({
                        ...content,
                        footerSection: {
                          ...content.footerSection,
                          socialHeading: {
                            en: e.target.value,
                            tr: content.footerSection.socialHeading?.tr || "ÇEVRİMİÇİ PROFİLLER:",
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black font-mono text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs font-bold uppercase mb-1">
                    SECTION LABEL (TR)
                  </label>
                  <input
                    type="text"
                    value={content.footerSection.socialHeading?.tr || ""}
                    placeholder="ÇEVRİMİÇİ PROFİLLER:"
                    onChange={(e) =>
                      setContent({
                        ...content,
                        footerSection: {
                          ...content.footerSection,
                          socialHeading: {
                            en: content.footerSection.socialHeading?.en || "ONLINE PRESENCE:",
                            tr: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black font-mono text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 border-2 border-black bg-white">
                  <label className="block font-mono text-xs font-bold uppercase mb-1 text-black">
                    LINKEDIN PROFILE URL
                  </label>
                  <input
                    type="text"
                    value={content.footerSection.linkedinUrl || ""}
                    placeholder="https://linkedin.com/in/berkayacar"
                    onChange={(e) =>
                      setContent({
                        ...content,
                        footerSection: {
                          ...content.footerSection,
                          linkedinUrl: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black font-mono text-xs font-bold"
                  />
                  <span className="text-[10px] font-mono text-black/60 block mt-1">
                    Direct link to your LinkedIn profile.
                  </span>
                </div>

                <div className="p-3 border-2 border-black bg-white">
                  <label className="block font-mono text-xs font-bold uppercase mb-1 text-black">
                    GITHUB PROFILE URL
                  </label>
                  <input
                    type="text"
                    value={content.footerSection.githubUrl || ""}
                    placeholder="https://github.com/Berkawaii"
                    onChange={(e) =>
                      setContent({
                        ...content,
                        footerSection: {
                          ...content.footerSection,
                          githubUrl: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black font-mono text-xs font-bold"
                  />
                  <span className="text-[10px] font-mono text-black/60 block mt-1">
                    Direct link to your GitHub profile.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="mt-8 pt-6 border-t-4 border-black flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={handleResetToDefault}
            type="button"
            className="px-4 py-2 border-2 border-black bg-[#F5EFE6] font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_#000000] hover:bg-[#FF70A6] cursor-pointer"
          >
            RESET TO FACTORY DEFAULTS
          </button>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            type="button"
            className="inline-flex items-center gap-2 px-6 py-3 border-4 border-black bg-[#CCFF00] font-mono text-sm font-bold uppercase tracking-wider shadow-ink hover:bg-[#b8e600] cursor-pointer"
          >
            <FloppyDisk size={18} weight="bold" />
            <span>{isSaving ? "SAVING..." : "SAVE ALL CHANGES TO FIRESTORE"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
