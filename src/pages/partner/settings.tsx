import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ArrowLeft,
  Save,
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Lock,
  Bell,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Camera,
  Trash2,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react";

interface PartnerProfile {
  partner_id: number;
  business_name: string;
  business_description: string;
  contact_email: string;
  contact_phone: string;
  website_url: string;
  social_media_links: string;
  verification_status: string;
  address: {
    street_address: string;
    city: string;
    postal_code: string;
    country: string;
  };
}

const PartnerSettings: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "profile" | "account" | "notifications" | "security"
  >("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  const [profile, setProfile] = useState<PartnerProfile>({
    partner_id: 1,
    business_name: "Casa Heritage Tours",
    business_description:
      "Authentic cultural experiences in the heart of Casablanca. We specialize in guided tours of historical sites, cultural immersion experiences, and authentic Moroccan adventures.",
    contact_email: "contact@casaheritage.ma",
    contact_phone: "+212 522 123 456",
    website_url: "https://casaheritage.ma",
    social_media_links:
      "https://instagram.com/casaheritage, https://facebook.com/casaheritage",
    verification_status: "verified",
    address: {
      street_address: "123 Boulevard Mohammed V",
      city: "Casablanca",
      postal_code: "20000",
      country: "Morocco",
    },
  });

  const [accountSettings, setAccountSettings] = useState({
    email: "partner@casaheritage.ma",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    bookingAlerts: true,
    reviewAlerts: true,
    paymentAlerts: true,
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setProfile((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountSettings((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const validateProfile = () => {
    const newErrors: Record<string, string> = {};

    if (!profile.business_name.trim()) {
      newErrors.business_name = "Business name is required";
    }
    if (!profile.contact_email.trim()) {
      newErrors.contact_email = "Contact email is required";
    } else if (!/\S+@\S+\.\S+/.test(profile.contact_email)) {
      newErrors.contact_email = "Please enter a valid email address";
    }
    if (!profile.address.street_address.trim()) {
      newErrors["address.street_address"] = "Street address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};

    if (accountSettings.newPassword) {
      if (!accountSettings.currentPassword) {
        newErrors.currentPassword = "Current password is required";
      }
      if (accountSettings.newPassword.length < 8) {
        newErrors.newPassword = "New password must be at least 8 characters";
      }
      if (accountSettings.newPassword !== accountSettings.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrors({ general: "Failed to update profile. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setAccountSettings((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setSuccessMessage("Password changed successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrors({ general: "Failed to change password. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccessMessage("Notification preferences updated!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrors({
        general: "Failed to update notifications. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("partner_token");
    router.push("/partner/login");
  };

  const tabs = [
    { id: "profile", name: "Business Profile", icon: Building2 },
    { id: "account", name: "Account", icon: User },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "security", name: "Security", icon: Shield },
  ];

  return (
    <>
      <Head>
        <title>Partner Settings - Casa Wonders</title>
        <meta
          name="description"
          content="Manage your partner account settings"
        />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-6">
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
                    Settings
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Manage your partner account and preferences
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-xl flex items-center justify-center">
                  <SettingsIcon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-left ${
                        activeTab === tab.id
                          ? "bg-accent text-white shadow-lg shadow-accent/30"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {successMessage && (
                <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <p className="text-green-600 dark:text-green-400 text-sm">
                      {successMessage}
                    </p>
                  </div>
                </div>
              )}

              {errors.general && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      {errors.general}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "profile" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Business Profile
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Update your business information and contact details
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Business Name *
                        </label>
                        <input
                          type="text"
                          name="business_name"
                          value={profile.business_name}
                          onChange={handleProfileChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
                            errors.business_name
                              ? "border-red-300 dark:border-red-600"
                              : "border-gray-300 dark:border-gray-600"
                          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                        />
                        {errors.business_name && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.business_name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Verification Status
                        </label>
                        <div
                          className={`px-4 py-3 rounded-xl text-sm font-medium ${
                            profile.verification_status === "verified"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}
                        >
                          {profile.verification_status === "verified"
                            ? "✓ Verified Partner"
                            : "⏳ Pending Verification"}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Business Description
                      </label>
                      <textarea
                        name="business_description"
                        value={profile.business_description}
                        onChange={handleProfileChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Describe your business..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Contact Email *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            name="contact_email"
                            value={profile.contact_email}
                            onChange={handleProfileChange}
                            className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
                              errors.contact_email
                                ? "border-red-300 dark:border-red-600"
                                : "border-gray-300 dark:border-gray-600"
                            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                          />
                        </div>
                        {errors.contact_email && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.contact_email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Contact Phone
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            name="contact_phone"
                            value={profile.contact_phone}
                            onChange={handleProfileChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Website URL
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Globe className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="url"
                          name="website_url"
                          value={profile.website_url}
                          onChange={handleProfileChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="https://yourbusiness.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Address *
                      </label>
                      <div className="space-y-4">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="address.street_address"
                            value={profile.address.street_address}
                            onChange={handleProfileChange}
                            className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
                              errors["address.street_address"]
                                ? "border-red-300 dark:border-red-600"
                                : "border-gray-300 dark:border-gray-600"
                            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                            placeholder="Street Address"
                          />
                        </div>
                        {errors["address.street_address"] && (
                          <p className="text-sm text-red-600 dark:text-red-400">
                            {errors["address.street_address"]}
                          </p>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input
                            type="text"
                            name="address.city"
                            value={profile.address.city}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="City"
                          />
                          <input
                            type="text"
                            name="address.postal_code"
                            value={profile.address.postal_code}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Postal Code"
                          />
                          <input
                            type="text"
                            name="address.country"
                            value={profile.address.country}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Country"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex items-center space-x-2 px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/30"
                      >
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "account" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Account Settings
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Manage your login credentials and account security
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={accountSettings.email}
                        onChange={handleAccountChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Change Password
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.current ? "text" : "password"}
                              name="currentPassword"
                              value={accountSettings.currentPassword}
                              onChange={handleAccountChange}
                              className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
                                errors.currentPassword
                                  ? "border-red-300 dark:border-red-600"
                                  : "border-gray-300 dark:border-gray-600"
                              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowPasswords((prev) => ({
                                  ...prev,
                                  current: !prev.current,
                                }))
                              }
                              className="absolute inset-y-0 right-0 pr-4 flex items-center"
                            >
                              {showPasswords.current ? (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                              ) : (
                                <Eye className="h-5 w-5 text-gray-400" />
                              )}
                            </button>
                          </div>
                          {errors.currentPassword && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                              {errors.currentPassword}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.new ? "text" : "password"}
                              name="newPassword"
                              value={accountSettings.newPassword}
                              onChange={handleAccountChange}
                              className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
                                errors.newPassword
                                  ? "border-red-300 dark:border-red-600"
                                  : "border-gray-300 dark:border-gray-600"
                              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowPasswords((prev) => ({
                                  ...prev,
                                  new: !prev.new,
                                }))
                              }
                              className="absolute inset-y-0 right-0 pr-4 flex items-center"
                            >
                              {showPasswords.new ? (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                              ) : (
                                <Eye className="h-5 w-5 text-gray-400" />
                              )}
                            </button>
                          </div>
                          {errors.newPassword && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                              {errors.newPassword}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.confirm ? "text" : "password"}
                              name="confirmPassword"
                              value={accountSettings.confirmPassword}
                              onChange={handleAccountChange}
                              className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
                                errors.confirmPassword
                                  ? "border-red-300 dark:border-red-600"
                                  : "border-gray-300 dark:border-gray-600"
                              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowPasswords((prev) => ({
                                  ...prev,
                                  confirm: !prev.confirm,
                                }))
                              }
                              className="absolute inset-y-0 right-0 pr-4 flex items-center"
                            >
                              {showPasswords.confirm ? (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                              ) : (
                                <Eye className="h-5 w-5 text-gray-400" />
                              )}
                            </button>
                          </div>
                          {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                              {errors.confirmPassword}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end mt-6">
                        <button
                          onClick={handleChangePassword}
                          disabled={isSaving || !accountSettings.newPassword}
                          className="flex items-center space-x-2 px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/30"
                        >
                          {isSaving ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Updating...</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4" />
                              <span>Change Password</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                        <div>
                          <h4 className="font-medium text-red-900 dark:text-red-100">
                            Danger Zone
                          </h4>
                          <p className="text-sm text-red-700 dark:text-red-300">
                            This action cannot be undone
                          </p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Notification Preferences
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Choose how you want to be notified about your business
                      activity
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Communication Preferences
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            key: "emailNotifications",
                            label: "Email Notifications",
                            description: "Receive notifications via email",
                          },
                          {
                            key: "pushNotifications",
                            label: "Push Notifications",
                            description:
                              "Receive push notifications in your browser",
                          },
                          {
                            key: "smsNotifications",
                            label: "SMS Notifications",
                            description: "Receive notifications via SMS",
                          },
                          {
                            key: "marketingEmails",
                            label: "Marketing Emails",
                            description:
                              "Receive updates and promotional content",
                          },
                        ].map((item) => (
                          <div
                            key={item.key}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                          >
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {item.label}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {item.description}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name={item.key}
                                checked={
                                  notificationSettings[
                                    item.key as keyof typeof notificationSettings
                                  ]
                                }
                                onChange={handleNotificationChange}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 dark:peer-focus:ring-accent/20 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Business Alerts
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            key: "bookingAlerts",
                            label: "Booking Alerts",
                            description:
                              "Get notified when you receive new bookings",
                          },
                          {
                            key: "reviewAlerts",
                            label: "Review Alerts",
                            description:
                              "Get notified when customers leave reviews",
                          },
                          {
                            key: "paymentAlerts",
                            label: "Payment Alerts",
                            description:
                              "Get notified about payment confirmations",
                          },
                        ].map((item) => (
                          <div
                            key={item.key}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                          >
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {item.label}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {item.description}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name={item.key}
                                checked={
                                  notificationSettings[
                                    item.key as keyof typeof notificationSettings
                                  ]
                                }
                                onChange={handleNotificationChange}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 dark:peer-focus:ring-accent/20 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={handleSaveNotifications}
                        disabled={isSaving}
                        className="flex items-center space-x-2 px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/30"
                      >
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Save Preferences</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Security Settings
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Manage your account security and privacy settings
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                        <div className="flex items-center space-x-3 mb-3">
                          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                          <h3 className="font-semibold text-green-900 dark:text-green-100">
                            Account Verified
                          </h3>
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Your partner account has been verified and is in good
                          standing.
                        </p>
                      </div>

                      <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center space-x-3 mb-3">
                          <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                            Secure Connection
                          </h3>
                        </div>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Your connection is secured with SSL encryption.
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Account Activity
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-700 dark:text-gray-300">
                            Last login
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            Today at 2:30 PM
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-700 dark:text-gray-300">
                            Password last changed
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            2 weeks ago
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-700 dark:text-gray-300">
                            Account created
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            January 15, 2024
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PartnerSettings;
