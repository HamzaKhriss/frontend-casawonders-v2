import React, { useState, useEffect, useCallback, useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Filter, Grid, Map, Search, MapPin, TrendingUp } from "lucide-react";

import MapView from "@/components/MapView";
import FilterDrawer from "@/components/FilterDrawer";
import Card from "@/components/Card";

import {
  getListings,
  searchListings,
  getFavorites,
  addFavorite,
  removeFavorite,
  ListingFilters,
  PaginatedResponse,
} from "@/lib/api";
import { getLatLng, watchPosition } from "@/lib/geo";
import { Listing } from "@/lib/mockData";

interface ExplorePageProps {
  currentLanguage: "en" | "fr";
  currentTheme: "light" | "dark";
}

const ExplorePage: React.FC<ExplorePageProps> = ({ currentLanguage }) => {
  const router = useRouter();

  /* ───────────── States ───────────── */
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [listings, setListings] = useState<Listing[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [filters, setFilters] = useState<ListingFilters>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  // ** Nouveauté ** : position utilisateur
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  /* ────────── Récupération des favoris ────────── */
  useEffect(() => {
    getFavorites()
      .then(setFavorites)
      .catch(() => {}); // non connecté
  }, []);

  /* ────────── Gestion des favoris ────────── */
  const toggleFavorite = async (id: string) => {
    const willAdd = !favorites.includes(id);
    try {
      if (willAdd) {
        await addFavorite(id);
        setFavorites((prev) => [...prev, id]);
      } else {
        await removeFavorite(id);
        setFavorites((prev) => prev.filter((x) => x !== id));
      }
    } catch {
      alert(
        currentLanguage === "en"
          ? "You must be logged in to save favorites."
          : "Vous devez être connecté pour sauvegarder des favoris."
      );
    }
  };

  // Synchronisation URL → état (search + category)
  useEffect(() => {
    const { search, category } = router.query;

    // Mettre à jour la recherche
    if (typeof search === "string") {
      setSearchQuery(search);
    } else {
      setSearchQuery("");
    }

    // Mettre à jour le filtre catégorie
    setFilters((prev) => ({
      ...prev,
      category:
        typeof category === "string" && category !== ""
          ? (category as ListingFilters["category"])
          : undefined,
    }));

    // À chaque changement d'URL, repartir de la page 1
    setPage(1);
  }, [router.query]);

  /* ────────── Géolocalisation → filtre + repère ────────── */
  useEffect(() => {
    (async () => {
      const coords = await getLatLng();
      if (coords) {
        setFilters((prev) =>
          prev.location ? prev : { ...prev, location: { ...coords, radius: 5 } }
        );
      }
    })();

    // ** watchPosition pour mettre à jour le repère utilisateur en temps réel **
    const unsub = watchPosition((pos) => {
      if (pos && pos.coords) {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      }
    });
    return () => unsub();
  }, []);

  /* ────────── Chargement des listings ────────── */
  const loadListings = useCallback(
    async (pageNum: number, reset = false) => {
      reset ? setIsLoading(true) : setIsLoadingMore(true);
      try {
        let response: PaginatedResponse<Listing>;
        if (searchQuery.trim()) {
          const results = await searchListings(searchQuery.trim());
          response = {
            data: results,
            total: results.length,
            page: 1,
            per_page: results.length,
            has_more: false,
          };
        } else {
          response = await getListings(filters, pageNum, 12);
        }
        reset
          ? setListings(response.data)
          : setListings((prev) => [...prev, ...response.data]);
        setHasMore(response.has_more);
        setPage(response.page);
      } catch (err) {
        console.error("❌ load listings:", err);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [filters, searchQuery]
  );

  useEffect(() => {
    loadListings(1, true);
  }, [loadListings]);

  /* ────────── Handlers ────────── */
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(router.query as Record<string, string>);
    searchQuery ? params.set("search", searchQuery) : params.delete("search");
    router.push(`/explore${params.toString() ? `?${params}` : ""}`, undefined);
  };

  const handleFilterApply = (newFilters: ListingFilters) => {
    setFilters(newFilters);
    setSelectedListing(null);
    const params = new URLSearchParams(router.query as Record<string, string>);
    newFilters.category
      ? params.set("category", newFilters.category)
      : params.delete("category");
    router.push(`/explore${params.toString() ? `?${params}` : ""}`, undefined);
  };

  const activeFiltersCount = useMemo(
    () =>
      [
        filters.category,
        filters.minPrice,
        filters.maxPrice,
        filters.minRating,
        filters.date,
        filters.location,
      ].filter(Boolean).length,
    [filters]
  );

  /* ────────── Render ────────── */
  return (
    <>
      <Head>
        <title>
          {currentLanguage === "en"
            ? "Explore Casablanca"
            : "Explorer Casablanca"}
        </title>
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {currentLanguage === "en"
                  ? "Explore Casablanca"
                  : "Explorer Casablanca"}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {currentLanguage === "en"
                  ? "Discover authentic experiences, exquisite restaurants, and rich cultural heritage in Morocco's economic capital."
                  : "Découvrez des expériences authentiques, des restaurants exquis et un riche patrimoine culturel dans la capitale économique du Maroc."}
              </p>
            </div>

            {/* Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-2xl mx-auto mb-8"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder={
                    currentLanguage === "en"
                      ? "Search experiences, restaurants, events..."
                      : "Rechercher des expériences, restaurants, événements..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200 text-lg"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent text-white px-6 py-2 rounded-xl hover:bg-accent/90 transition-all duration-200 font-medium"
                >
                  {currentLanguage === "en" ? "Search" : "Rechercher"}
                </button>
              </div>
            </form>

            {/* Quick Filters */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                {
                  key: "restaurant",
                  label:
                    currentLanguage === "en" ? "Restaurants" : "Restaurants",
                  icon: "🍽️",
                },
                {
                  key: "cultural",
                  label: currentLanguage === "en" ? "Cultural" : "Culturel",
                  icon: "🏛️",
                },
                {
                  key: "event",
                  label: currentLanguage === "en" ? "Events" : "Événements",
                  icon: "🎉",
                },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => {
                    const params = new URLSearchParams(
                      router.query as Record<string, string>
                    );
                    if (filters.category === filter.key) {
                      params.delete("category");
                    } else {
                      params.set("category", filter.key);
                    }
                    router.push(
                      `/explore${params.toString() ? `?${params}` : ""}`,
                      undefined
                    );
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    filters.category === filter.key
                      ? "bg-accent text-white shadow-lg"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                  }`}
                >
                  <span>{filter.icon}</span>
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>

            {/* Stats & Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">
                    {listings.length}{" "}
                    {currentLanguage === "en"
                      ? "experiences found"
                      : "expériences trouvées"}
                  </span>
                </div>
                {searchQuery && (
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">
                      {currentLanguage === "en"
                        ? `Results for "${searchQuery}"`
                        : `Résultats pour "${searchQuery}"`}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3">
                {/* Filter Button */}
                <button
                  onClick={() => setIsFilterDrawerOpen(true)}
                  className="relative flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {currentLanguage === "en" ? "Filters" : "Filtres"}
                  </span>
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* View Toggle */}
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                      viewMode === "list"
                        ? "bg-white dark:bg-gray-600 text-accent shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                    <span className="text-sm font-medium hidden sm:block">
                      {currentLanguage === "en" ? "Grid" : "Grille"}
                    </span>
                  </button>
                  <button
                    onClick={() => setViewMode("map")}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                      viewMode === "map"
                        ? "bg-white dark:bg-gray-600 text-accent shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                  >
                    <Map className="w-4 h-4" />
                    <span className="text-sm font-medium hidden sm:block">
                      {currentLanguage === "en" ? "Map" : "Carte"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        {viewMode === "list" ? (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {isLoading ? (
              /* Loading Skeleton */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-72"></div>
                  </div>
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {currentLanguage === "en"
                    ? "No experiences found"
                    : "Aucune expérience trouvée"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {currentLanguage === "en"
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "Essayez d'ajuster votre recherche ou vos filtres pour trouver ce que vous cherchez."}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilters({});
                    router.push("/explore");
                  }}
                  className="bg-accent text-white px-6 py-3 rounded-xl hover:bg-accent/90 transition-all duration-200 font-medium"
                >
                  {currentLanguage === "en"
                    ? "Clear all filters"
                    : "Effacer tous les filtres"}
                </button>
              </div>
            ) : (
              <>
                {/* Results Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                  {listings.map((listing) => (
                    <div
                      key={listing.id}
                      onClick={() => router.push(`/listing/${listing.id}`)}
                      className="cursor-pointer"
                    >
                      <Card
                        listing={listing}
                        currentLanguage={currentLanguage}
                        isWishlisted={favorites.includes(listing.id)}
                        onWishlistChange={toggleFavorite}
                      />
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center">
                    <button
                      onClick={() => loadListings(page + 1)}
                      disabled={isLoadingMore}
                      className="bg-accent text-white px-8 py-3 rounded-xl hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                    >
                      {isLoadingMore
                        ? currentLanguage === "en"
                          ? "Loading..."
                          : "Chargement..."
                        : currentLanguage === "en"
                        ? "Load More Experiences"
                        : "Charger plus d'expériences"}
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        ) : (
          <section className="h-[calc(100vh-200px)]">
            <MapView
              listings={listings}
              onListingClick={setSelectedListing}
              selectedListing={selectedListing}
              currentLanguage={currentLanguage}
              height="100%"
              userLocation={userLocation ?? undefined}
            />
          </section>
        )}

        <FilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          onApplyFilters={handleFilterApply}
          currentFilters={filters}
          currentLanguage={currentLanguage}
        />
      </div>
    </>
  );
};

export default ExplorePage;
