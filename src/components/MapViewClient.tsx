// src/components/MapViewClient.tsx

import React, { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import { Listing } from "@/lib/types";
import { Star, MapPin } from "lucide-react";

// Leaflet default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const CATEGORY_COLORS: Record<string, string> = {
  // Lowercase versions (normalized)
  restaurant: "#1ABC9C", // Your accent color for restaurants
  event: "#E74C3C", // Red for events
  cultural: "#3498DB", // Blue for cultural sites
  // Original case versions (what comes from API)
  Restaurant: "#1ABC9C",
  Event: "#E74C3C",
  Cultural: "#3498DB",
  // Plural versions
  restaurants: "#1ABC9C",
  events: "#E74C3C",
  culturals: "#3498DB",
  // Other possible names
  culture: "#3498DB",
  activity: "#9B59B6",
  activities: "#9B59B6",
};

// on protège l’accès aux labels avec un fallback
const CATEGORY_LABELS: Record<string, { en: string; fr: string }> = {
  // Lowercase versions
  restaurant: { en: "Restaurant", fr: "Restaurant" },
  event: { en: "Event", fr: "Événement" },
  cultural: { en: "Cultural", fr: "Culturel" },
  // Original case versions
  Restaurant: { en: "Restaurant", fr: "Restaurant" },
  Event: { en: "Event", fr: "Événement" },
  Cultural: { en: "Cultural", fr: "Culturel" },
  // Plural versions
  restaurants: { en: "Restaurants", fr: "Restaurants" },
  events: { en: "Events", fr: "Événements" },
  culturals: { en: "Culturals", fr: "Culturels" },
  // Other names
  culture: { en: "Culture", fr: "Culture" },
  activity: { en: "Activity", fr: "Activité" },
  activities: { en: "Activities", fr: "Activités" },
};

// Category icons
const CATEGORY_ICONS: Record<string, string> = {
  // Lowercase versions
  restaurant: "🍽️",
  event: "🎭",
  cultural: "🏛️",
  // Original case versions
  Restaurant: "🍽️",
  Event: "🎭",
  Cultural: "🏛️",
  // Plural versions
  restaurants: "🍽️",
  events: "🎭",
  culturals: "🏛️",
  // Other names
  culture: "🏛️",
  activity: "🏄‍♂️",
  activities: "🏄‍♂️",
};

const ICON_CACHE = new Map<string, L.DivIcon>();
function getIcon(cat: string | undefined): L.DivIcon {
  const category = cat || "default";
  if (ICON_CACHE.has(category)) return ICON_CACHE.get(category)!;

  // Try both original case and lowercase
  const color =
    CATEGORY_COLORS[category] ||
    CATEGORY_COLORS[category.toLowerCase()] ||
    "#1ABC9C";
  const categoryIcon =
    CATEGORY_ICONS[category] || CATEGORY_ICONS[category.toLowerCase()] || "📍";

  console.log(
    `Creating icon for category: "${cat}" -> normalized: "${category}" -> color: ${color}`
  ); // Debug log

  const icon = L.divIcon({
    html: `<div style="
      background:${color};
      width:32px;height:32px;
      border-radius:50%;
      border:3px solid #fff;
      box-shadow:0 4px 12px rgba(0,0,0,.3);
      display:flex;align-items:center;justify-content:center;
      font-size:14px;
      position:relative;">
        ${categoryIcon}
    </div>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
  ICON_CACHE.set(category, icon);
  return icon;
}

interface MapViewProps {
  listings: Listing[];
  onListingClick?: (l: Listing) => void;
  selectedListing?: Listing | null;
  userLocation?: [number, number];
  center?: [number, number];
  zoom?: number;
  height?: string;
  currentLanguage?: "en" | "fr";
}

const MapUpdater: React.FC<{
  center: [number, number];
  zoom: number;
  selected?: Listing | null;
}> = ({ center, zoom, selected }) => {
  const map = useMap();
  useEffect(() => {
    if (selected) {
      map.setView([selected.location.lat, selected.location.lng], 15, {
        animate: true,
        duration: 1,
      });
    } else {
      map.setView(center, zoom, { animate: true, duration: 1 });
    }
  }, [map, center, zoom, selected]);
  return null;
};

const MapViewClient: React.FC<MapViewProps> = ({
  listings,
  onListingClick,
  selectedListing,
  userLocation,
  center = [33.5892, -7.6125],
  zoom = 12,
  height = "400px",
  currentLanguage = "en",
}) => {
  const style = useMemo(() => ({ height }), [height]);

  // accès sécurisé aux labels, fallback sur la version anglaise puis la clé brute
  const getCategoryLabel = (cat: string) => {
    const category = cat || "";
    return (
      CATEGORY_LABELS[category]?.[currentLanguage] ??
      CATEGORY_LABELS[category.toLowerCase()]?.[currentLanguage] ??
      CATEGORY_LABELS[category]?.en ??
      CATEGORY_LABELS[category.toLowerCase()]?.en ??
      (cat || "Unknown")
    );
  };

  return (
    <div className="relative rounded-lg overflow-hidden" style={style}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <MapUpdater center={center} zoom={zoom} selected={selectedListing} />

        {/* Cercle position utilisateur */}
        {userLocation && (
          <Circle
            center={userLocation}
            radius={200}
            pathOptions={{
              color: "#2563eb",
              fillColor: "#2563eb",
              fillOpacity: 0.3,
              weight: 2,
            }}
          >
            <Popup>
              {currentLanguage === "en" ? "Your location" : "Votre position"}
            </Popup>
          </Circle>
        )}

        {/* Markers */}
        {listings.map((li) => {
          const title =
            currentLanguage === "en" ? li.title : li.titleFr ?? li.title;
          const address =
            currentLanguage === "en"
              ? li.location.address
              : li.location.addressFr ?? li.location.address;

          // Debug log to see what category we're getting
          console.log(`Listing ${li.id} has category: "${li.category}"`);

          return (
            <Marker
              key={li.id}
              position={[li.location.lat, li.location.lng]}
              icon={getIcon(li.category)}
              eventHandlers={{ click: () => onListingClick?.(li) }}
            >
              <Popup className="custom-popup">
                <div className="w-64 p-2">
                  <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
                    <img
                      src={li.images[0]}
                      alt={title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) =>
                        ((e.target as HTMLImageElement).src =
                          "/placeholder.jpg")
                      }
                    />
                    <span
                      className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
                        li.category?.toLowerCase().includes("restaurant")
                          ? "bg-accent/10 text-accent"
                          : li.category?.toLowerCase().includes("event")
                          ? "bg-red-100 text-red-600"
                          : li.category?.toLowerCase().includes("cultural") ||
                            li.category?.toLowerCase().includes("culture")
                          ? "bg-blue-100 text-blue-600"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {getCategoryLabel(li.category)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                    {title}
                  </h3>
                  <div className="flex items-center space-x-1 mb-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600">
                      {li.rating} ({li.reviewCount})
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span className="text-xs line-clamp-1">{address}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-accent">
                      {li.price} MAD
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/listing/${li.id}`, "_blank");
                      }}
                      className="px-3 py-1 bg-accent text-white text-xs rounded-lg hover:bg-accent/90 transition-colors"
                    >
                      {currentLanguage === "en"
                        ? "View details"
                        : "Voir détails"}
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">
          {currentLanguage === "en" ? "Categories" : "Catégories"}
        </h4>
        <div className="space-y-2">
          {/* Only show the main categories without duplicates */}
          <div className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: "#1ABC9C" }}
            />
            <span className="text-xs text-gray-700">
              {currentLanguage === "en" ? "Restaurant" : "Restaurant"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: "#E74C3C" }}
            />
            <span className="text-xs text-gray-700">
              {currentLanguage === "en" ? "Event" : "Événement"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: "#3498DB" }}
            />
            <span className="text-xs text-gray-700">
              {currentLanguage === "en" ? "Cultural" : "Culturel"}
            </span>
          </div>
        </div>
      </div>

      {/* Bouton reset */}
      <button
        onClick={() => {
          const mapEl = document.querySelector(
            ".leaflet-container"
          ) as HTMLElement & { _leaflet_map?: L.Map };
          mapEl?._leaflet_map?.setView(center, zoom);
        }}
        className="absolute top-4 right-4 z-[1000] bg-white p-2 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition"
        title={currentLanguage === "en" ? "Reset view" : "Réinitialiser la vue"}
      >
        <MapPin className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
};

export default React.memo(MapViewClient);
