/* components/Navbar.tsx */
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import {
  Search,
  Heart,
  MapPin,
  Menu,
  X,
  Globe,
  Moon,
  Sun,
  Bell,
  Home,
  Compass,
  LogOut,
  ChevronDown,
  Building2,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  onThemeToggle?: () => void;
  onLanguageToggle?: () => void;
  currentTheme?: "light" | "dark";
  currentLanguage?: "en" | "fr";
}

const Navbar: React.FC<NavbarProps> = ({
  onThemeToggle,
  onLanguageToggle,
  currentTheme = "light",
  currentLanguage = "en",
}) => {
  /* ───────────── hooks ───────────── */
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  /* ───────────── nav items (removed profile) ───────────── */
  const nav = [
    { href: "/", icon: Home, en: "Home", fr: "Accueil" },
    { href: "/explore", icon: Compass, en: "Explore", fr: "Explorer" },
    { href: "/wishlist", icon: Heart, en: "Wishlist", fr: "Favoris" },
    {
      href: "/partner/login",
      icon: Building2,
      en: "Partners",
      fr: "Partenaires",
    },
  ];

  const isActive = (href: string) =>
    href === "/" ? router.pathname === "/" : router.pathname.startsWith(href);

  /* ───────────── actions ───────────── */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/explore?search=${encodeURIComponent(search.trim())}`);
    setSearch("");
    setMobileOpen(false);
  };

  const closeMobile = () => setMobileOpen(false);

  /* ========================================================================= */
  return (
    <nav className="fixed inset-x-0 top-0 z-[9999] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/30 dark:border-gray-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ───────────────────────────────── Top bar ────────────────────────── */}
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 group"
            onClick={closeMobile}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
                Casa Wonders
              </span>
            </div>
          </Link>

          {/* Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center space-x-1">
            {nav.map(({ href, icon: Icon, en, fr }) => {
              const active = isActive(href);
              const label = currentLanguage === "en" ? en : fr;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200
                    ${
                      active
                        ? "bg-accent/10 text-accent"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                    }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-accent" : ""}`} />
                  <span>{label}</span>
                  {active && (
                    <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-accent rounded-full -translate-x-1/2 translate-y-2" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Search (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative group">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={
                    currentLanguage === "en"
                      ? "Search experiences..."
                      : "Rechercher..."
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-accent transition-colors" />
              </div>
            </form>
          </div>

          {/* Right Actions (Desktop) */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Theme Toggle */}
            {onThemeToggle && (
              <button
                onClick={onThemeToggle}
                aria-label="toggle theme"
                className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-xl transition-all duration-200"
              >
                {currentTheme === "light" ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Language Toggle */}
            {onLanguageToggle && (
              <button
                onClick={onLanguageToggle}
                aria-label="toggle language"
                className="flex items-center space-x-1 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-200"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium uppercase">
                  {currentLanguage}
                </span>
              </button>
            )}

            {/* Auth Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-200"
                >
                  <Image
                    src={user.profile_picture_url || "/placeholder-avatar.jpg"}
                    alt={`${user.first_name} ${user.last_name}`}
                    width={32}
                    height={32}
                    className="rounded-lg object-cover"
                  />
                  <div className="hidden xl:block text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.first_name}
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Image
                        src={
                          user.profile_picture_url || "/placeholder-avatar.jpg"
                        }
                        alt="Profile"
                        width={24}
                        height={24}
                        className="rounded-md object-cover"
                      />
                      <div>
                        <div className="text-sm font-medium">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {currentLanguage === "en"
                            ? "View Profile"
                            : "Voir Profil"}
                        </div>
                      </div>
                    </Link>
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        signOut();
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">
                        {currentLanguage === "en" ? "Sign Out" : "Déconnexion"}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                >
                  {currentLanguage === "en" ? "Sign In" : "Connexion"}
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-accent text-white rounded-xl hover:bg-accent/90 font-medium transition-all duration-200 shadow-sm"
                >
                  {currentLanguage === "en" ? "Get Started" : "Commencer"}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="toggle mobile menu"
            className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-xl transition-all duration-200"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* ───────────────────────────── Mobile Menu ───────────────────────────── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={
                      currentLanguage === "en"
                        ? "Search experiences..."
                        : "Rechercher..."
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </form>

              {/* Mobile Navigation */}
              <div className="space-y-2">
                {nav.map(({ href, icon: Icon, en, fr }) => {
                  const active = isActive(href);
                  const label = currentLanguage === "en" ? en : fr;
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={closeMobile}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all
                        ${
                          active
                            ? "bg-accent text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Actions */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                {/* Theme & Language */}
                <div className="flex space-x-2">
                  {onThemeToggle && (
                    <button
                      onClick={onThemeToggle}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                    >
                      {currentTheme === "light" ? (
                        <Moon className="w-4 h-4" />
                      ) : (
                        <Sun className="w-4 h-4" />
                      )}
                      <span className="text-sm">
                        {currentLanguage === "en"
                          ? currentTheme === "light"
                            ? "Dark"
                            : "Light"
                          : currentTheme === "light"
                          ? "Sombre"
                          : "Clair"}
                      </span>
                    </button>
                  )}

                  {onLanguageToggle && (
                    <button
                      onClick={onLanguageToggle}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                    >
                      <Globe className="w-4 h-4" />
                      <span className="text-sm uppercase font-medium">
                        {currentLanguage === "en" ? "FR" : "EN"}
                      </span>
                    </button>
                  )}
                </div>

                {/* Mobile Auth */}
                {user ? (
                  <div className="space-y-2">
                    <Link
                      href="/profile"
                      onClick={closeMobile}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                    >
                      <Image
                        src={
                          user.profile_picture_url || "/placeholder-avatar.jpg"
                        }
                        alt="Profile"
                        width={32}
                        height={32}
                        className="rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {currentLanguage === "en"
                            ? "View Profile"
                            : "Voir Profil"}
                        </div>
                      </div>
                    </Link>

                    <button
                      onClick={() => {
                        closeMobile();
                        signOut();
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>
                        {currentLanguage === "en" ? "Sign Out" : "Déconnexion"}
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      onClick={closeMobile}
                      className="block w-full px-4 py-3 text-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                    >
                      {currentLanguage === "en" ? "Sign In" : "Connexion"}
                    </Link>
                    <Link
                      href="/register"
                      onClick={closeMobile}
                      className="block w-full px-4 py-3 text-center bg-accent text-white rounded-xl hover:bg-accent/90 transition-all"
                    >
                      {currentLanguage === "en" ? "Get Started" : "Commencer"}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
