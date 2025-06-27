import React, { useState, useEffect } from "react";
import Head from "next/head";
import { changePassword } from "@/lib/auth";

import { useRouter } from "next/router";
import {
  User,
  Calendar,
  Heart,
  Settings,
  Moon,
  Sun,
  Globe,
  Bell,
  CreditCard,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  Edit3,
  Camera,
  LogOut,
  Users,
  Star,
  TrendingUp,
  Award,
  Sparkles,
  Shield,
  Key,
} from "lucide-react";
import { Booking, User as UserType } from "@/lib/types";
import {
  getUser,
  getBookings,
  updateUserPreferences,
  getFavorites,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface ProfilePageProps {
  currentLanguage: "en" | "fr";
  currentTheme: "light" | "dark";
  onThemeToggle: () => void;
  onLanguageToggle: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  currentLanguage,
  currentTheme,
  onThemeToggle,
  onLanguageToggle,
}) => {
  const router = useRouter();
  const { signOut } = useAuth();
  const [user, setUser] = useState<UserType | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "bookings" | "settings"
  >("overview");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [favCount, setFavCount] = useState<number>(0);

  // Change password states
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Load user data and bookings
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        // on lance les trois appels en parallèle
        const [userData, userBookings, userFavs] = await Promise.all([
          getUser(),
          getBookings(),
          getFavorites(),
        ]);

        setUser({
          ...userData,
          preferences: userData.preferences || {},
        });
        setBookings(userBookings);
        setFavCount(userFavs.length);
        setEditForm({ name: userData.name, email: userData.email });
      } catch (err) {
        console.error("⛔️ load profile:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const tabs = [
    {
      id: "overview",
      name: { en: "Overview", fr: "Aperçu" },
      icon: User,
      description: { en: "Your profile summary", fr: "Résumé de votre profil" },
    },
    {
      id: "bookings",
      name: { en: "My Bookings", fr: "Mes Réservations" },
      icon: Calendar,
      description: {
        en: "All your reservations",
        fr: "Toutes vos réservations",
      },
    },
    {
      id: "settings",
      name: { en: "Settings", fr: "Paramètres" },
      icon: Settings,
      description: { en: "Account preferences", fr: "Préférences du compte" },
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Loader className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      confirmed: { en: "Confirmed", fr: "Confirmée" },
      pending: { en: "Pending", fr: "En Attente" },
      cancelled: { en: "Cancelled", fr: "Annulée" },
    };
    return labels[status as keyof typeof labels]?.[currentLanguage] || status;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      currentLanguage === "fr" ? "fr-FR" : "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  // Handle change password
  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");
    const { oldPassword, newPassword, confirmPassword } = passwordForm;

    // validations...
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      // ✅ on passe par authFetch via changePassword()
      await changePassword(oldPassword, newPassword);

      setPasswordSuccess("Password updated successfully.");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setIsChangingPassword(false), 2000);
    } catch (err: any) {
      setPasswordError(err.message || "Failed to update password.");
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Update user profile (mock implementation)
      if (user) {
        const updatedUser = {
          ...user,
          name: editForm.name,
          email: editForm.email,
        };
        setUser(updatedUser);
        setIsEditingProfile(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handlePreferenceUpdate = async (
    preferences: Partial<UserType["preferences"]>
  ) => {
    try {
      if (user) {
        const updatedUser = await updateUserPreferences(preferences);
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Failed to update preferences:", error);
    }
  };

  const handleLogout = async () => {
    try {
      console.log("🚪 Signing out...");
      await signOut();
      console.log("✅ Signed out successfully");
    } catch (error) {
      console.error("❌ Failed to logout:", error);
      // Manual redirect as fallback
      router.push("/login");
    }
  };

  // Calculate user level based on bookings
  const getUserLevel = () => {
    const confirmedBookings = bookings.filter(
      (b) => b.status === "confirmed"
    ).length;
    if (confirmedBookings >= 10)
      return {
        level: "Explorer Elite",
        color: "text-purple-600 dark:text-purple-400",
        icon: Award,
      };
    if (confirmedBookings >= 5)
      return {
        level: "Adventure Seeker",
        color: "text-blue-600 dark:text-blue-400",
        icon: Star,
      };
    return {
      level: "Casa Wanderer",
      color: "text-green-600 dark:text-green-400",
      icon: Sparkles,
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {currentLanguage === "en"
              ? "Loading Profile..."
              : "Chargement du Profil..."}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {currentLanguage === "en"
              ? "Please wait while we fetch your information"
              : "Veuillez patienter pendant que nous récupérons vos informations"}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {currentLanguage === "en"
              ? "Profile not found"
              : "Profil non trouvé"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {currentLanguage === "en"
              ? "We couldn't find your profile. Please try logging in again."
              : "Nous n'avons pas pu trouver votre profil. Veuillez vous reconnecter."}
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-accent text-white px-8 py-3 rounded-xl font-semibold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/30"
          >
            {currentLanguage === "en" ? "Go Home" : "Accueil"}
          </button>
        </div>
      </div>
    );
  }

  const userLevel = getUserLevel();
  const LevelIcon = userLevel.icon;

  return (
    <>
      <Head>
        <title>
          {currentLanguage === "en"
            ? "My Profile - Casa Wonders"
            : "Mon Profil - Casa Wonders"}
        </title>
        <meta
          name="description"
          content={
            currentLanguage === "en"
              ? "Manage your Casa Wonders profile, view bookings, and update preferences."
              : "Gérez votre profil Casa Wonders, consultez vos réservations et mettez à jour vos préférences."
          }
        />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-accent via-accent/90 to-accent/80 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.jpg')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

          <div className="relative max-w-7xl mx-auto px-4 py-16">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Profile Avatar and Main Info */}
              <div className="flex flex-col items-center lg:items-start">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full bg-white p-1 shadow-2xl">
                    <img
                      src={user.avatar || "/placeholder-avatar.jpg"}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-avatar.jpg";
                      }}
                    />
                  </div>
                  <button className="absolute bottom-2 right-2 w-10 h-10 bg-white text-accent rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-lg">
                    <Camera className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-center lg:text-left">
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {user.name}
                  </h1>
                  <p className="text-white/80 text-lg mb-4">{user.email}</p>

                  {/* User Level Badge */}
                  <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                    <LevelIcon className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">
                      {userLevel.level}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex-1 lg:ml-12">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <Calendar className="w-8 h-8 text-white mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white">
                      {bookings.length}
                    </div>
                    <div className="text-white/80 text-sm">
                      {currentLanguage === "en" ? "Bookings" : "Réservations"}
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <Heart className="w-8 h-8 text-white mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white">
                      {favCount}
                    </div>
                    <div className="text-white/80 text-sm">
                      {currentLanguage === "en" ? "Favorites" : "Favoris"}
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <MapPin className="w-8 h-8 text-white mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white">
                      {
                        new Set(
                          bookings
                            .filter((b) => b.status === "confirmed")
                            .map((b) => b.listingId)
                        ).size
                      }
                    </div>
                    <div className="text-white/80 text-sm">
                      {currentLanguage === "en" ? "Places" : "Lieux"}
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <TrendingUp className="w-8 h-8 text-white mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white">
                      {bookings
                        .reduce((sum, booking) => sum + booking.totalPrice, 0)
                        .toLocaleString()}
                    </div>
                    <div className="text-white/80 text-sm">MAD</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 mt-8 justify-center lg:justify-start">
              <button
                onClick={() => router.push("/wishlist")}
                className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
              >
                <Heart className="w-5 h-5" />
                <span className="font-medium">
                  {currentLanguage === "en" ? "My Wishlist" : "Mes Favoris"}
                </span>
              </button>

              <button
                onClick={() => setIsEditingProfile(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-white text-accent rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg"
              >
                <Edit3 className="w-5 h-5" />
                <span className="font-medium">
                  {currentLanguage === "en"
                    ? "Edit Profile"
                    : "Modifier le Profil"}
                </span>
              </button>

              <button
                onClick={() => router.push("/explore")}
                className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
              >
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">
                  {currentLanguage === "en" ? "Explore More" : "Explorer Plus"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-20 z-10">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-3 py-6 px-2 border-b-3 font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? "border-accent text-accent bg-accent/5"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold">
                        {tab.name[currentLanguage]}
                      </div>
                      <div className="text-xs opacity-75">
                        {tab.description[currentLanguage]}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {currentLanguage === "en"
                        ? `Welcome back, ${user.name?.split(" ")[0] || "User"}!`
                        : `Bon retour, ${
                            user.name?.split(" ")[0] || "Utilisateur"
                          } !`}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      {currentLanguage === "en"
                        ? "Ready for your next Casablanca adventure?"
                        : "Prêt pour votre prochaine aventure à Casablanca ?"}
                    </p>
                  </div>
                  <div
                    className={`hidden md:flex items-center space-x-2 px-4 py-2 rounded-full ${userLevel.color} bg-opacity-10`}
                  >
                    <LevelIcon className={`w-5 h-5 ${userLevel.color}`} />
                    <span className={`font-semibold ${userLevel.color}`}>
                      {userLevel.level}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                          {bookings.length}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {currentLanguage === "en"
                            ? "Total Bookings"
                            : "Réservations Totales"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {
                          bookings.filter((b) => b.status === "confirmed")
                            .length
                        }{" "}
                        {currentLanguage === "en" ? "confirmed" : "confirmées"}
                      </span>
                      <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                        {bookings.filter((b) => b.status === "pending").length}{" "}
                        {currentLanguage === "en" ? "pending" : "en attente"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                        <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                          {favCount}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {currentLanguage === "en"
                            ? "Saved Experiences"
                            : "Expériences Sauvées"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push("/wishlist")}
                      className="text-sm text-accent hover:text-accent/80 transition-colors font-medium flex items-center space-x-1"
                    >
                      <span>
                        {currentLanguage === "en"
                          ? "View wishlist"
                          : "Voir la liste"}
                      </span>
                      <span>→</span>
                    </button>
                  </div>

                  <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                          {bookings
                            .reduce(
                              (sum, booking) => sum + booking.totalPrice,
                              0
                            )
                            .toLocaleString()}{" "}
                          MAD
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {currentLanguage === "en"
                            ? "Total Spent"
                            : "Total Dépensé"}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {currentLanguage === "en" ? "This year" : "Cette année"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-accent" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {currentLanguage === "en"
                          ? "Recent Activity"
                          : "Activité Récente"}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6">
                    {bookings.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">
                          {currentLanguage === "en"
                            ? "No bookings yet"
                            : "Aucune réservation"}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.slice(0, 4).map((booking) => (
                          <div
                            key={booking.id}
                            className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            onClick={() =>
                              router.push(`/listing/${booking.listingId}`)
                            }
                          >
                            <div
                              className={`flex items-center justify-center w-10 h-10 rounded-full ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {getStatusIcon(booking.status)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {currentLanguage === "en"
                                  ? "Booking"
                                  : "Réservation"}{" "}
                                #{booking.id.slice(-6)}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(booking.date)} •{" "}
                                {booking.totalPrice} MAD
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {getStatusLabel(booking.status)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => setActiveTab("bookings")}
                      className="w-full mt-6 py-3 text-accent hover:text-accent/80 transition-colors font-semibold bg-accent/5 hover:bg-accent/10 rounded-xl"
                    >
                      {currentLanguage === "en"
                        ? "View all bookings →"
                        : "Voir toutes les réservations →"}
                    </button>
                  </div>
                </div>

                {/* Achievements & Progress */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {currentLanguage === "en"
                          ? "Your Progress"
                          : "Vos Progrès"}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      {/* Places Visited */}
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            <div>
                              <h4 className="font-bold text-gray-900 dark:text-white">
                                {
                                  new Set(
                                    bookings
                                      .filter((b) => b.status === "confirmed")
                                      .map((b) => b.listingId)
                                  ).size
                                }
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {currentLanguage === "en"
                                  ? "Places Visited"
                                  : "Lieux Visités"}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                            {currentLanguage === "en"
                              ? "Explorer"
                              : "Explorateur"}
                          </span>
                        </div>
                      </div>

                      {/* Next Level Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {currentLanguage === "en"
                              ? "Next Level Progress"
                              : "Progrès Niveau Suivant"}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {
                              bookings.filter((b) => b.status === "confirmed")
                                .length
                            }
                            /
                            {bookings.filter((b) => b.status === "confirmed")
                              .length >= 10
                              ? "∞"
                              : bookings.filter((b) => b.status === "confirmed")
                                  .length >= 5
                              ? "10"
                              : "5"}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-accent to-accent/80 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(
                                100,
                                (bookings.filter(
                                  (b) => b.status === "confirmed"
                                ).length /
                                  (bookings.filter(
                                    (b) => b.status === "confirmed"
                                  ).length >= 10
                                    ? 10
                                    : bookings.filter(
                                        (b) => b.status === "confirmed"
                                      ).length >= 5
                                    ? 10
                                    : 5)) *
                                  100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="space-y-3">
                        <button
                          onClick={() => router.push("/explore")}
                          className="w-full flex items-center justify-center space-x-2 py-3 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors font-semibold"
                        >
                          <Sparkles className="w-5 h-5" />
                          <span>
                            {currentLanguage === "en"
                              ? "Discover New Places"
                              : "Découvrir de Nouveaux Lieux"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="space-y-8">
              {/* Header with Stats */}
              <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {currentLanguage === "en"
                        ? "My Bookings"
                        : "Mes Réservations"}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      {currentLanguage === "en"
                        ? "Manage and track all your Casa Wonders experiences"
                        : "Gérez et suivez toutes vos expériences Casa Wonders"}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {
                          bookings.filter((b) => b.status === "confirmed")
                            .length
                        }
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {currentLanguage === "en" ? "Confirmed" : "Confirmées"}
                      </div>
                    </div>
                    <div className="text-center bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-lg">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {bookings.filter((b) => b.status === "pending").length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {currentLanguage === "en" ? "Pending" : "En Attente"}
                      </div>
                    </div>
                    <div className="text-center bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-lg">
                      <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                        {bookings.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {currentLanguage === "en" ? "Total" : "Total"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Calendar className="w-12 h-12 text-accent/60" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {currentLanguage === "en"
                      ? "No bookings yet"
                      : "Aucune réservation pour le moment"}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                    {currentLanguage === "en"
                      ? "Start your journey through Casablanca! Discover amazing experiences and create unforgettable memories."
                      : "Commencez votre voyage à travers Casablanca ! Découvrez des expériences incroyables et créez des souvenirs inoubliables."}
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
                    </button>
                    <button
                      onClick={() => router.push("/wishlist")}
                      className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl font-semibold border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center space-x-2"
                    >
                      <Heart className="w-5 h-5" />
                      <span>
                        {currentLanguage === "en"
                          ? "View Wishlist"
                          : "Voir les Favoris"}
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="p-8">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                          {/* Booking Info */}
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-4">
                              <div
                                className={`flex items-center justify-center w-12 h-12 rounded-full ${getStatusColor(
                                  booking.status
                                )}`}
                              >
                                {getStatusIcon(booking.status)}
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                  {currentLanguage === "en"
                                    ? "Booking"
                                    : "Réservation"}{" "}
                                  #{booking.id.slice(-8).toUpperCase()}
                                </h3>
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                    booking.status
                                  )}`}
                                >
                                  {getStatusLabel(booking.status)}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                              <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                                <Calendar className="w-5 h-5 text-accent" />
                                <div>
                                  <div className="font-semibold text-gray-900 dark:text-white">
                                    {formatDate(booking.date)}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {booking.time}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                                <Users className="w-5 h-5 text-accent" />
                                <div>
                                  <div className="font-semibold text-gray-900 dark:text-white">
                                    {booking.participants}{" "}
                                    {currentLanguage === "en"
                                      ? "Participants"
                                      : "Participants"}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {currentLanguage === "en"
                                      ? "Group size"
                                      : "Taille du groupe"}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {currentLanguage === "en"
                                ? `Booked on ${new Date(
                                    booking.createdAt
                                  ).toLocaleDateString("en-US")}`
                                : `Réservé le ${new Date(
                                    booking.createdAt
                                  ).toLocaleDateString("fr-FR")}`}
                            </div>
                          </div>

                          {/* Price and Actions */}
                          <div className="lg:text-right">
                            <div className="mb-6">
                              <div className="text-3xl font-bold text-accent mb-1">
                                {booking.totalPrice.toLocaleString()} MAD
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {currentLanguage === "en"
                                  ? "Total amount"
                                  : "Montant total"}
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                              <button
                                onClick={() =>
                                  router.push(`/listing/${booking.listingId}`)
                                }
                                className="flex items-center justify-center space-x-2 px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent/90 transition-all duration-200 font-semibold shadow-lg shadow-accent/30"
                              >
                                <span>
                                  {currentLanguage === "en"
                                    ? "View Details"
                                    : "Voir Détails"}
                                </span>
                              </button>

                              {booking.status === "confirmed" && (
                                <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-semibold">
                                  <span>
                                    {currentLanguage === "en"
                                      ? "Download Receipt"
                                      : "Télécharger Reçu"}
                                  </span>
                                </button>
                              )}

                              {booking.status === "pending" && (
                                <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-xl hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-all duration-200 font-semibold">
                                  <Clock className="w-4 h-4" />
                                  <span>
                                    {currentLanguage === "en"
                                      ? "Awaiting Confirmation"
                                      : "En Attente de Confirmation"}
                                  </span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-4xl space-y-8">
              {/* Header */}
              <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
                    <Settings className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {currentLanguage === "en"
                        ? "Account Settings"
                        : "Paramètres du Compte"}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      {currentLanguage === "en"
                        ? "Customize your Casa Wonders experience"
                        : "Personnalisez votre expérience Casa Wonders"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Preferences */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {currentLanguage === "en"
                          ? "Preferences"
                          : "Préférences"}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                          {currentTheme === "light" ? (
                            <Sun className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                          ) : (
                            <Moon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {currentLanguage === "en"
                              ? "Appearance"
                              : "Apparence"}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {currentLanguage === "en"
                              ? `Currently using ${currentTheme} mode`
                              : `Actuellement en mode ${
                                  currentTheme === "light" ? "clair" : "sombre"
                                }`}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={onThemeToggle}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-200 ${
                          currentTheme === "dark"
                            ? "bg-accent shadow-lg shadow-accent/30"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ${
                            currentTheme === "dark"
                              ? "translate-x-7"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Language Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                          <Globe className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {currentLanguage === "en" ? "Language" : "Langue"}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {currentLanguage === "en"
                              ? "Choose your preferred language"
                              : "Choisissez votre langue préférée"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={onLanguageToggle}
                        className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 font-semibold border border-gray-200 dark:border-gray-600 shadow-sm"
                      >
                        {currentLanguage === "en" ? "Français" : "English"}
                      </button>
                    </div>

                    {/* Notifications */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                          <Bell className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {currentLanguage === "en"
                              ? "Notifications"
                              : "Notifications"}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {currentLanguage === "en"
                              ? "Booking confirmations and updates"
                              : "Confirmations et mises à jour"}
                          </p>
                        </div>
                      </div>
                      <button className="relative inline-flex h-8 w-14 items-center rounded-full bg-accent shadow-lg shadow-accent/30">
                        <span className="inline-block h-6 w-6 transform rounded-full bg-white transition-transform translate-x-7" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Account Security */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {currentLanguage === "en" ? "Security" : "Sécurité"}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-2xl transition-all duration-200 group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Key className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {currentLanguage === "en"
                              ? "Change Password"
                              : "Changer le Mot de Passe"}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {currentLanguage === "en"
                              ? "Update your account password"
                              : "Mettre à jour votre mot de passe"}
                          </p>
                        </div>
                      </div>
                      <div className="text-gray-400 group-hover:text-accent transition-colors">
                        →
                      </div>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-2xl transition-all duration-200 group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                          <LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-semibold text-red-700 dark:text-red-400">
                            {currentLanguage === "en"
                              ? "Sign Out"
                              : "Se Déconnecter"}
                          </h4>
                          <p className="text-sm text-red-600 dark:text-red-500">
                            {currentLanguage === "en"
                              ? "Sign out of your account"
                              : "Se déconnecter de votre compte"}
                          </p>
                        </div>
                      </div>
                      <div className="text-red-400 group-hover:text-red-600 transition-colors">
                        →
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {currentLanguage === "en"
                        ? "Account Information"
                        : "Informations du Compte"}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                        {currentLanguage === "en" ? "Full Name" : "Nom Complet"}
                      </label>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                        {currentLanguage === "en"
                          ? "Email Address"
                          : "Adresse Email"}
                      </label>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {user.email}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                        {currentLanguage === "en"
                          ? "Member Since"
                          : "Membre Depuis"}
                      </label>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {new Date().toLocaleDateString(
                          currentLanguage === "fr" ? "fr-FR" : "en-US",
                          { year: "numeric", month: "long" }
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                        {currentLanguage === "en"
                          ? "Account Level"
                          : "Niveau du Compte"}
                      </label>
                      <div
                        className={`text-lg font-semibold ${userLevel.color} flex items-center space-x-2`}
                      >
                        <LevelIcon className="w-5 h-5" />
                        <span>{userLevel.level}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Edit Profile Modal */}
        {isEditingProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                {currentLanguage === "en"
                  ? "Edit Profile"
                  : "Modifier le Profil"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {currentLanguage === "en" ? "Name" : "Nom"}
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {currentLanguage === "en" ? "Email" : "Email"}
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {currentLanguage === "en" ? "Cancel" : "Annuler"}
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 py-3 px-4 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
                >
                  {currentLanguage === "en" ? "Save Changes" : "Sauvegarder"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {isChangingPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {currentLanguage === "en"
                ? "Change Password"
                : "Changer le mot de passe"}
            </h3>

            <div className="space-y-4">
              {passwordError && <p className="text-red-600">{passwordError}</p>}
              {passwordSuccess && (
                <p className="text-green-600">{passwordSuccess}</p>
              )}
              <input
                type="password"
                placeholder={
                  currentLanguage === "en"
                    ? "Old Password"
                    : "Ancien mot de passe"
                }
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm((f) => ({
                    ...f,
                    oldPassword: e.target.value,
                  }))
                }
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="password"
                placeholder={
                  currentLanguage === "en"
                    ? "New Password"
                    : "Nouveau mot de passe"
                }
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((f) => ({
                    ...f,
                    newPassword: e.target.value,
                  }))
                }
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="password"
                placeholder={
                  currentLanguage === "en"
                    ? "Confirm New"
                    : "Confirmer mot de passe"
                }
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((f) => ({
                    ...f,
                    confirmPassword: e.target.value,
                  }))
                }
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsChangingPassword(false)}
                className="px-4 py-2 border rounded-lg"
              >
                {currentLanguage === "en" ? "Cancel" : "Annuler"}
              </button>
              <button
                onClick={handleChangePassword}
                className="px-4 py-2 bg-accent text-white rounded-lg"
              >
                {currentLanguage === "en" ? "Save" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
