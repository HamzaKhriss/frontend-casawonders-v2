// pages/wishlist.tsx
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Heart,
  Grid,
  List as ListIcon,
  Trash2,
  Star,
  MapPin,
  Calendar,
  Users,
  Sparkles,
  ArrowRight,
  BookmarkX,
} from "lucide-react";

import Card from "@/components/Card";
import BookingModal from "@/components/BookingModal";
import { Listing } from "@/lib/types";
import { getFavoriteListings, removeFavorite } from "@/lib/api";

interface WishlistPageProps {
  currentLanguage: "en" | "fr";
  currentTheme: "light" | "dark";
}

const WishlistPage: React.FC<WishlistPageProps> = ({ currentLanguage }) => {
  const router = useRouter();

  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedListing, setSelected] = useState<Listing | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  /* ─────────── Charger la liste des favoris ─────────── */
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        setListings(await getFavoriteListings());
      } catch (err) {
        console.error("Failed to load wishlist:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  /* ─────────── Ajouter / retirer un favori ──────────── */
  const handleWishlistChange = async (id: string, willBeLiked: boolean) => {
    // Ici willBeLiked === false → on retire
    if (!willBeLiked) {
      // Optimistic UI : retrait immédiat
      setListings((prev) => prev.filter((l) => l.id !== id));
      try {
        await removeFavorite(id);
      } catch (err) {
        console.error("Remove favorite failed → rollback", err);
        // rollback : on recharge
        setListings(await getFavoriteListings());
      }
    }
  };

  /* ─────────── Vider toute la wishlist ─────────── */
  const clearAll = async () => {
    const ok = window.confirm(
      currentLanguage === "en"
        ? "Are you sure you want to clear your entire wishlist?"
        : "Êtes-vous sûr de vouloir vider toute votre liste de souhaits ?"
    );
    if (!ok) return;

    try {
      await Promise.all(listings.map((l) => removeFavorite(l.id)));
      setListings([]);
    } catch (err) {
      console.error("Failed to clear wishlist:", err);
    }
  };

  /* ─────────── Helpers d'action UI ─────────── */
  const goToListing = (l: Listing) => router.push(`/listing/${l.id}`);
  const openBooking = (l: Listing, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelected(l);
    setModalOpen(true);
  };

  // Calculate stats
  const totalValue = listings.reduce((sum, listing) => sum + listing.price, 0);
  const categories = Array.from(new Set(listings.map((l) => l.category)));

  /* ─────────── Rendu ─────────── */
  return (
    <>
      <Head>
        <title>
          {currentLanguage === "en"
            ? "My Wishlist - Casa Wonders"
            : "Ma Liste de Souhaits - Casa Wonders"}
        </title>
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6">
                <Heart className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {currentLanguage === "en"
                  ? "My Wishlist"
                  : "Ma Liste de Souhaits"}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {currentLanguage === "en"
                  ? "Your curated collection of unforgettable Casablanca experiences"
                  : "Votre collection d'expériences inoubliables à Casablanca"}
              </p>
            </div>

            {/* Stats Cards */}
            {!isLoading && listings.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {listings.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {currentLanguage === "en" ? "Saved" : "Sauvegardées"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {categories.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {currentLanguage === "en" ? "Categories" : "Catégories"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                      <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {(
                          listings.reduce((sum, l) => sum + l.rating, 0) /
                          listings.length
                        ).toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {currentLanguage === "en" ? "Avg Rating" : "Note Moy."}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <span className="text-accent font-bold text-sm">MAD</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {totalValue.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {currentLanguage === "en"
                          ? "Total Value"
                          : "Valeur Tot."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Controls */}
            {!isLoading && listings.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {currentLanguage === "en" ? "View as:" : "Afficher comme:"}
                  </span>
                  <div className="flex bg-white dark:bg-gray-800 rounded-xl p-1 shadow-lg border border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-3 rounded-lg transition-all duration-200 ${
                        viewMode === "grid"
                          ? "bg-accent text-white shadow-md"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-3 rounded-lg transition-all duration-200 ${
                        viewMode === "list"
                          ? "bg-accent text-white shadow-md"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <ListIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={clearAll}
                  className="flex items-center space-x-2 px-6 py-3 text-alert bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all duration-200 border border-red-200 dark:border-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="font-medium">
                    {currentLanguage === "en" ? "Clear All" : "Tout Effacer"}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 py-12">
          {isLoading ? (
            /* Enhanced Loading Skeleton */
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                      <div className="space-y-2">
                        <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden animate-pulse shadow-lg"
                  >
                    <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : listings.length === 0 ? (
            /* Enhanced Empty State */
            <div className="text-center py-20">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden">
                  <BookmarkX className="w-16 h-16 text-accent/60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 dark:to-gray-900/20" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {currentLanguage === "en"
                  ? "Your wishlist is waiting to be filled"
                  : "Votre liste de souhaits attend d'être remplie"}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                {currentLanguage === "en"
                  ? "Discover amazing experiences in Casablanca and save your favorites for later. Your perfect adventure is just a click away!"
                  : "Découvrez des expériences incroyables à Casablanca et sauvegardez vos favorites pour plus tard. Votre aventure parfaite n'est qu'à un clic !"}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push("/explore")}
                  className="bg-accent text-white px-8 py-4 rounded-xl font-semibold hover:bg-accent/90 transition-all duration-200 shadow-lg shadow-accent/30 flex items-center space-x-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>
                    {currentLanguage === "en"
                      ? "Explore Experiences"
                      : "Explorer les Expériences"}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl font-semibold border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  {currentLanguage === "en"
                    ? "Back to Home"
                    : "Retour à l'Accueil"}
                </button>
              </div>
            </div>
          ) : viewMode === "grid" ? (
            /* Enhanced Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((l) => (
                <div
                  key={l.id}
                  onClick={() => goToListing(l)}
                  className="transform hover:scale-105 transition-transform duration-200"
                >
                  <Card
                    listing={l}
                    currentLanguage={currentLanguage}
                    isWishlisted={true}
                    onWishlistChange={(id) => handleWishlistChange(id, false)}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Enhanced List View */
            <div className="space-y-6">
              {listings.map((l) => {
                const title = currentLanguage === "en" ? l.title : l.titleFr;
                const desc =
                  currentLanguage === "en" ? l.description : l.descriptionFr;
                const address =
                  currentLanguage === "en"
                    ? l.location.address
                    : l.location.addressFr;

                return (
                  <div
                    key={l.id}
                    onClick={() => goToListing(l)}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer overflow-hidden group"
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden">
                        <img
                          src={l.images[0]}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/90 backdrop-blur-sm text-gray-800 shadow-lg">
                            {l.category}
                          </span>
                        </div>
                      </div>

                      <div className="md:w-2/3 p-8">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-accent transition-colors">
                              {title}
                            </h3>

                            <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 text-lg leading-relaxed">
                              {desc}
                            </p>

                            <div className="flex items-center space-x-6 text-gray-500 dark:text-gray-400 mb-6">
                              <div className="flex items-center space-x-2">
                                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                <span className="font-semibold">
                                  {l.rating}
                                </span>
                                <span>
                                  ({l.reviewCount}{" "}
                                  {currentLanguage === "en"
                                    ? "reviews"
                                    : "avis"}
                                  )
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-5 h-5" />
                                <span>{address}</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2 text-accent">
                                <Users className="w-5 h-5" />
                                <span className="font-medium">
                                  {currentLanguage === "en"
                                    ? "Perfect for groups"
                                    : "Parfait pour les groupes"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-3xl font-bold text-accent mb-2">
                              {l.price} MAD
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                              {currentLanguage === "en"
                                ? "per person"
                                : "par personne"}
                            </div>

                            <div className="space-y-3">
                              <button
                                onClick={(e) => openBooking(l, e)}
                                className="w-full bg-accent text-white px-6 py-3 rounded-xl font-semibold hover:bg-accent/90 transition-all duration-200 shadow-lg shadow-accent/30"
                              >
                                {currentLanguage === "en"
                                  ? "Book Now"
                                  : "Réserver"}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleWishlistChange(l.id, false);
                                }}
                                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center space-x-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>
                                  {currentLanguage === "en"
                                    ? "Remove"
                                    : "Supprimer"}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* Booking Modal */}
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          listing={selectedListing}
          currentLanguage={currentLanguage}
        />
      </div>
    </>
  );
};

export default WishlistPage;
