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
import { Listing } from "@/lib/mockData";
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

type CategoryKey = Listing["category"];

const CATEGORY_COLORS: Record<CategoryKey, string> = {
  restaurant: "#3B82F6",
  event:      "#8B5CF6",
  cultural:   "#10B981",
};

// on protège l’accès aux labels avec un fallback
const CATEGORY_LABELS: Record<CategoryKey, { en: string; fr: string }> = {
  restaurant: { en: "Restaurant", fr: "Restaurant" },
  event:      { en: "Event",      fr: "Événement" },
  cultural:   { en: "Cultural",   fr: "Culturel" },
};

const ICON_CACHE = new Map<CategoryKey, L.DivIcon>();
function getIcon(cat: CategoryKey): L.DivIcon {
  if (ICON_CACHE.has(cat)) return ICON_CACHE.get(cat)!;
  const color = CATEGORY_COLORS[cat] ?? "#6B7280";
  const icon = L.divIcon({
    html: `<div style="
      background:${color};
      width:24px;height:24px;
      border-radius:50%;
      border:3px solid #fff;
      box-shadow:0 2px 8px rgba(0,0,0,.3);
      display:flex;align-items:center;justify-content:center;">
        <div style="width:8px;height:8px;background:#fff;border-radius:50%;"></div>
    </div>`,
    className: "",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
  ICON_CACHE.set(cat, icon);
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
      map.setView(
        [selected.location.lat, selected.location.lng],
        15,
        { animate: true, duration: 1 }
      );
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
  const getCategoryLabel = (cat: CategoryKey) =>
    CATEGORY_LABELS[cat]?.[currentLanguage] ??
    CATEGORY_LABELS[cat]?.en ??
    cat;

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
              {currentLanguage === "en"
                ? "Your location"
                : "Votre position"}
            </Popup>
          </Circle>
        )}

        {/* Markers */}
        {listings.map((li) => {
          const title   = currentLanguage === "en" ? li.title : li.titleFr ?? li.title;
          const address = currentLanguage === "en"
            ? li.location.address
            : li.location.addressFr ?? li.location.address;

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
                        ((e.target as HTMLImageElement).src = "/placeholder.jpg")
                      }
                    />
                    <span
                      className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
                        li.category === "restaurant"
                          ? "bg-blue-100 text-blue-800"
                          : li.category === "event"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
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
                      onClick={() => onListingClick?.(li)}
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
