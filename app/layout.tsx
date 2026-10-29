import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { CSSProperties } from "react";
import { getDefaultThemeStyle } from "@/lib/color-themes";
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
  metadataBase: new URL("https://appsetterwebsite.vercel.app"),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#121210" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`gs ${plusJakartaSans.variable}`}
      style={defaultTheme as CSSProperties}
    >
      <body className={plusJakartaSans.className}>{children}</body>
    </html>
  );
}
