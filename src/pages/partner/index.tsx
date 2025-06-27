import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  BarChart3,
  Users,
  MapPin,
  Star,
  Calendar,
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Activity,
  Award,
  AlertTriangle,
  Settings,
  Loader2,
} from "lucide-react";

import {
  partnerProfileApi,
  partnerListingsApi,
  partnerReservationsApi,
  partnerReviewsApi,
  partnerUtils,
  PartnerProfile,
  PartnerListing,
  PartnerReservation,
  PartnerReview,
} from "@/lib/partnerApi";

const PartnerDashboard: React.FC = () => {
  const router = useRouter();
  const [currentLanguage] = useState<"en" | "fr">("en");
  const [activeTab, setActiveTab] = useState<
    "overview" | "listings" | "bookings" | "reviews"
  >("overview");

  // State management
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [listings, setListings] = useState<PartnerListing[]>([]);
  const [reservations, setReservations] = useState<PartnerReservation[]>([]);
  const [reviews, setReviews] = useState<PartnerReview[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Check authentication and load data
  useEffect(() => {
    if (!partnerUtils.isAuthenticated()) {
      router.push("/partner/login");
      return;
    }

    loadDashboardData();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all data in parallel
      const [profileData, listingsData, reservationsData, reviewsData] =
        await Promise.all([
          partnerProfileApi.get().catch(() => null),
          partnerListingsApi.getAll().catch(() => []),
          partnerReservationsApi.getAll().catch(() => []),
          partnerReviewsApi.getAll().catch(() => []),
        ]);

      setProfile(profileData);
      setListings(listingsData);
      setReservations(reservationsData);
      setReviews(reviewsData);
    } catch (err: any) {
      console.error("Error loading dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = {
    totalListings: listings.length,
    activeListings: listings.filter((l) => l.is_active).length,
    totalReservations: reservations.length,
    pendingReservations: reservations.filter((r) => r.status === "pending")
      .length,
    confirmedReservations: reservations.filter((r) => r.status === "confirmed")
      .length,
    totalRevenue: reservations
      .filter((r) => r.status === "confirmed")
      .reduce((sum, r) => sum + r.total_price, 0),
    averageRating:
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0,
    totalReviews: reviews.length,
  };

  // Handle logout
  const handleLogout = () => {
    partnerUtils.setToken("");
    localStorage.removeItem("partner_token");
    router.push("/partner/login");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">
            {currentLanguage === "en"
              ? "Loading dashboard..."
              : "Chargement du tableau de bord..."}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {currentLanguage === "en"
              ? "Error Loading Dashboard"
              : "Erreur de chargement"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            {currentLanguage === "en" ? "Retry" : "Réessayer"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          {currentLanguage === "en"
            ? "Partner Dashboard"
            : "Tableau de bord partenaire"}{" "}
          - Casa Wonders
        </title>
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Casa Wonders
                </h1>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {currentLanguage === "en"
                    ? "Partner Portal"
                    : "Portail Partenaire"}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-gray-700 dark:text-gray-300">
                  {profile?.business_name || currentLanguage === "en"
                    ? "Welcome"
                    : "Bienvenue"}
                </span>
                <button
                  onClick={() => router.push("/partner/settings")}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {currentLanguage === "en" ? "Logout" : "Déconnexion"}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {currentLanguage === "en" ? "Dashboard" : "Tableau de bord"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {currentLanguage === "en"
                ? "Manage your listings, bookings, and business performance"
                : "Gérez vos annonces, réservations et performances commerciales"}
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentLanguage === "en"
                      ? "Total Listings"
                      : "Annonces Totales"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalListings}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentLanguage === "en"
                      ? "Total Bookings"
                      : "Réservations Totales"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalReservations}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentLanguage === "en"
                      ? "Total Revenue"
                      : "Chiffre d'Affaires"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {partnerUtils.formatCurrency(stats.totalRevenue)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentLanguage === "en"
                      ? "Average Rating"
                      : "Note Moyenne"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.averageRating.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6">
                {[
                  {
                    key: "overview",
                    en: "Overview",
                    fr: "Aperçu",
                    icon: Activity,
                  },
                  {
                    key: "listings",
                    en: "Listings",
                    fr: "Annonces",
                    icon: MapPin,
                  },
                  {
                    key: "bookings",
                    en: "Bookings",
                    fr: "Réservations",
                    icon: Calendar,
                  },
                  {
                    key: "reviews",
                    en: "Reviews",
                    fr: "Avis",
                    icon: MessageSquare,
                  },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.key
                          ? "border-accent text-accent"
                          : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{currentLanguage === "en" ? tab.en : tab.fr}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      {currentLanguage === "en"
                        ? "Quick Actions"
                        : "Actions Rapides"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={() => router.push("/partner/listings/new")}
                        className="flex items-center space-x-3 p-4 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                        <span className="font-medium">
                          {currentLanguage === "en"
                            ? "Add New Listing"
                            : "Nouvelle Annonce"}
                        </span>
                      </button>

                      <button
                        onClick={() => setActiveTab("bookings")}
                        className="flex items-center space-x-3 p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <Calendar className="w-5 h-5" />
                        <span className="font-medium">
                          {currentLanguage === "en"
                            ? "Manage Bookings"
                            : "Gérer Réservations"}
                        </span>
                      </button>

                      <button
                        onClick={() => router.push("/partner/settings")}
                        className="flex items-center space-x-3 p-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">
                          {currentLanguage === "en" ? "Settings" : "Paramètres"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      {currentLanguage === "en"
                        ? "Recent Activity"
                        : "Activité Récente"}
                    </h3>

                    {reservations.length === 0 && reviews.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>
                          {currentLanguage === "en"
                            ? "No recent activity"
                            : "Aucune activité récente"}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Recent reservations */}
                        {reservations.slice(0, 3).map((reservation) => (
                          <div
                            key={reservation.reservation_id}
                            className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-white">
                                {currentLanguage === "en"
                                  ? "New booking"
                                  : "Nouvelle réservation"}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {partnerUtils.formatDate(
                                  reservation.date_time_reservation
                                )}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                reservation.status === "confirmed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : reservation.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              }`}
                            >
                              {reservation.status}
                            </span>
                          </div>
                        ))}

                        {/* Recent reviews */}
                        {reviews.slice(0, 2).map((review) => (
                          <div
                            key={review.review_id}
                            className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <Star className="w-5 h-5 text-yellow-400" />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-white">
                                {currentLanguage === "en"
                                  ? "New review"
                                  : "Nouvel avis"}
                              </p>
                              <div className="flex items-center space-x-2">
                                <div className="flex space-x-1">
                                  {[...Array(review.rating)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className="w-3 h-3 text-yellow-400 fill-current"
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {partnerUtils.formatDate(review.date_review)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Listings Tab */}
              {activeTab === "listings" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {currentLanguage === "en"
                        ? "Your Listings"
                        : "Vos Annonces"}
                    </h3>
                    <button
                      onClick={() => router.push("/partner/listings/new")}
                      className="flex items-center space-x-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>
                        {currentLanguage === "en" ? "Add Listing" : "Ajouter"}
                      </span>
                    </button>
                  </div>

                  {listings.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {currentLanguage === "en"
                          ? "No listings yet"
                          : "Aucune annonce"}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {currentLanguage === "en"
                          ? "Create your first listing to start accepting bookings"
                          : "Créez votre première annonce pour commencer à recevoir des réservations"}
                      </p>
                      <button
                        onClick={() => router.push("/partner/listings/new")}
                        className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                      >
                        {currentLanguage === "en"
                          ? "Create First Listing"
                          : "Créer la Première Annonce"}
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {listings.map((listing) => (
                        <div
                          key={listing.listing_id}
                          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                        >
                          <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                            {listing.images[0] ? (
                              <img
                                src={listing.images[0]}
                                alt={listing.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <MapPin className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>

                          <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                {listing.name}
                              </h4>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ml-2 ${
                                  listing.is_active
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                }`}
                              >
                                {listing.is_active
                                  ? currentLanguage === "en"
                                    ? "Active"
                                    : "Actif"
                                  : currentLanguage === "en"
                                  ? "Inactive"
                                  : "Inactif"}
                              </span>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                              {listing.description || currentLanguage === "en"
                                ? "No description"
                                : "Aucune description"}
                            </p>

                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {partnerUtils.formatCurrency(
                                  listing.base_price
                                )}
                              </span>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() =>
                                    router.push(
                                      `/partner/listings/${listing.listing_id}/edit`
                                    )
                                  }
                                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-red-500 hover:text-red-700">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Bookings Tab */}
              {activeTab === "bookings" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentLanguage === "en"
                      ? "Recent Bookings"
                      : "Réservations Récentes"}
                  </h3>

                  {reservations.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {currentLanguage === "en"
                          ? "No bookings yet"
                          : "Aucune réservation"}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {currentLanguage === "en"
                          ? "Bookings will appear here once customers start booking your experiences"
                          : "Les réservations apparaîtront ici une fois que les clients commenceront à réserver vos expériences"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reservations.map((reservation) => {
                        const listing = listings.find(
                          (l) => l.listing_id === reservation.listing_id
                        );
                        return (
                          <div
                            key={reservation.reservation_id}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                  {listing?.name ||
                                    `Listing #${reservation.listing_id}`}
                                </h4>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                  <span className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                      {partnerUtils.formatDate(
                                        reservation.date_time_reservation
                                      )}
                                    </span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <Users className="w-4 h-4" />
                                    <span>
                                      {reservation.number_of_participants}{" "}
                                      {currentLanguage === "en"
                                        ? "guests"
                                        : "invités"}
                                    </span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <DollarSign className="w-4 h-4" />
                                    <span>
                                      {partnerUtils.formatCurrency(
                                        reservation.total_price
                                      )}
                                    </span>
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-3">
                                <span
                                  className={`px-3 py-1 text-sm rounded-full ${
                                    reservation.status === "confirmed"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                      : reservation.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                  }`}
                                >
                                  {reservation.status}
                                </span>

                                {reservation.status === "pending" && (
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() =>
                                        partnerReservationsApi
                                          .updateStatus(
                                            reservation.reservation_id,
                                            "confirmed"
                                          )
                                          .then(loadDashboardData)
                                      }
                                      className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                      <span>
                                        {currentLanguage === "en"
                                          ? "Accept"
                                          : "Accepter"}
                                      </span>
                                    </button>
                                    <button
                                      onClick={() =>
                                        partnerReservationsApi
                                          .updateStatus(
                                            reservation.reservation_id,
                                            "cancelled"
                                          )
                                          .then(loadDashboardData)
                                      }
                                      className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                      <XCircle className="w-4 h-4" />
                                      <span>
                                        {currentLanguage === "en"
                                          ? "Decline"
                                          : "Refuser"}
                                      </span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentLanguage === "en"
                      ? "Customer Reviews"
                      : "Avis Clients"}
                  </h3>

                  {reviews.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {currentLanguage === "en"
                          ? "No reviews yet"
                          : "Aucun avis"}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {currentLanguage === "en"
                          ? "Customer reviews will appear here after they complete their experiences"
                          : "Les avis clients apparaîtront ici après qu'ils aient terminé leurs expériences"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review) => {
                        const listing = listings.find(
                          (l) => l.listing_id === review.listing_id
                        );
                        return (
                          <div
                            key={review.review_id}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                  {listing?.name ||
                                    `Listing #${review.listing_id}`}
                                </h4>
                                <div className="flex items-center space-x-2">
                                  <div className="flex space-x-1">
                                    {[...Array(review.rating)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 text-yellow-400 fill-current"
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {partnerUtils.formatDate(
                                      review.date_review
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                              {review.comment_text}
                            </p>

                            {review.partner_reply ? (
                              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                  {currentLanguage === "en"
                                    ? "Your reply:"
                                    : "Votre réponse:"}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                  {review.partner_reply}
                                </p>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  const reply = prompt(
                                    currentLanguage === "en"
                                      ? "Your reply:"
                                      : "Votre réponse:"
                                  );
                                  if (reply) {
                                    partnerReviewsApi
                                      .reply(review.review_id, reply)
                                      .then(loadDashboardData);
                                  }
                                }}
                                className="text-accent hover:text-accent/80 text-sm font-medium"
                              >
                                {currentLanguage === "en"
                                  ? "Reply to review"
                                  : "Répondre à l'avis"}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default PartnerDashboard;
