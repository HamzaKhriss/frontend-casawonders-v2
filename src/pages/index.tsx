import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Filter,
  Search,
  MapPin,
  TrendingUp,
  Star,
  Users,
  Clock,
  ArrowRight,
  Check,
  Building2,
} from "lucide-react";
import MapView from "@/components/MapView";
import FilterDrawer from "@/components/FilterDrawer";
import Card from "@/components/Card";
import HeroSection from "@/components/HeroSection";
import { Listing } from "@/lib/mockData";
import { getListings, ListingFilters } from "@/lib/api";

interface HomePageProps {
  currentLanguage: "en" | "fr";
  currentTheme: "light" | "dark";
}

const HomePage: React.FC<HomePageProps> = ({ currentLanguage }) => {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<ListingFilters>({});
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [userLocation, setUserLocation] = useState<
    [number, number] | undefined
  >(undefined);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setUserLocation([coords.latitude, coords.longitude]);
        },
        (err) => console.warn("Géo impossible :", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Load initial listings
  useEffect(() => {
    const loadListings = async () => {
      setIsLoading(true);
      try {
        const response = await getListings(filters, 1, 50);
        setListings(response.data);
      } catch (error) {
        console.error("Failed to load listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadListings();
  }, [filters]);

  const handleFilterApply = (newFilters: ListingFilters) => {
    setFilters(newFilters);
    setSelectedListing(null);
  };

  const handleListingClick = (listing: Listing) => {
    setSelectedListing(listing);
  };

  const handleListingCardClick = (listing: Listing) => {
    router.push(`/listing/${listing.id}`);
  };

  const featuredListings = listings.slice(0, 6);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined)
      count++;
    if (filters.minRating) count++;
    if (filters.date) count++;
    if (filters.location) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <>
      <Head>
        <title>Casa Wonders - Discover the Best of Casablanca</title>
        <meta
          name="description"
          content="Explore restaurants, cultural sites, and events in Casablanca with our interactive map. Book authentic experiences in Morocco's economic capital."
        />
        <meta
          property="og:title"
          content="Casa Wonders - Discover the Best of Casablanca"
        />
        <meta
          property="og:description"
          content="Explore restaurants, cultural sites, and events in Casablanca with our interactive map."
        />
      </Head>

      <div className="relative">
        {/* Hero Section */}
        <HeroSection
          currentLanguage={currentLanguage}
          onSearchClick={() => setIsFilterDrawerOpen(true)}
          onExploreClick={() => router.push("/explore")}
          listingsCount={listings.length || 150}
        />

        {/* Featured Categories Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {currentLanguage === "en"
                  ? "Explore by Category"
                  : "Explorer par Catégorie"}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                {currentLanguage === "en"
                  ? "Discover the best of Casablanca through our curated categories"
                  : "Découvrez le meilleur de Casablanca à travers nos catégories soigneusement sélectionnées"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  key: "restaurant",
                  icon: "🍽️",
                  title:
                    currentLanguage === "en" ? "Restaurants" : "Restaurants",
                  description:
                    currentLanguage === "en"
                      ? "Savor authentic Moroccan cuisine"
                      : "Savourez la cuisine marocaine authentique",
                  color: "from-orange-500 to-red-500",
                  bgColor: "bg-orange-50 dark:bg-orange-900/20",
                  textColor: "text-orange-600 dark:text-orange-400",
                },
                {
                  key: "cultural",
                  icon: "🏛️",
                  title:
                    currentLanguage === "en"
                      ? "Cultural Sites"
                      : "Sites Culturels",
                  description:
                    currentLanguage === "en"
                      ? "Explore rich heritage and history"
                      : "Explorez le riche patrimoine et l'histoire",
                  color: "from-blue-500 to-purple-500",
                  bgColor: "bg-blue-50 dark:bg-blue-900/20",
                  textColor: "text-blue-600 dark:text-blue-400",
                },
                {
                  key: "event",
                  icon: "🎭",
                  title: currentLanguage === "en" ? "Events" : "Événements",
                  description:
                    currentLanguage === "en"
                      ? "Join vibrant local celebrations"
                      : "Participez aux célébrations locales vibrantes",
                  color: "from-purple-500 to-pink-500",
                  bgColor: "bg-purple-50 dark:bg-purple-900/20",
                  textColor: "text-purple-600 dark:text-purple-400",
                },
                {
                  key: "activity",
                  icon: "🏄‍♂️",
                  title: currentLanguage === "en" ? "Activities" : "Activités",
                  description:
                    currentLanguage === "en"
                      ? "Adventure and recreation awaits"
                      : "L'aventure et les loisirs vous attendent",
                  color: "from-green-500 to-teal-500",
                  bgColor: "bg-green-50 dark:bg-green-900/20",
                  textColor: "text-green-600 dark:text-green-400",
                },
              ].map((category) => (
                <div
                  key={category.key}
                  className="group cursor-pointer"
                  onClick={() =>
                    router.push(`/explore?category=${category.key}`)
                  }
                >
                  <div
                    className={`relative ${category.bgColor} rounded-3xl p-8 h-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-200/50 dark:border-gray-700/50`}
                  >
                    <div className="text-center space-y-4">
                      <div className="text-5xl mb-4">{category.icon}</div>
                      <h3
                        className={`text-2xl font-bold ${category.textColor}`}
                      >
                        {category.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {category.description}
                      </p>
                      <div className="pt-4">
                        <div
                          className={`inline-flex items-center space-x-2 ${category.textColor} font-semibold group-hover:translate-x-1 transition-transform`}
                        >
                          <span>
                            {currentLanguage === "en" ? "Explore" : "Explorer"}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Listings Section */}
        {featuredListings.length > 0 && (
          <section className="py-20 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  {currentLanguage === "en"
                    ? "Featured Experiences"
                    : "Expériences en Vedette"}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  {currentLanguage === "en"
                    ? "Discover the most popular and highly-rated places in Casablanca"
                    : "Découvrez les lieux les plus populaires et les mieux notés de Casablanca"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="group cursor-pointer"
                    onClick={() => handleListingCardClick(listing)}
                  >
                    <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={listing.image_url || "/placeholder.jpg"}
                          alt={listing.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {listing.category}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4">
                          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {listing.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                          {listing.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                          {listing.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">
                              {typeof listing.location === "string"
                                ? listing.location
                                : listing.location?.address ||
                                  listing.location?.addressFr ||
                                  "Casablanca"}
                            </span>
                          </div>
                          <div className="text-accent font-bold">
                            {listing.price_range || "Free"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={() => router.push("/explore")}
                  className="group bg-accent text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="flex items-center space-x-3">
                    <span>
                      {currentLanguage === "en"
                        ? "View All Experiences"
                        : "Voir Toutes les Expériences"}
                    </span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Map Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {currentLanguage === "en"
                  ? "Explore on Map"
                  : "Explorer sur la Carte"}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                {currentLanguage === "en"
                  ? "Discover places around you with our interactive map"
                  : "Découvrez les lieux autour de vous avec notre carte interactive"}
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="h-[500px] relative">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {currentLanguage === "en"
                          ? "Loading map..."
                          : "Chargement de la carte..."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <MapView
                    listings={listings}
                    selectedListing={selectedListing}
                    onListingClick={handleListingClick}
                    userLocation={userLocation}
                    filters={filters}
                    currentLanguage={currentLanguage}
                  />
                )}
                <div className="absolute top-6 left-6 z-[1000]">
                  <button
                    onClick={() => setIsFilterDrawerOpen(true)}
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
                  >
                    <Filter className="w-5 h-5" />
                    <span className="font-semibold">
                      {currentLanguage === "en" ? "Filter" : "Filtrer"}
                    </span>
                    {activeFiltersCount > 0 && (
                      <span className="bg-accent text-white text-sm w-6 h-6 rounded-full flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partner CTA Section */}
        <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                  {currentLanguage === "en"
                    ? "Join Casa Wonders as a Partner"
                    : "Rejoignez Casa Wonders en tant que Partenaire"}
                </h2>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  {currentLanguage === "en"
                    ? "Showcase your business to thousands of travelers and grow your revenue with our trusted platform."
                    : "Présentez votre entreprise à des milliers de voyageurs et augmentez vos revenus avec notre plateforme de confiance."}
                </p>
                <div className="space-y-4 mb-8">
                  {[
                    {
                      en: "Reach more customers",
                      fr: "Atteignez plus de clients",
                    },
                    {
                      en: "Easy booking management",
                      fr: "Gestion facile des réservations",
                    },
                    {
                      en: "Secure payments",
                      fr: "Paiements sécurisés",
                    },
                    {
                      en: "Professional support",
                      fr: "Support professionnel",
                    },
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-200">
                        {currentLanguage === "en" ? benefit.en : benefit.fr}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => router.push("/partner/register")}
                    className="group bg-accent text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <span className="flex items-center justify-center space-x-3">
                      <Building2 className="w-5 h-5" />
                      <span>
                        {currentLanguage === "en"
                          ? "Become a Partner"
                          : "Devenir Partenaire"}
                      </span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                  <button
                    onClick={() => router.push("/partner/login")}
                    className="group border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all duration-300"
                  >
                    {currentLanguage === "en"
                      ? "Partner Login"
                      : "Connexion Partenaire"}
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          500+ Partners
                        </h3>
                        <p className="text-gray-300">Growing community</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          25% Average Growth
                        </h3>
                        <p className="text-gray-300">In bookings per month</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          4.9/5 Rating
                        </h3>
                        <p className="text-gray-300">Partner satisfaction</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-accent/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-accent/10 rounded-full blur-lg"></div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-accent text-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                {currentLanguage === "en"
                  ? "Why Choose Casa Wonders?"
                  : "Pourquoi Choisir Casa Wonders?"}
              </h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                {currentLanguage === "en"
                  ? "Join thousands of travelers who trust us to discover the best of Casablanca"
                  : "Rejoignez des milliers de voyageurs qui nous font confiance pour découvrir le meilleur de Casablanca"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  icon: <MapPin className="w-8 h-8" />,
                  number: (listings.length || 150) + "+",
                  label:
                    currentLanguage === "en"
                      ? "Unique Places"
                      : "Lieux Uniques",
                },
                {
                  icon: <Star className="w-8 h-8" />,
                  number: "4.8",
                  label:
                    currentLanguage === "en"
                      ? "Average Rating"
                      : "Note Moyenne",
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  number: "50K+",
                  label:
                    currentLanguage === "en"
                      ? "Happy Travelers"
                      : "Voyageurs Satisfaits",
                },
                {
                  icon: <Clock className="w-8 h-8" />,
                  number: "24/7",
                  label: currentLanguage === "en" ? "Support" : "Support",
                },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filter Drawer */}
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

export default HomePage;
