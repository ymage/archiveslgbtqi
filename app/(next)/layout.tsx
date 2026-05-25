import "../globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { VisualEditing } from "next-sanity";

import { draftMode } from "next/headers";
import { Suspense } from "react";

import localFont from "next/font/local";

import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import { BannerAlert, ToastProviders } from "./components/ui";
import { IntroAnimation } from "./components/ui/IntroAnimation";
import CookieBanner from "./components/ui/CookieBanner";
import { Metadata } from "next";
import { settingsQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SettingsQueryResult } from "@/sanity.types";

const cityBurn = localFont({
  src: "./fonts/cityburn/cityburn.ttf",
  variable: "--font-cityburn",
});

const jetBrains = localFont({
  variable: "--font-jetbrains",
  src: [
    {
      path: "./fonts/jet-brains/jetbrains-light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/jet-brains/jetbrains-medium.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/jet-brains/jetbrains-mediumitalic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/jet-brains/jetbrains-extrabold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
});

const tanker = localFont({
  variable: "--font-tanker",
  display: "swap",
  src: "./fonts/tanker/tanker.otf",
});

export async function generateMetadata() {
  const [settings] = await Promise.all([
    sanityFetch<SettingsQueryResult>({ query: settingsQuery, stega: false }),
  ]);
  return {
    title: settings?.globalSettings.siteTitle,
    description: settings?.globalSettings.siteDescription as any,
    icons: {
      icon: [
        {
          url: "/favicon.ico",
          sizes: "any",
        },
      ],
    },
    openGraph: {
      images: [
        {
          url: settings?.globalSettings.ogImage || "",
          alt: settings?.globalSettings.altText || "",
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  } satisfies Metadata;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${cityBurn.variable} ${jetBrains.variable} ${tanker.variable} bg-white`}
    >
      <body>
        <section className="flex min-h-screen flex-grow flex-col selection:bg-pink-arch">
          {draftMode().isEnabled && <BannerAlert />}
          <IntroAnimation />
          <Suspense>
            <Header />
          </Suspense>
          <main id="main-content">
            <ToastProviders>{children}</ToastProviders>
          </main>
          <Suspense>
            <Footer />
          </Suspense>
          <CookieBanner />
        </section>
        {draftMode().isEnabled && <VisualEditing />}
        <SpeedInsights />
      </body>
    </html>
  );
}
