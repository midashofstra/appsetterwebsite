import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import type { CSSProperties } from "react";
import { DEFAULT_PRIMARY, getDefaultThemeStyle } from "@/lib/color-themes";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const defaultTheme = getDefaultThemeStyle();

export const metadata: Metadata = {
  title: "Appointment Setter | AI appointment setter voor LinkedIn, e-mail en WhatsApp",
  description:
    "Een AI-agent die je leads opvolgt via LinkedIn, e-mail en WhatsApp en afspraken direct in je agenda plant.",
};

export const viewport: Viewport = {
  themeColor: DEFAULT_PRIMARY,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`gs ${figtree.className}`}
      style={defaultTheme as CSSProperties}
    >
      <body>{children}</body>
    </html>
  );
}
