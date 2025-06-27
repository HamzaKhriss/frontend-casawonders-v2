import React, { useState, useEffect } from "react";
import {
  X,
  Filter,
  DollarSign,
  Star,
  Calendar,
  MapPin,
  Utensils,
  Music,
  Palette,
  Check,
  Building2,
  Sparkles,
} from "lucide-react";
import { ListingFilters } from "@/lib/api";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: ListingFilters) => void;
  currentFilters: ListingFilters;
  currentLanguage?: "en" | "fr";
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters,
  currentLanguage = "en",
}) => {
  const [filters, setFilters] = useState<ListingFilters>(currentFilters);

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const categories = [
    {
      id: "restaurant",
      name: { en: "Restaurants", fr: "Restaurants" },
      icon: Utensils,
      description: {
        en: "Dining & culinary experiences",
        fr: "Expériences culinaires",
      },
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "event",
      name: { en: "Events", fr: "Événements" },
      icon: Sparkles,
      description: {
        en: "Entertainment & activities",
        fr: "Divertissement et activités",
      },
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "cultural",
      name: { en: "Cultural", fr: "Culturel" },
      icon: Building2,
      description: {
        en: "Heritage & cultural sites",
        fr: "Sites patrimoniaux et culturels",
      },
      color: "from-green-500 to-green-600",
    },
  ];

  const priceRanges = [
    {
      min: 0,
      max: 100,
      label: { en: "Under 100 MAD", fr: "Moins de 100 MAD" },
      level: "Budget",
    },
    {
      min: 100,
      max: 200,
      label: { en: "100-200 MAD", fr: "100-200 MAD" },
      level: "Standard",
    },
    {
      min: 200,
      max: 300,
      label: { en: "200-300 MAD", fr: "200-300 MAD" },
      level: "Premium",
    },
    {
      min: 300,
      max: 500,
      label: { en: "300-500 MAD", fr: "300-500 MAD" },
      level: "Luxury",
    },
    {
      min: 500,
      max: undefined,
      label: { en: "Over 500 MAD", fr: "Plus de 500 MAD" },
      level: "Elite",
    },
  ];

  const ratingOptions = [
    { value: 4.5, label: { en: "Excellent", fr: "Excellent" }, stars: 5 },
    { value: 4.0, label: { en: "Very Good", fr: "Très Bon" }, stars: 4 },
    { value: 3.5, label: { en: "Good", fr: "Bon" }, stars: 4 },
    { value: 3.0, label: { en: "Average", fr: "Moyen" }, stars: 3 },
  ];

  const handleCategoryChange = (
    category: "restaurant" | "event" | "cultural"
  ) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === category ? undefined : category,
    }));
  };

  const handlePriceRangeChange = (min: number, max?: number) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFilters((prev) => ({
      ...prev,
      minRating: prev.minRating === rating ? undefined : rating,
    }));
  };

  const handleDateChange = (date: string) => {
    setFilters((prev) => ({
      ...prev,
      date: date || undefined,
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: ListingFilters = {};
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
  };

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
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] transition-all duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 z-[10001] transform transition-all duration-500 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } rounded-t-3xl shadow-2xl border-t border-gray-200 dark:border-gray-700`}
      >
        <div className="max-h-[85vh] overflow-y-auto">
          {/* Handle Bar */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                <Filter className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {currentLanguage === "en" ? "Filters" : "Filtres"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentLanguage === "en"
                    ? "Find your perfect experience"
                    : "Trouvez votre expérience parfaite"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 space-y-8">
            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {currentLanguage === "en" ? "Category" : "Catégorie"}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {categories.map((category) => {
                  const isSelected = filters.category === category.id;
                  const Icon = category.icon;

                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id as any)}
                      className={`relative p-4 rounded-2xl border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-accent bg-accent/5 shadow-lg shadow-accent/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {category.name[currentLanguage]}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {category.description[currentLanguage]}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {currentLanguage === "en" ? "Price Range" : "Gamme de Prix"}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {priceRanges.map((range, index) => {
                  const isSelected =
                    filters.minPrice === range.min &&
                    filters.maxPrice === range.max;

                  return (
                    <button
                      key={index}
                      onClick={() =>
                        handlePriceRangeChange(range.min, range.max)
                      }
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-accent bg-accent/5 shadow-lg shadow-accent/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {range.label[currentLanguage]}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {range.level}
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rating */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {currentLanguage === "en" ? "Minimum Rating" : "Note Minimum"}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {ratingOptions.map((option) => {
                  const isSelected = filters.minRating === option.value;

                  return (
                    <button
                      key={option.value}
                      onClick={() => handleRatingChange(option.value)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-accent bg-accent/5 shadow-lg shadow-accent/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md"
                      }`}
                    >
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < option.stars
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="font-semibold text-gray-900 dark:text-white text-sm">
                          {option.label[currentLanguage]}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {option.value}+{" "}
                          {currentLanguage === "en" ? "stars" : "étoiles"}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {currentLanguage === "en"
                  ? "Available Date"
                  : "Date Disponible"}
              </h3>
              <div className="relative">
                <input
                  type="date"
                  value={filters.date || ""}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200"
                  min={new Date().toISOString().split("T")[0]}
                />
                <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-6">
            <div className="flex space-x-3">
              <button
                onClick={handleClear}
                className="flex-1 py-4 px-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              >
                {currentLanguage === "en" ? "Clear All" : "Effacer Tout"}
              </button>
              <button
                onClick={handleApply}
                className="flex-1 py-4 px-6 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition-all duration-200 shadow-lg shadow-accent/30"
              >
                {currentLanguage === "en" ? "Apply" : "Appliquer"}
                {activeFiltersCount > 0 && (
                  <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterDrawer;
