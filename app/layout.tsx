import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { DictionaryProvider } from "@/app/lib/i18n/dictionary-context";
import { getDictionary, getLocale } from "@/app/lib/i18n/get-dictionary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const METADATA_BY_LOCALE = {
  de: {
    title: "CVforYou – Lebenslauf in Minuten erstellen",
    description:
      "Erstelle mit CVforYou einen professionellen, ATS-optimierten Lebenslauf: Vorlage wählen, Daten eingeben, als PDF herunterladen.",
  },
  en: {
    title: "CVforYou – Build a resume in minutes",
    description:
      "Build a professional, ATS-optimized resume with CVforYou: pick a template, enter your details, download it as a PDF.",
  },
  fr: {
    title: "CVforYou – Crée ton CV en quelques minutes",
    description:
      "Crée un CV professionnel et optimisé ATS avec CVforYou : choisis un modèle, saisis tes données, télécharge-le en PDF.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return METADATA_BY_LOCALE[locale];
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  const dict = await getDictionary();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <DictionaryProvider dict={dict} locale={locale}>
          {children}
        </DictionaryProvider>
      </body>
    </html>
  );
}
