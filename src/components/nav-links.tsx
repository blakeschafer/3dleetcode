"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Visualize" },
  { href: "/problems", label: "Problems" },
  { href: "/resources", label: "Resources" },
  { href: "/tracker", label: "Tracker" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {NAV_ITEMS.map(({ href, label }) => {
        const isActive =
          href === "/"
            ? pathname === "/" || pathname.startsWith("/visualizer")
            : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? "text-[#00D4FF] bg-[#00D4FF]/10"
                : "text-[#8899AA] hover:text-white hover:bg-[#131A2B]"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
