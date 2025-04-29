// Translations for the UI elements
export type Language = "en" | "lv"

export interface Translations {
  layers: {
    title: string
    marathon: {
      name: string
      distance: string
    }
    halfMarathon: {
      name: string
      distance: string
    }
    tenK: {
      name: string
      distance: string
    }
    fiveK: {
      name: string
      distance: string
    }
    mile: {
      name: string
      distance: string
    }
  }
  controls: {
    myLocation: string
    routes: string
    zones: string
    pois: string
    fullscreen: string
    exitFullscreen: string
  }
  errors: {
    locationNotSupported: string
    locationDenied: string
    locationUnavailable: string
    locationTimeout: string
    outsideRiga: string
    fullscreenNotSupported: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    layers: {
      title: "Distance",
      marathon: {
        name: "Marathon",
        distance: "42km",
      },
      halfMarathon: {
        name: "Half Marathon",
        distance: "21km",
      },
      tenK: {
        name: "10km",
        distance: "",
      },
      fiveK: {
        name: "Jubilee 5K",
        distance: "6km",
      },
      mile: {
        name: "DPD Mile",
        distance: "1609m",
      },
    },
    controls: {
      myLocation: "My Location",
      routes: "Route",
      zones: "Zones",
      pois: "Points of Interest",
      fullscreen: "Enter fullscreen",
      exitFullscreen: "Exit fullscreen",
    },
    errors: {
      locationNotSupported: "Your browser doesn't support geolocation.",
      locationDenied: "Location access was denied",
      locationUnavailable: "Location information is unavailable",
      locationTimeout: "Location request timed out",
      outsideRiga: "Your location is outside the Riga area. Centering on Riga.",
      fullscreenNotSupported: "Fullscreen mode is not supported by your browser.",
    },
  },
  lv: {
    layers: {
      title: "Distance",
      marathon: {
        name: "Maratons",
        distance: "42 km",
      },
      halfMarathon: {
        name: "Pusmaratons",
        distance: "21 km",
      },
      tenK: {
        name: "10 km",
        distance: "",
      },
      fiveK: {
        name: "Jubilejas piecītis",
        distance: "6 km",
      },
      mile: {
        name: "DPD jūdze",
        distance: "1609m",
      },
    },
    controls: {
      myLocation: "Mana atrašanās vieta",
      routes: "Trase",
      zones: "Zonas",
      pois: "Interešu punkti",
      fullscreen: "Pilnekrāna režīms",
      exitFullscreen: "Iziet no pilnekrāna režīma",
    },
    errors: {
      locationNotSupported: "Jūsu pārlūkprogramma neatbalsta ģeolokāciju.",
      locationDenied: "Piekļuve atrašanās vietai tika liegta",
      locationUnavailable: "Atrašanās vietas informācija nav pieejama",
      locationTimeout: "Atrašanās vietas pieprasījuma noilgums",
      outsideRiga: "Jūsu atrašanās vieta ir ārpus Rīgas. Centrējam uz Rīgu.",
      fullscreenNotSupported: "Jūsu pārlūkprogramma neatbalsta pilnekrāna režīmu.",
    },
  },
}
