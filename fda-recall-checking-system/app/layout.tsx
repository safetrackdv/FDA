import type { Metadata } from "next";
import { Merriweather, Fira_Sans } from "next/font/google";
import Script from "next/script";
import { CookieBanner } from "@/components/CookieBanner";
import "./globals.css";

const GA_ID = "G-XPNG5PXY31";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-merriweather",
  display: "swap",
});

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fira-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SafeTrack — Drug Recall Alerts",
  description:
    "Know instantly if your medications have been recalled by the FDA. Add prescriptions to your medicine cabinet and receive email alerts when matching recalls are issued.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${merriweather.variable} ${firaSans.variable}`}>
      <body className="min-h-screen bg-surface text-on-surface antialiased">
        {children}
        <CookieBanner />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
        </Script>
      </body>
    </html>
  );
}
