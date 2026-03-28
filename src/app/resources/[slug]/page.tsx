"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/top-bar";
import { GuideSidebar } from "@/components/guide-sidebar";
import { GuideContent } from "@/components/guide-content";
import { studyGuides } from "@/data/study-guides";

export default function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const guide = studyGuides.find((g) => g.slug === slug);

  if (!guide) notFound();

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          <GuideSidebar />
          <GuideContent guide={guide} />
        </div>
      </main>
    </div>
  );
}
