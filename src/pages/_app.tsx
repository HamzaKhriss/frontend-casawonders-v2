import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";

import React, { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps }: AppProps) {
  /* ─────────── Thème & Langue (inchangé) ─────────── */
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState<"en" | "fr">("en");

  /* mounted : restore prefs */
  useEffect(() => {
    setTheme(
      (localStorage.getItem("casa-wonders-theme") as "light" | "dark") ??
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light")
    );
    setLang(
      (localStorage.getItem("casa-wonders-language") as "en" | "fr") ??
        (navigator.language.startsWith("fr") ? "fr" : "en")
    );
  }, []);

  /* apply theme */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("casa-wonders-theme", theme);
  }, [theme]);

  /* save language */
  useEffect(() => {
    localStorage.setItem("casa-wonders-language", lang);
  }, [lang]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  const toggleLanguage = () => setLang((l) => (l === "en" ? "fr" : "en"));

  /* ─────────── UI ─────────── */
  return (
    <AuthProvider>
      <Head>
        <title>Casa Wonders – Discover Casablanca</title>
        <meta
          name="description"
          content="Discover, bookmark & book experiences in Casablanca"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:locale"
          content={lang === "fr" ? "fr_FR" : "en_US"}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout
        theme={theme}
        lang={lang}
        onThemeToggle={toggleTheme}
        onLangToggle={toggleLanguage}
      >
        <Component
          {...pageProps}
          currentTheme={theme}
          currentLanguage={lang}
          onThemeToggle={toggleTheme}
          onLanguageToggle={toggleLanguage}
        />
      </MainLayout>
    </AuthProvider>
  );
}

/* ---------- layout qui n’affiche la navbar que si l’utilisateur est loggué ---------- */
const MainLayout: React.FC<{
  children: React.ReactNode;
  theme: "light" | "dark";
  lang: "en" | "fr";
  onThemeToggle: () => void;
  onLangToggle: () => void;
}> = ({ children, theme, lang, onThemeToggle, onLangToggle }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Don't show navbar/footer on partner pages (they have their own layout)
  const isPartnerPage = router.pathname.startsWith("/partner");

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col">
      {!isPartnerPage && (
        <Navbar
          currentTheme={theme}
          currentLanguage={lang}
          onThemeToggle={onThemeToggle}
          onLanguageToggle={onLangToggle}
        />
      )}
      <main className={!isPartnerPage ? "pt-24 flex-1" : "flex-1"}>
        {children}
      </main>
      {!isPartnerPage && <Footer currentLanguage={lang} currentTheme={theme} />}
    </div>
  );
};
