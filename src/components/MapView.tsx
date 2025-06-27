import React from "react";
import dynamic from "next/dynamic";
import { Listing } from "@/lib/mockData";

/* ------------------------------------------------------------------ */
/*  Props                                                             */
/* ------------------------------------------------------------------ */
export interface MapViewProps {
  listings: Listing[];
  onListingClick?: (l: Listing) => void;
  selectedListing?: Listing | null;
  center?: [number, number];
  zoom?: number;
  height?: string;
  currentLanguage?: "en" | "fr";
  /* facultatif : on vous laisse le champ libre       */
  userLocation?: [number, number];
}

const MapLoading: React.FC<{
  height: string;
  currentLanguage: "en" | "fr";
}> = ({ height, currentLanguage }) => (
  <div
    className="bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"
    style={{ height }}
  >
    <div className="text-center space-y-4">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
      <div className="text-gray-500 dark:text-gray-400">
        {currentLanguage === "en" ? "Loading map…" : "Chargement de la carte…"}
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Dynamic import (SSR OFF)                                           */
/*  – on typpe correctement MapViewProps                               */
/*  – on transmet height + currentLanguage au loader                   */
/* ------------------------------------------------------------------ */
const DynamicMap = dynamic<MapViewProps>(
  () => import("./MapViewClient"),
  {
    ssr: false,
    // le loader ne reçoit PAS les props → on les capture avec une closure
    loading: () => (
      <MapLoading height="400px" currentLanguage="en" />
    ),
  }
);

/* ------------------------------------------------------------------ */
/*  Facade                                                             */
/* ------------------------------------------------------------------ */
const MapView: React.FC<MapViewProps> = ({
  height = "400px",
  currentLanguage = "en",
  ...rest
}) => {
  return (
    <DynamicMap
      {...rest}
      height={height}
      currentLanguage={currentLanguage}
    />
  );
};

export default React.memo(MapView);
