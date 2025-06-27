import React, { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  TrendingUp,
  ArrowRight,
  Star,
  Users,
  Globe,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/router";

interface HeroSectionProps {
  currentLanguage: "en" | "fr";
  onSearchClick: () => void;
  onExploreClick: () => void;
  listingsCount: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  currentLanguage,
  onSearchClick,
  onExploreClick,
  listingsCount,
}) => {
  const [scrollY, setScrollY] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Subtle animated background
  const SubtleBackground = () => (
    <div className="absolute inset-0 overflow-hidden opacity-40">
      {/* Very subtle floating shapes */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-accent/5 to-teal-400/5 rounded-full blur-3xl"
        style={{
          animation: "float 20s ease-in-out infinite",
          transform: `translateY(${scrollY * 0.02}px)`,
        }}
      ></div>

      <div
        className="absolute top-3/4 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-3xl"
        style={{
          animation: "float 25s ease-in-out infinite reverse",
          animationDelay: "5s",
          transform: `translateY(${scrollY * -0.02}px)`,
        }}
      ></div>
    </div>
  );

  // Travel-themed 3D illustration component - bigger and more centered
  const TravelIllustration = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const pages = ["home", "search", "details", "booking"];

    useEffect(() => {
      const pageInterval = setInterval(() => {
        setCurrentPage((prev) => (prev + 1) % pages.length);
      }, 3000); // Change page every 3 seconds

      return () => clearInterval(pageInterval);
    }, []);

    const renderPhoneContent = (phoneIndex: number) => {
      const [transitioning, setTransitioning] = useState(false);

      useEffect(() => {
        setTransitioning(true);
        const timeout = setTimeout(() => setTransitioning(false), 100);
        return () => clearTimeout(timeout);
      }, [currentPage]);

      const pageIndex = (currentPage + phoneIndex) % pages.length;
      const page = pages[pageIndex];

      const getPageContent = (pageType: string) => {
        switch (pageType) {
          case "home":
            return (
              <div className="w-full h-full bg-gradient-to-br from-accent/10 to-teal-600/10 rounded-2xl p-5 flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div className="w-7 h-7 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                </div>
                <div className="space-y-4 flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-full w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-full w-1/2 animate-pulse"></div>
                  <div className="h-24 bg-gradient-to-br from-accent/20 to-teal-600/20 rounded-xl"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-full w-2/3 animate-pulse"></div>
                </div>
                <div className="mt-5 h-12 bg-accent/80 rounded-xl flex items-center justify-center">
                  <div className="w-5 h-5 bg-white/80 rounded"></div>
                </div>
              </div>
            );
          case "search":
            return (
              <div className="w-full h-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-2xl p-5 flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="w-7 h-7 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                </div>
                <div className="space-y-4 flex-1">
                  <div className="h-8 bg-white/50 dark:bg-gray-700/50 rounded-lg border border-blue-200/50"></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-16 bg-gradient-to-br from-accent/15 to-teal-600/15 rounded-lg"></div>
                    <div className="h-16 bg-gradient-to-br from-blue-400/15 to-purple-400/15 rounded-lg"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full w-full animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full w-2/3 animate-pulse"></div>
                  </div>
                </div>
              </div>
            );
          case "details":
            return (
              <div className="w-full h-full bg-gradient-to-br from-purple-400/10 to-indigo-500/10 rounded-2xl p-5 flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="w-7 h-7 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                </div>
                <div className="space-y-4 flex-1">
                  <div className="h-20 bg-gradient-to-br from-purple-400/20 to-indigo-500/20 rounded-xl"></div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full w-full"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full w-1/2"></div>
                  </div>
                </div>
                <div className="mt-4 h-10 bg-purple-500/80 rounded-xl"></div>
              </div>
            );
          case "booking":
            return (
              <div className="w-full h-full bg-gradient-to-br from-teal-400/10 to-accent/10 rounded-2xl p-5 flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-accent" />
                  </div>
                  <div className="w-7 h-7 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                </div>
                <div className="space-y-4 flex-1">
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-6 rounded ${
                          i === 10
                            ? "bg-accent/60"
                            : "bg-gray-200 dark:bg-gray-600"
                        }`}
                      ></div>
                    ))}
                  </div>
                  <div className="h-4 bg-accent/40 rounded-full w-2/3"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full w-full"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full w-1/2"></div>
                  </div>
                </div>
                <div className="mt-4 h-10 bg-accent/80 rounded-xl"></div>
              </div>
            );
          default:
            return null;
        }
      };

      return (
        <div
          className={`w-full h-full transition-all duration-700 ease-in-out transform ${
            transitioning ? "scale-95 opacity-80" : "scale-100 opacity-100"
          }`}
        >
          {getPageContent(page)}
        </div>
      );
    };

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Main illustration container - sized to fit between badge and trust indicators */}
        <div className="relative transform rotate-6 hover:rotate-3 transition-transform duration-700 scale-125 translate-y-0">
          {/* Phone mockup 1 - Back left */}
          <div className="absolute top-0 left-0 w-64 h-[450px] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-5 transform -rotate-12 hover:-rotate-6 transition-transform duration-500 z-10">
            {renderPhoneContent(0)}
          </div>

          {/* Phone mockup 2 - Front right */}
          <div className="absolute top-12 left-24 w-64 h-[450px] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-5 transform rotate-8 hover:rotate-12 transition-transform duration-500 z-20">
            {renderPhoneContent(1)}
          </div>
        </div>
      </div>
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : star <= rating
                ? "fill-yellow-400/50 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 overflow-hidden">
      {/* Subtle Background */}
      <SubtleBackground />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="min-h-screen grid lg:grid-cols-2 gap-16 items-center py-16">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50 dark:border-gray-700/50">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {currentLanguage === "en"
                  ? "Discover Authentic Morocco"
                  : "Découvrez le Maroc Authentique"}
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                  {currentLanguage === "en" ? "Explore" : "Explorez"}
                </span>
                <br />
                <span className="bg-gradient-to-r from-accent to-teal-600 bg-clip-text text-transparent">
                  Casa Wonders
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                {currentLanguage === "en"
                  ? "Discover authentic experiences, exquisite restaurants, and rich cultural heritage in the heart of Morocco's economic capital."
                  : "Découvrez des expériences authentiques, des restaurants exquis et un riche patrimoine culturel au cœur de la capitale économique du Maroc."}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {listingsCount}+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {currentLanguage === "en"
                      ? "Unique Places"
                      : "Lieux Uniques"}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    4.8
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {currentLanguage === "en" ? "Avg Rating" : "Note Moyenne"}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onExploreClick}
                className="group relative px-8 py-4 bg-accent text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  <Search className="w-6 h-6" />
                  <span>
                    {currentLanguage === "en"
                      ? "Start Exploring"
                      : "Commencer l'Exploration"}
                  </span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button
                onClick={() => router.push("/explore?category=restaurant")}
                className="px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white border border-gray-200/50 dark:border-gray-700/50 rounded-2xl font-semibold text-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-300"
              >
                {currentLanguage === "en"
                  ? "Browse Restaurants"
                  : "Parcourir les Restaurants"}
              </button>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-3 pt-4">
              {renderStars(4.8)}
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                4.8
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {currentLanguage === "en"
                  ? "Average user rating"
                  : "Note moyenne des utilisateurs"}
              </span>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span>
                  {currentLanguage === "en"
                    ? "Verified Partners"
                    : "Partenaires Vérifiés"}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span>
                  {currentLanguage === "en"
                    ? "Instant Booking"
                    : "Réservation Instantanée"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Constrained Illustration */}
          <div className="relative flex items-start justify-center min-h-full">
            <div className="mt-0">
              <TravelIllustration />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
