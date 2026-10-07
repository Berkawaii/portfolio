"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Terminal, House, ArrowBendUpLeft } from "@phosphor-icons/react";
import { useLanguage } from "@/context/LanguageContext";

interface HistoryEntry {
  type: "input" | "output" | "error" | "ascii";
  text: string;
}

export default function TerminalPage() {
  const { lang, setLang } = useLanguage();
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      type: "ascii",
      text: `
  ____  _____ ____  _  __    _ __   __     _    ____    _    ____  
 | __ )| ____|  _ \\| |/ /   / \\\\ \\ / /    / \\  / ___|  / \\  |  _ \\ 
 |  _ \\|  _| | |_) | ' /   / _ \\\\ V /    / _ \\| |     / _ \\ | |_) |
 | |_) | |___|  _ <| . \\  / ___ \\| |    / ___ \\ |___ / ___ \\|  _ < 
 |____/|_____|_| \\_\\_|\\_\\/_/   \\_\\_|   /_/   \\_\\____/_/   \\_\\_| \\_\\
      -- SENIOR FULL STACK & DISTRIBUTED SYSTEMS ARCHITECT --
      `,
    },
    {
      type: "output",
      text:
        lang === "en"
          ? 'Welcome to Berkay Acar Interactive Architecture Console v2.4.\nType "help" to view available diagnostic commands or "cv" to download resume.'
          : 'Berkay Acar Mimari İnteraktif Konsol v2.4\'e hoş geldiniz.\nKullanılabilir komutları görmek için "help", özgeçmiş için "cv" yazınız.',
    },
  ]);

  const [inputVal, setInputVal] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Add command to history
    setCmdHistory((prev) => [rawCmd, ...prev]);
    setHistoryIndex(-1);

    const newHistory: HistoryEntry[] = [
      ...history,
      { type: "input", text: `guest@berkayacar:~$ ${rawCmd}` },
    ];

    switch (cmd) {
      case "help":
        newHistory.push({
          type: "output",
          text: `AVAILABLE COMMANDS:
  help       - Print this command reference
  whoami     - Architectural background & profile summary
  skills     - Technical arsenal (C#, .NET, Flutter, Cloud, AI)
  projects   - Production enterprise & R&D lab systems
  cv         - Download Berkay Acar Resume (PDF)
  contact    - Dispatch direct communication channels
  status     - Query live telemetry & SLA dashboard
  skate      - Execute kickflip skateboard routine
  coffee     - Brew double-shot espresso
  matrix     - Toggle visual cyberspace stream
  clear      - Clear terminal screen buffer
  exit       - Return to visual portfolio homepage`,
        });
        break;

      case "whoami":
        newHistory.push({
          type: "output",
          text: `[PROFILE IDENTIFIER]
NAME      : Berkay Acar
TITLE     : Senior Full Stack & Mobile Architect
LOCATION  : Istanbul, Turkey
EXPERIENCE: 5+ Years High-Concurrency Distributed Systems
PORTFOLIO : Architected enterprise engines serving 30,000+ corporate clients with 99.99% uptime.`,
        });
        break;

      case "skills":
        newHistory.push({
          type: "output",
          text: `[TECHNICAL ARSENAL]
CORE BACKEND  : .NET Core 8/9, C#, ASP.NET Microservices, Entity Framework Core, Dapper
MOBILE ENGINE : Flutter, Dart, Android Native, iOS Swift, State Management (Bloc, Riverpod)
DATA & PUB/SUB: PostgreSQL, Redis In-Memory Ring Buffers, Google Cloud Firestore, Kafka
INFRA & CLOUD : Docker, Kubernetes, CI/CD GitHub Actions, Firebase Hosting, Cloud Run
DISTRIBUTED   : WebSockets High-Throughput Pipelines, WebAudio API, Mono WASM Compilation`,
        });
        break;

      case "projects":
        newHistory.push({
          type: "output",
          text: `[KEY ARCHITECTURAL PROJECTS]
1. UniCoWallet Platform & Autonomous Assistant (Fintech Core, 500+ users, Flutter/.NET)
2. Mobile Field Operations Engine (30,000+ B2B clients, sub-100ms offline sync)
3. Cruwell's Vox Real-Time Voice Lab (Sub-20ms audio packet dispatch over WebSockets)
4. Syntax Factory Roslyn WASM (Client-side C# compiler running on WebAssembly)
5. Gri Archive (60fps canvas micro-physics layout engine)`,
        });
        break;

      case "cv":
      case "resume":
        if (typeof window !== "undefined") {
          window.open("/berkay_acar_cv.pdf", "_blank");
        }
        newHistory.push({
          type: "output",
          text: "INITIATING DOWNLOAD: Berkay_Acar_CV.pdf dispatched to browser in new tab.",
        });
        break;

      case "contact":
        newHistory.push({
          type: "output",
          text: `[DIRECT DISPATCH CHANNELS]
EMAIL    : acar.berkai@gmail.com
PHONE    : +90 554 428 04 04
LINKEDIN : https://linkedin.com/in/im-berkay
GITHUB   : https://github.com/berkayacar`,
        });
        break;

      case "status":
        newHistory.push({
          type: "output",
          text: "NAVIGATING: Teleporting to /status telemetry dashboard...",
        });
        setTimeout(() => {
          if (typeof window !== "undefined") {
            window.location.href = "/status";
          }
        }, 600);
        break;

      case "skate":
        newHistory.push({
          type: "ascii",
          text: `
      \\O/   *KICKFLIP EXECUTED!*
       |    
      / \\   
   ===========
     O     O  --> CLEAN LANDING ON CONCRETE!
          `,
        });
        break;

      case "coffee":
        newHistory.push({
          type: "ascii",
          text: `
      ( (
       ) )
    .______.
    |      |]  BREWING DOUBLE-SHOT DARK ROAST ESPRESSO...
    \\______/   SYSTEM ENERGY RECHARGED +100%
          `,
        });
        break;

      case "matrix":
        newHistory.push({
          type: "output",
          text: "01000010 01000101 01010010 01001011 01000001 01011001 00100000 01000001 01000011 01000001 01010010\n[CYBERSPACE DECRYPTED]: Wake up, Neo... The architecture is distributed.",
        });
        break;

      case "clear":
        setHistory([]);
        setInputVal("");
        return;

      case "exit":
        newHistory.push({
          type: "output",
          text: "Returning to mission control...",
        });
        setTimeout(() => {
          if (typeof window !== "undefined") {
            window.location.href = "/";
          }
        }, 400);
        break;

      default:
        newHistory.push({
          type: "error",
          text: `bash: command not found: "${rawCmd}". Type "help" to inspect valid architecture commands.`,
        });
        break;
    }

    setHistory(newHistory);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(inputVal);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length > 0 && historyIndex < cmdHistory.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const prevIdx = historyIndex - 1;
        setHistoryIndex(prevIdx);
        setInputVal(cmdHistory[prevIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal("");
      }
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="min-h-[100dvh] bg-[#0a0a0a] text-[#33ff33] font-mono flex flex-col justify-between selection:bg-[#33ff33] selection:text-black p-4 sm:p-6 lg:p-8 cursor-text relative overflow-x-hidden"
    >
      {/* Subtle CRT scanline effect */}
      <div
        style={{
          backgroundImage:
            "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%)",
          backgroundSize: "100% 4px",
        }}
        className="fixed inset-0 pointer-events-none z-30 opacity-40"
      />

      {/* Top Header / Bar */}
      <header className="relative z-20 flex items-center justify-between border-b-2 border-[#33ff33]/40 pb-3 mb-4">
        <div className="flex items-center gap-2 text-xs">
          <Terminal size={18} weight="bold" className="text-[#33ff33]" />
          <span className="font-bold tracking-wider uppercase text-white">
            BERKAY ACAR // HACKER CONSOLE [TTY-1]
          </span>
          <span className="hidden sm:inline text-white/50">// LATENCY: SUB-1MS</span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-[#33ff33] text-[#33ff33] hover:bg-[#33ff33] hover:text-black transition-colors"
          >
            <House size={14} weight="bold" />
            <span>EXIT TO GUI</span>
          </Link>
        </div>
      </header>

      {/* Terminal Output Area */}
      <main className="relative z-20 flex-1 space-y-3 overflow-y-auto text-xs sm:text-sm leading-relaxed">
        {history.map((entry, idx) => {
          if (entry.type === "input") {
            return (
              <div key={idx} className="text-white font-bold">
                {entry.text}
              </div>
            );
          }
          if (entry.type === "error") {
            return (
              <div key={idx} className="text-[#ff3366]">
                {entry.text}
              </div>
            );
          }
          if (entry.type === "ascii") {
            return (
              <pre
                key={idx}
                className="text-[#CCFF00] font-mono text-[10px] sm:text-xs leading-none whitespace-pre overflow-x-auto py-1"
              >
                {entry.text}
              </pre>
            );
          }
          return (
            <div key={idx} className="text-[#a0ffa0] whitespace-pre-line">
              {entry.text}
            </div>
          );
        })}

        {/* Live Input Line */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-white font-bold shrink-0">guest@berkayacar:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1 bg-transparent text-[#33ff33] border-none outline-none font-mono text-xs sm:text-sm p-0 m-0 focus:ring-0"
          />
        </div>

        <div ref={terminalEndRef} />
      </main>

      {/* Bottom Status Ticker */}
      <footer className="relative z-20 border-t border-[#33ff33]/30 pt-3 mt-4 flex flex-wrap items-center justify-between text-[11px] text-white/50">
        <div>HINT: Type "help" for instructions, or press UP/DOWN arrows for command recall.</div>
        <div className="text-[#33ff33]">AUTHENTICATED // LEVEL_5 ROOT CLEARANCE</div>
      </footer>
    </div>
  );
}
