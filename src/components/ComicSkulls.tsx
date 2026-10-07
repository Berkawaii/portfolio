"use client";

import React from "react";

export function ComicSkaterSkull({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Skull Base Outline */}
      <circle cx="50" cy="46" r="32" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
      {/* Jaw */}
      <path
        d="M32 64 L32 82 L68 82 L68 64 Z"
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="6"
      />
      {/* Eye Sockets */}
      <circle cx="39" cy="45" r="9" fill="#000000" />
      <circle cx="61" cy="45" r="9" fill="#000000" />
      <circle cx="41" cy="43" r="3" fill="#FFFFFF" />
      <circle cx="63" cy="43" r="3" fill="#FFFFFF" />
      {/* Nose Cavity */}
      <path d="M50 54 L46 62 L54 62 Z" fill="#000000" />
      {/* Teeth Lines */}
      <line x1="41" y1="72" x2="41" y2="82" stroke="#000000" strokeWidth="4" />
      <line x1="50" y1="70" x2="50" y2="82" stroke="#000000" strokeWidth="4" />
      <line x1="59" y1="72" x2="59" y2="82" stroke="#000000" strokeWidth="4" />
      {/* Retro Crossbones Accent */}
      <circle cx="28" cy="24" r="5" fill="#FF5400" stroke="#000000" strokeWidth="3" />
      <circle cx="72" cy="24" r="5" fill="#FF5400" stroke="#000000" strokeWidth="3" />
    </svg>
  );
}

export function ComicStickerBadge({
  text,
  color = "orange",
  rotate = "-rotate-2",
  className = "",
}: {
  text: string;
  color?: "orange" | "pink" | "blue" | "lime" | "yellow";
  rotate?: string;
  className?: string;
}) {
  const bgMap = {
    orange: "bg-[#FF5400] text-white",
    pink: "bg-[#FF70A6] text-black",
    blue: "bg-[#70D6FF] text-black",
    lime: "bg-[#CCFF00] text-black",
    yellow: "bg-[#FFE600] text-black",
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 font-mono font-bold text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000000] select-none ${bgMap[color]} ${rotate} ${className}`}
    >
      <span className="text-[10px]">★</span>
      <span>{text}</span>
    </div>
  );
}

export function HalftoneBox({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative border-4 border-black bg-[#F5EFE6] shadow-ink-lg ${className}`}>
      <div className="absolute inset-0 comic-halftone-light pointer-events-none opacity-40" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
