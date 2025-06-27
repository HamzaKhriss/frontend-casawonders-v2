import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import {
  MapPin,
  Eye,
  EyeOff,
  LogIn,
  ArrowRight,
  Moon,
  Sun,
  Globe,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

interface LoginPageProps {
  currentLanguage: "en" | "fr";
  currentTheme: "light" | "dark";
  onThemeToggle?: () => void;
  onLanguageToggle?: () => void;
}

export default function LoginPage({
  currentLanguage = "en",
  currentTheme = "light",
  onThemeToggle,
  onLanguageToggle,
}: LoginPageProps) {
  const router = useRouter();
  const { signIn } = useAuth(); // ← nouveau helper
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  // Get redirect info from URL params
  const redirectPath = router.query.redirect as string;
  const actionParam = router.query.action as string;

  /* ------------------------------------------------------------------ */
  /*  Form helpers                                                      */
  /* ------------------------------------------------------------------ */
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(form.email.trim(), form.password); // gère cookie + profil + redirection
    } catch (err: any) {
      setError(
        err?.message ||
          (currentLanguage === "en" ? "Login failed" : "Échec de la connexion")
      );
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /*  I18n                                                              */
  /* ------------------------------------------------------------------ */
  // Get action-specific messages
  const getActionMessage = () => {
    if (!actionParam) return null;

    const actionMessages = {
      en: {
        booking: "Please sign in to book this experience",
        wishlist: "Please sign in to add items to your wishlist",
        profile: "Please sign in to access your profile",
      },
      fr: {
        booking: "Veuillez vous connecter pour réserver cette expérience",
        wishlist:
          "Veuillez vous connecter pour ajouter des éléments à vos favoris",
        profile: "Veuillez vous connecter pour accéder à votre profil",
      },
    };

    return (
      actionMessages[currentLanguage][
        actionParam as keyof typeof actionMessages.en
      ] || null
    );
  };

  const t = {
    en: {
      title: "Welcome Back",
      subtitle: "Sign in to your Casa Wonders account",
      email: "Email Address",
      password: "Password",
      show: "Show password",
      hide: "Hide password",
      login: "Sign In",
      logging: "Signing in...",
      noAccount: "Don't have an account?",
      register: "Create one here",
    },
    fr: {
      title: "Bon Retour",
      subtitle: "Connectez-vous à votre compte Casa Wonders",
      email: "Adresse Email",
      password: "Mot de Passe",
      show: "Afficher le mot de passe",
      hide: "Masquer le mot de passe",
      login: "Se Connecter",
      logging: "Connexion…",
      noAccount: "Vous n'avez pas de compte ?",
      register: "Créez-en un ici",
    },
  }[currentLanguage];

  /* ------------------------------------------------------------------ */
  /*  UI                                                                */
  /* ------------------------------------------------------------------ */
  return (
    <>
      <Head>
        <title>{`${t.title} – Casa Wonders`}</title>
        <meta name="description" content={t.subtitle} />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* ---------------------------------------------------------------- */}
        {/*  Boutons thème / langue (coin haut-droit)                       */}
        {/* ---------------------------------------------------------------- */}
        <div className="absolute top-6 right-6 flex items-center space-x-3 z-10">
          {onThemeToggle && (
            <button
              onClick={onThemeToggle}
              className="p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 rounded-2xl transition-colors"
              aria-label="Toggle theme"
            >
              {currentTheme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
          )}

          {onLanguageToggle && (
            <button
              onClick={onLanguageToggle}
              className="flex items-center space-x-2 px-3 py-3 rounded-2xl text-gray-600 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-colors"
              aria-label="Toggle language"
            >
              <Globe className="w-5 h-5" />
              <span className="font-semibold uppercase text-sm">
                {currentLanguage}
              </span>
            </button>
          )}
        </div>

        {/* décor radial – purement esthétique */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 dark:from-accent/10 dark:to-accent/5" />

        <div className="relative min-h-screen flex">
          {/* -------------------------------------------------------------- */}
          {/*  Colonne gauche (branding) – desktop only                     */}
          {/* -------------------------------------------------------------- */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent to-accent/80 p-12 items-center justify-center">
            <div className="max-w-lg text-center text-white">
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur">
                  <MapPin className="w-12 h-12 text-white" />
                </div>
              </div>

              <h1 className="text-4xl font-bold mb-4">Casa Wonders</h1>
              <p className="text-xl text-white/90 mb-8">
                {currentLanguage === "en"
                  ? "Discover the authentic experiences of Casablanca"
                  : "Découvrez les expériences authentiques de Casablanca"}
              </p>

              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { n: "500+", l: { en: "Experiences", fr: "Expériences" } },
                  { n: "4.8", l: { en: "Rating", fr: "Note" } },
                  { n: "50K+", l: { en: "Users", fr: "Utilisateurs" } },
                ].map((b) => (
                  <div
                    key={b.n}
                    className="bg-white/10 rounded-xl p-4 backdrop-blur"
                  >
                    <div className="text-2xl font-bold">{b.n}</div>
                    <div className="text-sm text-white/80">
                      {b.l[currentLanguage]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------- */}
          {/*  Colonne droite (formulaire)                                  */}
          {/* -------------------------------------------------------------- */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
            <div className="w-full max-w-md space-y-8">
              {/* Logo mobile */}
              <div className="lg:hidden text-center">
                <div className="inline-flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center shadow-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
                    Casa Wonders
                  </span>
                </div>
              </div>

              {/* En-tête */}
              <div className="text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {t.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {t.subtitle}
                </p>
              </div>

              {/* Action Message */}
              {getActionMessage() && (
                <div className="bg-accent/10 border border-accent/20 text-accent dark:text-accent-light px-4 py-3 rounded-xl text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <LogIn className="w-4 h-4" />
                    <span>{getActionMessage()}</span>
                  </div>
                </div>
              )}

              {/* Erreur */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* Formulaire */}
              <form onSubmit={onSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t.email}
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    required
                    placeholder={
                      currentLanguage === "en"
                        ? "Enter your email"
                        : "Entrez votre email"
                    }
                    className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t.password}
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPwd ? "text" : "password"}
                      value={form.password}
                      onChange={onChange}
                      required
                      placeholder={
                        currentLanguage === "en"
                          ? "Enter your password"
                          : "Entrez votre mot de passe"
                      }
                      className="w-full px-4 py-4 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      aria-label={showPwd ? t.hide : t.show}
                    >
                      {showPwd ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent text-white py-4 rounded-xl shadow-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-3 text-lg font-semibold"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{t.logging}</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>{t.login}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Register link */}
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  {t.noAccount}{" "}
                  <Link
                    href="/register"
                    className="text-accent hover:text-accent/80 font-semibold transition-colors inline-flex items-center space-x-1"
                  >
                    <span>{t.register}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
