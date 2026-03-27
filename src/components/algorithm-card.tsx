"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Algorithm } from "@/algorithms/types";
import { MiniPreview } from "@/three/mini-preview";

interface AlgorithmCardProps {
  algorithm: Algorithm;
}

export function AlgorithmCard({ algorithm }: AlgorithmCardProps) {
  return (
    <Link href={`/visualizer/${algorithm.slug}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative bg-[#131A2B] rounded-xl border border-[#1E2A3F] p-5 cursor-pointer transition-colors hover:border-[#00D4FF] group overflow-hidden"
      >
        <div className="h-40 rounded-lg bg-[#0B0F1A] mb-4 overflow-hidden border border-[#1E2A3F] group-hover:border-[#00D4FF]/30 transition-colors">
          <MiniPreview algorithm={algorithm} />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">{algorithm.name}</h3>
        <p className="text-sm text-[#8899AA] mb-3">{algorithm.description}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded bg-[#0B0F1A] border border-[#1E2A3F] text-[#00D4FF]">
            {algorithm.complexity.time}
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-[#0B0F1A] border border-[#1E2A3F] text-[#00D4FF]">
            {algorithm.complexity.space}
          </span>
          <span className="text-xs text-[#3A4A5C] ml-auto">{algorithm.category}</span>
        </div>
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            boxShadow: "inset 0 0 30px rgba(0, 212, 255, 0.05), 0 0 15px rgba(0, 212, 255, 0.1)",
          }}
        />
      </motion.div>
    </Link>
  );
}
