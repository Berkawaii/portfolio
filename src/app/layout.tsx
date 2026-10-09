import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "700", "800"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "700"],
});

const SITE_URL = "https://berkayacar.web.app";

export const viewport: Viewport = {
  themeColor: "#FF5400",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Berkay Acar : Senior Full Stack & Mobile Engineer",
    template: "%s | Berkay Acar",
  },
  description:
    "Senior Full Stack & Mobile Engineer specialized in high-concurrency .NET Core microservices, cross-platform Flutter engines, and resilient B2B enterprise solutions.",
  keywords: [
    "Berkay Acar",
    "Berkay Acar Portfolio",
    "Berkay Acar Engineer",
    "Senior Full Stack Engineer",
    "Senior Mobile Engineer",
    "Flutter Architecture",
    ".NET Core Microservices",
    "Berkawaii",
  ],
  authors: [{ name: "Berkay Acar", url: SITE_URL }],
  creator: "Berkay Acar",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    firstName: "Berkay",
    lastName: "Acar",
    username: "Berkawaii",
    title: "Berkay Acar : Senior Full Stack & Mobile Engineer",
    description:
      "Senior Full Stack & Mobile Engineer specialized in high-concurrency .NET Core microservices, cross-platform Flutter engines, and resilient B2B enterprise solutions.",
    url: SITE_URL,
    siteName: "Berkay Acar Portfolio",
    locale: "en_US",
    images: [
      {
        url: "/assets/comic_hero_mascot.jpg",
        width: 1200,
        height: 630,
        alt: "Berkay Acar - Senior Full Stack & Mobile Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Berkay Acar : Senior Full Stack & Mobile Engineer",
    description:
      "Senior Full Stack & Mobile Engineer specialized in high-concurrency .NET Core microservices, cross-platform Flutter engines, and resilient B2B enterprise solutions.",
    images: ["/assets/comic_hero_mascot.jpg"],
    creator: "@Berkawaii",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "googleb32cd446bf43c2b0",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Berkay Acar",
      givenName: "Berkay",
      familyName: "Acar",
      jobTitle: "Senior Full Stack & Mobile Engineer",
      url: SITE_URL,
      image: `${SITE_URL}/assets/comic_hero_mascot.jpg`,
      sameAs: [
        "https://github.com/Berkawaii",
        "https://linkedin.com/in/im-berkay",
      ],
      knowsAbout: [
        ".NET Core",
        "Flutter",
        "TypeScript",
        "Next.js",
        "Distributed Systems",
        "Microservices Architecture",
        "High-Concurrency Engines",
        "WebSockets",
      ],
      description:
        "Senior Systems & Mobile Developer specialized in high-concurrency .NET Core microservices, cross-platform Flutter engines, and agentic AI pipelines.",
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: "Berkay Acar : Portfolio & Systems Architecture",
      isPartOf: {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Berkay Acar Engineering Portfolio",
      },
      about: { "@id": `${SITE_URL}/#person` },
      mainEntity: { "@id": `${SITE_URL}/#person` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakartaSans.variable} ${spaceMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-[100dvh] bg-[#F5EFE6] text-black font-sans antialiased selection:bg-[#FF5400] selection:text-white"
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
