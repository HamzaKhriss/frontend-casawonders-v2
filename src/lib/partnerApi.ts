import { API_BASE } from "./auth";

// Partner API endpoints
const PARTNER_API_BASE = `${API_BASE}/partner/`;

// Types based on backend schemas
export interface PartnerProfile {
  partner_id: number;
  user_id: number;
  business_name: string;
  business_description?: string;
  contact_email: string;
  contact_phone?: string;
  address: {
    address_id: number;
    street_address: string;
    city: string;
    postal_code?: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  website_url?: string;
  social_media_links?: string;
  verification_status: string;
}

export interface PartnerListing {
  listing_id: number;
  partner_id: number;
  category: {
    category_id: number;
    category_name: string;
    description?: string;
  };
  address: {
    address_id: number;
    street_address: string;
    city: string;
    postal_code?: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  name: string;
  description?: string;
  images: string[];
  videos: string[];
  base_price: number;
  accessibility_info?: string;
  cancellation_policy?: string;
  is_active: boolean;
  creation_date: string;
  last_update_date: string;
}

export interface PartnerReservation {
  reservation_id: number;
  user_id: number;
  listing_id: number;
  date_time_reservation: string;
  number_of_participants: number;
  status: string;
  total_price: number;
}

export interface PartnerReview {
  review_id: number;
  user_id: number;
  listing_id: number;
  rating: number;
  comment_text: string;
  date_review: string;
  partner_reply?: string;
  partner_reply_date?: string;
}

export interface AvailabilitySlot {
  slot_id: number;
  listing_id: number;
  date_slot_start: string;
  date_slot_end: string;
  capacity: number;
  booked_count: number;
  is_available: boolean;
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("partner_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "An error occurred" }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  return response.json();
};

// Partner Profile APIs
export const partnerProfileApi = {
  // Create partner profile
  create: async (profileData: {
    business_name: string;
    business_description?: string;
    contact_email: string;
    contact_phone?: string;
    address_id: number;
    website_url?: string;
    social_media_links?: string;
  }): Promise<PartnerProfile> => {
    const response = await fetch(`${PARTNER_API_BASE}/profile`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },

  // Get partner profile
  get: async (): Promise<PartnerProfile> => {
    const response = await fetch(`${PARTNER_API_BASE}/profile`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Update partner profile
  update: async (
    profileData: Partial<{
      business_name: string;
      business_description: string;
      contact_email: string;
      contact_phone: string;
      address_id: number;
      website_url: string;
      social_media_links: string;
    }>
  ): Promise<PartnerProfile> => {
    const response = await fetch(`${PARTNER_API_BASE}/profile`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },
};

// Partner Listings APIs
export const partnerListingsApi = {
  // Get all partner listings
  getAll: async (): Promise<PartnerListing[]> => {
    const response = await fetch(`${PARTNER_API_BASE}/listings`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get specific listing
  get: async (listingId: number): Promise<PartnerListing> => {
    const response = await fetch(`${PARTNER_API_BASE}/listings/${listingId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Create new listing
  create: async (listingData: {
    category_id: number;
    address_id: number;
    name: string;
    description?: string;
    images?: string[];
    videos?: string[];
    base_price?: number;
    accessibility_info?: string;
    cancellation_policy?: string;
    is_active?: boolean;
  }): Promise<PartnerListing> => {
    const response = await fetch(`${PARTNER_API_BASE}/listings`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(listingData),
    });
    return handleResponse(response);
  },

  // Update listing
  update: async (
    listingId: number,
    listingData: Partial<{
      category_id: number;
      address_id: number;
      name: string;
      description: string;
      images: string[];
      videos: string[];
      base_price: number;
      accessibility_info: string;
      cancellation_policy: string;
      is_active: boolean;
    }>
  ): Promise<PartnerListing> => {
    const response = await fetch(`${PARTNER_API_BASE}/listings/${listingId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(listingData),
    });
    return handleResponse(response);
  },

  // Delete listing
  delete: async (listingId: number): Promise<void> => {
    const response = await fetch(`${PARTNER_API_BASE}/listings/${listingId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ detail: "An error occurred" }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }
  },
};

// Availability Slots APIs
export const partnerSlotsApi = {
  // Get slots for a listing
  getByListing: async (listingId: number): Promise<AvailabilitySlot[]> => {
    const response = await fetch(
      `${PARTNER_API_BASE}/listings/${listingId}/slots`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  // Create new slot
  create: async (
    listingId: number,
    slotData: {
      date_slot_start: string;
      date_slot_end: string;
      capacity: number;
    }
  ): Promise<AvailabilitySlot> => {
    const response = await fetch(
      `${PARTNER_API_BASE}/listings/${listingId}/slots`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(slotData),
      }
    );
    return handleResponse(response);
  },

  // Update slot
  update: async (
    slotId: number,
    slotData: Partial<{
      date_slot_start: string;
      date_slot_end: string;
      capacity: number;
      is_available: boolean;
    }>
  ): Promise<AvailabilitySlot> => {
    const response = await fetch(`${PARTNER_API_BASE}/slots/${slotId}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(slotData),
    });
    return handleResponse(response);
  },

  // Delete slot
  delete: async (slotId: number): Promise<void> => {
    const response = await fetch(`${PARTNER_API_BASE}/slots/${slotId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ detail: "An error occurred" }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }
  },
};

// Partner Reservations APIs
export const partnerReservationsApi = {
  // Get all reservations for partner
  getAll: async (): Promise<PartnerReservation[]> => {
    const response = await fetch(`${PARTNER_API_BASE}/reservations`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Update reservation status
  updateStatus: async (
    reservationId: number,
    status: string
  ): Promise<PartnerReservation> => {
    const response = await fetch(
      `${PARTNER_API_BASE}/reservations/${reservationId}`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      }
    );
    return handleResponse(response);
  },
};

// Partner Reviews APIs
export const partnerReviewsApi = {
  // Get all reviews for partner
  getAll: async (): Promise<PartnerReview[]> => {
    const response = await fetch(`${PARTNER_API_BASE}/reviews`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Reply to review
  reply: async (
    reviewId: number,
    partnerReply: string
  ): Promise<PartnerReview> => {
    const response = await fetch(
      `${PARTNER_API_BASE}/reviews/${reviewId}/reply`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ partner_reply: partnerReply }),
      }
    );
    return handleResponse(response);
  },
};

// Partner Authentication APIs
export const partnerAuthApi = {
  // Partner login
  login: async (
    email: string,
    password: string
  ): Promise<{ access_token: string; token_type: string }> => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  // Partner registration (basic user account only)
  register: async (userData: {
    email: string;
    password: string;
    role?: string;
  }): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userData, role: "partner" }),
    });
    return handleResponse(response);
  },

  // Complete partner registration (once backend implements this endpoint)
  registerComplete: async (registrationData: {
    // User account
    email: string;
    password: string;

    // Business information
    business_name: string;
    business_description: string;
    contact_email: string;
    contact_phone: string;
    website_url?: string;
    social_media_links?: string;

    // Address
    street_address: string;
    city: string;
    postal_code?: string;
    country: string;
  }): Promise<{ message: string; access_token: string }> => {
    const response = await fetch(`${API_BASE}/auth/register/partner`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registrationData),
    });
    return handleResponse(response);
  },

  // Get current partner user info
  getCurrentUser: async (): Promise<any> => {
    const response = await fetch(`${API_BASE}/auth/profile`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Logout
  logout: () => {
    localStorage.removeItem("partner_token");
  },
};

// Debug API (from backend routes)
export const partnerDebugApi = {
  // Debug JWT token
  debugJWT: async (): Promise<any> => {
    const response = await fetch(`${PARTNER_API_BASE}/debug`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Utility functions
export const partnerUtils = {
  // Check if partner is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("partner_token");
  },

  // Get partner token
  getToken: (): string | null => {
    return localStorage.getItem("partner_token");
  },

  // Set partner token
  setToken: (token: string): void => {
    localStorage.setItem("partner_token", token);
  },

  // Format currency
  formatCurrency: (amount: number, currency: string = "MAD"): string => {
    return `${amount.toLocaleString()} ${currency}`;
  },

  // Format date
  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  // Get status color classes
  getStatusColor: (status: string): string => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "verified":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  },
};

// Export all APIs as a single object
export const partnerApi = {
  profile: partnerProfileApi,
  listings: partnerListingsApi,
  slots: partnerSlotsApi,
  reservations: partnerReservationsApi,
  reviews: partnerReviewsApi,
  auth: partnerAuthApi,
  debug: partnerDebugApi,
  utils: partnerUtils,
};
