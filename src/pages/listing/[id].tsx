// pages/listing/[id].tsx
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import {
  ArrowLeft,
  Heart,
  Share,
  Star,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  Clock,
  Users,
  Calendar,
  Shield,
  Award,
  Info,
  Camera,
  Phone,
  Mail,
  Globe,
  Navigation,
  Bookmark,
  MessageCircle,
  ThumbsUp,
  Verified,
  Crown,
  Grid3X3,
  X,
  Upload,
  Wifi,
  Car,
  Coffee,
  Utensils,
  Home,
  ChevronDown,
  Flag,
  Copy,
  CheckCircle,
} from "lucide-react";

import { Listing } from "@/lib/types";
import {
  getListing,
  getFavorites,
  addFavorite,
  removeFavorite,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import BookingModal from "@/components/BookingModal";
import MapView from "@/components/MapView";

interface ListingDetailPageProps {
  listing: Listing | null;
  currentLanguage: "en" | "fr";
  currentTheme: "light" | "dark";
}

const ListingDetailPage: React.FC<ListingDetailPageProps> = ({
  listing: initial,
  currentLanguage,
}) => {
  const router = useRouter();
  const { requireAuth } = useAuth();

  /* ------------------------------------------------------------------
   * ÉTATS
   * ------------------------------------------------------------------ */
  const [listing, setListing] = useState<Listing | null>(initial);
  const [wishlisted, setWishlisted] = useState(false);
  const [loadingWish, setLoadingWish] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  /* ------------------------------------------------------------------
   * Data loading and favorites sync
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (!listing && router.query.id) {
      getListing(router.query.id as string)
        .then(setListing)
        .catch(console.error);
    }

    if (router.query.id) {
      getFavorites()
        .then((ids) => setWishlisted(ids.includes(String(router.query.id))))
        .catch(() => {});
    }
  }, [router.query.id, listing]);

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">
            {currentLanguage === "en" ? "Loading..." : "Chargement..."}
          </p>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------
   * Language helpers
   * ------------------------------------------------------------------ */
  const title = currentLanguage === "en" ? listing.title : listing.titleFr;
  const desc =
    currentLanguage === "en" ? listing.description : listing.descriptionFr;
  const addr =
    currentLanguage === "en"
      ? listing.location.address
      : listing.location.addressFr;

  /* ------------------------------------------------------------------
   * Actions
   * ------------------------------------------------------------------ */
  const handleWishlist = async () => {
    if (!requireAuth("wishlist")) return;

    setLoadingWish(true);
    try {
      if (wishlisted) {
        await removeFavorite(listing.id);
      } else {
        await addFavorite(listing.id);
      }
      setWishlisted(!wishlisted);
    } catch (err: any) {
      if (String(err?.message).includes("400")) {
        setWishlisted(true);
      } else {
        console.error("Wishlist error:", err);
      }
    } finally {
      setLoadingWish(false);
    }
  };

  const handleBooking = () => {
    if (!requireAuth("booking")) return;
    setBookingOpen(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: desc,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  /* ------------------------------------------------------------------ */
  return (
    <>
      <Head>
        <title>{title} - Casa Wonders</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={listing.images[0]} />
      </Head>

      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        {/* Airbnb-style Header */}
        <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-screen-xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium hidden sm:block">
                  {currentLanguage === "en" ? "Back" : "Retour"}
                </span>
              </button>

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-1 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Share className="w-4 h-4" />
                    <span className="text-sm font-medium hidden sm:block">
                      {currentLanguage === "en" ? "Share" : "Partager"}
                    </span>
                  </button>

                  {/* Share Menu */}
                  {showShareMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <button
                        onClick={copyToClipboard}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        {copySuccess ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        )}
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {copySuccess
                            ? currentLanguage === "en"
                              ? "Copied!"
                              : "Copié!"
                            : currentLanguage === "en"
                            ? "Copy link"
                            : "Copier le lien"}
                        </span>
                      </button>
                      <button
                        onClick={() => setShowShareMenu(false)}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Flag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {currentLanguage === "en"
                            ? "Report listing"
                            : "Signaler"}
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleWishlist}
                  disabled={loadingWish}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    wishlisted
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  } ${loadingWish ? "opacity-50 cursor-wait" : ""}`}
                >
                  <Heart
                    className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`}
                  />
                  <span className="text-sm font-medium hidden sm:block">
                    {currentLanguage === "en" ? "Save" : "Sauvegarder"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-screen-xl mx-auto px-6 pt-6">
          {/* Title Section */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-2">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-black dark:text-white fill-current" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {listing.rating}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  ({listing.reviewCount}{" "}
                  {currentLanguage === "en" ? "reviews" : "avis"})
                </span>
              </div>
              <span className="text-gray-500 dark:text-gray-400">·</span>
              <span className="text-gray-700 dark:text-gray-300 underline">
                {addr}
              </span>
            </div>
          </div>

          {/* Photo Gallery - Airbnb Style */}
          <div className="mb-8">
            <div className="grid grid-cols-4 gap-2 h-[60vh] rounded-xl overflow-hidden">
              {/* Main Photo */}
              <div
                className="col-span-4 md:col-span-2 relative group cursor-pointer"
                onClick={() => setShowAllPhotos(true)}
              >
                <img
                  src={listing.images[0]}
                  alt={title}
                  className="w-full h-full object-cover group-hover:brightness-95 transition-all duration-200"
                />
              </div>

              {/* Side Photos */}
              <div className="hidden md:block col-span-1 space-y-2">
                {listing.images.slice(1, 3).map((img, idx) => (
                  <div
                    key={idx}
                    className="h-[calc(50%-4px)] relative group cursor-pointer"
                    onClick={() => setShowAllPhotos(true)}
                  >
                    <img
                      src={img}
                      alt={`${title} ${idx + 2}`}
                      className="w-full h-full object-cover group-hover:brightness-95 transition-all duration-200"
                    />
                  </div>
                ))}
              </div>

              <div className="hidden md:block col-span-1 space-y-2">
                {listing.images.slice(3, 5).map((img, idx) => (
                  <div
                    key={idx}
                    className="h-[calc(50%-4px)] relative group cursor-pointer"
                    onClick={() => setShowAllPhotos(true)}
                  >
                    <img
                      src={img}
                      alt={`${title} ${idx + 4}`}
                      className="w-full h-full object-cover group-hover:brightness-95 transition-all duration-200"
                    />
                    {idx === 1 && listing.images.length > 5 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <button
                          onClick={() => setShowAllPhotos(true)}
                          className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg text-gray-900 font-medium hover:bg-gray-100 transition-colors"
                        >
                          <Grid3X3 className="w-4 h-4" />
                          <span>
                            {currentLanguage === "en"
                              ? "Show all photos"
                              : "Voir toutes les photos"}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile: Show all photos button */}
            <div className="md:hidden mt-4">
              <button
                onClick={() => setShowAllPhotos(true)}
                className="w-full flex items-center justify-center space-x-2 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Grid3X3 className="w-4 h-4" />
                <span className="font-medium">
                  {currentLanguage === "en"
                    ? `Show all ${listing.images.length} photos`
                    : `Voir les ${listing.images.length} photos`}
                </span>
              </button>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Host Information */}
              <div className="pb-8 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {currentLanguage === "en"
                        ? `Experience hosted by ${listing.host.name}`
                        : `Expérience organisée par ${listing.host.name}`}
                    </h2>
                    <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 mt-1">
                      <span>
                        2-8 {currentLanguage === "en" ? "guests" : "invités"}
                      </span>
                      <span>·</span>
                      <span>
                        2-3 {currentLanguage === "en" ? "hours" : "heures"}
                      </span>
                    </div>
                  </div>
                  <img
                    src={listing.host.avatar}
                    alt={listing.host.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                </div>

                {listing.host.verified && (
                  <div className="flex items-center space-x-2 mb-4">
                    <Shield className="w-5 h-5 text-accent" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {currentLanguage === "en"
                        ? "Identity verified"
                        : "Identité vérifiée"}
                    </span>
                  </div>
                )}

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {desc}
                </p>
              </div>

              {/* What's Included */}
              <div className="py-8 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {currentLanguage === "en"
                    ? "What's included"
                    : "Ce qui est inclus"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {listing.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="py-8 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 mb-6">
                  <Star className="w-6 h-6 text-black dark:text-white fill-current" />
                  <span className="text-xl font-semibold text-gray-900 dark:text-white">
                    {listing.rating} · {listing.reviewCount}{" "}
                    {currentLanguage === "en" ? "reviews" : "avis"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1, 2, 3, 4].map((review) => (
                    <div key={review} className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src="/placeholder-avatar.jpg"
                          alt="Reviewer"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            Sarah M.
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {currentLanguage === "en"
                              ? "December 2024"
                              : "Décembre 2024"}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-black dark:text-white fill-current"
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {currentLanguage === "en"
                          ? "Amazing experience! The host was very knowledgeable and the tour was perfectly organized. Highly recommend!"
                          : "Expérience incroyable ! L'hôte était très compétent et la visite était parfaitement organisée. Je recommande vivement !"}
                      </p>
                    </div>
                  ))}
                </div>

                <button className="mt-6 px-6 py-3 border border-gray-900 dark:border-white text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">
                  {currentLanguage === "en"
                    ? `Show all ${listing.reviewCount} reviews`
                    : `Voir les ${listing.reviewCount} avis`}
                </button>
              </div>

              {/* Location */}
              <div className="py-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {currentLanguage === "en"
                    ? "Where you'll be"
                    : "Où vous serez"}
                </h3>

                <div className="mb-4">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl h-80 overflow-hidden">
                    <MapView
                      listings={[listing]}
                      center={[listing.location.lat, listing.location.lng]}
                      zoom={15}
                      height="100%"
                      currentLanguage={currentLanguage}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {addr}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {currentLanguage === "en"
                      ? "Located in the heart of Casablanca, this area is known for its vibrant culture and historical significance. Easily accessible by public transport and walking distance from major attractions."
                      : "Situé au cœur de Casablanca, ce quartier est connu pour sa culture vibrante et son importance historique. Facilement accessible en transport en commun et à distance de marche des principales attractions."}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg bg-white dark:bg-gray-900">
                  <div className="flex items-baseline space-x-2 mb-6">
                    <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {listing.price} MAD
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {currentLanguage === "en" ? "per person" : "par personne"}
                    </span>
                  </div>

                  <button
                    onClick={handleBooking}
                    className="w-full bg-gradient-to-r from-accent to-accent/90 text-white py-3 rounded-lg font-semibold mb-4 hover:from-accent/90 hover:to-accent transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    {currentLanguage === "en" ? "Reserve" : "Réserver"}
                  </button>

                  <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                    {currentLanguage === "en"
                      ? "You won't be charged yet"
                      : "Vous ne serez pas débité maintenant"}
                  </p>

                  <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        {listing.price} MAD x 1{" "}
                        {currentLanguage === "en" ? "person" : "personne"}
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {listing.price} MAD
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        {currentLanguage === "en"
                          ? "Service fee"
                          : "Frais de service"}
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {Math.round(listing.price * 0.1)} MAD
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-gray-900 dark:text-white">
                        {currentLanguage === "en" ? "Total" : "Total"}
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {Math.round(listing.price * 1.1)} MAD
                      </span>
                    </div>
                  </div>
                </div>

                {/* Host Contact Card */}
                <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-900">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={listing.host.avatar}
                      alt={listing.host.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {listing.host.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {currentLanguage === "en" ? "Host" : "Hôte"}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        124
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {currentLanguage === "en" ? "Reviews" : "Avis"}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          4.9
                        </span>
                        <Star className="w-3 h-3 text-black dark:text-white fill-current" />
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {currentLanguage === "en" ? "Rating" : "Note"}
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-2 border border-gray-900 dark:border-white text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">
                    {currentLanguage === "en"
                      ? "Contact host"
                      : "Contacter l'hôte"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* All Photos Modal */}
        {showAllPhotos && (
          <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowAllPhotos(false)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="font-medium">
                    {currentLanguage === "en" ? "Back" : "Retour"}
                  </span>
                </button>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {listing.images.length}{" "}
                  {currentLanguage === "en" ? "photos" : "photos"}
                </h2>
                <div className="w-16"></div>
              </div>

              <div className="flex-1 overflow-auto p-6">
                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {listing.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="aspect-square md:aspect-[4/3] overflow-hidden rounded-lg"
                      >
                        <img
                          src={img}
                          alt={`${title} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Modal */}
        <BookingModal
          isOpen={bookingOpen}
          onClose={() => setBookingOpen(false)}
          listing={listing}
          currentLanguage={currentLanguage}
        />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const listing = await getListing(params!.id as string);
    return { props: { listing } };
  } catch (err) {
    console.error("SSR getListing error:", err);
    return { props: { listing: null } };
  }
};

export default ListingDetailPage;
