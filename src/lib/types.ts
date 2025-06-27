// lib/types.ts - Type definitions for the application

export interface Listing {
  id: string;
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  category: "restaurant" | "event" | "cultural";
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
    addressFr: string;
  };
  /** Each slot has a unique id + time (HH:mm) */
  availability: {
    date: string; // ex. "2024-01-15"
    slots: { id: number; time: string }[];
  }[];
  amenities: string[];
  host: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  createdAt: string;
}

export interface Booking {
  id: string;
  listingId: string;
  date: string;
  time: string;
  participants: number;
  status: "confirmed" | "pending" | "cancelled";
  totalPrice: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  preferences: {
    language: "en" | "fr";
    theme: "light" | "dark";
  };
  bookings: Booking[];
  wishlist: string[];
}
