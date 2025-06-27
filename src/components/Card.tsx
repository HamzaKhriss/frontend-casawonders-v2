// components/Card.tsx
import React from "react";
import { Heart, Star, MapPin, User, Shield } from "lucide-react";
import { Listing } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

interface CardProps {
  listing: Listing;
  currentLanguage: "en" | "fr";
  isWishlisted: boolean;
  onWishlistChange: (listingId: string) => void;
}

const Card: React.FC<CardProps> = ({
  listing,
  currentLanguage,
  isWishlisted,
  onWishlistChange,
}) => {
  const { requireAuth } = useAuth();

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Check if user is authenticated before allowing wishlist action
    if (!requireAuth("wishlist")) {
      return;
    }

    onWishlistChange(listing.id);
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      restaurant: currentLanguage === "en" ? "Restaurant" : "Restaurant",
      cultural: currentLanguage === "en" ? "Cultural" : "Culturel",
      event: currentLanguage === "en" ? "Event" : "Événement",
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      restaurant:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      cultural:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      event:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 dark:border-gray-700 h-full flex flex-col">
      {/* Image Container - Fixed Height */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <img
          src={listing.images[0]}
          alt={currentLanguage === "en" ? listing.title : listing.titleFr}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${getCategoryColor(
              listing.category
            )}`}
          >
            {getCategoryLabel(listing.category)}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-600 dark:text-gray-400 hover:text-red-500"
            }`}
          />
        </button>

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center space-x-1 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-2 py-1 rounded-lg">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-xs font-semibold text-gray-900 dark:text-white">
              {listing.rating}
            </span>
          </div>
        </div>
      </div>

      {/* Content Container - Flexible Height */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title - Fixed Height with Ellipsis */}
        <div className="mb-3 h-14">
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-7 overflow-hidden">
            {(() => {
              const title =
                currentLanguage === "en" ? listing.title : listing.titleFr;
              const maxLength = 60; // Approximate character limit for 2 lines

              if (title.length <= maxLength) {
                return title;
              }

              // Find the last complete word before the limit
              const truncated = title.substring(0, maxLength);
              const lastSpaceIndex = truncated.lastIndexOf(" ");
              const finalText =
                lastSpaceIndex > 0
                  ? truncated.substring(0, lastSpaceIndex)
                  : truncated;

              return `${finalText}...`;
            })()}
          </h3>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-500 dark:text-gray-400 mb-3">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-sm line-clamp-1">
            {currentLanguage === "en"
              ? listing.location.address
              : listing.location.addressFr}
          </span>
        </div>

        {/* Description - Fixed Height with Ellipsis */}
        <div className="mb-4 h-16">
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-5 overflow-hidden">
            {(() => {
              const description =
                currentLanguage === "en"
                  ? listing.description
                  : listing.descriptionFr;
              const maxLength = 120; // Approximate character limit for 3 lines

              if (description.length <= maxLength) {
                return description;
              }

              // Find the last complete word before the limit
              const truncated = description.substring(0, maxLength);
              const lastSpaceIndex = truncated.lastIndexOf(" ");
              const finalText =
                lastSpaceIndex > 0
                  ? truncated.substring(0, lastSpaceIndex)
                  : truncated;

              return `${finalText}...`;
            })()}
          </p>
        </div>

        {/* Bottom Section - Push to bottom */}
        <div className="mt-auto space-y-4">
          {/* Reviews */}
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-gray-900 dark:text-white mr-1">
              {listing.rating}
            </span>
            <div className="flex items-center mr-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(listing.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span>
              ({listing.reviewCount}{" "}
              {currentLanguage === "en" ? "reviews" : "avis"})
            </span>
          </div>

          {/* Host & Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={listing.host.avatar}
                alt={listing.host.name}
                className="w-8 h-8 rounded-full mr-3 object-cover"
              />
              <div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {listing.host.name}
                  </span>
                  {listing.host.verified && (
                    <Shield className="w-3 h-3 text-blue-500 ml-1" />
                  )}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {currentLanguage === "en" ? "Host" : "Hôte"}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold text-accent text-lg">
                {listing.price} MAD
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {currentLanguage === "en" ? "per person" : "par personne"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
