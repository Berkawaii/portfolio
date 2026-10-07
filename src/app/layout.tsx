import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Berkay Acar : Senior Full Stack & Mobile Architect",
  description:
    "Senior Systems & Mobile Architect specialized in high-concurrency .NET Core microservices, cross-platform Flutter engines, and agentic AI pipelines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakartaSans.variable} ${spaceMono.variable}`}>
      <body
        suppressHydrationWarning
        className="min-h-[100dvh] bg-[#F5EFE6] text-black font-sans antialiased selection:bg-[#FF5400] selection:text-white"
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
