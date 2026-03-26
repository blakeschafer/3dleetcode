import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AlgoVision 3D",
  description: "See algorithms in 3D. Step through every operation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-[#0B0F1A] text-white min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
