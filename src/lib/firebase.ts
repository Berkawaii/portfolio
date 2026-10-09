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
  version: 3,
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
      en: "SENIOR FULL STACK & MOBILE ENGINEER",
      tr: "KIDEMLİ FULL STACK & MOBİL MÜHENDİS",
    },
    headline: {
      en: "BUILDING HIGH-CONCURRENCY MOBILE & BACKEND SYSTEMS.",
      tr: "YÜKSEK PERFORMANSLI MOBİL VE ARKA YÜZ SİSTEMLERİ GELİŞTİRİYORUM.",
    },
    subtext: {
      en: "Full Stack & Mobile Engineer specializing in .NET Core microservices, cross-platform Flutter engines, and resilient B2B enterprise solutions serving 30,000+ corporate clients.",
      tr: "30.000'den fazla kurumsal müşteriye hizmet veren .NET Core mikroservisleri, Flutter motorları ve dayanıklı B2B mimarileri geliştiren Full Stack ve Mobil Mühendis.",
    },
    primaryCta: {
      en: "EXPLORE WORK",
      tr: "PROJELERİ İNCELE",
    },
    captionFigure: {
      en: "FIG 1.0 : FULL STACK ENGINEER",
      tr: "ŞEKİL 1.0 : FULL STACK MÜHENDİS",
    },
    captionLocation: {
      en: "ISTANBUL, TR",
      tr: "İSTANBUL, TR",
    },
    badgeTopLeft: {
      en: "LET'S GO!",
      tr: "BAŞLAYALIM!",
    },
    badgeTopRight: {
      en: "ROCK SOLID",
      tr: "KAYA GİBİ",
    },
    badgeBottomRight: {
      en: "STAY POSITIVE",
      tr: "POZİTİF KAL",
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
        en: "High-concurrency daily field sales operations",
        tr: "Günlük yüksek hacimli saha satış operasyonları",
      },
      bgColor: "bg-[#70D6FF]",
    },
    {
      id: "m-2",
      value: "30%",
      label: {
        en: "Hosting Costs Slashed",
        tr: "Sunucu Maliyeti Tasarrufu",
      },
      detail: {
        en: "Consolidated legacy stack to .NET Core engine",
        tr: "Eski sistemlerin .NET Core çekirdeğine taşınması",
      },
      bgColor: "bg-[#CCFF00]",
    },
    {
      id: "m-3",
      value: "75%",
      label: {
        en: "Paperwork Automated",
        tr: "Evrak İşi Otomasyonu",
      },
      detail: {
        en: "Embedded AI assistant in UniCoWallet platform",
        tr: "UniCoWallet içerisine entegre yapay zeka asistanı",
      },
      bgColor: "bg-[#FF70A6]",
    },
    {
      id: "m-4",
      value: "Sub-50ms",
      label: {
        en: "API Response Latency",
        tr: "API Yanıt Süresi",
      },
      detail: {
        en: "Optimized SAP ERP data sync microservices",
        tr: "Optimize edilmiş SAP ERP veri senkronizasyon mikroservisleri",
      },
      bgColor: "bg-[#FF5400] text-white",
    },
    {
      id: "m-5",
      value: "4.5+ Yrs",
      label: {
        en: "Enterprise Engineering",
        tr: "Kurumsal Mühendislik",
      },
      detail: {
        en: "High-concurrency mobile, .NET microservices and distributed data",
        tr: "Yüksek eşzamanlı mobil, .NET mikroservisler ve dağıtık veri",
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
      en: "Real-world production systems engineered for Düzey and enterprise partners: problem framing, architectural trade-offs, and measurable outcomes.",
      tr: "Düzey ve kurumsal ortaklar için geliştirilen üretim sistemleri: problem tanımı, mimari tercihler ve ölçülebilir sonuçlar.",
    },
    items: [
      {
        id: "unicowallet-fintech",
        title: {
          en: "UniCoWallet Platform & Agentic AI Assistant",
          tr: "UniCoWallet Platformu & Otonom Yapay Zeka Asistanı",
        },
        category: {
          en: "FINTECH & MOBILE",
          tr: "FİNTEK & MOBİL",
        },
        client: {
          en: "Düzey (500+ Internal Employees)",
          tr: "Düzey (500+ Kurum İçi Çalışan)",
        },
        period: "2023 - Present",
        role: {
          en: "Full Stack & Mobile Engineer",
          tr: "Full Stack & Mobil Mühendisi",
        },
        summary: {
          en: "Engineered an enterprise digital wallet consolidating employee meal, expense, and travel allowances into a unified ledger with automated approval workflows.",
          tr: "Çalışan yemek, masraf ve seyahat harcırahlarını otomatik onay süreçleriyle birleştiren kurumsal dijital cüzdan sistemini geliştirdim.",
        },
        problem: {
          en: "Managing expense and travel allowances for 500+ staff relied entirely on paper receipts and manual approvals, generating review delays and invoice auditing friction.",
          tr: "500'den fazla personelin harcama ve seyahat izinleri tamamen kağıt evraklar ve manuel onaylarla yürütülüyor, bu da onay gecikmelerine ve denetim yüküne yol açıyordu.",
        },
        approach: {
          en: "Decoupled the architecture into 3 services: Transaction Engine, Immutable Ledger, and an AI Document Processor for OCR receipt extraction.",
          tr: "Mimarisi 3 ana parçaya ayrıldı: İşlem Motoru, Değişmez Muhasebe Defteri ve OCR fiş ayrıştırması yapan Yapay Zeka Belge İşlemcisi.",
        },
        tradeoffs: {
          en: "Enforced strict idempotency keys across all payment mutations to eliminate double-spend risks during cell network disconnects.",
          tr: "Hücresel ağ kopmalarında mükerrer harcama riskini önlemek için tüm ödeme mutasyonlarında katı eşgüçlülük (idempotency) anahtarlarını zorunlu tuttum.",
        },
        impactMetricsEn: [
          "75% physical paperwork reduction across internal operations",
          "Sub-100ms financial transaction authorization latency",
          "Zero ledger divergence with idempotent transactional write guarantees",
          "Zero-trust RBAC architecture with biometric and JWT authentication",
        ],
        impactMetricsTr: [
          "Kurum içi operasyonlarda fiziksel evrak işinde %75 azalma",
          "100ms altında finansal işlem yetkilendirme gecikmesi",
          "Eşgüçlü yazma garantileri ile sıfır bakiye tutarsızlığı",
          "Biyometrik ve JWT kimlik doğrulamalı sıfır güvenli RBAC mimarisi",
        ],
        techStack: [
          ".NET Core",
          "C#",
          "Flutter",
          "Dart",
          "PostgreSQL",
          "Redis",
          "Docker",
          "Azure DevOps",
        ],
        badgeText: {
          en: "ENTERPRISE FINTECH",
          tr: "KURUMSAL FİNTEK",
        },
        badgeColor: "orange",
        architectureDetails: {
          en: "Decoupled microservice architecture: Transaction Engine, Ledger Auditor, and AI Document Processor with strict idempotency keys.",
          tr: "İşlem Motoru, Defter Denetçisi ve Yapay Zeka Belge İşlemcisine ayrılmış, katı eşgüçlülük anahtarlarına sahip mikroservis mimarisi.",
        },
        imagePath: "/assets/comic_unicowallet.jpg",
      },
      {
        id: "b2b-sales-engine",
        title: {
          en: "30,000+ B2B Client & Sales Engine",
          tr: "30.000+ B2B Müşteri & Satış Motoru",
        },
        category: {
          en: "HIGH-SCALE MOBILITY",
          tr: "YÜKSEK ÖLÇEKLİ MOBİLİTE",
        },
        client: {
          en: "Düzey (30,000+ Enterprise Clients)",
          tr: "Düzey (30.000+ Kurumsal Müşteri)",
        },
        period: "2022 - Present",
        role: {
          en: "Senior Full Stack & Mobile Engineer",
          tr: "Kıdemli Full Stack & Mobil Mühendisi",
        },
        summary: {
          en: "Cross-platform mobile apps using Flutter and .NET Core powering daily field sales operations for nationwide distributor networks.",
          tr: "Ülke çapındaki distribütör ağlarının günlük saha satış operasyonlarını yürüten Flutter ve .NET Core tabanlı çapraz platform mobil uygulamalar.",
        },
        problem: {
          en: "Field sales agents operating across nationwide retail routes faced frequent connectivity drops in underground warehouses, causing order sync failures and checkout delays.",
          tr: "Ülke çapındaki perakende rotalarında çalışan saha temsilcileri depolarda sık sık bağlantı kopması yaşıyor, bu da sipariş senkronizasyon hatalarına ve gecikmelere yol açıyordu.",
        },
        approach: {
          en: "Engineered an offline-first Flutter application utilizing local SQLite storage, coupled with an event-driven background sync engine that pushes queued orders to .NET Core backends upon reconnection.",
          tr: "Yerel SQLite depolaması kullanan çevrimdışı öncelikli Flutter uygulaması ve yeniden bağlantı kurulduğunda kuyruktaki siparişleri .NET Core sunucularına aktaran olay güdümlü senkronizasyon motoru geliştirdim.",
        },
        tradeoffs: {
          en: "Accepted eventual consistency for non-critical telemetry to prioritize immediate local order placement and sub-second checkout speeds for field agents.",
          tr: "Saha temsilcileri için anında sipariş kaydı ve bir saniyenin altında işlem hızını önceliklendirmek adına kritik olmayan telemetri verilerinde nihai tutarlılık (eventual consistency) modelini benimsedim.",
        },
        impactMetricsEn: [
          "Sub-second mobile checkout and inventory reservation",
          "Reliable offline-first operation across 30,000+ client touchpoints",
          "40% reduction in deployment overhead via CI/CD pipelines",
          "Automated beta staging via Firebase App Distribution",
        ],
        impactMetricsTr: [
          "Bir saniyenin altında mobil sipariş tamamlama ve stok rezervasyonu",
          "30.000+ kurumsal temas noktasında güvenilir çevrimdışı çalışma",
          "CI/CD boru hatları ile dağıtım iş yükünde %40 tasarruf",
          "Firebase App Distribution ile otomatik beta test aşamalandırması",
        ],
        techStack: [
          "Flutter",
          "Dart",
          "Riverpod",
          ".NET Core",
          "MSSQL",
          "SQLite",
          "Firebase App Distribution",
        ],
        badgeText: {
          en: "30K+ CLIENTS",
          tr: "30B+ MÜŞTERİ",
        },
        badgeColor: "blue",
        architectureDetails: {
          en: "Dual-layer sync protocol combining local SQLite cache with event-driven background queues syncing to enterprise .NET Core backends.",
          tr: "Yerel SQLite önbelleğini kurumsal .NET Core sunucularına bağlayan olay güdümlü arkaplan kuyruklu çift katmanlı senkronizasyon.",
        },
      },
      {
        id: "dynamic-delivery-routing",
        title: {
          en: "SAP ERP Pipeline & Delivery Routing",
          tr: "SAP ERP Veri Hattı & Sevkiyat Yönlendirme",
        },
        category: {
          en: "ENTERPRISE MODERNIZATION",
          tr: "KURUMSAL MODERNİZASYON",
        },
        client: {
          en: "Düzey Logistics",
          tr: "Düzey Lojistik",
        },
        period: "2021 - 2023",
        role: {
          en: "Senior Full Stack Engineer",
          tr: "Kıdemli Full Stack Mühendisi",
        },
        summary: {
          en: "Modernized legacy monolithic Java and Angular systems into a unified .NET Core, React, and Next.js stack, streamlining high-throughput data sync between SAP ERP and field sales.",
          tr: "Eski Java ve Angular sistemlerini birleşik .NET Core, React ve Next.js altyapısına modernize ederek SAP ERP ile saha temsilcileri arasındaki veri senkronizasyonunu hızlandırdım.",
        },
        problem: {
          en: "A legacy monolithic Java and Angular stack caused severe database write-locks on the core SAP ERP during morning peak ordering hours, inflating infrastructure hosting bills.",
          tr: "Eski monolitik Java ve Angular altyapısı, sabah yoğun sipariş saatlerinde ana SAP ERP üzerinde ciddi veritabanı kilitlenmelerine yol açıyor ve sunucu maliyetlerini artırıyordu.",
        },
        approach: {
          en: "Introduced an asynchronous message brokering pipeline that buffered and throttled incoming mobile transactions before communicating with SAP, while modernizing frontend applications to .NET Core and Next.js.",
          tr: "SAP ile iletişim kurmadan önce gelen mobil işlemleri arabelleğe alan ve dengeleyen asenkron mesajlaşma katmanı kurdum; ön yüzü .NET Core ve Next.js mimarisine modernize ettim.",
        },
        tradeoffs: {
          en: "Replaced synchronous write-waiting with transactional event queues, introducing message replay mechanisms to handle downstream ERP downtime gracefully.",
          tr: "Senkron doğrudan yazma yerine kuyruk tabanlı modeli benimsedim; ERP kesintilerini yönetmek için mesaj yeniden oynatma mekanizmaları ekledim.",
        },
        impactMetricsEn: [
          "30% reduction in monthly infrastructure and hosting bills",
          "25% drop in field order fulfillment roundtrip latency",
          "Decoupled SAP transactional write-locks from mobile query bursts",
          "Unified .NET Core and modern React/Next.js maintainable stack",
        ],
        impactMetricsTr: [
          "Aylık altyapı ve sunucu maliyetlerinde %30 azalma",
          "Saha sipariş karşılama gecikmesinde %25 düşüş",
          "SAP yazma kilitlerini mobil ani işlem yüklerinden bağımsızlaştırma",
          "Sürdürülebilir .NET Core ve modern React/Next.js altyapısı",
        ],
        techStack: [
          ".NET Core",
          "C#",
          "SAP ERP",
          "React",
          "Next.js",
          "Redis",
          "PostgreSQL",
        ],
        badgeText: {
          en: "LOGISTICS ENGINE",
          tr: "LOJİSTİK MOTORU",
        },
        badgeColor: "lime",
        architectureDetails: {
          en: "Asynchronous message brokering layer decoupling SAP ERP transactional write-locks from mobile client query bursts.",
          tr: "SAP ERP işlemsel kilitlerini mobil istemci sorgu patlamalarından ayıran asenkron mesaj aracılık katmanı.",
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
      en: "Rigorous full stack competencies built across 4.5+ years of enterprise engineering: from low-level memory allocation in C# to high-performance Flutter runtimes.",
      tr: "4.5+ yıllık kurumsal mühendislikte inşa edilmiş yetkinlikler: C#'ta düşük seviyeli bellek yönetiminden yüksek performanslı Flutter çalışma zamanlarına.",
    },
    cells: [
      {
        id: "cell-backend",
        title: {
          en: "Backend & Distributed Microservices",
          tr: "Arkayüz & Dağıtık Mikroservisler",
        },
        summary: {
          en: "Architecting decoupled microservice clusters in .NET Core and C#. Specializing in high-throughput API gateways, asynchronous message queues, and zero-allocation socket streams.",
          tr: ".NET Core ve C# üzerinde bağımsız mikroservis kümeleri mimarisi. Yüksek hacimli API geçitleri, asenkron mesaj kuyrukları ve sıfır tahsisatlı soket akışları.",
        },
        tag: {
          en: "CORE SPECIALTY",
          tr: "ANA UZMANLIK",
        },
        pills: [".NET Core", "C#", "RESTful APIs", "Microservices", "WebSockets", "Docker", "Node.js"],
        bgColor: "bg-[#FF5400]",
        textColor: "text-white",
        colSpanDesktop: 7,
      },
      {
        id: "cell-mobile",
        title: {
          en: "Cross-Platform Mobile Engine",
          tr: "Çapraz Platform Mobil Motor",
        },
        summary: {
          en: "Production-grade enterprise mobile apps engineered in Flutter and Dart. Zero frame drops, offline SQLite sync, and reactive state orchestration via Riverpod and GetX.",
          tr: "Flutter ve Dart ile üretilmiş kurumsal kalitede mobil uygulamalar. Sıfır kare kaybı, çevrimdışı SQLite senkronizasyonu ve Riverpod ile reaktif durum yönetimi.",
        },
        tag: {
          en: "30K CLIENT SCALE",
          tr: "30B MÜŞTERİ ÖLÇEĞİ",
        },
        pills: ["Flutter", "Dart", "Riverpod", "GetX", "Swift", "Offline SQLite"],
        bgColor: "bg-[#70D6FF]",
        textColor: "text-black",
        colSpanDesktop: 5,
      },
      {
        id: "cell-ai",
        title: {
          en: "Agentic AI Integration",
          tr: "Otonom Yapay Zeka Entegrasyonu",
        },
        summary: {
          en: "Integrating AI agents and embedded LLM assistants into business pipelines. Automated approvals, test generation, and intelligent system analysis.",
          tr: "Yapay zeka ajanlarını ve gömülü LLM asistanlarını iş süreçlerine entegre etme. Otomatik onaylar, test üretimi ve akıllı sistem analizi.",
        },
        tag: {
          en: "20% FASTER LEAD",
          tr: "%20 HIZLI GELİŞTİRME",
        },
        pills: ["Antigravity SDK", "Cursor", "Claude", "LLM APIs", "Automated Tests"],
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
          en: "Relational schema design, query optimization, and fast in-memory key-value caching to support concurrent transactions without lock contention.",
          tr: "İlişkisel şema tasarımı, sorgu optimizasyonu ve kilitlenme olmadan eşzamanlı işlemleri destekleyen bellek içi anahtar-değer önbellekleme.",
        },
        tag: {
          en: "HIGH AVAILABILITY",
          tr: "YÜKSEK ERİŞİLEBİLİRLİK",
        },
        pills: ["PostgreSQL", "MSSQL", "Redis", "Cloud Firestore", "SQLite"],
        bgColor: "bg-[#F4EBD9]",
        textColor: "text-black",
        colSpanDesktop: 4,
      },
      {
        id: "cell-devops",
        title: {
          en: "DevOps & Enterprise Security",
          tr: "DevOps & Kurumsal Güvenlik",
        },
        summary: {
          en: "Automated multi-stage CI/CD pipelines, containerization with Docker, and strict RBAC protocols utilizing JWT and OAuth2 standards.",
          tr: "Otomatik çok aşamalı CI/CD hatları, Docker ile konteynerizasyon ve JWT ile OAuth2 standartlarını kullanan katı RBAC protokolleri.",
        },
        tag: {
          en: "ZERO-TRUST",
          tr: "SIFIR GÜVEN",
        },
        pills: ["Docker", "Azure DevOps", "CI/CD", "JWT/OAuth2", "RBAC", "GitLab"],
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
      en: "Beyond commercial systems: exploratory laboratories testing low-latency binary streams, in-browser Roslyn compiler runtimes, and experimental motion physics.",
      tr: "Ticari sistemlerin ötesinde: düşük gecikmeli ikili veri akışlarını, tarayıcı içi Roslyn derleyici çalışma ortamını ve hareket fiziğini test eden deneysel laboratuvarlar.",
    },
    items: [
      {
        id: "cruwells-vox",
        title: {
          en: "Cruwell's Vox Low-Latency Audio & Comms",
          tr: "Cruwell's Vox Düşük Gecikmeli Ses & İletişim",
        },
        badgeText: {
          en: "EXPERIMENTAL LAB",
          tr: "DENEYSEL LAB",
        },
        tabLabel: {
          en: "CRUWELL'S : EXPERIMENTAL",
          tr: "CRUWELL'S : DENEYSEL",
        },
        period: "2024",
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
          ".NET Core",
          "C#",
          "WebSockets",
          "React",
          "TypeScript",
          "Web Audio API",
          "Redis Pub/Sub",
        ],
        imagePath: "/assets/comic_realtime_engine.jpg",
        githubUrl: "https://github.com/Berkawaii/cruwells-vox",
        liveUrl: "https://cruwellsvox.dev",
      },
      {
        id: "syntax-factory",
        title: {
          en: "Syntax Factory Roslyn WASM Engine",
          tr: "Syntax Factory Roslyn WASM Motoru",
        },
        badgeText: {
          en: "WASM PROTOTYPE",
          tr: "WASM PROTOTİPİ",
        },
        tabLabel: {
          en: "SYNTAX : WASM PROTOTYPE",
          tr: "SYNTAX : WASM PROTOTİPİ",
        },
        period: "2023 - 2024",
        summary: {
          en: "Web-based simulation and interactive C# code generation game powered by real-time in-browser Roslyn compiler execution via WebAssembly.",
          tr: "WebAssembly aracılığıyla tarayıcı içinde gerçek zamanlı Roslyn derleyici çalıştırma destekli web simülasyonu ve interaktif C# kod üretim oyunu.",
        },
        architectureDetails: {
          en: "Roslyn syntax tree visitor running entirely client-side via Mono WASM runtime with isolated heap bounds.",
          tr: "İzole yığın sınırlarına sahip Mono WASM çalışma zamanı ile tamamen istemci tarafında çalışan Roslyn sözdizimi ağacı gezgini.",
        },
        impactMetricsEn: [
          "In-browser C# Roslyn compilation without server compute roundtrips",
          "Interactive AST inspection and visual syntax graph construction",
          "Deterministic code sandbox preventing memory leaks and runaway loops",
        ],
        impactMetricsTr: [
          "Sunucuya ihtiyaç duymadan tarayıcı içinde doğrudan C# Roslyn derlemesi",
          "İnteraktif AST incelemesi ve görsel sözdizimi grafiği oluşturma",
          "Bellek sızıntılarını ve sonsuz döngüleri önleyen deterministik kod yalıtım alanı",
        ],
        techStack: [
          "C#",
          ".NET WASM",
          "Roslyn Compiler API",
          "React",
          "TypeScript",
          "Tailwind CSS",
        ],
        githubUrl: "https://github.com/Berkawaii",
        liveUrl: "https://syntaxfactory.dev",
      },
      {
        id: "gri-archive",
        title: {
          en: "Gri Archive Interactive Creative Lab",
          tr: "Gri Arşiv İnteraktif Yaratıcı Lab",
        },
        badgeText: {
          en: "UI EXPERIMENT",
          tr: "ARAYÜZ DENEYİ",
        },
        tabLabel: {
          en: "GRI : UI EXPERIMENT",
          tr: "GRI : ARAYÜZ DENEYİ",
        },
        period: "2023",
        summary: {
          en: "Curated frontend interactive archive and experimentation lab testing experimental layout models, micro-physics, and high-performance DOM render loops.",
          tr: "Deneysel yerleşim modellerini, mikro fizik hareketlerini ve yüksek performanslı DOM render döngülerini test eden yaratıcı ön yüz arşivi.",
        },
        architectureDetails: {
          en: "Custom render scheduler synchronizing CSS transform matrices with device refresh rates.",
          tr: "CSS dönüşüm matrislerini cihaz yenileme hızlarıyla senkronize eden özel render zamanlayıcı.",
        },
        impactMetricsEn: [
          "60fps hardware-accelerated fluid motion transitions",
          "Zero layout shift design architecture with strict container bounds",
          "Minimal DOM footprint with dynamic canvas rendering fallback",
        ],
        impactMetricsTr: [
          "60fps donanım hızlandırmalı akıcı hareket geçişleri",
          "Katı kapsayıcı sınırlarıyla sıfır kümülatif düzen kayması (CLS)",
          "Dinamik tuval (canvas) çizim yedeğiyle minimal DOM ayak izi",
        ],
        techStack: [
          "Next.js",
          "TypeScript",
          "Canvas API",
          "Web Animations API",
          "Tailwind CSS",
        ],
        githubUrl: "https://github.com/Berkawaii",
        liveUrl: "https://griarchive.com",
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
        period: "SEP 2021 - PRESENT (EXP. 2026)",
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
      en: "READY TO ENGINEER BULLETPROOF SYSTEMS?",
      tr: "DAYANIKLI SİSTEMLER İNŞA ETMEYE HAZIR MISINIZ?",
    },
    subtext: {
      en: "Whether you need enterprise microservice consolidation, high-concurrency mobile field architectures, or resilient fintech backends, let us talk systems.",
      tr: "Kurumsal mikroservis dönüşümü, yüksek eşzamanlı mobil saha mimarileri veya sağlam fintek arkayüzleri için sistemleri konuşalım.",
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
      en: "Senior Full Stack & Mobile Architect. Engineered with .NET Core, Flutter, and Google Cloud Firestore.",
      tr: "Kıdemli Full Stack & Mobil Mimarı. .NET Core, Flutter ve Google Cloud Firestore ile geliştirilmiştir.",
    },
    socialHeading: {
      en: "ONLINE PRESENCE:",
      tr: "ÇEVRİMİÇİ PROFİLLER:",
    },
    linkedinUrl: "https://linkedin.com/in/berkayacar",
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

export const SITE_CONTENT_LOCAL_STORAGE_KEY = "berkay_portfolio_site_content_v4";

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
            items: (parsed.caseStudiesSection?.items || DEFAULT_SITE_CONTENT.caseStudiesSection.items).map((item: CaseStudyItem, i: number) => {
              const defaultItem = DEFAULT_SITE_CONTENT.caseStudiesSection.items[i];
              return {
                ...defaultItem,
                ...item,
                role: item.role?.en?.includes("Architect") ? (defaultItem?.role || item.role) : (item.role || defaultItem?.role),
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
            items: (parsed.labSection?.items || DEFAULT_SITE_CONTENT.labSection.items).map((item: LabItem, i: number) => {
              const defaultItem = DEFAULT_SITE_CONTENT.labSection.items[i];
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
            items: (data.caseStudiesSection?.items || DEFAULT_SITE_CONTENT.caseStudiesSection.items).map((item: CaseStudyItem, i: number) => {
              const defaultItem = DEFAULT_SITE_CONTENT.caseStudiesSection.items[i];
              return {
                ...defaultItem,
                ...item,
                role: item.role?.en?.includes("Architect") ? (defaultItem?.role || item.role) : (item.role || defaultItem?.role),
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
            items: (data.labSection?.items || DEFAULT_SITE_CONTENT.labSection.items).map((item: LabItem, i: number) => {
              const defaultItem = DEFAULT_SITE_CONTENT.labSection.items[i];
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
