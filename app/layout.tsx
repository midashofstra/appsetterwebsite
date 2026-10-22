import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "appointmentsetter.app | AI appointment setter voor LinkedIn, e-mail en WhatsApp",
  description:
    "Een AI-agent die je leads opvolgt via LinkedIn, e-mail en WhatsApp en afspraken direct in je agenda plant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`gs ${figtree.className}`}>
      <body>{children}</body>
    </html>
  );
}
