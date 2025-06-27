/* ------------------------------------------------------------------ */
/*  Interfaces                                                         */
/* ------------------------------------------------------------------ */

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
  /** Chaque créneau possède désormais un id unique + le time (HH:mm) */
  availability: {
    date: string;                       // ex. "2024-01-15"
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

/* ------------------------------------------------------------------ */
/*  Mock listings                                                     */
/* ------------------------------------------------------------------ */
export const mockListings: Listing[] = [
  /* ───────────── 1 ───────────── */
  {
    id: "1",
    title: "Hassan II Mosque Tour",
    titleFr: "Visite de la Mosquée Hassan II",
    description:
      "Discover the architectural marvel of Hassan II Mosque, one of the largest mosques in the world.",
    descriptionFr:
      "Découvrez la merveille architecturale de la Mosquée Hassan II, l'une des plus grandes mosquées au monde.",
    category: "cultural",
    price: 150,
    rating: 4.8,
    reviewCount: 342,
    images: [
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=800",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
    ],
    location: {
      lat: 33.6062,
      lng: -7.6326,
      address: "Boulevard Sidi Mohammed Ben Abdallah, Casablanca",
      addressFr: "Boulevard Sidi Mohammed Ben Abdallah, Casablanca",
    },
    availability: [
      {
        date: "2024-01-15",
        slots: [
          { id: 1, time: "09:00" },
          { id: 2, time: "11:00" },
          { id: 3, time: "14:00" },
          { id: 4, time: "16:00" },
        ],
      },
      {
        date: "2024-01-16",
        slots: [
          { id: 5,  time: "09:00" },
          { id: 6,  time: "11:00" },
          { id: 7,  time: "14:00" },
        ],
      },
    ],
    amenities: ["Guided Tour", "Audio Guide", "Photography"],
    host: {
      name: "Mohammed Al-Fassi",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      verified: true,
    },
    createdAt: "2024-01-01",
  },

  /* ───────────── 2 ───────────── */
  {
    id: "2",
    title: "Rick's Café",
    titleFr: "Café Rick's",
    description:
      "Experience the legendary atmosphere of Casablanca at the famous Rick's Café.",
    descriptionFr:
      "Vivez l'atmosphère légendaire de Casablanca au célèbre Café Rick's.",
    category: "restaurant",
    price: 300,
    rating: 4.6,
    reviewCount: 189,
    images: [
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800",
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800",
    ],
    location: {
      lat: 33.5731,
      lng: -7.6298,
      address: "248 Boulevard Sour Jdid, Casablanca",
      addressFr: "248 Boulevard Sour Jdid, Casablanca",
    },
    availability: [
      {
        date: "2024-01-15",
        slots: [
          { id: 1, time: "19:00" },
          { id: 2, time: "20:00" },
          { id: 3, time: "21:00" },
        ],
      },
      {
        date: "2024-01-16",
        slots: [
          { id: 4, time: "19:00" },
          { id: 5, time: "20:00" },
          { id: 6, time: "21:00" },
          { id: 7, time: "22:00" },
        ],
      },
    ],
    amenities: ["Live Music", "Bar", "Terrace", "Reservations"],
    host: {
      name: "Fatima Benali",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b988?w=100",
      verified: true,
    },
    createdAt: "2024-01-02",
  },

  /* ───────────── 3 ───────────── */
  {
    id: "3",
    title: "Old Medina Walking Tour",
    titleFr: "Visite à pied de l'Ancienne Médina",
    description:
      "Explore the narrow alleys and traditional souks of Casablanca's historic medina.",
    descriptionFr:
      "Explorez les ruelles étroites et les souks traditionnels de la médina historique de Casablanca.",
    category: "cultural",
    price: 120,
    rating: 4.5,
    reviewCount: 267,
    images: [
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=800",
      "https://images.unsplash.com/photo-1548848304-9d0e3ab0b9ac?w=800",
    ],
    location: {
      lat: 33.5949,
      lng: -7.6187,
      address: "Ancient Medina, Casablanca",
      addressFr: "Ancienne Médina, Casablanca",
    },
    availability: [
      {
        date: "2024-01-15",
        slots: [
          { id: 1, time: "10:00" },
          { id: 2, time: "15:00" },
        ],
      },
      {
        date: "2024-01-16",
        slots: [
          { id: 3, time: "10:00" },
          { id: 4, time: "15:00" },
        ],
      },
    ],
    amenities: ["Local Guide", "Tea Break", "Shopping Stops"],
    host: {
      name: "Youssef Marrakchi",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      verified: true,
    },
    createdAt: "2024-01-03",
  },

  /* ───────────── 4 ───────────── */
  {
    id: "4",
    title: "La Corniche Beach Club",
    titleFr: "Club de Plage La Corniche",
    description:
      "Relax and dine at this exclusive beach club overlooking the Atlantic Ocean.",
    descriptionFr:
      "Détendez-vous et dînez dans ce club de plage exclusif surplombant l'océan Atlantique.",
    category: "restaurant",
    price: 250,
    rating: 4.7,
    reviewCount: 156,
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
    ],
    location: {
      lat: 33.5889,
      lng: -7.6394,
      address: "Boulevard de la Corniche, Casablanca",
      addressFr: "Boulevard de la Corniche, Casablanca",
    },
    availability: [
      {
        date: "2024-01-15",
        slots: [
          { id: 1, time: "12:00" },
          { id: 2, time: "13:00" },
          { id: 3, time: "14:00" },
          { id: 4, time: "19:00" },
          { id: 5, time: "20:00" },
        ],
      },
      {
        date: "2024-01-16",
        slots: [
          { id: 6, time: "12:00" },
          { id: 7, time: "13:00" },
          { id: 8, time: "19:00" },
          { id: 9, time: "20:00" },
        ],
      },
    ],
    amenities: ["Ocean View", "Pool Access", "Beach Chairs", "Parking"],
    host: {
      name: "Amina Tazi",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      verified: true,
    },
    createdAt: "2024-01-04",
  },

  /* ───────────── 5 ───────────── */
  {
    id: "5",
    title: "Art Deco Architecture Tour",
    titleFr: "Visite Architecture Art Déco",
    description:
      "Discover Casablanca's unique Art Deco buildings and colonial heritage.",
    descriptionFr:
      "Découvrez les bâtiments Art Déco uniques de Casablanca et son patrimoine colonial.",
    category: "cultural",
    price: 180,
    rating: 4.9,
    reviewCount: 98,
    images: [
      "https://images.unsplash.com/photo-1572979284768-2e0e5ce74a63?w=800",
      "https://images.unsplash.com/photo-1577711718803-53bbcc6e5a1b?w=800",
    ],
    location: {
      lat: 33.5892,
      lng: -7.6125,
      address: "Boulevard Mohammed V, Casablanca",
      addressFr: "Boulevard Mohammed V, Casablanca",
    },
    availability: [
      {
        date: "2024-01-15",
        slots: [
          { id: 1, time: "09:30" },
          { id: 2, time: "14:30" },
        ],
      },
      {
        date: "2024-01-16",
        slots: [
          { id: 3, time: "09:30" },
          { id: 4, time: "14:30" },
        ],
      },
    ],
    amenities: ["Architecture Guide", "Photography", "Coffee Break"],
    host: {
      name: "Hassan Benjelloun",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100",
      verified: true,
    },
    createdAt: "2024-01-05",
  },

  /* ───────────── 6 ───────────── */
  {
    id: "6",
    title: "Traditional Moroccan Cooking Class",
    titleFr: "Cours de Cuisine Marocaine Traditionnelle",
    description:
      "Learn to prepare authentic Moroccan dishes with a local chef.",
    descriptionFr:
      "Apprenez à préparer des plats marocains authentiques avec un chef local.",
    category: "event",
    price: 220,
    rating: 4.8,
    reviewCount: 234,
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
      "https://images.unsplash.com/photo-1605522833157-e7ac61b2a6e9?w=800",
    ],
    location: {
      lat: 33.5731,
      lng: -7.5898,
      address: "Rue Ibn Batouta, Casablanca",
      addressFr: "Rue Ibn Batouta, Casablanca",
    },
    availability: [
      {
        date: "2024-01-15",
        slots: [
          { id: 1, time: "10:00" },
          { id: 2, time: "16:00" },
        ],
      },
      {
        date: "2024-01-16",
        slots: [
          { id: 3, time: "10:00" },
          { id: 4, time: "16:00" },
        ],
      },
    ],
    amenities: ["Ingredients Included", "Recipe Book", "Tea Service", "Take-home Meal"],
    host: {
      name: "Lalla Aicha",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
      verified: true,
    },
    createdAt: "2024-01-06",
  },
];

/* ------------------------------------------------------------------ */
/*  Mock utilisateur                                                  */
/* ------------------------------------------------------------------ */
export const mockUser: User = {
  id: "user-1",
  name: "Hamza Khriss",
  email: "hamza.khriss@203gmail.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
  preferences: {
    language: "en",
    theme: "light",
  },
  bookings: [
    {
      id: "booking-1",
      listingId: "1",
      date: "2024-01-15",
      time: "09:00",
      participants: 2,
      status: "confirmed",
      totalPrice: 300,
      createdAt: "2024-01-10",
    },
    {
      id: "booking-2",
      listingId: "6",
      date: "2024-01-16",
      time: "10:00",
      participants: 1,
      status: "pending",
      totalPrice: 220,
      createdAt: "2024-01-11",
    },
  ],
  wishlist: ["2", "4", "5"],
};
