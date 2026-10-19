import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | Georgian Cuisine`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={SITE.locale.split("-")[0]} className={`${manrope.variable} ${cormorant.variable}`} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
