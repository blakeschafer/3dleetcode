"use client";

import Link from "next/link";
import { NavLinks } from "./nav-links";

export function TopBar({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-50 bg-[#0B0F1A]/80 backdrop-blur-md border-b border-[#1E2A3F]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span
            className="text-xl font-bold text-[#00D4FF]"
            style={{ textShadow: "0 0 20px rgba(0, 212, 255, 0.3)" }}
          >
            AlgoVision 3D
          </span>
        </Link>
        <NavLinks />
        <div className="flex-1 flex items-center justify-end">
          {children}
        </div>
      </div>
    </header>
  );
}
