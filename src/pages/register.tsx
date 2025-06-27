// pages/register.tsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import {
  MapPin,
  Eye,
  EyeOff,
  UserPlus,
  ArrowRight,
  Check,
  X,
  Moon,
  Sun,
  Globe,
} from "lucide-react";
import { registerUser } from "@/lib/auth";

interface RegisterPageProps {
  currentLanguage: "en" | "fr";
  currentTheme: "light" | "dark";
  onThemeToggle?: () => void;
  onLanguageToggle?: () => void;
}

export default function RegisterPage({
  currentLanguage = "en",
  currentTheme = "light",
  onThemeToggle,
  onLanguageToggle,
}: RegisterPageProps) {
  const router = useRouter();

  // Get redirect info from URL params to pass to login
  const redirectPath = router.query.redirect as string;
  const actionParam = router.query.action as string;
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirmPassword) {
      setError(
        currentLanguage === "en"
          ? "Passwords do not match"
          : "Les mots de passe ne correspondent pas"
      );
      return;
    }
    const complexity = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!complexity.test(form.password)) {
      setError(
        currentLanguage === "en"
          ? "Password must be 8+ chars, include one lowercase, one uppercase & one digit"
          : "Le mot de passe doit contenir 8+ caractères, une minuscule, une majuscule et un chiffre"
      );
      return;
    }
    setLoading(true);
    try {
      await registerUser({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone_number: form.phone_number.trim() || undefined,
      });

      // Redirect to login with any redirect params
      const loginUrl = {
        pathname: "/login",
        query: {
          ...(redirectPath && { redirect: redirectPath }),
          ...(actionParam && { action: actionParam }),
        },
      };
      router.replace(loginUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Password validation checks
  const passwordChecks = {
    length: form.password.length >= 8,
    lowercase: /[a-z]/.test(form.password),
    uppercase: /[A-Z]/.test(form.password),
    digit: /\d/.test(form.password),
  };

  const translations = {
    en: {
      title: "Create Account",
      subtitle: "Join Casa Wonders and start exploring",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      phone: "Phone Number (Optional)",
      showPassword: "Show password",
      hidePassword: "Hide password",
      registerButton: "Create Account",
      registering: "Creating account...",
      haveAccount: "Already have an account?",
      login: "Sign in here",

      passwordRequirements: "Password Requirements:",
      requirement1: "At least 8 characters",
      requirement2: "One lowercase letter",
      requirement3: "One uppercase letter",
      requirement4: "One number",
    },
    fr: {
      title: "Créer un Compte",
      subtitle: "Rejoignez Casa Wonders et commencez à explorer",
      firstName: "Prénom",
      lastName: "Nom",
      email: "Adresse Email",
      password: "Mot de Passe",
      confirmPassword: "Confirmer le Mot de Passe",
      phone: "Numéro de Téléphone (Optionnel)",
      showPassword: "Afficher le mot de passe",
      hidePassword: "Masquer le mot de passe",
      registerButton: "Créer un Compte",
      registering: "Création du compte...",
      haveAccount: "Vous avez déjà un compte ?",
      login: "Connectez-vous ici",

      passwordRequirements: "Exigences du mot de passe :",
      requirement1: "Au moins 8 caractères",
      requirement2: "Une lettre minuscule",
      requirement3: "Une lettre majuscule",
      requirement4: "Un chiffre",
    },
  };

  const t = translations[currentLanguage];

  return (
    <>
      <Head>
        <title>{t.title} - Casa Wonders</title>
        <meta name="description" content={t.subtitle} />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Theme/Language Controls */}
        <div className="absolute top-6 right-6 flex items-center space-x-3 z-10">
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
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 dark:from-accent/10 dark:to-accent/5" />

        <div className="relative min-h-screen flex">
          {/* Left Side - Branding */}
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
                  ? "Join thousands discovering Casablanca's hidden gems"
                  : "Rejoignez des milliers de personnes découvrant les joyaux cachés de Casablanca"}
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-4 backdrop-blur">
                  <Check className="w-6 h-6 text-white" />
                  <span>
                    {currentLanguage === "en"
                      ? "Discover authentic experiences"
                      : "Découvrez des expériences authentiques"}
                  </span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-4 backdrop-blur">
                  <Check className="w-6 h-6 text-white" />
                  <span>
                    {currentLanguage === "en"
                      ? "Save your favorite places"
                      : "Sauvegardez vos lieux favoris"}
                  </span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-4 backdrop-blur">
                  <Check className="w-6 h-6 text-white" />
                  <span>
                    {currentLanguage === "en"
                      ? "Book unique experiences"
                      : "Réservez des expériences uniques"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Register Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
            <div className="w-full max-w-md space-y-8">
              {/* Mobile Logo */}
              <div className="lg:hidden text-center">
                <div className="inline-flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
                    Casa Wonders
                  </span>
                </div>
              </div>

              {/* Header */}
              <div className="text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {t.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {t.subtitle}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* Register Form */}
              <form onSubmit={onSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t.firstName}
                    </label>
                    <input
                      name="first_name"
                      value={form.first_name}
                      onChange={onChange}
                      required
                      className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                      placeholder={currentLanguage === "en" ? "John" : "Jean"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t.lastName}
                    </label>
                    <input
                      name="last_name"
                      value={form.last_name}
                      onChange={onChange}
                      required
                      className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                      placeholder={currentLanguage === "en" ? "Doe" : "Dupont"}
                    />
                  </div>
                </div>

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
                    className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                    placeholder={
                      currentLanguage === "en"
                        ? "john@example.com"
                        : "jean@exemple.com"
                    }
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t.phone}
                  </label>
                  <input
                    name="phone_number"
                    value={form.phone_number}
                    onChange={onChange}
                    className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                    placeholder="+212 6 12 34 56 78"
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
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={onChange}
                      required
                      className="w-full px-4 py-4 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                      placeholder={
                        currentLanguage === "en"
                          ? "Create a strong password"
                          : "Créez un mot de passe fort"
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      aria-label={
                        showPassword ? t.hidePassword : t.showPassword
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Password Requirements */}
                  {form.password && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t.passwordRequirements}
                      </p>
                      <div className="space-y-1">
                        <div
                          className={`flex items-center space-x-2 text-sm ${
                            passwordChecks.length
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {passwordChecks.length ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                          <span>{t.requirement1}</span>
                        </div>
                        <div
                          className={`flex items-center space-x-2 text-sm ${
                            passwordChecks.lowercase
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {passwordChecks.lowercase ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                          <span>{t.requirement2}</span>
                        </div>
                        <div
                          className={`flex items-center space-x-2 text-sm ${
                            passwordChecks.uppercase
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {passwordChecks.uppercase ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                          <span>{t.requirement3}</span>
                        </div>
                        <div
                          className={`flex items-center space-x-2 text-sm ${
                            passwordChecks.digit
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {passwordChecks.digit ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                          <span>{t.requirement4}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t.confirmPassword}
                  </label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={onChange}
                      required
                      className={`w-full px-4 py-4 pr-12 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all ${
                        form.confirmPassword &&
                        form.password !== form.confirmPassword
                          ? "border-red-300 dark:border-red-600"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder={
                        currentLanguage === "en"
                          ? "Confirm your password"
                          : "Confirmez votre mot de passe"
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      aria-label={
                        showConfirmPassword ? t.hidePassword : t.showPassword
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {form.confirmPassword &&
                    form.password !== form.confirmPassword && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {currentLanguage === "en"
                          ? "Passwords do not match"
                          : "Les mots de passe ne correspondent pas"}
                      </p>
                    )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent text-white py-4 rounded-xl shadow-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-3 text-lg font-semibold"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{t.registering}</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>{t.registerButton}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  {t.haveAccount}{" "}
                  <Link
                    href={{
                      pathname: "/login",
                      query: {
                        ...(redirectPath && { redirect: redirectPath }),
                        ...(actionParam && { action: actionParam }),
                      },
                    }}
                    className="text-accent hover:text-accent/80 font-semibold transition-colors inline-flex items-center space-x-1"
                  >
                    <span>{t.login}</span>
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
