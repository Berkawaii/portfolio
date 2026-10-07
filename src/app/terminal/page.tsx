"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Terminal, House, FastForward } from "@phosphor-icons/react";
import { useLanguage } from "@/context/LanguageContext";

interface HistoryEntry {
  type: "input" | "output" | "error" | "ascii" | "matrix" | "system";
  text: string;
}

interface VirtualFile {
  type: "file";
  size: string;
  date: string;
  content: string;
}

interface VirtualDir {
  type: "dir";
  date: string;
  children: Record<string, VirtualNode>;
}

type VirtualNode = VirtualFile | VirtualDir;

// Virtual Filesystem Definition with Deep-Dive Architecture Specs
const VIRTUAL_FS: Record<string, VirtualNode> = {
  projects: {
    type: "dir",
    date: "Oct 07 15:30",
    children: {
      unicowallet: {
        type: "dir",
        date: "Oct 07 14:00",
        children: {
          "README.md": {
            type: "file",
            size: "1.8K",
            date: "Oct 07 14:00",
            content: `================================================================================
UNICOWALLET - HIGH-CONCURRENCY FINANCIAL TRANSACTION ORCHESTRATION PLATFORM
================================================================================
Domain       : Autonomous Fintech Infrastructure & Micro-Transactions
Active Scale : 30,000+ Enterprise Clients | Sub-50ms Transaction Latency
Availability : 99.99% Production SLA across high-traffic operating windows
Lead Tech    : .NET 8 Microservices, C#, PostgreSQL, Redis, Flutter, Docker

DESCRIPTION:
An automated, multi-account financial transaction orchestration engine designed
to eliminate human latency in high-frequency payment verification workflows.
Features asynchronous queue processing, AES-256 encrypted payload envelopes,
and distributed idempotency validation.`,
          },
          "architecture.md": {
            type: "file",
            size: "2.4K",
            date: "Oct 07 14:05",
            content: `UNICOWALLET ARCHITECTURE SPECIFICATION:
--------------------------------------------------------------------------------
1. Ingress Tier:
   - High-throughput API gateway built on ASP.NET Core Kestrel engine.
   - Token bucket rate limiting with Redis-backed distributed state.

2. Event & Message Dispatch:
   - Decoupled asynchronous consumer queues with distributed idempotency keys.
   - Resilient circuit breakers with Polly policies preventing cascading panics.

3. Persistence & Caching:
   - PostgreSQL master-replica topology with connection pooling via PgBouncer.
   - Redis in-memory ring buffers caching active sessions and balance snapshots.

4. Client Frontend:
   - Cross-platform Flutter engine running on iOS, Android, and Desktop targets.
   - Offline-first cache layer with sub-100ms delta reconciliation.`,
          },
          "specs.json": {
            type: "file",
            size: "612B",
            date: "Oct 07 14:10",
            content: `{
  "system": "Unicowallet Engine",
  "version": "4.2.0-prod",
  "clientCount": 30000,
  "p99LatencyMs": 48.2,
  "uptimePercent": 99.99,
  "stack": [".NET 8", "C#", "PostgreSQL", "Redis", "Flutter", "Docker"],
  "security": ["AES-256", "HMAC-SHA256", "Zero-Trust RBAC"]
}`,
          },
        },
      },
      aegis: {
        type: "dir",
        date: "Oct 07 14:00",
        children: {
          "README.md": {
            type: "file",
            size: "1.6K",
            date: "Oct 07 14:00",
            content: `================================================================================
AEGIS - AUTONOMOUS PUZZLE & MATHEMATICAL CONSTRAINT ENGINE
================================================================================
Domain       : Algorithmic Game Systems & Heuristic Evaluation
Throughput   : Millions of state transitions evaluated per generation cycle
Engine       : Unity, C#, Custom Constraint Satisfaction Solver (CSP)

DESCRIPTION:
A deterministic procedural puzzle generation and constraint verification system.
Constructed using forward checking, minimum remaining values (MRV) heuristics,
and state-space graph traversal to guarantee mathematical solvability.`,
          },
          "algorithms.md": {
            type: "file",
            size: "1.9K",
            date: "Oct 07 14:15",
            content: `AEGIS MATHEMATICAL & ALGORITHMIC SPECIFICATION:
--------------------------------------------------------------------------------
1. Constraint Satisfaction Engine (CSP):
   - Backtracking search combined with AC-3 arc consistency algorithms.
   - Dynamic variable ordering based on degree heuristic and MRV.

2. Solvability Verification:
   - Deterministic forward graph traversal proving puzzle completion paths.
   - Elimination of dead-end configurations prior to client asset compilation.

3. Execution Target:
   - Optimized C# memory layout with zero garbage collection allocations.
   - SIMD-friendly struct arrays achieving 60fps tick stability on mobile.`,
          },
        },
      },
      "cruwells-vox": {
        type: "dir",
        date: "Oct 07 14:00",
        children: {
          "README.md": {
            type: "file",
            size: "1.7K",
            date: "Oct 07 14:00",
            content: `================================================================================
CRUWELL'S VOX - DISTRIBUTED LOW-LATENCY SPATIAL AUDIO MESH
================================================================================
Domain       : Real-Time Networked Audio & Spatial Telemetry
Latency      : Sub-20ms packet dispatch across distributed node mesh
Protocol     : WebRTC, C#, WebSockets, Binary Audio Frame Packing

DESCRIPTION:
An experimental distributed voice mesh providing positional 3D audio telemetry
over high-jitter network conditions. Implements custom ring-buffer jitter
smoothing and zero-copy binary audio serialization.`,
          },
          "protocol.md": {
            type: "file",
            size: "2.1K",
            date: "Oct 07 14:20",
            content: `CRUWELL'S VOX NETWORK PROTOCOL SPEC:
--------------------------------------------------------------------------------
1. Binary Serialization:
   - Custom 16-byte packed telemetry headers with microsecond timestamps.
   - OPUS audio frames serialized with variable bitrate adaptive compression.

2. Spatial Positioning:
   - 3D Cartesian coordinates (X, Y, Z) and head orientation quaternions.
   - Dynamic HRTF (Head-Related Transfer Function) calculation in client WebAudio.

3. Fault Recovery:
   - Predictive packet loss concealment (PLC) minimizing audio clipping.
   - Automatic mesh topology failover upon node packet drop exceeding 5%.`,
          },
        },
      },
      "tactical-football": {
        type: "dir",
        date: "Oct 07 14:00",
        children: {
          "README.md": {
            type: "file",
            size: "1.6K",
            date: "Oct 07 14:00",
            content: `================================================================================
TACTICAL FOOTBALL SIM - DETERMINISTIC SPORTS SIMULATION ENGINE
================================================================================
Domain       : Simulation Architecture & Sports Spatial Analytics
Tick Rate    : 60Hz deterministic physics lockstep across 22 concurrent agents
Stack        : C#, Spatial Hash Partitioning, Event-Driven Architecture

DESCRIPTION:
A deterministic 2D/3D soccer simulation engine featuring 22 autonomous agents
making continuous tactical decisions using spatial influence maps and
raycast passing lanes.`,
          },
          "physics_engine.md": {
            type: "file",
            size: "1.8K",
            date: "Oct 07 14:25",
            content: `TACTICAL FOOTBALL SIM ENGINE DETAILS:
--------------------------------------------------------------------------------
1. Spatial Partitioning:
   - Uniform grid hash spatial index reducing collision complexity from O(n^2) to O(1).
   - Dynamic player proximity query caches updated every physics frame.

2. Deterministic Lockstep:
   - Fixed-point integer arithmetic ensuring bit-identical replay simulation.
   - State snapshot serialization enabling instant scrubbing and rewind analysis.`,
          },
        },
      },
      "chastity-museum": {
        type: "dir",
        date: "Oct 07 14:00",
        children: {
          "README.md": {
            type: "file",
            size: "1.5K",
            date: "Oct 07 14:00",
            content: `================================================================================
CHASTITY VIRTUAL MUSEUM - INTERACTIVE SPATIAL WEBGL GALLERY
================================================================================
Domain       : GPU Web Graphics & Spatial Interactive Interface
Render Rate  : Solid 60fps WebGL pipeline across desktop & mobile viewports
Stack        : Three.js, WebGL Shaders, Next.js, Dynamic Asset Streaming

DESCRIPTION:
An interactive spatial museum platform delivering curated virtual exhibits with
dynamic texture LOD streaming, ambient occlusion shaders, and spatial navigation.`,
          },
        },
      },
    },
  },
  "README.md": {
    type: "file",
    size: "2.1K",
    date: "Oct 07 15:30",
    content: `================================================================================
BERKAY ACAR - ARCHITECTURAL PORTFOLIO & DIAGNOSTICS CONSOLE
================================================================================
Welcome to the interactive engineering terminal for Berkay Acar, Senior Full-Stack
and Mobile Systems Architect.

QUICK START:
  - Type "projects" to view the complete production systems breakdown.
  - Type "cd projects" and "ls" to explore project folders in the virtual filesystem.
  - Type "cat projects/unicowallet/architecture.md" to inspect deep technical specs.
  - Type "resume" to download the official PDF curriculum vitae.
  - Type "skills" for the complete backend, mobile, and cloud technical arsenal.
  - Type "coffee" or "skate" for interactive ASCII animations.`,
  },
  "Berkay_Acar_Resume.pdf": {
    type: "file",
    size: "120K",
    date: "Oct 07 15:35",
    content: `[BINARY DOCUMENT REFERENCE: /Berkay_Acar_Resume.pdf]
Type "resume" to download and open the official PDF resume in your browser.`,
  },
  "skills.txt": {
    type: "file",
    size: "1.4K",
    date: "Oct 07 14:00",
    content: `[TECHNICAL ARSENAL SUMMARY]
CORE BACKEND  : .NET Core 8/9, C#, ASP.NET Microservices, Entity Framework Core, Dapper
MOBILE ENGINE : Flutter, Dart, Android Native, iOS Swift, State Management (Bloc, Riverpod)
DATA & PUBSUB : PostgreSQL, Redis Ring Buffers, Google Cloud Firestore, Kafka
INFRA & CLOUD : Docker, Kubernetes, CI/CD GitHub Actions, Firebase Hosting, Cloud Run
DISTRIBUTED   : WebSockets Pipelines, WebRTC, Mono WASM Compilation, Zero-Trust IAM`,
  },
  "contact.json": {
    type: "file",
    size: "380B",
    date: "Oct 07 14:00",
    content: `{
  "name": "Berkay Acar",
  "title": "Senior Full-Stack & Mobile Software Architect",
  "email": "acar.berkai@gmail.com",
  "phone": "+90 554 428 04 04",
  "location": "Istanbul, Turkey",
  "linkedin": "https://linkedin.com/in/im-berkay",
  "github": "https://github.com/Berkawaii"
}`,
  },
};

const MATRIX_INTRO_LINES = [
  "Wake up, Neo...",
  "The Matrix has you...",
  "Follow the white rabbit.",
  "Knock, knock, Neo.",
];

export default function TerminalPage() {
  const { lang } = useLanguage();

  // Matrix Boot Typewriter Sequence State
  const [bootCompleted, setBootCompleted] = useState(false);
  const [introStep, setIntroStep] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Virtual Filesystem State
  const [currentPath, setCurrentPath] = useState<string>("~");

  // Terminal History State
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isAnimating, setIsAnimating] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Matrix Typewriter Opening Animation Effect
  useEffect(() => {
    // If intro already skipped or completed, do nothing
    if (bootCompleted) return;

    if (introStep < MATRIX_INTRO_LINES.length) {
      const targetLine = MATRIX_INTRO_LINES[introStep];
      let charIdx = 0;
      setDisplayedText("");
      setIsTyping(true);

      const typeInterval = setInterval(() => {
        if (charIdx <= targetLine.length) {
          setDisplayedText(targetLine.slice(0, charIdx));
          charIdx++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          // Pause between lines
          const pauseTimeout = setTimeout(() => {
            setIntroStep((prev) => prev + 1);
          }, 950);
          return () => clearTimeout(pauseTimeout);
        }
      }, 55);

      return () => clearInterval(typeInterval);
    } else {
      // Intro complete, boot into interactive shell
      completeBoot();
    }
  }, [introStep, bootCompleted]);

  const completeBoot = () => {
    setBootCompleted(true);
    setHistory([
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
        type: "system",
        text: `[SYSTEM KERNEL BOOT COMPLETE]
Interactive Architecture Terminal v3.0 [TTY-1] initialized.
Virtual filesystem mounted at /home/guest (~).
Type "help" for command matrix, "projects" for architecture, or "resume" to download PDF.`,
      },
    ]);
  };

  const skipBoot = () => {
    completeBoot();
  };

  useEffect(() => {
    if (bootCompleted) {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [history, bootCompleted]);

  // Virtual Filesystem Helper: Resolve node by path
  const resolveNode = (pathStr: string): { node: VirtualNode | null; path: string } => {
    let cleanPath = pathStr.trim();
    if (cleanPath === "~" || cleanPath === "") {
      return {
        node: { type: "dir", date: "Oct 07 15:30", children: VIRTUAL_FS },
        path: "~",
      };
    }

    // Normalize relative paths
    let fullPath = cleanPath;
    if (!cleanPath.startsWith("~")) {
      fullPath = currentPath === "~" ? `~/${cleanPath}` : `${currentPath}/${cleanPath}`;
    }

    // Split segments
    const segments = fullPath.replace(/^~\/?/, "").split("/").filter(Boolean);
    let curr: VirtualNode = { type: "dir", date: "Oct 07 15:30", children: VIRTUAL_FS };

    for (const seg of segments) {
      if (seg === ".") continue;
      if (seg === "..") {
        // Can't easily go above with this loop alone, handled in cd
        continue;
      }
      if (curr.type !== "dir" || !curr.children[seg]) {
        return { node: null, path: fullPath };
      }
      curr = curr.children[seg];
    }

    return { node: curr, path: fullPath };
  };

  // Command Execution Handler
  const handleCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed || isAnimating) return;

    setCmdHistory((prev) => [rawCmd, ...prev]);
    setHistoryIndex(-1);

    const promptSymbol = `guest@berkayacar:${currentPath}$ ${rawCmd}`;
    const newHistory: HistoryEntry[] = [
      ...history,
      { type: "input", text: promptSymbol },
    ];

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ");

    switch (cmd) {
      case "help":
        newHistory.push({
          type: "output",
          text: `AVAILABLE COMMANDS:
  help              - Display this command matrix
  whoami            - Architect profile, experience & leadership
  skills            - Technical competency arsenal (.NET, Flutter, Cloud, WebGL)
  projects          - Comprehensive enterprise & R&D projects overview (from README)
  cd <dir>          - Navigate virtual directories (e.g. "cd projects", "cd ..")
  ls / dir          - List files & directories in current path
  cat <file>        - Inspect file contents (e.g. "cat architecture.md")
  pwd               - Print current virtual working directory
  resume            - Download Berkay Acar Resume (PDF: Berkay_Acar_Resume.pdf)
  cv                - Alias for "resume"
  contact           - Display communication channels and direct coordinates
  status            - Teleport to live edge latency & SLA dashboard (/status)
  skate             - Execute 4-frame animated kickflip sequence
  coffee            - Brew multi-stage artisanal double-shot espresso
  matrix            - Replay cyberspace digital matrix rain
  clear             - Flush terminal screen buffer
  exit              - Return to graphical portfolio homepage`,
        });
        break;

      case "whoami":
        newHistory.push({
          type: "output",
          text: `[PROFILE: BERKAY ACAR]
TITLE     : Senior Full-Stack & Mobile Software Architect
EXPERIENCE: 5+ Years High-Concurrency Distributed Systems & Mobile Engineering
LOCATION  : Istanbul, Turkey
PORTFOLIO : https://berkayacar.web.app
GITHUB    : https://github.com/Berkawaii
LINKEDIN  : https://linkedin.com/in/im-berkay
SUMMARY   : Architected mission-critical enterprise platforms serving 30,000+ corporate
            clients with sub-50ms latency, high-throughput microservices, and 99.99% uptime.`,
        });
        break;

      case "skills":
        newHistory.push({
          type: "output",
          text: `[ENGINEERING ARSENAL & CORE COMPETENCIES]
CORE BACKEND  : .NET Core 8/9, C#, ASP.NET Microservices, Entity Framework Core, Dapper
MOBILE ENGINE : Flutter, Dart, Android Native, iOS Swift, State Management (Bloc, Riverpod)
DATA & PUBSUB : PostgreSQL, Redis Ring Buffers, Google Cloud Firestore, Apache Kafka
INFRA & CLOUD : Docker, Kubernetes, CI/CD GitHub Actions, Firebase Hosting, Cloud Run
DISTRIBUTED   : WebSockets High-Throughput Pipelines, WebAudio API, Mono WASM, WebGL`,
        });
        break;

      case "projects":
        newHistory.push({
          type: "output",
          text: `================================================================================
                    PRODUCTION SYSTEMS & R&D LABS REGISTRY                      
================================================================================

[1] UNICOWALLET - AUTONOMOUS MULTI-ACCOUNT INFRASTRUCTURE
    Category     : High-Concurrency Financial Tech & Distributed Systems
    Scale        : 30,000+ Active Clients | Sub-50ms Latency | 99.99% SLA
    Architecture : .NET 8 Microservices, PostgreSQL, Redis ring buffers, AES-256
    Capabilities : Concurrent transaction orchestration, idempotency keys, circuit breakers
    Virtual Path : ~/projects/unicowallet/

[2] AEGIS - AUTONOMOUS PUZZLE & CONSTRAINT ENGINE
    Category     : Algorithmic Game Systems & Heuristic Evaluation
    Scale        : Millions of state transitions evaluated per cycle
    Architecture : Unity, C#, Constraint Satisfaction (CSP), State-Space Graph Traversal
    Capabilities : Deterministic level generation, board validation, mathematical proofs
    Virtual Path : ~/projects/aegis/

[3] CRUWELL'S VOX - SPATIAL AUDIO TELEMETRY MESH
    Category     : Low-Latency Networked Communications
    Scale        : Sub-20ms audio packet dispatch | Zero packet reordering loss
    Architecture : WebRTC, C#, WebSockets, Binary Audio Serialization
    Capabilities : Spatial positioning audio packets, jitter buffer mitigation, mesh routing
    Virtual Path : ~/projects/cruwells-vox/

[4] TACTICAL FOOTBALL SIM - DETERMINISTIC SPORTS PHYSICS
    Category     : Simulation Engine & Sports Analytics
    Scale        : 60Hz deterministic physics tick rate across 22 concurrent agents
    Architecture : Spatial Partitioning, Event-Driven State Synchronization
    Capabilities : Multi-agent spatial tactical decision engines, deterministic simulation cycles
    Virtual Path : ~/projects/tactical-football/

[5] CHASTITY VIRTUAL MUSEUM - INTERACTIVE SPATIAL GALLERY
    Category     : WebGL Graphics & Spatial Web Interface
    Scale        : 60fps WebGL rendering across desktop and mobile viewports
    Architecture : Three.js, WebGL Shaders, Next.js, Dynamic Asset Streaming
    Capabilities : GPU-accelerated 3D environment rendering, progressive texture LOD streaming
    Virtual Path : ~/projects/chastity-museum/

--------------------------------------------------------------------------------
PRO-TIP: Use "cd projects/<name>" and "cat architecture.md" to inspect deep-dive technical specs!`,
        });
        break;

      // Virtual Directory Navigation: cd
      case "cd": {
        if (!arg || arg === "~") {
          setCurrentPath("~");
          newHistory.push({ type: "output", text: "Returned to root directory: ~" });
          break;
        }

        if (arg === "..") {
          if (currentPath === "~") {
            newHistory.push({ type: "output", text: "Already at root directory (~)" });
          } else {
            const parts = currentPath.split("/");
            parts.pop();
            const parent = parts.join("/") || "~";
            setCurrentPath(parent);
          }
          break;
        }

        // Target path
        let target = arg;
        if (target.endsWith("/")) target = target.slice(0, -1);

        const { node, path } = resolveNode(target);
        if (!node) {
          newHistory.push({
            type: "error",
            text: `cd: no such file or directory: ${arg}`,
          });
        } else if (node.type !== "dir") {
          newHistory.push({
            type: "error",
            text: `cd: not a directory: ${arg}`,
          });
        } else {
          setCurrentPath(path);
        }
        break;
      }

      // Virtual Directory Listing: ls / dir
      case "ls":
      case "dir": {
        const { node } = resolveNode(currentPath);
        if (node && node.type === "dir") {
          const lines = [
            `total ${Object.keys(node.children).length * 4}`,
            `drwxr-xr-x  2 guest guest  4096 Oct 07 15:30 .`,
            `drwxr-xr-x  2 guest guest  4096 Oct 07 15:30 ..`,
          ];
          for (const [name, child] of Object.entries(node.children)) {
            if (child.type === "dir") {
              lines.push(`drwxr-xr-x  3 guest guest  4096 ${child.date} \x1b[36m${name}/\x1b[0m`);
            } else {
              lines.push(`-rw-r--r--  1 guest guest  ${child.size.padStart(5, " ")} ${child.date} ${name}`);
            }
          }
          newHistory.push({
            type: "output",
            text: lines.join("\n"),
          });
        } else {
          newHistory.push({ type: "error", text: "ls: directory inaccessible" });
        }
        break;
      }

      // Print Working Directory: pwd
      case "pwd":
        newHistory.push({
          type: "output",
          text: `/home/guest${currentPath.replace(/^~/, "") || ""}`,
        });
        break;

      // File Inspection: cat
      case "cat": {
        if (!arg) {
          newHistory.push({ type: "error", text: "cat: missing file operand. Example: cat README.md" });
          break;
        }
        const { node } = resolveNode(arg);
        if (!node) {
          newHistory.push({ type: "error", text: `cat: ${arg}: No such file or directory` });
        } else if (node.type === "dir") {
          newHistory.push({ type: "error", text: `cat: ${arg}: Is a directory. Use "cd ${arg}" instead.` });
        } else {
          newHistory.push({ type: "output", text: node.content });
        }
        break;
      }

      // Resume download (with cv alias)
      case "resume":
      case "cv": {
        if (typeof window !== "undefined") {
          window.open("/Berkay_Acar_Resume.pdf", "_blank");
        }
        const notice =
          cmd === "cv"
            ? '[NOTICE] "cv" command aliased to "resume".\n'
            : "";
        newHistory.push({
          type: "output",
          text: `${notice}INITIATING DOWNLOAD: Berkay_Acar_Resume.pdf dispatched to browser in new tab.`,
        });
        break;
      }

      case "contact":
        newHistory.push({
          type: "output",
          text: `[DIRECT COMMUNICATION COORDINATES]
EMAIL    : acar.berkai@gmail.com
PHONE    : +90 554 428 04 04
LINKEDIN : https://linkedin.com/in/im-berkay
GITHUB   : https://github.com/Berkawaii
LOCATION : Istanbul, Turkey`,
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
        }, 500);
        break;

      // Animated Skateboard Routine
      case "skate": {
        setIsAnimating(true);
        const skateFrames = [
          `[1/4] DROPPING IN & ROLLING ACROSS THE CONCRETE...
   O
  /|   🛹
  / \\  ==================================`,
          `[2/4] CROUCHING & POPPING HIGH TAIL OLLIE...
      \\O/
       |    ~* POP! *~
      / \\
       🛹
  ---------------------------------------`,
          `[3/4] 360 KICKFLIP ROTATION IN MID-AIR...
      \\O/   * 360 KICKFLIP ROTATING *
       |    
      / \\   
     \\==/   
  ---------------------------------------`,
          `[4/4] 4-WHEEL BOLTS STOMP & REVERT OUT!
       O
      /|\\   * CLEAN STOMP ON CONCRETE! *
      / \\
    =======
     O   O  --> VELOCITY: 24 KM/H [STYLE SCORE: 10 / 10]
  =======================================`,
        ];

        let frameIdx = 0;
        newHistory.push({ type: "ascii", text: skateFrames[0] });
        setHistory([...newHistory]);

        const interval = setInterval(() => {
          frameIdx++;
          if (frameIdx < skateFrames.length) {
            setHistory((prev) => [
              ...prev.slice(0, -1),
              { type: "ascii", text: skateFrames[frameIdx] },
            ]);
          } else {
            clearInterval(interval);
            setIsAnimating(false);
          }
        }, 400);
        setInputVal("");
        return;
      }

      // Animated Espresso Routine
      case "coffee": {
        setIsAnimating(true);
        const coffeeFrames = [
          `[1/4] GRINDING SPECIALTY ESPRESSO BEANS...
   * . * . * . *  [BURR SPEED: 1400 RPM]
  =======================================`,
          `[2/4] PRESSURIZING 9-BAR DUAL BOILER TO 93.5°C...
   ~~ PRE-INFUSION IN PROGRESS ~~
  =======================================`,
          `[3/4] EXTRACTING GOLDEN CREMA STREAM...
   |||||||||||||||||||||||||||||||||||| 100%
  =======================================`,
          `[4/4] DOUBLE-SHOT DARK ROAST ESPRESSO SERVED!
       ( (
        ) )
     .______.
     |  ☕  |]   FRESH EXTRACTION COMPLETE!
     \\______/    [PROFILE: Rich Cocoa Crema, Smooth Body]
  ══════════════ SYSTEM ENERGY RECHARGED: 100% CAPACITY`,
        ];

        let frameIdx = 0;
        newHistory.push({ type: "ascii", text: coffeeFrames[0] });
        setHistory([...newHistory]);

        const interval = setInterval(() => {
          frameIdx++;
          if (frameIdx < coffeeFrames.length) {
            setHistory((prev) => [
              ...prev.slice(0, -1),
              { type: "ascii", text: coffeeFrames[frameIdx] },
            ]);
          } else {
            clearInterval(interval);
            setIsAnimating(false);
          }
        }, 400);
        setInputVal("");
        return;
      }

      // Matrix Digital Stream
      case "matrix":
        newHistory.push({
          type: "matrix",
          text: `01000010 01000101 01010010 01001011 01000001 01011001 00100000 01000001 01000011 01000001 01010010
01010011 01011001 01010011 01010100 01000101 01001101 01010011 00100000 01000001 01010010 01000011
[CYBERSPACE DECRYPTED]: "Wake up, Neo... The architecture is distributed."
[ROOT KERNEL] Memory buffers synchronized. Zero packet loss across 30k nodes.`,
        });
        break;

      case "clear":
        setHistory([]);
        setInputVal("");
        return;

      case "exit":
        newHistory.push({
          type: "output",
          text: "Terminating console session. Returning to graphical portfolio...",
        });
        setTimeout(() => {
          if (typeof window !== "undefined") {
            window.location.href = "/";
          }
        }, 350);
        break;

      default:
        newHistory.push({
          type: "error",
          text: `bash: command not found: "${rawCmd}". Type "help" to view valid architecture commands.`,
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

  // If in Matrix Boot Mode, render the typewriter scene
  if (!bootCompleted) {
    return (
      <div
        onClick={skipBoot}
        className="min-h-[100dvh] bg-black text-[#33ff33] font-mono flex flex-col items-center justify-center p-6 cursor-pointer relative select-none"
      >
        {/* CRT Scanline overlay */}
        <div
          style={{
            backgroundImage:
              "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.5) 50%)",
            backgroundSize: "100% 4px",
          }}
          className="fixed inset-0 pointer-events-none z-30 opacity-60"
        />

        <div className="max-w-xl w-full space-y-4 text-center sm:text-left z-20">
          <div className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wider leading-relaxed min-h-[3.5rem] flex items-center justify-center sm:justify-start">
            <span>{displayedText}</span>
            <span className="inline-block w-3.5 h-6 sm:h-7 bg-[#33ff33] ml-1.5 animate-pulse" />
          </div>

          <div className="pt-12 text-center text-xs text-[#33ff33]/40 tracking-widest uppercase">
            [ CLICK ANYWHERE OR PRESS ESC TO SKIP MATRIX SEQUENCE ]
          </div>
        </div>
      </div>
    );
  }

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

        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          <button
            type="button"
            onClick={() => {
              setBootCompleted(false);
              setIntroStep(0);
            }}
            className="hidden sm:inline-flex items-center gap-1 px-2 py-1 border border-[#33ff33]/40 text-[#33ff33]/70 hover:bg-[#33ff33]/10 hover:text-[#33ff33] transition-colors cursor-pointer"
            title="Replay Matrix Wake Up Intro"
          >
            <FastForward size={14} weight="bold" />
            <span>REPLAY INTRO</span>
          </button>

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
          if (entry.type === "system") {
            return (
              <div key={idx} className="text-[#70D6FF] whitespace-pre-line font-bold">
                {entry.text}
              </div>
            );
          }
          if (entry.type === "matrix") {
            return (
              <div key={idx} className="text-[#00ff88] whitespace-pre-line font-mono py-1">
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
            <div key={idx} className="text-[#a0ffa0] whitespace-pre-line font-mono">
              {entry.text}
            </div>
          );
        })}

        {/* Live Input Line */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-white font-bold shrink-0">guest@berkayacar:{currentPath}$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isAnimating}
            autoFocus
            className="flex-1 bg-transparent text-[#33ff33] border-none outline-none font-mono text-xs sm:text-sm p-0 m-0 focus:ring-0 disabled:opacity-50"
          />
        </div>

        <div ref={terminalEndRef} />
      </main>

      {/* Bottom Status Ticker */}
      <footer className="relative z-20 border-t border-[#33ff33]/30 pt-3 mt-4 flex flex-wrap items-center justify-between text-[11px] text-white/50">
        <div>
          HINT: Type &quot;projects&quot; or &quot;cd projects&quot; &bull; &quot;resume&quot; &bull; &quot;coffee&quot; &bull; &quot;skate&quot;
        </div>
        <div className="text-[#33ff33]">AUTHENTICATED // LEVEL_5 ROOT CLEARANCE</div>
      </footer>
    </div>
  );
}
