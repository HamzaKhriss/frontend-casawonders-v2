/**
 * Options par défaut pour la géolocalisation.
 *   – haute précision (GPS) si dispo
 *   – timeout 10 s
 *   – mise en cache 60 s
 */
const defaultOpts: PositionOptions = {
    enableHighAccuracy: true,
    timeout:            10_000,
    maximumAge:         60_000,
  };
  
  /**
   * Essaie d’obtenir la position courante de l’utilisateur.
   * - Résout avec GeolocationPosition
   * - Renvoie null si l’API n’existe pas ou si l’utilisateur refuse.
   */
  export async function getCurrentPosition(
    opts: PositionOptions = defaultOpts,
  ): Promise<GeolocationPosition | null> {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      console.warn("[Geo] API non disponible");
      return null;
    }
  
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos),
        (err) => {
          console.warn("[Geo] impossible :", err);
          resolve(null); // on continue sans crash
        },
        opts,
      );
    });
  }
  
  /**
   * Version pratique : ne renvoie que les {lat, lng} ou null.
   */
  export async function getLatLng(
    opts: PositionOptions = defaultOpts,
  ): Promise<{ lat: number; lng: number } | null> {
    const pos = await getCurrentPosition(opts);
    if (!pos) return null;
    const { latitude: lat, longitude: lng } = pos.coords;
    return { lat, lng };
  }
  
  /**
   * Surveille la position de l’utilisateur.
   * Renvoie un « unsubscribe » pour arrêter la surveillance.
   */
  export function watchPosition(
    cb: (coords: GeolocationPosition | null) => void,
    opts: PositionOptions = defaultOpts,
  ): () => void {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      console.warn("[Geo] API non disponible");
      cb(null);
      return () => {};
    }
  
    const id = navigator.geolocation.watchPosition(
      (pos) => cb(pos),
      (err) => {
        console.warn("[Geo] watch error :", err);
        cb(null);
      },
      opts,
    );
  
    // unsubscribe
    return () => navigator.geolocation.clearWatch(id);
  }
  