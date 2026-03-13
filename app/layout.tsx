import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RescueSynth AI - Disaster Intelligence Platform",
  description: "AI-powered disaster scenario generation and analysis platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
