"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { type Language, translations } from "@/lib/translations"
import type { RouteDistance } from "@/components/map/layer-selector"
import { markAsOpenedFromEmbed } from "@/lib/embed-utils"
import Preloader from "@/components/preloader"

// Dynamically import the Map component to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("@/components/map/map-component"), {
  loading: () => null, // We'll use our custom preloader instead
  ssr: false,
})

export default function Page() {
  const [visibleLayers, setVisibleLayers] = useState({
    routes: true,
    zones: true,
    pois: true,
  })
  const [language, setLanguage] = useState<Language>("en")
  const [selectedDistance, setSelectedDistance] = useState<RouteDistance>("42km")
  const [isLoading, setIsLoading] = useState(true)
  const [showMap, setShowMap] = useState(false)

  // Check if this page was opened from an embed and mark it
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.search.includes("from=embed")) {
        markAsOpenedFromEmbed()
      }
    }

    // Simulate loading time (remove this in production)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const toggleLayer = (layer: keyof typeof visibleLayers) => {
    setVisibleLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }))
  }

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
  }

  const handleDistanceChange = (distance: RouteDistance) => {
    setSelectedDistance(distance)
  }

  const handlePreloaderComplete = () => {
    setShowMap(true)
  }

  const t = translations[language]

  return (
    <main className="h-screen w-full" aria-hidden="false">
      {(!showMap || isLoading) && <Preloader isLoading={isLoading} onAnimationComplete={handlePreloaderComplete} />}

      {showMap && (
        <MapComponent
          visibleLayers={visibleLayers}
          language={language}
          selectedDistance={selectedDistance}
          onLanguageChange={handleLanguageChange}
          onDistanceChange={handleDistanceChange}
          onToggleLayer={toggleLayer}
          translations={t}
        />
      )}
    </main>
  )
}
