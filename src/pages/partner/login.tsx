import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Shield,
  Globe,
  Users,
  BarChart3,
  Loader2,
} from "lucide-react";

import { partnerAuthApi, partnerUtils } from "@/lib/partnerApi";

const PartnerLogin: React.FC = () => {
  const router = useRouter();
  const [currentLanguage] = useState<"en" | "fr">("en");

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check if already authenticated
  useEffect(() => {
    if (partnerUtils.isAuthenticated()) {
      router.push("/partner");
    }

    // Check for registration success message
    if (router.query.registered === "true") {
      const message = router.query.message as string;
      setSuccess(
        message ||
          (currentLanguage === "en"
            ? "Registration successful! Please sign in to continue."
            : "Inscription réussie ! Veuillez vous connecter pour continuer.")
      );

      // Clean up URL parameters
      const cleanUrl = router.asPath.split("?")[0];
      router.replace(cleanUrl, undefined, { shallow: true });
    }
  }, [router, currentLanguage]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate form
      if (!formData.email || !formData.password) {
        throw new Error(
          currentLanguage === "en"
            ? "Please fill in all fields"
            : "Veuillez remplir tous les champs"
        );
      }

      // Login with API
      const response = await partnerAuthApi.login(
        formData.email,
        formData.password
      );

      // Store token
      partnerUtils.setToken(response.access_token);

      setSuccess(
        currentLanguage === "en"
          ? "Login successful! Redirecting..."
          : "Connexion réussie ! Redirection..."
      );

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/partner");
      }, 1000);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.message ||
          (currentLanguage === "en"
            ? "Invalid email or password"
            : "Email ou mot de passe invalide")
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (error) setError(null);
  };

  return (
    <>
      <Head>
        <title>
          {currentLanguage === "en" ? "Partner Login" : "Connexion Partenaire"}{" "}
          - Casa Wonders
        </title>
        <meta
          name="description"
          content={
            currentLanguage === "en"
              ? "Sign in to your Casa Wonders partner account"
              : "Connectez-vous à votre compte partenaire Casa Wonders"
          }
        />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col lg:flex-row">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {currentLanguage === "en" ? "Welcome Back" : "Bon Retour"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {currentLanguage === "en"
                  ? "Sign in to your partner account"
                  : "Connectez-vous à votre compte partenaire"}
              </p>
            </div>

            {/* Alert Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-red-700 dark:text-red-300 text-sm">
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <p className="text-green-700 dark:text-green-300 text-sm">
                  {success}
                </p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {currentLanguage === "en" ? "Email Address" : "Adresse Email"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder={
                      currentLanguage === "en"
                        ? "partner@example.com"
                        : "partenaire@exemple.com"
                    }
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {currentLanguage === "en" ? "Password" : "Mot de Passe"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-accent to-accent/90 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>
                      {currentLanguage === "en"
                        ? "Signing In..."
                        : "Connexion..."}
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      {currentLanguage === "en" ? "Sign In" : "Se Connecter"}
                    </span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Additional Links */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {currentLanguage === "en"
                  ? "Don't have an account?"
                  : "Pas de compte?"}
                <Link
                  href="/partner/register"
                  className="ml-2 text-accent hover:text-accent/80 font-medium transition-colors"
                >
                  {currentLanguage === "en"
                    ? "Register here"
                    : "Inscrivez-vous ici"}
                </Link>
              </p>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href="/"
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm transition-colors"
                >
                  ←{" "}
                  {currentLanguage === "en"
                    ? "Back to Casa Wonders"
                    : "Retour à Casa Wonders"}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Features Showcase */}
        <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-accent to-accent/80 items-center justify-center p-12">
          <div className="max-w-md text-white">
            <h2 className="text-3xl font-bold mb-6">
              {currentLanguage === "en"
                ? "Grow Your Business with Casa Wonders"
                : "Développez Votre Entreprise avec Casa Wonders"}
            </h2>
            <p className="text-accent-100 mb-8 leading-relaxed">
              {currentLanguage === "en"
                ? "Join thousands of partners who trust Casa Wonders to showcase their experiences and connect with travelers from around the world."
                : "Rejoignez des milliers de partenaires qui font confiance à Casa Wonders pour présenter leurs expériences et se connecter avec des voyageurs du monde entier."}
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {currentLanguage === "en"
                      ? "Global Reach"
                      : "Portée Mondiale"}
                  </h3>
                  <p className="text-accent-100 text-sm">
                    {currentLanguage === "en"
                      ? "Connect with travelers worldwide"
                      : "Connectez-vous avec des voyageurs du monde entier"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {currentLanguage === "en"
                      ? "Easy Management"
                      : "Gestion Facile"}
                  </h3>
                  <p className="text-accent-100 text-sm">
                    {currentLanguage === "en"
                      ? "Manage bookings and customers effortlessly"
                      : "Gérez les réservations et clients sans effort"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {currentLanguage === "en"
                      ? "Analytics & Insights"
                      : "Analyses et Perspectives"}
                  </h3>
                  <p className="text-accent-100 text-sm">
                    {currentLanguage === "en"
                      ? "Track performance and grow your business"
                      : "Suivez les performances et développez votre activité"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {currentLanguage === "en"
                      ? "Secure Platform"
                      : "Plateforme Sécurisée"}
                  </h3>
                  <p className="text-accent-100 text-sm">
                    {currentLanguage === "en"
                      ? "Safe transactions and data protection"
                      : "Transactions sécurisées et protection des données"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <p className="text-accent-100 text-sm italic">
                "
                {currentLanguage === "en"
                  ? "Casa Wonders has transformed how we connect with customers. Our bookings increased by 300% in the first year!"
                  : "Casa Wonders a transformé notre façon de nous connecter avec les clients. Nos réservations ont augmenté de 300% la première année !"}
                "
              </p>
              <p className="text-white font-medium mt-2">
                -{" "}
                {currentLanguage === "en"
                  ? "Sarah, Heritage Tours"
                  : "Sarah, Visites Patrimoine"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PartnerLogin;
