// Configuration for KML file URLs based on distance and language
import type { Language } from "./translations"
import type { RouteDistance } from "@/components/map/layer-selector"

// Type for the KML configuration
export type KMLConfig = Record<Language, Record<RouteDistance, string>>

// Default KML URL (placeholder)
const DEFAULT_KML_URL =
  "https://raw.githubusercontent.com/davisrukitis/rrm25-poi/refs/heads/main/Rimi%20Riga%20Marathon%202025%20__%20Marathon.kml"

// KML configuration object
// This can be easily updated with actual URLs for each distance and language
export const kmlConfig: KMLConfig = {
  en: {
    "42km":
      "https://raw.githubusercontent.com/davisrukitis/rrm25-poi/refs/heads/main/Rimi%20Riga%20Marathon%202025%20__%20Marathon.kml",
    "21km":
      "https://raw.githubusercontent.com/davisrukitis/rrm25-poi/refs/heads/main/Rimi%20Riga%20Marathon%202025%20__%20Half%20Marathon.kml",
    "10km":
      "https://raw.githubusercontent.com/davisrukitis/rrm25-poi/refs/heads/main/Rimi%20Riga%20Marathon%202025%20__%2010%20km%20EN.kml",
    "6km":
      "https://raw.githubusercontent.com/davisrukitis/rrm25-poi/refs/heads/main/Rimi%20Riga%20Marathon%202025%20__%206km.kml",
    mile: "https://raw.githubusercontent.com/davisrukitis/rrm25-poi/refs/heads/main/Rimi%20Riga%20Marathon%202025%20__%20Mile.kml",
  },
  lv: {
    "42km":
      "https://raw.githubusercontent.com/davisrukitis/rrm25-poi/refs/heads/main/Rimi%20Riga%20Marathon%202025%20__%20Maratons.kml",
    "21km":
      "https://raw.githubusercontent.com/davisrukitis/rrm25-poi/refs/heads/main/Rimi%20Riga%20Marathon%202025%20__%20Pusmaratons.kml",
    "10km":
      "https://raw.githubusercontent.com/davisrukitis/rrm25-poi/refs/heads/main/Rimi%20Riga%20Marathon%202025%20__%2010%20km%20LV.kml",
    "6km":
      "https://raw.githubusercontent.com/davisrukitis/rrm25-poi/refs/heads/main/Rimi%20Riga%20Marathon%202025%20__%206km%20LV.kml",
    mile: "https://raw.githubusercontent.com/davisrukitis/rrm25-poi/refs/heads/main/Rimi%20Riga%20Marathon%202025%20__%20Ju%CC%84dze.kml",
  },
}

// Function to get the KML URL based on language and distance
export function getKmlUrl(language: Language, distance: RouteDistance): string {
  return kmlConfig[language][distance]
}
