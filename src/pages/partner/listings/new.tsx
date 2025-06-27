import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Eye,
  Upload,
  X,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Camera,
  Video,
  Info,
  CheckCircle,
  AlertCircle,
  Building2,
  Utensils,
  Sparkles,
  Calendar,
  Globe,
  Phone,
  Mail,
  Loader2,
} from "lucide-react";

import {
  partnerListingsApi,
  partnerUtils,
  PartnerListing,
} from "@/lib/partnerApi";

interface ListingFormData {
  name: string;
  description: string;
  category_id: number;
  base_price: number;
  images: string[];
  videos: string[];
  accessibility_info: string;
  cancellation_policy: string;
  address: {
    street_address: string;
    city: string;
    postal_code: string;
    country: string;
  };
  // Additional fields based on category
  duration?: number; // for activities
  activity_type?: string;
  event_type?: string;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  cuisine_type?: string;
  opening_hours?: string;
  amenities?: string[];
}

const categories = [
  {
    id: 1,
    name: "Cultural Experience",
    icon: Building2,
    description: "Museums, historical sites, cultural tours",
  },
  {
    id: 2,
    name: "Culinary Experience",
    icon: Utensils,
    description: "Restaurants, cooking classes, food tours",
  },
  {
    id: 3,
    name: "Entertainment",
    icon: Sparkles,
    description: "Shows, events, nightlife experiences",
  },
];

const NewListing: React.FC = () => {
  const router = useRouter();
  const [currentLanguage] = useState<"en" | "fr">("en");
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    if (!partnerUtils.isAuthenticated()) {
      router.push("/partner/login");
    }
  }, [router]);

  const [formData, setFormData] = useState<ListingFormData>({
    name: "",
    description: "",
    category_id: 0,
    base_price: 0,
    images: [],
    videos: [],
    accessibility_info: "",
    cancellation_policy:
      "Free cancellation up to 24 hours before the experience",
    address: {
      street_address: "",
      city: "Casablanca",
      postal_code: "",
      country: "Morocco",
    },
  });

  const [imageUploading, setImageUploading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name.includes(".")) {
      // Handle nested object properties
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof ListingFormData],
          [child]: type === "number" ? parseFloat(value) || 0 : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "number"
            ? parseFloat(value) || 0
            : type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : value,
      }));
    }

    // Clear errors when user starts typing
    if (error) setError(null);
  };

  const handleCategorySelect = (categoryId: number) => {
    setFormData((prev) => ({ ...prev, category_id: categoryId }));
    setError((prev) => ({ ...prev, category_id: "" }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setImageUploading(true);
    try {
      // Convert files to base64 or upload to a service
      // For now, we'll create placeholder URLs
      const newImages: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Create object URL for preview (in production, upload to cloud storage)
        const imageUrl = URL.createObjectURL(file);
        newImages.push(imageUrl);
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 10), // Limit to 10 images
      }));
    } catch (err) {
      setError(
        currentLanguage === "en"
          ? "Failed to upload images"
          : "Échec du téléchargement des images"
      );
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Listing name is required";
      if (!formData.description.trim())
        newErrors.description = "Description is required";
      if (!formData.category_id)
        newErrors.category_id = "Please select a category";
    }

    if (step === 2) {
      if (!formData.address.street_address.trim())
        newErrors["address.street_address"] = "Street address is required";
      if (formData.base_price <= 0)
        newErrors.base_price = "Please enter a valid price";
    }

    if (step === 3) {
      if (formData.images.length === 0) {
        newErrors.images = "At least one image is required";
      }
    }

    setError(newErrors.general || Object.values(newErrors).join("\n"));
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);
    setError(null);

    try {
      // Create address first (this would be a separate API call in real implementation)
      const addressId = 1; // Mock address ID - in real app, create address first

      // Prepare listing data
      const listingData = {
        category_id: formData.category_id,
        address_id: addressId,
        name: formData.name,
        description: formData.description,
        images: formData.images,
        videos: formData.videos,
        base_price: formData.base_price,
        accessibility_info: formData.accessibility_info || undefined,
        cancellation_policy: formData.cancellation_policy || undefined,
        is_active: true,
      };

      // Create listing
      const listing = await partnerListingsApi.create(listingData);

      setSuccess(
        currentLanguage === "en"
          ? "Listing created successfully!"
          : "Annonce créée avec succès !"
      );

      // Redirect to dashboard after success
      setTimeout(() => {
        router.push("/partner");
      }, 2000);
    } catch (err: any) {
      console.error("Create listing error:", err);
      setError(
        err.message ||
          (currentLanguage === "en"
            ? "Failed to create listing"
            : "Échec de la création de l'annonce")
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Basic Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Listing Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
                      error && error.startsWith("name")
                        ? "border-red-300"
                        : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                    placeholder="e.g., Hassan II Mosque Private Tour"
                  />
                  {error && error.startsWith("name") && (
                    <p className="mt-1 text-sm text-red-600">
                      {error.split("\n")[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors resize-none ${
                      error && error.startsWith("description")
                        ? "border-red-300"
                        : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                    placeholder="Describe your experience in detail..."
                  />
                  {error && error.startsWith("description") && (
                    <p className="mt-1 text-sm text-red-600">
                      {error.split("\n")[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Category *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => handleCategorySelect(category.id)}
                          className={`p-4 border-2 rounded-xl transition-all hover:shadow-md ${
                            formData.category_id === category.id
                              ? "border-accent bg-accent/5 shadow-md"
                              : "border-gray-200 dark:border-gray-700 hover:border-accent/50"
                          }`}
                        >
                          <Icon
                            className={`w-8 h-8 mx-auto mb-2 ${
                              formData.category_id === category.id
                                ? "text-accent"
                                : "text-gray-400"
                            }`}
                          />
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                            {category.name}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {category.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                  {error && error.startsWith("category_id") && (
                    <p className="mt-2 text-sm text-red-600">
                      {error.split("\n")[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Location & Pricing
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address.street_address"
                      value={formData.address.street_address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
                        error && error.startsWith("address.street_address")
                          ? "border-red-300"
                          : "border-gray-300 dark:border-gray-600"
                      } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                      placeholder="123 Boulevard Mohammed V"
                    />
                    {error && error.startsWith("address.street_address") && (
                      <p className="mt-1 text-sm text-red-600">
                        {error.split("\n")[0]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="address.postal_code"
                      value={formData.address.postal_code}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="20000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Base Price (MAD) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="base_price"
                      value={formData.base_price || ""}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
                        error && error.startsWith("base_price")
                          ? "border-red-300"
                          : "border-gray-300 dark:border-gray-600"
                      } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  {error && error.startsWith("base_price") && (
                    <p className="mt-1 text-sm text-red-600">
                      {error.split("\n")[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Media & Visual Content
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Images
                  </label>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                            <Camera className="w-8 h-8 text-gray-500" />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {formData.images.length < 10 && (
                      <label className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Add Image
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Upload up to 10 high-quality images. First image will be
                    used as the main photo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Additional Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Accessibility Information
                  </label>
                  <textarea
                    name="accessibility_info"
                    value={formData.accessibility_info}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Describe accessibility features and any limitations..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cancellation Policy
                  </label>
                  <textarea
                    name="cancellation_policy"
                    value={formData.cancellation_policy}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Describe your cancellation policy..."
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const steps = [
    {
      number: 1,
      title: "Basic Info",
      description: "Name, description, category",
    },
    { number: 2, title: "Location", description: "Address and pricing" },
    { number: 3, title: "Media", description: "Photos and videos" },
    { number: 4, title: "Details", description: "Additional information" },
  ];

  return (
    <>
      <Head>
        <title>
          {currentLanguage === "en"
            ? "Create New Listing"
            : "Créer une Nouvelle Annonce"}{" "}
          - Casa Wonders
        </title>
        <meta
          name="description"
          content="Create a new listing for your business"
        />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/partner"
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentLanguage === "en"
                      ? "Create New Listing"
                      : "Créer une Nouvelle Annonce"}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Add a new experience to Casa Wonders
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep >= step.number
                          ? "bg-accent text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        currentStep > step.number
                          ? "bg-accent"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <p className="text-green-700 dark:text-green-300">{success}</p>
              </div>
            )}

            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Create Listing</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewListing;
