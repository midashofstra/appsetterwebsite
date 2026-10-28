import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { CSSProperties } from "react";
import { DEFAULT_PRIMARY, getDefaultThemeStyle } from "@/lib/color-themes";
import "@/lib/fontawesome";
import "./globals.css";

// Previous site font (Figtree via next/font):
// import { Figtree } from "next/font/google";
// const figtree = Figtree({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700", "800"],
//   display: "swap",
// });

/** Plus Jakarta Sans: Google variable axis tops out at 800 (no 900 cut). */
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-sans",
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
      className={`gs ${plusJakartaSans.variable}`}
      style={defaultTheme as CSSProperties}
    >
      <body className={plusJakartaSans.className}>{children}</body>
    </html>
  );
}
