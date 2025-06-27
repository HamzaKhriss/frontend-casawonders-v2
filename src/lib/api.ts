// lib/api.ts — pont entre FastAPI et Next.js

import { Listing, Booking, User } from "./types";
import { API_BASE, authFetch } from "./auth"; // ← use your authFetch helper

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */
export interface ListingFilters {
  category?: "restaurant" | "event" | "cultural";
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  date?: string;
  location?: { lat: number; lng: number; radius: number };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

export interface ReservationInput {
  listingId: string;
  slotId: number;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm"
  participants: number;
  specialRequests?: string;
  paymentToken: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
const buildQuery = (params: Record<string, any>): string =>
  Object.entries(params)
    .filter(([, v]) => v != null && v !== "")
    .map(
      ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
    )
    .join("&");

const safeParseJSON = <T = unknown>(json?: string): T[] => {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const placeholder = (kind: 1 | 2 = 1) =>
  kind === 1 ? "/placeholder.jpg" : "/placeholder-avatar.jpg";

/* ------------------------------------------------------------------ */
/*  Availability grouping                                             */
/* ------------------------------------------------------------------ */
type RawSlot = {
  slot_id: number;
  date_slot_start: string;
  is_available: boolean;
};

const groupSlots = (raw: RawSlot[] = []) => {
  const map = new Map<string, { id: number; time: string }[]>();
  raw.forEach((s) => {
    if (!s.is_available) return;
    const [date, timeFull] = s.date_slot_start.split("T");
    const time = (timeFull ?? "").slice(0, 5);
    if (!map.has(date)) map.set(date, []);
    map.get(date)!.push({ id: s.slot_id, time });
  });
  return Array.from(map.entries()).map(([date, slots]) => ({
    date,
    slots: slots.sort((a, b) => a.time.localeCompare(b.time)),
  }));
};

/* ------------------------------------------------------------------ */
/*  Mapping backend → front                                           */
/* ------------------------------------------------------------------ */
const mapBackendListing = (raw: any): Listing => {
  const images = safeParseJSON<string>(raw.photos_json);
  const avatar = images[0] || placeholder(2);
  return {
    id: String(raw.listing_id),
    title: raw.name,
    titleFr: raw.name,
    description: raw.description ?? "",
    descriptionFr: raw.description ?? "",
    category: raw.category?.category_name,
    price: raw.base_price ?? 0,
    rating: raw.average_rating ?? 0,
    reviewCount: raw.reviews_count ?? 0,
    images: images.length ? images : [placeholder()],
    location: {
      lat: raw.address?.latitude,
      lng: raw.address?.longitude,
      address: raw.address?.street_address ?? "",
      addressFr: raw.address?.street_address ?? "",
    },
    availability: groupSlots(raw.availability_slots),
    amenities: safeParseJSON<string>(raw.restaurant?.amenities_json),
    host: {
      name: raw.partner?.business_name ?? "",
      avatar,
      verified: raw.partner?.verification_status === "verified",
    },
    createdAt: raw.creation_date,
  };
};

const mapBackendBooking = (raw: any): Booking => {
  const iso = String(raw.date_time_reservation ?? raw.booking_timestamp ?? "");
  return {
    id: String(raw.reservation_id ?? raw.id ?? ""),
    listingId: String(raw.listing?.listing_id ?? raw.listing_id ?? ""),
    date: iso.slice(0, 10),
    time: iso.slice(11, 16),
    participants: Number(raw.number_of_participants ?? 1),
    status: raw.status ?? "pending",
    totalPrice: Number(raw.total_price ?? 0),
    createdAt: String(raw.booking_timestamp ?? iso),
  };
};

/* ------------------------------------------------------------------ */
/*  LISTINGS (public)                                                 */
/* ------------------------------------------------------------------ */
export const getListings = async (
  filters: ListingFilters = {},
  page = 1,
  limit = 12
): Promise<PaginatedResponse<Listing>> => {
  const q: Record<string, any> = {
    page,
    per_page: limit,
    ...(filters.category && { category: filters.category }),
    ...(filters.minPrice != null && { minPrice: filters.minPrice }),
    ...(filters.maxPrice != null && { maxPrice: filters.maxPrice }),
    ...(filters.minRating != null && { minRating: filters.minRating }),
    ...(filters.date && { date_from: filters.date }),
    ...(filters.location && {
      lat: filters.location.lat,
      lng: filters.location.lng,
      radius: filters.location.radius,
    }),
  };
  const res = await fetch(`${API_BASE}/user/listings?${buildQuery(q)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const js = await res.json();
  return {
    data: js.data.map(mapBackendListing),
    total: js.total,
    page: js.page,
    per_page: js.per_page,
    has_more: js.has_more,
  };
};

export const searchListings = async (keyword: string): Promise<Listing[]> => {
  const qs = buildQuery({ search: keyword.trim(), page: 1, per_page: 100 });
  const res = await fetch(`${API_BASE}/user/listings?${qs}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const js = await res.json();
  return js.data.map(mapBackendListing);
};

export const getListing = async (id: string): Promise<Listing | null> => {
  const res = await fetch(`${API_BASE}/user/items/${id}`);
  if (!res.ok) return null;
  return mapBackendListing(await res.json());
};

/* ------------------------------------------------------------------ */
/*  USER (protected)                                                  */
/* ------------------------------------------------------------------ */
export const getUser = async (): Promise<User> => {
  const res = await authFetch(`${API_BASE}/user/profile`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const updateUserPreferences = async (
  prefs: Partial<User["preferences"]>
): Promise<User> => {
  const res = await authFetch(`${API_BASE}/user/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(prefs),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/* ------------------------------------------------------------------ */
/*  FAVORITES (protected)                                             */
/* ------------------------------------------------------------------ */
export const getFavorites = async (): Promise<string[]> => {
  const res = await authFetch(`${API_BASE}/user/favorites`);
  if (!res.ok) return [];
  const arr = await res.json();
  return arr.map((f: any) => String(f.listing_id ?? f.listing?.listing_id));
};

export const addFavorite = async (id: string): Promise<void> => {
  const res = await authFetch(`${API_BASE}/user/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ listing_id: Number(id) }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
};

export const removeFavorite = async (id: string): Promise<void> => {
  const res = await authFetch(`${API_BASE}/user/favorites/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
};

export const getFavoriteListings = async (): Promise<Listing[]> => {
  const res = await authFetch(`${API_BASE}/user/favorites`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const arr = await res.json();
  return arr.map((f: any) => mapBackendListing(f.listing));
};

/* ------------------------------------------------------------------ */
/*  BOOKINGS (protected)                                              */
/* ------------------------------------------------------------------ */
export const createBooking = async (
  input: ReservationInput
): Promise<Booking> => {
  const res = await authFetch(`${API_BASE}/user/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      listing_id: Number(input.listingId),
      slot_id: input.slotId,
      date_time_reservation: `${input.date}T${input.time}:00Z`,
      number_of_participants: input.participants,
      special_requests: input.specialRequests,
      payment_token: input.paymentToken,
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return mapBackendBooking(await res.json());
};

export const getBookings = async (): Promise<Booking[]> => {
  const res = await authFetch(`${API_BASE}/user/reservations`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()).map(mapBackendBooking);
};

export const cancelBooking = async (id: string): Promise<void> => {
  const res = await authFetch(`${API_BASE}/user/reservations/${id}/cancel`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
};
