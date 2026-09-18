import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kleanzo — Dirt Gone. Shine On.",
  description: "Professional Post-Construction Cleaning & Handover Management Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
