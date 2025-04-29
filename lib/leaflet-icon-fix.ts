// This file fixes the Leaflet icon issues in Next.js
import L from "leaflet"

export function fixLeafletIcon() {
  // Only run on the client side
  if (typeof window === "undefined") return

  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl

  // @ts-ignore
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  })
}
