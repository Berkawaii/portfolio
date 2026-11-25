import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  Firestore,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  Auth,
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  FirebaseStorage,
} from "firebase/storage";

export interface LocalizedString {
  en: string;
  tr: string;
}

export interface MetricItem {
  id: string;
  value: string;
  label: LocalizedString;
  detail: LocalizedString;
  bgColor: string;
}

export interface CaseStudyItem {
  id: string;
  title: LocalizedString;
  category: LocalizedString;
  client: LocalizedString;
  period: string;
  role: LocalizedString;
  summary: LocalizedString;
  problem?: LocalizedString;
  approach?: LocalizedString;
  tradeoffs?: LocalizedString;
  impactMetricsEn: string[];
  impactMetricsTr: string[];
  techStack: string[];
  badgeText: LocalizedString;
  badgeColor: "orange" | "pink" | "blue" | "lime";
  architectureDetails: LocalizedString;
  imagePath?: string;
}

export interface BentoCellItem {
  id: string;
  title: LocalizedString;
  summary: LocalizedString;
  tag: LocalizedString;
  pills: string[];
  bgColor: string;
  textColor: string;
  colSpanDesktop: number;
}

export interface LabItem {
  id: string;
  title: LocalizedString;
  badgeText: LocalizedString;
  tabLabel?: LocalizedString;
  period: string;
  summary: LocalizedString;
  architectureDetails: LocalizedString;
  impactMetricsEn: string[];
  impactMetricsTr: string[];
  techStack: string[];
  imagePath?: string;
  githubUrl?: string;
  liveUrl?: string;
}

export interface ManifestoRuleItem {
  number: string;
  ruleCode: string;
  title: LocalizedString;
  desc: LocalizedString;
  tag: LocalizedString;
  bgColor: string;
}

export interface CertItem {
  id: string;
  title: LocalizedString;
  issuer: LocalizedString;
}

export interface AwardItem {
  id: string;
  year: string;
  title: LocalizedString;
  desc: LocalizedString;
  badgeColor: string;
}

export interface EducationItem {
  id: string;
  period: string;
  school: LocalizedString;
  degree: LocalizedString;
}

export interface SiteTheme {
  canvasBg: string;
  accentColor: string;
  cardBg: string;
  borderColor: string;
}

export interface SectionConfig {
  id: "hero" | "metrics" | "caseStudies" | "bento" | "labs" | "manifesto" | "firebaseDeck" | "credentials";
  name: LocalizedString;
  visible: boolean;
}

export interface SiteContent {
  version?: number;
  theme: SiteTheme;
  resumeUrl?: string;
  sectionsOrder: SectionConfig[];
  hero: {
    eyebrow: LocalizedString;
    headline: LocalizedString;
    subtext: LocalizedString;
    primaryCta: LocalizedString;
    captionFigure: LocalizedString;
    captionLocation: LocalizedString;
    badgeTopLeft?: LocalizedString;
    badgeTopRight?: LocalizedString;
    badgeBottomRight?: LocalizedString;
    imagePath?: string;
    githubUrl?: string;
  };
  metrics: MetricItem[];
  caseStudiesSection: {
    heading: LocalizedString;
    subheading: LocalizedString;
    items: CaseStudyItem[];
  };
  bentoSection: {
    heading: LocalizedString;
    subheading: LocalizedString;
    cells: BentoCellItem[];
  };
  labSection: {
    heading: LocalizedString;
    subheading: LocalizedString;
    items: LabItem[];
  };
  manifestoSection: {
    eyebrow: LocalizedString;
    headline: LocalizedString;
    subtext: LocalizedString;
    rules: ManifestoRuleItem[];
  };
  credentialsSection: {
    heading: LocalizedString;
    subheading: LocalizedString;
    certs: CertItem[];
    awards: AwardItem[];
    education: EducationItem[];
  };
  footerSection: {
    eyebrow: LocalizedString;
    dialogueBadge?: LocalizedString;
    headline: LocalizedString;
    subtext: LocalizedString;
    ctaText: LocalizedString;
    email: string;
    phone: string;
    location: LocalizedString;
    roleSummary: LocalizedString;
    socialHeading?: LocalizedString;
    linkedinUrl?: string;
    githubUrl?: string;
  };
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  version: 5,
  theme: {
    canvasBg: "#F5EFE6",
    accentColor: "#FF5400",
    cardBg: "#FFFFFF",
    borderColor: "#000000",
  },
  resumeUrl: "/Berkay_Acar_Resume.pdf",
  sectionsOrder: [
    {
      id: "hero",
      name: { en: "Hero Section", tr: "Hero Bölümü" },
      visible: true,
    },
    {
      id: "metrics",
      name: { en: "Impact Metrics", tr: "Etki Metrikleri" },
      visible: true,
    },
    {
      id: "caseStudies",
      name: { en: "Enterprise Case Studies", tr: "Kurumsal Vaka Çalışmaları" },
      visible: true,
    },
    {
      id: "bento",
      name: { en: "Technical Arsenal Bento", tr: "Teknik Cephane Bento" },
      visible: true,
    },
    {
      id: "labs",
      name: { en: "Signature R&D Labs", tr: "İmza Ar-Ge Labları" },
      visible: true,
    },
    {
      id: "manifesto",
      name: { en: "Engineering Manifesto", tr: "Mühendislik Manifestosu" },
      visible: true,
    },
    {
      id: "firebaseDeck",
      name: { en: "Firebase Telemetry Deck", tr: "Firebase Telemetri Konsolu" },
      visible: false,
    },
    {
      id: "credentials",
      name: { en: "Credentials & Awards", tr: "Sertifikalar ve Ödüller" },
      visible: true,
    },
  ],
  hero: {
    eyebrow: {
      en: "FULL STACK & MOBILE ENGINEER | ENTERPRISE SOLUTIONS",
      tr: "FULL STACK & MOBİL MÜHENDİS | KURUMSAL ÇÖZÜMLER",
    },
    headline: {
      en: "BUILDING HIGH-SCALE .NET, WEB & MOBILE SYSTEMS.",
      tr: "YÜKSEK ÖLÇEKLİ .NET, WEB VE MOBİL SİSTEMLER GELİŞTİRİYORUM.",
    },
    subtext: {
      en: "Full Stack & Mobile Engineer building modular .NET 9 backends, React/Next.js internal portals, Flutter B2B apps, and ERP-integrated platforms serving 30,000+ corporate clients.",
      tr: "30.000'den fazla kurumsal müşteriye hizmet veren modüler .NET 9 backend motorları, React/Next.js kurumsal portalları, Flutter B2B uygulamaları ve ERP entegre sistemler geliştiren Full Stack ve Mobil Mühendis.",
    },
    primaryCta: {
      en: "EXPLORE WORK",
      tr: "PROJELERİ İNCELE",
    },
    captionFigure: {
      en: "FIG 1.0 : BERKAY ACAR",
      tr: "ŞEKİL 1.0 : BERKAY ACAR",
    },
    captionLocation: {
      en: "ISTANBUL, TR",
      tr: "İSTANBUL, TR",
    },
    badgeTopLeft: {
      en: "SYS_STATUS: STABLE",
      tr: "DURUM: STABİL",
    },
    badgeTopRight: {
      en: "MEASURE TWICE, CUT ONCE",
      tr: "KIRK ÖLÇ, BİR BİÇ",
    },
    badgeBottomRight: {
      en: "TRY KONAMI CODE",
      tr: "KONAMI KODUNU DENE",
    },
    imagePath: "/assets/comic_hero_mascot.jpg",
    githubUrl: "https://github.com/Berkawaii",
  },
  metrics: [
    {
      id: "m-1",
      value: "30,000+",
      label: {
        en: "Enterprise B2B Clients",
        tr: "Kurumsal B2B Müşteri",
      },
      detail: {
        en: "Düzey Market B2B ordering & nationwide distribution",
        tr: "Düzey Market B2B sipariş ve ülke çapında dağıtım",
      },
      bgColor: "bg-[#70D6FF]",
    },
    {
      id: "m-2",
      value: "5",
      label: {
        en: "Enterprise Systems Shipped",
        tr: "Canlı Kurumsal Sistem",
      },
      detail: {
        en: "Sun-Engine, Expense PWA, Discount Portal, B2B Web & Mobile",
        tr: "Sun-Engine, Masraf PWA, İskonto Portalı, B2B Web & Mobil",
      },
      bgColor: "bg-[#CCFF00]",
    },
    {
      id: "m-3",
      value: ".NET 9",
      label: {
        en: "Legacy-to-Modern Migration",
        tr: "Eski Sistemden Modernizasyon",
      },
      detail: {
        en: "Ported Java/JHipster expense & ERP flows into modular plugins",
        tr: "Java/JHipster masraf ve ERP akışlarının modüler eklentilere taşınması",
      },
      bgColor: "bg-[#FF70A6]",
    },
    {
      id: "m-4",
      value: "30+",
      label: {
        en: "Custom Commerce & ERP Plugins",
        tr: "Özel E-Ticaret & ERP Eklentisi",
      },
      detail: {
        en: "Pricing engine, SAP/Panorama sync, Iyzico/Netahsilat/TokenFlex",
        tr: "Fiyat motoru, SAP/Panorama senkronizasyonu, Iyzico/Netahsilat/TokenFlex",
      },
      bgColor: "bg-[#FF5400] text-white",
    },
    {
      id: "m-5",
      value: "5+ Yrs",
      label: {
        en: "Full Stack & Mobile Engineering",
        tr: "Full Stack & Mobil Mühendislik",
      },
      detail: {
        en: ".NET, React/Next.js, Flutter, SQL/Firestore & applied AI",
        tr: ".NET, React/Next.js, Flutter, SQL/Firestore ve uygulamalı yapay zeka",
      },
      bgColor: "bg-[#FFFFFF]",
    },
  ],
  caseStudiesSection: {
    heading: {
      en: "ENTERPRISE ENGINEERING CASE STUDIES",
      tr: "KURUMSAL MÜHENDİSLİK VAKA ÇALIŞMALARI",
    },
    subheading: {
      en: "Production systems engineered for Düzey Pazarlama and Koç Holding commercial operations: problem framing, architectural trade-offs, and measurable outcomes.",
      tr: "Düzey Pazarlama ve Koç Holding ticari operasyonları için geliştirilen canlı sistemler: problem tanımı, mimari tercihler ve ölçülebilir sonuçlar.",
    },
    items: [
      {
        id: "sun-engine-core",
        title: {
          en: "Sun-Engine: Core SFA, Pricing & Enterprise Backend",
          tr: "Sun-Engine: SFA, Fiyat Motoru ve Kurumsal Backend",
        },
        category: {
          en: "ENTERPRISE BACKEND & ERP",
          tr: "KURUMSAL BACKEND & ERP",
        },
        client: {
          en: "Düzey Pazarlama A.Ş. (Koç Holding)",
          tr: "Düzey Pazarlama A.Ş. (Koç Holding)",
        },
        period: "2024 - Present",
        role: {
          en: "Full Stack & Backend Engineer",
          tr: "Full Stack & Backend Mühendisi",
        },
        summary: {
          en: "Unified .NET 9 / nopCommerce 4.80.6 modular plugin backend powering Digital Expense Management, Commercial Discount Approvals, SFA pricing calculation, and Panorama/SAP ERP synchronization.",
          tr: "Dijital Masraf Yönetimi, Ticari İskonto Onayı, SFA fiyat/koşul hesaplama ve Panorama/SAP ERP senkronizasyonunu tek çekirdekte toplayan .NET 9 / nopCommerce 4.80.6 modüler eklenti backend motoru.",
        },
        problem: {
          en: "Internal expense workflows ran on a separate legacy Java Spring Boot/JHipster stack while commercial discount approvals, customer-specific SFA pricing matrices, and ERP sync jobs lived in fragmented services with duplicated auth and data models.",
          tr: "Kurum içi masraf süreçleri ayrı bir Java Spring Boot/JHipster yapısında çalışırken, ticari iskonto onayları, müşteri bazlı SFA fiyat matrisleri ve ERP senkronizasyonları dağınık servislerde tutuluyor ve bakım maliyetini artırıyordu.",
        },
        approach: {
          en: "Consolidated the ecosystem onto .NET 9 modular plugins: ported ExpenseManagement with 3-tier services and immutable C# record DTOs, built DiscountRequest with deferred matrix loading, brand-level price masking and an AI approval assistant backend, and engineered SalesEngine + PriceSync/DiscountSync/CustomerSync + Panorama SOAP integration.",
          tr: "Ekosistemi .NET 9 modüler eklenti mimarisinde birleştirdim: ExpenseManagement eklentisini 3 katmanlı servisler ve immutable C# record DTO'larla port ettim; gecikmeli matris yüklemeli, marka bazlı fiyat maskelemeli ve yapay zeka asistanlı DiscountRequest eklentisini, ayrıca çok kriterli SalesEngine fiyat motorunu ve Panorama SOAP/Sync eklentilerini geliştirdim.",
        },
        tradeoffs: {
          en: "Chose manual entity-to-DTO mappers over AutoMapper to preserve compile-time safety and eliminate circular serialization graphs, and deferred discount matrix queries behind explicit user triggers to keep approval detail endpoints fast under heavy ERP payloads.",
          tr: "Derleme zamanı güvenliği ve döngüsel referansları önlemek için AutoMapper yerine açık manuel mapper sınıflarını tercih ettim; yoğun ERP yüklerinde yanıt süresini korumak için mevcut iskonto matrisini gecikmeli (deferred) yükleme arkasına aldım.",
        },
        impactMetricsEn: [
          "Migrated Java/JHipster expense domain to .NET 9 with 13 DTOs, 8 mappers, and 13 tiered services",
          "Multi-criteria SFA pricing engine across brand, channel, segment, city, tax, and scale factors",
          "Automated Panorama SOAP, price, discount, and customer sync pipelines with OTP auth",
          "Role-aware price masking and AI assistant context endpoints for commercial approvals",
        ],
        impactMetricsTr: [
          "Java/JHipster masraf altyapısı 13 DTO, 8 mapper ve 13 katmanlı servisle .NET 9'a taşındı",
          "Marka, kanal, segment, şehir, vergi ve ölçek kriterli çok boyutlu SFA fiyat motoru",
          "OTP doğrulamalı Panorama SOAP, fiyat, iskonto ve müşteri senkronizasyon hatları",
          "Ticari onaylar için rol bazlı fiyat maskeleme ve yapay zeka asistanı API katmanı",
        ],
        techStack: [
          ".NET 9",
          "C#",
          "nopCommerce 4.80",
          "MSSQL",
          "SAP ERP",
          "Panorama SOAP",
          "REST API",
          "JWT / Entra ID",
        ],
        badgeText: {
          en: "CORE ENGINE",
          tr: "ÇEKİRDEK MOTOR",
        },
        badgeColor: "orange",
        architectureDetails: {
          en: "Modular .NET 9 plugin host uniting ExpenseManagement, DiscountRequest, SalesEngine pricing schemas, Panorama SOAP integration, and background sync workers.",
          tr: "ExpenseManagement, DiscountRequest, SalesEngine fiyat şemaları, Panorama SOAP entegrasyonu ve senkronizasyon servislerini barındıran modüler .NET 9 eklenti çekirdeği.",
        },
        imagePath: "/assets/comic_realtime_engine.jpg",
      },
      {
        id: "duzey-masraf-pwa",
        title: {
          en: "Düzey Masraf: Digital Expense & Approval PWA",
          tr: "Düzey Masraf: Dijital Masraf ve Onay PWA",
        },
        category: {
          en: "ENTERPRISE WEB & PWA",
          tr: "KURUMSAL WEB & PWA",
        },
        client: {
          en: "Düzey Tüketim Malları A.Ş.",
          tr: "Düzey Tüketim Malları A.Ş.",
        },
        period: "2025 - Present",
        role: {
          en: "Full Stack Engineer",
          tr: "Full Stack Mühendisi",
        },
        summary: {
          en: "Installable React 19 + TypeScript PWA digitizing employee receipts, 7-role expense approvals, PDF statement dispatch, SAP FI handoff, and an embedded Gemini-powered Muhittin assistant.",
          tr: "Çalışan fiş/fatura girişini, 7 rollü çok kademeli onay akışını, PDF döküm iletimini, SAP FI aktarımını ve Gemini destekli Muhittin asistanını sunan kurulabilir React 19 + TypeScript PWA uygulaması.",
        },
        problem: {
          en: "Field and office staff needed a fast mobile-capable workflow for receipt capture, multi-tier approval routing, and instant SAP FI validation.",
          tr: "Saha ve ofis çalışanları; fiş yükleme, çok kademeli onay yönlendirme ve hızlı SAP FI aktarımı için mobil uyumlu bir sürece ihtiyaç duyuyordu.",
        },
        approach: {
          en: "Built a React 19 + Vite 8 PWA with Service Worker offline shell, client-side receipt compression, URL-persisted filters/pagination, full-filtered UTF-8 CSV export, MSAL Microsoft Entra ID SSO + JWT auth, Firestore live SSO/maintenance toggles, and the Muhittin smart assistant.",
          tr: "Service Worker çevrimdışı kabuk destekli React 19 + Vite 8 PWA geliştirdim; istemci tarafı görsel sıkıştırma, URL tabanlı filtre/sayfa koruma, tüm filtrelere uygun UTF-8 CSV dışa aktarım, MSAL Entra ID SSO + JWT, Firestore canlı bakım/SSO anahtarları ve Muhittin asistanını entegre ettim.",
        },
        tradeoffs: {
          en: "Offloaded image compression to the browser canvas before upload to slash mobile bandwidth and Azure Blob payload size, and kept SSO/maintenance flags in Cloud Firestore for zero-redeploy operational control.",
          tr: "Mobil veri tüketimini ve sunucu yükünü azaltmak için fiş görsellerini yükleme öncesi tarayıcıda sıkıştırdım; SSO ve bakım modu yönetimini yeniden dağıtım gerektirmeden anlık açıp kapatabilmek için Cloud Firestore'a bağladım.",
        },
        impactMetricsEn: [
          "7-role RBAC approval pipeline from employee submission to SAP FI posting",
          "Client-side receipt compression, batch PDF generation & full-filtered CSV export",
          "Dual auth with Microsoft Entra ID (MSAL SSO), OTP password reset & impersonation",
          "Firestore-driven live maintenance gate and Gemini-assisted Muhittin help panel",
        ],
        impactMetricsTr: [
          "Çalışan girişinden SAP FI kaydına kadar 7 rollü RBAC onay hattı",
          "İstemci tarafı fiş sıkıştırma, toplu PDF döküm ve tam filtreli CSV dışa aktarım",
          "Microsoft Entra ID (MSAL SSO), OTP şifre sıfırlama ve admin impersonation desteği",
          "Firestore tabanlı canlı bakım kapısı ve Gemini destekli Muhittin yardımcı paneli",
        ],
        techStack: [
          "React 19",
          "TypeScript",
          "Vite 8",
          "PWA",
          "MSAL Entra ID",
          "Cloud Firestore",
          "Gemini AI",
          ".NET 9 API",
        ],
        badgeText: {
          en: "EXPENSE PWA",
          tr: "MASRAF PWA",
        },
        badgeColor: "blue",
        architectureDetails: {
          en: "React 19 + Vite 8 installable PWA communicating with Sun-Engine REST APIs, backed by MSAL Entra ID SSO and Firestore runtime flags.",
          tr: "Sun-Engine REST API'leriyle haberleşen, MSAL Entra ID SSO ve Firestore canlı ayarlarıyla desteklenen React 19 + Vite 8 PWA mimarisi.",
        },
      },
      {
        id: "iskonto-talep-portal",
        title: {
          en: "İskonto Talep: Commercial Discount & Pricing Portal",
          tr: "İskonto Talep: Ticari İskonto ve Özel Fiyat Onay Portalı",
        },
        category: {
          en: "B2B COMMERCIAL WORKFLOW",
          tr: "B2B TİCARİ İŞ AKIŞI",
        },
        client: {
          en: "Düzey Pazarlama A.Ş. (Sales & Finance)",
          tr: "Düzey Pazarlama A.Ş. (Satış & Finans)",
        },
        period: "2025 - Present",
        role: {
          en: "Full Stack Engineer",
          tr: "Full Stack Mühendisi",
        },
        summary: {
          en: "Next.js 16 + TypeScript enterprise approval portal enabling sales reps, regional directors, and financial controllers to create, audit, and approve commercial discount and special price requests.",
          tr: "Satış ekipleri, bölge müdürleri ve finans onaycıları için iskonto ile özel fiyat taleplerinin oluşturulup denetlendiği Next.js 16 + TypeScript tabanlı kurumsal onay portalı.",
        },
        problem: {
          en: "Evaluating B2B commercial discounts across dozens of product lines, distributor tiers, and regional approval rules lacked clear audit timelines, role-scoped price visibility, and mobile-friendly quick approvals.",
          tr: "Çok sayıda ürün grubu, bayi katmanı ve bölgesel kural içeren B2B iskonto taleplerinin incelenmesinde net onay tarihçesi, rol bazlı fiyat gizliliği ve mobil hızlı onay akışı eksikti.",
        },
        approach: {
          en: "Engineered a dual-theme Next.js 16 + Tailwind CSS 4 portal with a 4-step dynamic request wizard, quick approval workspace, role-gated KC Excel template management, deferred current discount matrix loading, hidden-price masking, grouped audit timelines, and proactive AI assistant nudges.",
          tr: "Çift temalı Next.js 16 + Tailwind CSS 4 arayüzüyle 4 adımlı talep sihirbazı, hızlı onay ekranı, rol bazlı KC Excel şablon/raporlama, gecikmeli mevcut iskonto matrisi, gizli fiyat maskeleme, gruplanmış onay tarihçesi ve proaktif AI asistan uyarıları geliştirdim.",
        },
        tradeoffs: {
          en: "Used static export-friendly client state with strict JWT route guards and step-grouped history deduplication so reviewers inspect clean state transitions without redundant audit noise.",
          tr: "Katı JWT rota korumalarıyla statik dağıtıma uygun istemci mimarisi kullandım; onay geçmişinde tekrar eden adımları gruplayarak yöneticilere sade bir denetim izi sundum.",
        },
        impactMetricsEn: [
          "4-step dynamic request wizard with product picker and parameter validation",
          "Role-gated KC Excel reporting, deferred discount matrix & hidden price masking",
          "Deduplicated approval value history timeline and mobile quick-approval flow",
          "Proactive AI Approval Assistant nudges embedded directly in request forms",
        ],
        impactMetricsTr: [
          "Ürün seçicili ve parametre doğrulamalı 4 adımlı dinamik talep sihirbazı",
          "Rol yetkili KC Excel raporlama, gecikmeli iskonto matrisi ve gizli fiyat maskeleme",
          "Tekilleştirilmiş onay değer tarihçesi ve mobil uyumlu hızlı onay akışı",
          "Talep formlarına gömülü proaktif Yapay Zeka Onay Asistanı yönlendirmeleri",
        ],
        techStack: [
          "Next.js 16",
          "React 19",
          "TypeScript",
          "Tailwind CSS 4",
          "Axios",
          "JWT Auth",
          "AI Assistant",
          ".NET 9 API",
        ],
        badgeText: {
          en: "DISCOUNT PORTAL",
          tr: "İSKONTO PORTALI",
        },
        badgeColor: "lime",
        architectureDetails: {
          en: "Next.js 16 App Router frontend integrated with Sun-Engine DiscountRequest APIs, JWT Bearer auto-logout guards, and contextual AI review nudges.",
          tr: "Sun-Engine DiscountRequest API'leri, JWT Bearer otomatik çıkış korumaları ve bağlamsal yapay zeka asistanıyla entegre Next.js 16 App Router ön yüzü.",
        },
      },
      {
        id: "duzey-market-b2b-backend",
        title: {
          en: "Düzey Market: Enterprise B2B E-Commerce Engine",
          tr: "Düzey Market: Kurumsal B2B E-Ticaret Motoru",
        },
        category: {
          en: "B2B E-COMMERCE BACKEND",
          tr: "B2B E-TİCARET BACKEND",
        },
        client: {
          en: "Düzey Market (30,000+ B2B Clients)",
          tr: "Düzey Market (30.000+ B2B Müşteri)",
        },
        period: "2022 - Present",
        role: {
          en: "Senior Full Stack Engineer",
          tr: "Kıdemli Full Stack Mühendisi",
        },
        summary: {
          en: "High-concurrency .NET 7 / nopCommerce 4.60 B2B commerce platform extended with 30+ custom Düzey plugins serving 30,000+ corporate buyers, SAP stock reservation, and multi-gateway B2B payments.",
          tr: "30.000+ kurumsal müşteriye hizmet veren, 30'dan fazla özel Düzey eklentisi, SAP stok rezervasyonu ve çoklu B2B ödeme geçitleriyle genişletilmiş .NET 7 / nopCommerce 4.60 e-ticaret çekirdeği.",
        },
        problem: {
          en: "High-volume B2B ordering across thousands of SKUs and customer-specific price tiers caused cache misses on virtual/parent SKUs, coupled cart/order price trace contention, and fragile SAP stock synchronization.",
          tr: "Binlerce SKU ve müşteri özel fiyat katmanlarında yüksek hacimli B2B siparişleri; sanal/ana SKU önbellek sapmalarına, sepet/sipariş fiyat izi çakışmalarına ve SAP stok tutarsızlıklarına yol açıyordu.",
        },
        approach: {
          en: "Built and maintained 30+ custom plugins on .NET 7 including DuzeyDiscountRules, DuzeyCheckoutValidator, DuzeyFlow, DuzeyTierPriceImport, OtpAuthenticator, PanoramaIntegration, and payment integrations (Iyzico + AccountSettler, Netahsilat, TokenFlex, DuzeyGateway), while decoupling order-item price traces from cart traces and implementing virtual SKU parent caching + SAP reserved stock percentages.",
          tr: ".NET 7 üzerinde DuzeyDiscountRules, DuzeyCheckoutValidator, DuzeyFlow, DuzeyTierPriceImport, OtpAuthenticator, PanoramaIntegration ve Iyzico/AccountSettler, Netahsilat, TokenFlex, DuzeyGateway ödeme eklentilerini içeren 30+ modül geliştirdim; sipariş ve sepet fiyat izlerini ayrıştırdım, sanal SKU önbelleği ve SAP rezerve stok kontrolü ekledim.",
        },
        tradeoffs: {
          en: "Added explicit parent-SKU cache keys and reserved stock thresholds instead of live synchronous SAP roundtrips on every cart mutation, protecting checkout latency under peak morning order bursts.",
          tr: "Her sepet güncellemesinde senkron SAP çağrısı yapmak yerine ana SKU önbellek anahtarları ve rezerve stok eşikleri kullanarak sabah yoğunluğunda sipariş tamamlama hızını korudum.",
        },
        impactMetricsEn: [
          "Powers daily B2B ordering for 30,000+ nationwide retail & corporate buyers",
          "30+ custom .NET 7 plugins covering pricing, checkout validation, gamification & ERP",
          "Decoupled cart/order price traces & virtual SKU caching for fast catalog browsing",
          "Multi-provider B2B payments: Iyzico, Netahsilat, TokenFlex & custom gateways",
        ],
        impactMetricsTr: [
          "Ülke çapında 30.000+ kurumsal alıcının günlük B2B siparişlerini yönetir",
          "Fiyatlama, sepet doğrulama, oyunlaştırma ve ERP için 30+ özel .NET 7 eklentisi",
          "Ayrıştırılmış sepet/sipariş fiyat izleri ve sanal SKU önbellekleme",
          "Çoklu B2B ödeme altyapısı: Iyzico, Netahsilat, TokenFlex ve özel geçitler",
        ],
        techStack: [
          ".NET 7",
          "C#",
          "nopCommerce 4.60",
          "MSSQL",
          "SAP ERP",
          "Iyzico",
          "Netahsilat",
          "TokenFlex",
          "WebApi",
        ],
        badgeText: {
          en: "30K+ B2B",
          tr: "30B+ B2B",
        },
        badgeColor: "pink",
        architectureDetails: {
          en: "Plugin-driven .NET 7 / nopCommerce 4.60 enterprise commerce core with SAP stock error management, parent-SKU price caching, and multi-gateway payment orchestration.",
          tr: "SAP stok hata yönetimi, ana SKU fiyat önbelleklemesi ve çoklu ödeme orkestrasyonuna sahip eklenti tabanlı .NET 7 / nopCommerce 4.60 kurumsal ticaret çekirdeği.",
        },
      },
      {
        id: "duzey-market-b2b-mobile",
        title: {
          en: "Düzey Market Mobile: Hybrid B2B & Field App",
          tr: "Düzey Market Mobil: Hibrit B2B ve Saha Uygulaması",
        },
        category: {
          en: "B2B MOBILE APPLICATION",
          tr: "B2B MOBİL UYGULAMA",
        },
        client: {
          en: "Düzey Market (B2B Buyers & Field Staff)",
          tr: "Düzey Market (B2B Müşteriler & Saha)",
        },
        period: "2023 - Present",
        role: {
          en: "Mobile & Full Stack Engineer",
          tr: "Mobil & Full Stack Mühendisi",
        },
        summary: {
          en: "Cross-platform Flutter & Dart mobile application unifying the B2B customer storefront and internal staff portal with native camera barcode scanning and Smart Ready Basket workflows.",
          tr: "B2B müşteri mağazasını ve kurum içi personel portalını yerel kamera barkod tarama ve Akıllı Sepet akışlarıyla birleştiren Flutter & Dart tabanlı çapraz platform mobil uygulama.",
        },
        problem: {
          en: "B2B shop owners and field sales staff needed instant shelf-side barcode ordering across both customer (duzeymarket.com) and staff (personel.duzeymarket.com) portals without maintaining separate native codebases.",
          tr: "B2B esnaf ve saha satış ekipleri; hem müşteri (duzeymarket.com) hem personel (personel.duzeymarket.com) portallarına tek uygulamadan erişip raf başında kamerayla barkod okutarak anında sipariş vermek istiyordu.",
        },
        approach: {
          en: "Engineered a hybrid Flutter + GetX architecture combining native screens (Smart Ready Basket / Akıllı Sepet, Iyzico payment view, announcements, cookie consent) with an optimized WebView bridge and a draggable floating barcode scanner powered by mobile_scanner.",
          tr: "Akıllı Sepet, Iyzico ödeme, duyuru ve çerez izin ekranlarını; optimize edilmiş bir WebView köprüsü ve mobile_scanner tabanlı sürüklenebilir yüzer barkod okuma butonuyla birleştiren Flutter + GetX hibrit mimarisi geliştirdim.",
        },
        tradeoffs: {
          en: "Paired a shared WebView bridge for rapidly evolving web promotions and pricing rules with native Dart camera scanning and GetX state controllers, delivering instant parity with the .NET B2B backend.",
          tr: "Hızla değişen kampanya ve fiyat kurallarını anında yansıtmak için WebView köprüsünü kullanırken, donanım gerektiren barkod okuma ve hızlı menü akışlarını yerel Flutter/GetX katmanında tuttum.",
        },
        impactMetricsEn: [
          "Dual-mode storefront & staff portal switching (duzeymarket.com & personel)",
          "Native camera barcode scan injected directly into live B2B catalog search",
          "Draggable floating barcode trigger + Smart Ready Basket & Iyzico modules",
          "Single Flutter/Dart codebase shipping across Android and iOS",
        ],
        impactMetricsTr: [
          "Çift modlu müşteri mağazası ve personel portalı geçişi (duzeymarket & personel)",
          "Yerel kamera barkod taramasının doğrudan canlı B2B ürün aramasına aktarımı",
          "Sürüklenebilir barkod butonu, Akıllı Sepet ve Iyzico ödeme modülleri",
          "Android ve iOS için tek Flutter/Dart kod tabanıyla üretim dağıtımı",
        ],
        techStack: [
          "Flutter",
          "Dart",
          "GetX",
          "WebView Bridge",
          "Mobile Scanner",
          "Android & iOS",
        ],
        badgeText: {
          en: "MOBILE B2B",
          tr: "MOBİL B2B",
        },
        badgeColor: "blue",
        architectureDetails: {
          en: "GetX reactive ViewModel orchestrating native Flutter barcode scanning, draggable overlay controls, and authenticated B2B/staff WebView sessions.",
          tr: "Yerel Flutter barkod tarama, sürüklenebilir arayüz kontrolleri ve kimlik doğrulamalı B2B/personel WebView oturumlarını yöneten GetX reaktif mimari.",
        },
      },
    ],
  },
  bentoSection: {
    heading: {
      en: "SYSTEMS ARCHITECTURE & TECHNICAL ARSENAL",
      tr: "SİSTEM MİMARİSİ VE TEKNİK CEPHANE",
    },
    subheading: {
      en: "Production competencies forged across 5+ years of enterprise .NET backends, modern React/Next.js portals, Flutter mobile apps, and real-time WebRTC R&D.",
      tr: "5+ yıllık kurumsal .NET backend, modern React/Next.js portalları, Flutter mobil uygulamaları ve gerçek zamanlı WebRTC Ar-Ge projelerinde edinilmiş yetkinlikler.",
    },
    cells: [
      {
        id: "cell-backend",
        title: {
          en: ".NET Core & Enterprise ERP Backends",
          tr: ".NET Core & Kurumsal ERP Backendleri",
        },
        summary: {
          en: "Architecting modular .NET 9 & .NET 7 backends on nopCommerce plugin ecosystems. Delivering SFA pricing engines, expense ledgers, RESTful APIs, and SAP / Panorama SOAP integrations.",
          tr: "nopCommerce eklenti ekosistemi üzerinde modüler .NET 9 ve .NET 7 backend sistemleri. SFA fiyat motorları, masraf defterleri, REST API'ler ve SAP / Panorama SOAP entegrasyonları.",
        },
        tag: {
          en: "CORE SPECIALTY",
          tr: "ANA UZMANLIK",
        },
        pills: [".NET 9 / 7", "C#", "nopCommerce Plugins", "SAP / Panorama ERP", "RESTful APIs", "Docker"],
        bgColor: "bg-[#FF5400]",
        textColor: "text-white",
        colSpanDesktop: 7,
      },
      {
        id: "cell-mobile",
        title: {
          en: "React, Next.js & Flutter Frontends",
          tr: "React, Next.js & Flutter Ön Yüzler",
        },
        summary: {
          en: "Shipping responsive internal enterprise PWAs in React 19 & Next.js 16 alongside cross-platform Flutter B2B apps with GetX, native barcode scanning, and offline Service Workers.",
          tr: "React 19 ve Next.js 16 ile kurumsal PWA'lar; GetX, yerel barkod tarama ve çevrimdışı Service Worker destekli çapraz platform Flutter B2B mobil uygulamalar.",
        },
        tag: {
          en: "30K CLIENT SCALE",
          tr: "30B MÜŞTERİ ÖLÇEĞİ",
        },
        pills: ["React 19", "Next.js 16", "TypeScript", "Vite 8", "PWA", "Flutter", "Dart", "GetX"],
        bgColor: "bg-[#70D6FF]",
        textColor: "text-black",
        colSpanDesktop: 5,
      },
      {
        id: "cell-ai",
        title: {
          en: "Applied AI & Real-Time Protocols",
          tr: "Uygulamalı AI & Gerçek Zamanlı Protokoller",
        },
        summary: {
          en: "Embedding Gemini & OpenAI assistants (Muhittin, Approval Nudges, AEGIS) into operational workflows, plus building sub-frame WebRTC P2P binary protocols and Three.js game loops.",
          tr: "Operasyonel iş akışlarına Gemini & OpenAI asistanları (Muhittin, Onay Asistanı, AEGIS) entegre etme; ayrıca düşük gecikmeli WebRTC P2P ikili protokolleri ve Three.js oyun motorları.",
        },
        tag: {
          en: "AI & P2P R&D",
          tr: "AI & P2P AR-GE",
        },
        pills: ["Gemini / OpenAI APIs", "WebRTC P2P", "Binary Protocols", "Three.js", "LiveKit"],
        bgColor: "bg-[#CCFF00]",
        textColor: "text-black",
        colSpanDesktop: 4,
      },
      {
        id: "cell-db",
        title: {
          en: "Databases & Cache Fabric",
          tr: "Veritabanları & Önbellek Altyapısı",
        },
        summary: {
          en: "Relational schema optimization in MSSQL & PostgreSQL, parent-SKU price caching, Redis distributed state, and Cloud Firestore real-time configuration & signaling.",
          tr: "MSSQL ve PostgreSQL ilişkisel şema optimizasyonu, ana SKU fiyat önbelleklemesi, Redis dağıtık durum yönetimi ve Cloud Firestore gerçek zamanlı yapılandırma ile sinyalleşme.",
        },
        tag: {
          en: "HIGH AVAILABILITY",
          tr: "YÜKSEK ERİŞİLEBİLİRLİK",
        },
        pills: ["MSSQL", "PostgreSQL", "Redis", "Cloud Firestore", "SQLite"],
        bgColor: "bg-[#F4EBD9]",
        textColor: "text-black",
        colSpanDesktop: 4,
      },
      {
        id: "cell-devops",
        title: {
          en: "Identity, Payments & Delivery",
          tr: "Kimlik, Ödeme & Dağıtım",
        },
        summary: {
          en: "Microsoft Entra ID (MSAL SSO), JWT & multi-role RBAC matrices, B2B payment gateways (Iyzico, Netahsilat, TokenFlex), and automated Firebase / CI/CD deployments.",
          tr: "Microsoft Entra ID (MSAL SSO), JWT ve çok rollü RBAC matrisleri, B2B ödeme geçitleri (Iyzico, Netahsilat, TokenFlex) ve otomatik Firebase / CI/CD dağıtımları.",
        },
        tag: {
          en: "ZERO-TRUST",
          tr: "SIFIR GÜVEN",
        },
        pills: ["Entra ID (MSAL)", "JWT / RBAC", "Iyzico / Netahsilat", "TokenFlex", "Firebase", "CI/CD"],
        bgColor: "bg-[#FF70A6]",
        textColor: "text-black",
        colSpanDesktop: 4,
      },
    ],
  },
  labSection: {
    heading: {
      en: "SIGNATURE R&D & EXPERIMENTAL LABS",
      tr: "İMZA AR-GE VE DENEYSEL LABORATUVARLAR",
    },
    subheading: {
      en: "Beyond commercial systems: side projects and experimental labs exploring zero-install WebRTC browser consoles, low-latency audio comms, LLM state machines, and simulation engines.",
      tr: "Ticari sistemlerin ötesinde: kurulumsuz WebRTC tarayıcı konsollarını, düşük gecikmeli ses iletişimini, LLM durum makinelerini ve simülasyon motorlarını test eden Ar-Ge ve yan projeler.",
    },
    items: [
      {
        id: "overcade",
        title: {
          en: "OVERCADE: Zero-Install WebRTC Browser Console",
          tr: "OVERCADE: Kurulumsuz WebRTC Tarayıcı Konsolu",
        },
        badgeText: {
          en: "WEBRTC CONSOLE",
          tr: "WEBRTC KONSOL",
        },
        tabLabel: {
          en: "Overcade",
          tr: "Overcade",
        },
        period: "2026",
        summary: {
          en: "Turns any PC or Smart TV browser into a 1-4 player local couch-gaming console and smartphones into QR-paired wireless gamepads over zero-server-cost WebRTC P2P DataChannels. Ships 5 playable 60 FPS multiplayer games (Chrono Knights ARPG, Pico Protocol, Fired Up Overdrive, Vortex Drift 09, Ironclad Protocol) plus a 3D telemetry sandbox.",
          tr: "Herhangi bir PC veya Akıllı TV tarayıcısını 1-4 oyunculu yerel konsola, akıllı telefonları ise QR kodla eşleşen kablosuz oyun kumandalarına dönüştüren sıfır sunucu maliyetli WebRTC P2P platformu. 5 oynanabilir 60 FPS çok oyunculu oyun (Chrono Knights ARPG, Pico Protocol, Fired Up Overdrive, Vortex Drift 09, Ironclad Protocol) ve 3D telemetri arenası içerir.",
        },
        architectureDetails: {
          en: "Ephemeral Firestore SDP/ICE signaling (6-10 ops/session, immediately unsubscribed on connect) handing off to an unordered, zero-retransmit WebRTC UDP DataChannel streaming 8-byte ArrayBuffer gamepad packets and 8-byte host feedback telemetry (HP/MP/haptics/game mode) with zero GC pressure.",
          tr: "Bağlantı kurulduğu anda kapanan geçici Firestore SDP/ICE sinyalleşmesi (oturum başı 6-10 işlem) sonrası sıralamasız ve yeniden iletimsiz WebRTC UDP DataChannel üzerinden 8 baytlık ikili ArrayBuffer kumanda paketleri ve 8 baytlık canlı geri bildirim telemetrisi (HP/MP/titreşim/mod) aktarır.",
        },
        impactMetricsEn: [
          "8-byte binary ArrayBuffer gamepad & 8-byte host feedback protocol over UDP DataChannel",
          "Zero-install QR pairing turning 1-4 smartphones into dynamic game-aware wireless controllers",
          "5 full multiplayer titles powered by Three.js R3F, RPG-JS v5, and custom 60 FPS physics engines",
          "Built-in camera QR scanner, floating analog stick, D-pad mode & custom controller layouts",
        ],
        impactMetricsTr: [
          "UDP DataChannel üzerinde 8 baytlık ikili ArrayBuffer kumanda ve 8 baytlık geri bildirim protokolü",
          "1-4 akıllı telefonu QR ile oyuna özel kablosuz kumandaya dönüştüren kurulumsuz eşleşme",
          "Three.js R3F, RPG-JS v5 ve özel 60 FPS fizik motorlarıyla 5 tam çok oyunculu oyun",
          "Dahili kamera QR tarayıcı, yüzer analog çubuk, D-pad modu ve özelleştirilebilir tuş düzeni",
        ],
        techStack: [
          "React 19",
          "TypeScript",
          "WebRTC P2P",
          "Three.js / R3F",
          "RPG-JS v5",
          "Cloud Firestore",
          "Binary DataView",
          "Tailwind CSS 4",
        ],
        imagePath: "/assets/overcade_console.jpg",
        githubUrl: "https://github.com/Berkawaii/Overcade",
        liveUrl: "https://overcade.web.app",
      },
      {
        id: "cruwells-vox",
        title: {
          en: "Cruwell's Vox Low-Latency Audio & Comms",
          tr: "Cruwell's Vox Düşük Gecikmeli Ses & İletişim",
        },
        badgeText: {
          en: "REAL-TIME LAB",
          tr: "GERÇEK ZAMANLI LAB",
        },
        tabLabel: {
          en: "Cruwell's Vox",
          tr: "Cruwell's Vox",
        },
        period: "2026",
        summary: {
          en: "High-throughput real-time communication platform engineered for sub-20ms audio packet dispatch and peer synchronization under constrained bandwidth conditions.",
          tr: "Kısıtlı bant genişliği koşullarında 20ms altında ses paketi iletimi ve eşler arası senkronizasyon için tasarlanmış gerçek zamanlı iletişim platformu.",
        },
        architectureDetails: {
          en: "High-frequency ring buffer audio processing pipeline with zero-allocation socket frames in C#.",
          tr: "C# ile geliştirilmiş sıfır tahsisatlı soket çerçevelerine sahip yüksek frekanslı dairesel arabellek ses işleme hattı.",
        },
        impactMetricsEn: [
          "Sub-20ms packet dispatch over optimized WebSockets",
          "Custom binary serialization reducing payload footprint by 60%",
          "Fault-tolerant room mesh state management with heartbeat probes",
        ],
        impactMetricsTr: [
          "Optimize WebSockets üzerinden 20ms altı paket iletimi",
          "Paket boyutunu %60 azaltan özel ikili serileştirme",
          "Kalp atışı probları ile hata toleranslı oda ağ durum yönetimi",
        ],
        techStack: [
          "React",
          "Electron",
          "Firebase",
          "LiveKit",
          "SFU",
          "Oracle",
          "Firestore",
        ],
        imagePath: "/assets/CRUWELL’S VOX_ Real-Time Audio Poster.png",
        githubUrl: "https://github.com/Berkawaii/Cruwell-s-Vox",
        liveUrl: "https://cruwellsvox.web.app/",
      },
      {
        id: "gri-archive",
        title: {
          en: "AEGIS: AUTONOMOUS PUZZLE ENGINE",
          tr: "AEGIS: OTONOM BULMACA MOTORU",
        },
        badgeText: {
          en: "AI CONTROLLED",
          tr: "YZ KONTROLLÜ",
        },
        tabLabel: {
          en: "EXPERIMENTAL AI GAME",
          tr: "DENEYSEL YAPAY ZEKA OYUNU",
        },
        period: "2026",
        summary: {
          en: "Interactive, browser-based escape room powered by dynamic LLM reasoning and real-time state machines. Replaced static quest trees with an autonomous AI dungeon master that generates contextual puzzles, evaluates multimodal user input, and orchestrates live room states on the fly.",
          tr: "Klasik kurgusal bulmaca ağaçlarını çöpe atan, yapay zeka güdümlü dinamik bir kaçış odası simülasyonu. Kullanıcı girdilerini gerçek zamanlı ayrıştıran, otonom bir AI karar motoru ile bağlama göre şekillenen bulmacalar ve anlık durum yönetimi sunar.",
        },
        architectureDetails: {
          en: "Modular event-driven architecture decoupled into Scenario Orchestrator, Dynamic Context Engine, and Prompt Sanitizer to prevent jailbreaking while maintaining deep narrative immersion.",
          tr: "Senaryo Yöneticisi, Dinamik Context Motoru ve Jailbreak engelleme katmanıyla ayrıştırılmış, deterministik durum makineleri (FSM) üzerine kurulu modüler yapı.",
        },
        impactMetricsEn: [
          "100% procedurally evaluated player interactions via custom agentic loops",
          "Low-latency prompt-to-puzzle state transitions with local session caching",
          "Deterministic win-condition validation guarded against LLM hallucinations",
          "Zero pre-scripted clues; fully contextual narrative progression",
        ],
        impactMetricsTr: [
          "Sabit senaryo yerine tamamen ajan döngüleriyle işletilen dinamik oynanış",
          "Halüsinasyonu engelleyen sıkı kural ve durum doğrulama katmanı",
          "Kullanıcı kararlarına göre anında üretilen dinamik ipucu ve zorluk ölçekleme",
          "Durum yönetimi ve context boyutunu minimize eden optimize prompt mimarisi",
        ],
        techStack: [
          "TypeScript",
          "React",
          "OpenAI API / LLM",
          "Node.js",
          "TailwindCSS",
          "Zustand",
          "Render",
        ],
        imagePath: "/assets/AEGIS_ Autonomous Puzzle Engine.png",
        githubUrl: "https://github.com/Berkawaii/AiEscapeRoom",
        liveUrl: "https://aiescaperoom.onrender.com/",
      },
      {
        id: "lab-1791289152696",
        title: {
          en: "TACTICAL FOOTBALL SIM ENGINE",
          tr: "AMATÖR FUTBOL MENAJERLİK MOTORU",
        },
        badgeText: {
          en: "GAME ENGINE & SPORTS SIMULATION",
          tr: "OYUN MOTORU & TAKTİKSEL SİMÜLASYON",
        },
        tabLabel: {
          en: "HALISAHA MANAGER",
          tr: "HALISAHA MANAGER",
        },
        period: "2026",
        summary: {
          en: "Text-and-data-driven amateur football management simulation inspired by classic managerial titles. Implements dynamic tactical setups, squad chemistry dynamics, attribute-based match calculation engines, and seasonal progression algorithms tailored for grassroot football culture.",
          tr: "Klasik menajerlik oyunlarından (FM/CM) ilham alan, mahalle ve halı saha kültürünü derin taktiksel mekaniklerle harmanlayan simülasyon platformu. Oyuncu nitelik matrisleri, form/kondisyon döngüleri ve olasılık tabanlı anlık maç olaylarını hesaplayan bir simülasyon motoru barındırır.",
        },
        architectureDetails: {
          en: "Deterministic 2.5D/text match simulation pipeline decoupled into Turn-Based Event Generator, Player Attribute Matrix, and Dynamic Tactical Bias Resolver.",
          tr: "Olasılık Tabanlı Maç Olay Üreteci (Match Event Generator), Nitelik Matrisi (Attribute Matrix) ve Taktiksel Durum Yöneticisinden oluşan deterministik simülasyon hattı.",
        },
        impactMetricsEn: [
          "Attribute-weighted probabilistic match engine calculating real-time pitch events per tick",
          "State machine orchestrating tactical formations, condition fatigue, and in-game substitutions",
          "Granular squad management: player ratings, dynamic morale systems, and grassroots scouting",
          "Decoupled computational engine ensuring reproducible, seed-based match simulations",
        ],
        impactMetricsTr: [
          "Oyuncu yeteneklerine ve taktiksel tercihlere göre anlık pozisyon ve gol olasılıklarını çözen maç motoru",
          "Kondisyon, moral, sakatlık ve takım kimyası parametrelerini işleyen durum makineleri",
          "Hamle ve taktik değişikliklerine anında tepki veren olay bazlı simülasyon döngüsü",
          "Tekrar üretilebilir (seed-based) ve tutarlı maç sonuçları üreten deterministik algoritma",
        ],
        techStack: [
          "Firebase",
          "React 18",
          "PostgreSQL",
          "Tailwind CSS + PostCSS",
          "Supabase",
          "Vite 6",
          "Node.js",
        ],
        imagePath: "/assets/Tactical Football Sim_ From Grassroots to Glory.png",
        githubUrl: "https://github.com/Berkawaii/halisahaManager",
        liveUrl: "https://halisaha-manager.web.app/",
      },
      {
        id: "syntax-factory",
        title: {
          en: "Chastity Virtual Museum",
          tr: "CHASTITY SANAL MÜZESİ",
        },
        badgeText: {
          en: "Europeana",
          tr: "Europeana",
        },
        tabLabel: {
          en: "Chastity",
          tr: "Chastity",
        },
        period: "2025",
        summary: {
          en: "Interactive online museum platform providing seamless exhibition exploration with high-performance digital displays.",
          tr: "Yüksek performanslı dijital sergileme kabiliyetine sahip, akıcı bir sergi deneyimi sunan etkileşimli çevrim içi müze platformu.",
        },
        architectureDetails: {
          en: "A chic, simple, and beautiful online virtual museum application powered by the Europeana API. This project allows users to browse through high-quality masterpieces, view detailed artwork metadata, and explore various art eras and artists in an elegant, responsive interface.",
          tr: "Europeana API altyapısıyla güçlendirilmiş, zarif, sade ve estetik bir çevrim içi sanal müze uygulaması. Kullanıcıların yüksek kaliteli başyapıtları keşfetmesine, eserlerin ayrıntılı metaverilerini incelemesine ve zarif, duyarlı (responsive) bir arayüz üzerinden farklı sanat dönemleri ile sanatçıları deneyimlemesine olanak tanır.",
        },
        impactMetricsEn: [],
        impactMetricsTr: [],
        techStack: [
          "React",
          "HTML",
          "Vanilla CSS",
          "Axios",
          "framer-motion",
          "lucide-react",
          "Vite",
        ],
        imagePath: "/assets/Chastity Virtual Museum Poster.png",
        githubUrl: "https://github.com/Berkawaii/chastity",
        liveUrl: "https://berkawaii.github.io/chastityWeb/",
      },
    ],
  },
  manifestoSection: {
    eyebrow: {
      en: "ENGINEERING PRINCIPLES",
      tr: "MÜHENDİSLİK İLKELERİ",
    },
    headline: {
      en: "RESILIENT SYSTEMS. CLEAN CODE. MEASURABLE IMPACT.",
      tr: "DİRENÇLİ SİSTEMLER. TEMİZ KOD. ÖLÇÜLEBİLİR ETKİ.",
    },
    subtext: {
      en: "Software engineering is not about chasing ephemeral hype. It is about constructing resilient, predictable systems that withstand real enterprise pressure without compromising maintainability.",
      tr: "Yazılım mühendisliği geçici popülerlikleri kovalamak değildir. Gerçek kurumsal yük altında aksamadan çalışan dirençli, öngörülebilir ve bakımı kolay sistemler inşa etmektir.",
    },
    rules: [
      {
        number: "01",
        ruleCode: "RULE 01 : DETERMINISM",
        title: {
          en: "Idempotent By Design",
          tr: "Doğuştan Eşgüçlü (Idempotent)",
        },
        desc: {
          en: "If an API call or message cannot safely retry ten times during network partition, it is broken. Every write pipeline requires strict idempotency keys.",
          tr: "Bir API çağrısı veya mesaj ağ kesintisinde on kez güvenle tekrarlanamıyorsa bozuktur. Her yazma hattı katı eşgüçlülük anahtarları gerektirir.",
        },
        tag: {
          en: "DISTRIBUTED FAULT TOLERANCE",
          tr: "DAĞITIK HATA TOLERANSI",
        },
        bgColor: "bg-[#F5EFE6]",
      },
      {
        number: "02",
        ruleCode: "RULE 02 : SIMPLICITY",
        title: {
          en: "Concrete Over Clever",
          tr: "Yalınlık Kurnazlıktan Üstündür",
        },
        desc: {
          en: "Avoid layered boilerplate and fragile abstractions. Typed contracts, explicit error returns, and predictable execution paths keep code maintainable for years.",
          tr: "Gereksiz katmanlardan ve kırılgan soyutlamalardan kaçının. Tipli sözleşmeler, açık hata dönüşleri ve öngörülebilir yollar kodu yıllarca sürdürülebilir kılar.",
        },
        tag: {
          en: "CLEAN ARCHITECTURE",
          tr: "TEMİZ MİMARİ",
        },
        bgColor: "bg-[#CCFF00]",
      },
      {
        number: "03",
        ruleCode: "RULE 03 : METRICS",
        title: {
          en: "Relentless Profiling",
          tr: "Aralıksız Profil Çıkarma",
        },
        desc: {
          en: "Every allocated byte and database query matters when thirty thousand concurrent clients hit your API. Profile memory, eliminate lock contention, ship speed.",
          tr: "Otuz bin eşzamanlı istemci sisteminize bağlandığında ayrılan her bayt ve veritabanı sorgusu önemlidir. Belleği ölçün, kilitlenmeleri çözün, hız sunun.",
        },
        tag: {
          en: "HIGH CONCURRENCY",
          tr: "YÜKSEK EŞZAMANLILIK",
        },
        bgColor: "bg-[#70D6FF]",
      },
    ],
  },
  credentialsSection: {
    heading: {
      en: "ACCREDITATIONS, HONORS & EDUCATION",
      tr: "SERTİFİKALAR, ÖDÜLLER VE EĞİTİM",
    },
    subheading: {
      en: "Rigorous technical validation through recognized industry certifications, executive leadership awards, and computer science degrees.",
      tr: "Sektörel sertifikalar, kurumsal başarı ödülleri ve bilgisayar bilimleri diplomaları ile belgelenmiş teknik yetkinlik.",
    },
    certs: [
      {
        id: "c-1",
        title: {
          en: "SAP Commerce Cloud Development",
          tr: "SAP Commerce Cloud Geliştirme",
        },
        issuer: {
          en: "Enterprise Cloud Architecture",
          tr: "Kurumsal Bulut Mimarisi",
        },
      },
      {
        id: "c-2",
        title: {
          en: "IIBA Business Analysis",
          tr: "IIBA İş Analizi",
        },
        issuer: {
          en: "Systems Analysis & Architecture",
          tr: "Sistem Analizi & Mimarisi",
        },
      },
      {
        id: "c-3",
        title: {
          en: "Scrum INC. Agile Practitioner",
          tr: "Scrum INC. Çevik Uygulayıcı",
        },
        issuer: {
          en: "Iterative Delivery & Sprint Cadence",
          tr: "İteratif Teslimat & Sprint Yönetimi",
        },
      },
      {
        id: "c-4",
        title: {
          en: "HackerRank Problem Solving",
          tr: "HackerRank Problem Çözme",
        },
        issuer: {
          en: "Advanced Algorithms & Logic",
          tr: "İleri Algoritmalar & Mantık",
        },
      },
    ],
    awards: [
      {
        id: "a-1",
        year: "YEAR 2025",
        title: {
          en: "Digital Transformation Contributor Award",
          tr: "Dijital Dönüşüm Katkı Ödülü",
        },
        desc: {
          en: "Recognized for leading the high-impact migration of legacy infrastructure to modern .NET and React microservices engines.",
          tr: "Eski altyapıların modern .NET ve React mikroservis motorlarına yüksek etkili geçişini yönettiği için ödüllendirildi.",
        },
        badgeColor: "bg-[#FF5400] text-white",
      },
      {
        id: "a-2",
        year: "YEAR 2023",
        title: {
          en: "Team Collaboration Award",
          tr: "Takım İş Birliği Ödülü",
        },
        desc: {
          en: "Awarded for cross-departmental coordination in deploying enterprise-wide mobile Flutter solutions.",
          tr: "Kurum çapında kurumsal Flutter çözümlerinin hayata geçirilmesindeki departmanlar arası koordinasyon için ödüllendirildi.",
        },
        badgeColor: "bg-[#CCFF00] text-black",
      },
    ],
    education: [
      {
        id: "e-1",
        period: "SEP 2021 - AUG 2026",
        school: {
          en: "Anadolu University",
          tr: "Anadolu Üniversitesi",
        },
        degree: {
          en: "Bachelor of Science in Management Information Systems",
          tr: "Yönetim Bilişim Sistemleri Lisans",
        },
      },
      {
        id: "e-2",
        period: "SEP 2019 - SEP 2021",
        school: {
          en: "Piri Reis University",
          tr: "Piri Reis Üniversitesi",
        },
        degree: {
          en: "Associate Degree in Computer Programming",
          tr: "Bilgisayar Programcılığı Ön Lisans",
        },
      },
    ],
  },
  footerSection: {
    eyebrow: {
      en: "DIRECT DISPATCH",
      tr: "DOĞRUDAN İLETİŞİM",
    },
    dialogueBadge: {
      en: "OPEN FOR DIALOGUE",
      tr: "İLETİŞİME AÇIK",
    },
    headline: {
      en: "PRODUCTION SYSTEMS BUILT FOR REAL ENTERPRISE LOAD.",
      tr: "GERÇEK KURUMSAL YÜK İÇİN İNŞA EDİLMİŞ ÜRETİM SİSTEMLERİ.",
    },
    subtext: {
      en: "From .NET 9 enterprise plugins, SAP/Panorama ERP pipelines, and React/Next.js internal portals to Flutter B2B mobile apps and WebRTC real-time prototypes — let us talk engineering.",
      tr: ".NET 9 kurumsal eklentilerinden, SAP/Panorama ERP hatlarından ve React/Next.js portallarından Flutter B2B mobil uygulamalara ve WebRTC gerçek zamanlı prototiplere kadar mühendisliği konuşalım.",
    },
    ctaText: {
      en: "GET IN TOUCH",
      tr: "İLETİŞİME GEÇ",
    },
    email: "acar.berkai@gmail.com",
    phone: "+90 554 428 04 04",
    location: {
      en: "Istanbul, Turkey",
      tr: "İstanbul, Türkiye",
    },
    roleSummary: {
      en: "Senior Full Stack & Mobile Engineer. Built with Next.js, TypeScript, and Google Cloud Firestore.",
      tr: "Kıdemli Full Stack & Mobil Mühendisi. Next.js, TypeScript ve Google Cloud Firestore ile geliştirilmiştir.",
    },
    socialHeading: {
      en: "ONLINE PRESENCE:",
      tr: "ÇEVRİMİÇİ PROFİLLER:",
    },
    linkedinUrl: "https://linkedin.com/in/im-berkay",
    githubUrl: "https://github.com/Berkawaii",
  },
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "berkay-58575.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "berkay-58575",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "berkay-58575.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;
let isConfigured = false;

try {
  if (typeof window !== "undefined") {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    isConfigured = Boolean(
      firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("Demo")
    );
  }
} catch (error) {
  console.warn("Firebase client initialization deferred to local fallback:", error);
}

export { auth, signInWithEmailAndPassword, signOut, onAuthStateChanged, storage };
export type { User };

/**
 * Compresses an image file client-side to ensure it is lightweight (<100KB),
 * ultra-fast to load, and safely fits inside Firestore and localStorage limits.
 */
export async function compressImageToDataUrl(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => resolve(reader.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export async function uploadImageFile(file: File): Promise<string> {
  // Always prepare an optimized lightweight compressed version
  const optimizedDataUrl = await compressImageToDataUrl(file);

  // If Firebase Storage is configured and initialized, attempt upload
  if (storage && isConfigured) {
    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storageRef = ref(storage, `portfolio_uploads/${Date.now()}_${sanitizedName}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (err) {
      console.warn("Firebase Storage upload skipped, using optimized image:", err);
    }
  }

  // Resilient fallback: optimized lightweight image
  return optimizedDataUrl;
}

export const SITE_CONTENT_LOCAL_STORAGE_KEY = "berkay_portfolio_site_content_v6";

export function sanitizeResumeUrl(url?: string): string {
  if (!url || url === "/berkay_acar_cv.pdf" || url.endsWith("/berkay_acar_cv.pdf") || url.endsWith("_cv.pdf")) {
    return "/Berkay_Acar_Resume.pdf";
  }
  return url;
}

export function getLocalSiteContent(): SiteContent {
  if (typeof window === "undefined") return DEFAULT_SITE_CONTENT;
  try {
    const cached = localStorage.getItem(SITE_CONTENT_LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.hero && parsed.caseStudiesSection) {
        return {
          ...DEFAULT_SITE_CONTENT,
          ...parsed,
          resumeUrl: sanitizeResumeUrl(parsed.resumeUrl),
          theme: { ...DEFAULT_SITE_CONTENT.theme, ...(parsed.theme || {}) },
          sectionsOrder:
            parsed.sectionsOrder && Array.isArray(parsed.sectionsOrder) && parsed.sectionsOrder.length > 0
              ? parsed.sectionsOrder
              : DEFAULT_SITE_CONTENT.sectionsOrder,
          hero: {
            ...DEFAULT_SITE_CONTENT.hero,
            ...(parsed.hero || {}),
            captionFigure: parsed.hero?.captionFigure || DEFAULT_SITE_CONTENT.hero.captionFigure,
            captionLocation: parsed.hero?.captionLocation || DEFAULT_SITE_CONTENT.hero.captionLocation,
            badgeTopLeft: parsed.hero?.badgeTopLeft || DEFAULT_SITE_CONTENT.hero.badgeTopLeft,
            badgeTopRight: parsed.hero?.badgeTopRight || DEFAULT_SITE_CONTENT.hero.badgeTopRight,
            badgeBottomRight: parsed.hero?.badgeBottomRight || DEFAULT_SITE_CONTENT.hero.badgeBottomRight,
            githubUrl: parsed.hero?.githubUrl !== undefined ? parsed.hero.githubUrl : DEFAULT_SITE_CONTENT.hero.githubUrl,
          },
          caseStudiesSection: {
            ...DEFAULT_SITE_CONTENT.caseStudiesSection,
            ...(parsed.caseStudiesSection || {}),
            heading: parsed.caseStudiesSection?.heading || DEFAULT_SITE_CONTENT.caseStudiesSection.heading,
            subheading: parsed.caseStudiesSection?.subheading || DEFAULT_SITE_CONTENT.caseStudiesSection.subheading,
            items: (parsed.caseStudiesSection?.items || DEFAULT_SITE_CONTENT.caseStudiesSection.items).map((item: CaseStudyItem) => {
              const defaultItem = DEFAULT_SITE_CONTENT.caseStudiesSection.items.find((d) => d.id === item.id);
              return {
                ...(defaultItem || {}),
                ...item,
                role: item.role || defaultItem?.role || { en: "Full Stack Engineer", tr: "Full Stack Mühendisi" },
                problem: item.problem || defaultItem?.problem,
                approach: item.approach || defaultItem?.approach,
                tradeoffs: item.tradeoffs || defaultItem?.tradeoffs,
                impactMetricsEn: item.impactMetricsEn && Array.isArray(item.impactMetricsEn) ? item.impactMetricsEn : (defaultItem?.impactMetricsEn || []),
                impactMetricsTr: item.impactMetricsTr && Array.isArray(item.impactMetricsTr) ? item.impactMetricsTr : (defaultItem?.impactMetricsTr || []),
                techStack: item.techStack && Array.isArray(item.techStack) ? item.techStack : (defaultItem?.techStack || []),
              };
            }),
          },
          bentoSection: {
            ...DEFAULT_SITE_CONTENT.bentoSection,
            ...(parsed.bentoSection || {}),
            heading: parsed.bentoSection?.heading || DEFAULT_SITE_CONTENT.bentoSection.heading,
            subheading: parsed.bentoSection?.subheading || DEFAULT_SITE_CONTENT.bentoSection.subheading,
          },
          labSection: {
            ...DEFAULT_SITE_CONTENT.labSection,
            ...(parsed.labSection || {}),
            heading: parsed.labSection?.heading || DEFAULT_SITE_CONTENT.labSection.heading,
            subheading: parsed.labSection?.subheading || DEFAULT_SITE_CONTENT.labSection.subheading,
            items: (parsed.labSection?.items || DEFAULT_SITE_CONTENT.labSection.items).map((item: LabItem) => {
              const defaultItem = DEFAULT_SITE_CONTENT.labSection.items.find((d) => d.id === item.id);
              return {
                ...item,
                tabLabel: item.tabLabel || defaultItem?.tabLabel || {
                  en: `${item.title?.en?.split(" ")[0] || "LAB"} : ${item.badgeText?.en || "R&D"}`,
                  tr: `${item.title?.tr?.split(" ")[0] || item.title?.en?.split(" ")[0] || "LAB"} : ${item.badgeText?.tr || item.badgeText?.en || "AR-GE"}`,
                },
                impactMetricsEn: item.impactMetricsEn && Array.isArray(item.impactMetricsEn) ? item.impactMetricsEn : (defaultItem?.impactMetricsEn || []),
                impactMetricsTr: item.impactMetricsTr && Array.isArray(item.impactMetricsTr) ? item.impactMetricsTr : (defaultItem?.impactMetricsTr || []),
                techStack: item.techStack && Array.isArray(item.techStack) ? item.techStack : (defaultItem?.techStack || []),
                githubUrl: item.githubUrl !== undefined ? item.githubUrl : defaultItem?.githubUrl,
                liveUrl: item.liveUrl !== undefined ? item.liveUrl : defaultItem?.liveUrl,
              };
            }),
          },
          manifestoSection: {
            ...DEFAULT_SITE_CONTENT.manifestoSection,
            ...(parsed.manifestoSection || {}),
            eyebrow: parsed.manifestoSection?.eyebrow || DEFAULT_SITE_CONTENT.manifestoSection.eyebrow,
            headline: parsed.manifestoSection?.headline || DEFAULT_SITE_CONTENT.manifestoSection.headline,
            subtext: parsed.manifestoSection?.subtext || DEFAULT_SITE_CONTENT.manifestoSection.subtext,
          },
          credentialsSection: {
            ...DEFAULT_SITE_CONTENT.credentialsSection,
            ...(parsed.credentialsSection || {}),
            heading: parsed.credentialsSection?.heading || DEFAULT_SITE_CONTENT.credentialsSection.heading,
            subheading: parsed.credentialsSection?.subheading || DEFAULT_SITE_CONTENT.credentialsSection.subheading,
          },
          footerSection: {
            ...DEFAULT_SITE_CONTENT.footerSection,
            ...(parsed.footerSection || {}),
            eyebrow: parsed.footerSection?.eyebrow || DEFAULT_SITE_CONTENT.footerSection.eyebrow,
            dialogueBadge: parsed.footerSection?.dialogueBadge || DEFAULT_SITE_CONTENT.footerSection.dialogueBadge,
            headline: parsed.footerSection?.headline || DEFAULT_SITE_CONTENT.footerSection.headline,
            subtext: parsed.footerSection?.subtext || DEFAULT_SITE_CONTENT.footerSection.subtext,
            ctaText: parsed.footerSection?.ctaText || DEFAULT_SITE_CONTENT.footerSection.ctaText,
            socialHeading: parsed.footerSection?.socialHeading || DEFAULT_SITE_CONTENT.footerSection.socialHeading,
            linkedinUrl: parsed.footerSection?.linkedinUrl !== undefined ? parsed.footerSection.linkedinUrl : DEFAULT_SITE_CONTENT.footerSection.linkedinUrl,
            githubUrl: parsed.footerSection?.githubUrl !== undefined ? parsed.footerSection.githubUrl : DEFAULT_SITE_CONTENT.footerSection.githubUrl,
          },
        };
      }
    }
    localStorage.setItem(
      SITE_CONTENT_LOCAL_STORAGE_KEY,
      JSON.stringify(DEFAULT_SITE_CONTENT)
    );
  } catch (e) {
    console.error("Local storage read failed:", e);
  }
  return DEFAULT_SITE_CONTENT;
}

export function saveLocalSiteContent(content: SiteContent): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      SITE_CONTENT_LOCAL_STORAGE_KEY,
      JSON.stringify(content)
    );
  } catch (e) {
    console.error("Failed to save site content to localStorage:", e);
  }
}

export async function fetchSiteContent(): Promise<{
  content: SiteContent;
  source: "firestore" | "local-cache";
}> {
  if (typeof window === "undefined") {
    return { content: DEFAULT_SITE_CONTENT, source: "local-cache" };
  }

  if (db && isConfigured) {
    try {
      const docRef = doc(db, "settings", "site_content");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as SiteContent;
        const merged: SiteContent = {
          ...DEFAULT_SITE_CONTENT,
          ...data,
          resumeUrl: sanitizeResumeUrl(data.resumeUrl),
          theme: { ...DEFAULT_SITE_CONTENT.theme, ...(data.theme || {}) },
          sectionsOrder:
            data.sectionsOrder && Array.isArray(data.sectionsOrder) && data.sectionsOrder.length > 0
              ? data.sectionsOrder
              : DEFAULT_SITE_CONTENT.sectionsOrder,
          hero: {
            ...DEFAULT_SITE_CONTENT.hero,
            ...(data.hero || {}),
            captionFigure: data.hero?.captionFigure || DEFAULT_SITE_CONTENT.hero.captionFigure,
            captionLocation: data.hero?.captionLocation || DEFAULT_SITE_CONTENT.hero.captionLocation,
            badgeTopLeft: data.hero?.badgeTopLeft || DEFAULT_SITE_CONTENT.hero.badgeTopLeft,
            badgeTopRight: data.hero?.badgeTopRight || DEFAULT_SITE_CONTENT.hero.badgeTopRight,
            badgeBottomRight: data.hero?.badgeBottomRight || DEFAULT_SITE_CONTENT.hero.badgeBottomRight,
            githubUrl: data.hero?.githubUrl !== undefined ? data.hero.githubUrl : DEFAULT_SITE_CONTENT.hero.githubUrl,
          },
          caseStudiesSection: {
            ...DEFAULT_SITE_CONTENT.caseStudiesSection,
            ...(data.caseStudiesSection || {}),
            heading: data.caseStudiesSection?.heading || DEFAULT_SITE_CONTENT.caseStudiesSection.heading,
            subheading: data.caseStudiesSection?.subheading || DEFAULT_SITE_CONTENT.caseStudiesSection.subheading,
            items: (data.caseStudiesSection?.items || DEFAULT_SITE_CONTENT.caseStudiesSection.items).map((item: CaseStudyItem) => {
              const defaultItem = DEFAULT_SITE_CONTENT.caseStudiesSection.items.find((d) => d.id === item.id);
              return {
                ...(defaultItem || {}),
                ...item,
                role: item.role || defaultItem?.role || { en: "Full Stack Engineer", tr: "Full Stack Mühendisi" },
                problem: item.problem || defaultItem?.problem,
                approach: item.approach || defaultItem?.approach,
                tradeoffs: item.tradeoffs || defaultItem?.tradeoffs,
                impactMetricsEn: item.impactMetricsEn && Array.isArray(item.impactMetricsEn) ? item.impactMetricsEn : (defaultItem?.impactMetricsEn || []),
                impactMetricsTr: item.impactMetricsTr && Array.isArray(item.impactMetricsTr) ? item.impactMetricsTr : (defaultItem?.impactMetricsTr || []),
                techStack: item.techStack && Array.isArray(item.techStack) ? item.techStack : (defaultItem?.techStack || []),
              };
            }),
          },
          bentoSection: {
            ...DEFAULT_SITE_CONTENT.bentoSection,
            ...(data.bentoSection || {}),
            heading: data.bentoSection?.heading || DEFAULT_SITE_CONTENT.bentoSection.heading,
            subheading: data.bentoSection?.subheading || DEFAULT_SITE_CONTENT.bentoSection.subheading,
          },
          labSection: {
            ...DEFAULT_SITE_CONTENT.labSection,
            ...(data.labSection || {}),
            heading: data.labSection?.heading || DEFAULT_SITE_CONTENT.labSection.heading,
            subheading: data.labSection?.subheading || DEFAULT_SITE_CONTENT.labSection.subheading,
            items: (data.labSection?.items || DEFAULT_SITE_CONTENT.labSection.items).map((item: LabItem) => {
              const defaultItem = DEFAULT_SITE_CONTENT.labSection.items.find((d) => d.id === item.id);
              return {
                ...item,
                tabLabel: item.tabLabel || defaultItem?.tabLabel || {
                  en: `${item.title?.en?.split(" ")[0] || "LAB"} : ${item.badgeText?.en || "R&D"}`,
                  tr: `${item.title?.tr?.split(" ")[0] || item.title?.en?.split(" ")[0] || "LAB"} : ${item.badgeText?.tr || item.badgeText?.en || "AR-GE"}`,
                },
                impactMetricsEn: item.impactMetricsEn && Array.isArray(item.impactMetricsEn) ? item.impactMetricsEn : (defaultItem?.impactMetricsEn || []),
                impactMetricsTr: item.impactMetricsTr && Array.isArray(item.impactMetricsTr) ? item.impactMetricsTr : (defaultItem?.impactMetricsTr || []),
                techStack: item.techStack && Array.isArray(item.techStack) ? item.techStack : (defaultItem?.techStack || []),
                githubUrl: item.githubUrl !== undefined ? item.githubUrl : defaultItem?.githubUrl,
                liveUrl: item.liveUrl !== undefined ? item.liveUrl : defaultItem?.liveUrl,
              };
            }),
          },
          manifestoSection: {
            ...DEFAULT_SITE_CONTENT.manifestoSection,
            ...(data.manifestoSection || {}),
            eyebrow: data.manifestoSection?.eyebrow || DEFAULT_SITE_CONTENT.manifestoSection.eyebrow,
            headline: data.manifestoSection?.headline || DEFAULT_SITE_CONTENT.manifestoSection.headline,
            subtext: data.manifestoSection?.subtext || DEFAULT_SITE_CONTENT.manifestoSection.subtext,
          },
          credentialsSection: {
            ...DEFAULT_SITE_CONTENT.credentialsSection,
            ...(data.credentialsSection || {}),
            heading: data.credentialsSection?.heading || DEFAULT_SITE_CONTENT.credentialsSection.heading,
            subheading: data.credentialsSection?.subheading || DEFAULT_SITE_CONTENT.credentialsSection.subheading,
          },
          footerSection: {
            ...DEFAULT_SITE_CONTENT.footerSection,
            ...(data.footerSection || {}),
            eyebrow: data.footerSection?.eyebrow || DEFAULT_SITE_CONTENT.footerSection.eyebrow,
            dialogueBadge: data.footerSection?.dialogueBadge || DEFAULT_SITE_CONTENT.footerSection.dialogueBadge,
            headline: data.footerSection?.headline || DEFAULT_SITE_CONTENT.footerSection.headline,
            subtext: data.footerSection?.subtext || DEFAULT_SITE_CONTENT.footerSection.subtext,
            ctaText: data.footerSection?.ctaText || DEFAULT_SITE_CONTENT.footerSection.ctaText,
            socialHeading: data.footerSection?.socialHeading || DEFAULT_SITE_CONTENT.footerSection.socialHeading,
            linkedinUrl: data.footerSection?.linkedinUrl !== undefined ? data.footerSection.linkedinUrl : DEFAULT_SITE_CONTENT.footerSection.linkedinUrl,
            githubUrl: data.footerSection?.githubUrl !== undefined ? data.footerSection.githubUrl : DEFAULT_SITE_CONTENT.footerSection.githubUrl,
          },
        };
        saveLocalSiteContent(merged);
        return { content: merged, source: "firestore" };
      }
    } catch (err) {
      console.warn("Firestore site_content read error, using local cache:", err);
    }
  }

  return { content: getLocalSiteContent(), source: "local-cache" };
}

export async function saveSiteContent(content: SiteContent): Promise<{
  success: boolean;
  destination: "firestore" | "local-cache";
}> {
  saveLocalSiteContent(content);

  if (db && isConfigured) {
    try {
      const docRef = doc(db, "settings", "site_content");
      // Strip any undefined properties that cause Firestore setDoc() to fail
      const sanitized = JSON.parse(JSON.stringify(content));
      await setDoc(docRef, sanitized, { merge: true });
      return { success: true, destination: "firestore" };
    } catch (err) {
      console.warn("Firestore site_content save skipped, persisted locally:", err);
      return { success: true, destination: "local-cache" };
    }
  }

  return { success: true, destination: "local-cache" };
}

export function getFirebaseDiagnostics() {
  return {
    projectId: "berkay-58575",
    consoleUrl: "https://console.firebase.google.com/u/1/project/berkay-58575/overview",
    firestoreStatus: db ? "INITIALIZED" : "DEFERRED",
    authStatus: auth ? "READY" : "DEFERRED",
    isConfiguredWithApiKey: isConfigured,
    localCacheReady: true,
    authDomain: "berkay-58575.firebaseapp.com",
    storageBucket: "berkay-58575.firebasestorage.app",
  };
}
