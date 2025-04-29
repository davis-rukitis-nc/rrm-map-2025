"use client"

import { useState, useEffect, useRef } from "react"
import { MapContainer, TileLayer, useMap, Marker } from "react-leaflet"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Compass, Loader2, Plus, Minus, ExternalLink } from "lucide-react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Import components
import KMLLayer from "./kml-layer"
import MapControls from "./map-controls"

// Import types and utilities
import type { Language, Translations } from "@/lib/translations"
import type { RouteDistance } from "./layer-selector"
import { fixLeafletIcon } from "@/lib/leaflet-icon-fix"
import { isEmbedded, isMobileDevice, isOpenedFromEmbed, markAsOpenedFromEmbed, openInNewTab } from "@/lib/embed-utils"

// Update the function to get KML URL to use the new configuration
import { getKmlUrl } from "@/lib/kml-config"

// Types
interface MapComponentProps {
  visibleLayers: {
    routes: boolean
    zones: boolean
    pois: boolean
  }
  language: Language
  selectedDistance: RouteDistance
  onLanguageChange: (language: Language) => void
  onDistanceChange: (distance: RouteDistance) => void
  onToggleLayer: (layer: keyof VisibleLayers) => void
  translations: Translations
}

// Define the VisibleLayers type
type VisibleLayers = {
  routes: boolean
  zones: boolean
  pois: boolean
}

// Map bounds for Riga (extended north)
const RIGA_BOUNDS: L.LatLngBoundsExpression = [
  [56.9, 24.0], // Southwest corner
  [57.1, 24.23], // Northeast corner (extended north)
]

// External Link Button Component
function ExternalLinkButton() {
  const [isInEmbed, setIsInEmbed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isFromEmbed, setIsFromEmbed] = useState(false)

  useEffect(() => {
    setIsInEmbed(isEmbedded())
    setIsMobile(isMobileDevice())
    setIsFromEmbed(isOpenedFromEmbed())

    // If this page was opened from an embed, mark it as such
    if (window.location.search.includes("from=embed")) {
      markAsOpenedFromEmbed()
    }
  }, [])

  // Don't show the button if we're already in a new tab opened from an embed
  if (isFromEmbed) {
    return null
  }

  // Only show the button if we're in an embed
  if (!isInEmbed) {
    return null
  }

  const handleClick = () => {
    openInNewTab()
  }

  return (
    <Button
      onClick={handleClick}
      className="absolute right-2 top-14 z-[1000] h-8 w-8 rounded-full bg-white/90 p-0 text-slate-800 shadow-md hover:bg-white"
      size="sm"
      aria-label="Open in new tab"
    >
      <ExternalLink className="h-4 w-4" />
    </Button>
  )
}

// Custom Zoom Control Component
function CustomZoomControl() {
  const map = useMap()

  const handleZoomIn = () => {
    map.zoomIn()
  }

  const handleZoomOut = () => {
    map.zoomOut()
  }

  return (
    <div className="absolute bottom-20 right-2 z-[1000] flex flex-col gap-2">
      <Button
        onClick={handleZoomIn}
        className="h-8 w-8 rounded-full bg-white/90 p-0 text-slate-800 shadow-md hover:bg-white"
        size="sm"
        aria-label="Zoom in"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button
        onClick={handleZoomOut}
        className="h-8 w-8 rounded-full bg-white/90 p-0 text-slate-800 shadow-md hover:bg-white"
        size="sm"
        aria-label="Zoom out"
      >
        <Minus className="h-4 w-4" />
      </Button>
    </div>
  )
}

// User Location Component
function UserLocationMarker({ position }: { position: [number, number] | null }) {
  if (!position) return null

  // Create a custom icon for the user location
  const userIcon = L.divIcon({
    className: "user-location-marker",
    html: `
      <div class="relative" role="img" aria-label="Your location">
        <div class="absolute -left-2 -top-2 h-4 w-4 rounded-full bg-blue-500 opacity-30 animate-ping"></div>
        <div class="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-blue-500"></div>
      </div>
    `,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  })

  return <Marker position={position} icon={userIcon} />
}

// Location Button Component
function LocationButton({
  translations,
  onLocationFound,
}: {
  translations: Translations
  onLocationFound: (position: [number, number]) => void
}) {
  const map = useMap()
  const [loading, setLoading] = useState(false)
  const [isInEmbed, setIsInEmbed] = useState(false)

  useEffect(() => {
    setIsInEmbed(isEmbedded())
  }, [])

  // Hide the location button when in an iframe to prevent permission issues
  if (isInEmbed) {
    return null
  }

  const handleClick = () => {
    setLoading(true)

    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: translations.errors.locationNotSupported,
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const userLocation: [number, number] = [latitude, longitude]

        // Check if the user's location is within Riga bounds
        const userLatLng = L.latLng(latitude, longitude)
        const bounds = L.latLngBounds(RIGA_BOUNDS)

        if (bounds.contains(userLatLng)) {
          map.flyTo(userLocation, 15)
          onLocationFound(userLocation)
        } else {
          // If user is outside Riga, just center on Riga
          toast({
            title: "Outside Riga",
            description: translations.errors.outsideRiga,
          })
          map.flyTo([56.9496, 24.1052], 13)
        }

        setLoading(false)
      },
      (error) => {
        let message = "Failed to get your location"

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = translations.errors.locationDenied
            break
          case error.POSITION_UNAVAILABLE:
            message = translations.errors.locationUnavailable
            break
          case error.TIMEOUT:
            message = translations.errors.locationTimeout
            break
        }

        toast({
          title: "Location Error",
          description: message,
          variant: "destructive",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })

        setLoading(false)
      },
    )
  }

  return (
    <Button
      onClick={handleClick}
      className="absolute bottom-2 right-2 z-[1000] h-8 w-8 rounded-full bg-white/90 p-0 text-slate-800 shadow-md hover:bg-white"
      disabled={loading}
      size="sm"
      aria-label={translations.controls.myLocation}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Compass className="h-4 w-4" />}
    </Button>
  )
}

// Map Boundary Control Component
function MapBoundaryControl() {
  const map = useMap()

  useEffect(() => {
    // Set max bounds to restrict panning
    map.setMaxBounds(RIGA_BOUNDS)

    // Handle when user tries to pan outside bounds
    map.on("drag", () => {
      map.panInsideBounds(RIGA_BOUNDS, { animate: false })
    })

    // Set min/max zoom levels
    map.setMinZoom(11) // Prevent zooming out too far
    map.setMaxZoom(18)

    return () => {
      map.off("drag")
    }
  }, [map])

  return null
}

// Map UI Controls Component
function MapUIControls({
  visibleLayers,
  language,
  selectedDistance,
  onLanguageChange,
  onDistanceChange,
  onToggleLayer,
  translations,
  onLocationFound,
}: {
  visibleLayers: VisibleLayers
  language: Language
  selectedDistance: RouteDistance
  onLanguageChange: (language: Language) => void
  onDistanceChange: (distance: RouteDistance) => void
  onToggleLayer: (layer: keyof VisibleLayers) => void
  translations: Translations
  onLocationFound: (position: [number, number]) => void
}) {
  return (
    <>
      {/* Map Controls */}
      <MapControls
        visibleLayers={visibleLayers}
        onToggleLayer={onToggleLayer}
        language={language}
        onLanguageChange={onLanguageChange}
        selectedDistance={selectedDistance}
        onDistanceChange={onDistanceChange}
        translations={translations}
      />

      {/* External Link Button (replaces Fullscreen in embedded mode) */}
      <ExternalLinkButton />

      {/* Custom Zoom Controls */}
      <CustomZoomControl />

      {/* Location Button */}
      <LocationButton translations={translations} onLocationFound={onLocationFound} />
    </>
  )
}

export default function MapComponent({
  visibleLayers,
  language,
  selectedDistance,
  onLanguageChange,
  onDistanceChange,
  onToggleLayer,
  translations,
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [kmlUrl, setKmlUrl] = useState<string>("")
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  // Update KML URL when language or distance changes
  useEffect(() => {
    setKmlUrl(getKmlUrl(language, selectedDistance))
  }, [language, selectedDistance])

  // Only run on client side
  useEffect(() => {
    setIsClient(true)
    fixLeafletIcon()
  }, [])

  // Handle Leaflet classList error
  useEffect(() => {
    // Fix for Leaflet's classList issue
    if (isClient) {
      const originalInitTile = (L.GridLayer.prototype as any)._initTile
      if (originalInitTile) {
        L.GridLayer.include({
          _initTile: function (tile: HTMLElement) {
            originalInitTile.call(this, tile)

            const tileSize = this.getTileSize()
            tile.style.width = tileSize.x + "px"
            tile.style.height = tileSize.y + "px"
          },
        })
      }
    }
  }, [isClient])

  const handleLocationFound = (position: [number, number]) => {
    setUserLocation(position)
  }

  if (!isClient) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  // Update the MapContainer to fix ARIA issues
  return (
    <div className="h-full w-full" aria-hidden="false">
      <MapContainer
        center={[56.9496, 24.1052]} // Center on Riga
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
        zoomControl={false} // We'll use our custom zoom control
        attributionControl={false} // Hide attribution for more space
        whenCreated={(map) => {
          mapRef.current = map
        }}
        // Add ARIA attributes for accessibility
        aria-label="Interactive map of Riga Marathon routes and points of interest"
        role="application"
      >
        {/* Clean, minimal tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* KML Layer with Riga Marathon POIs */}
        {kmlUrl && (
          <KMLLayer
            url={kmlUrl}
            showRoutes={visibleLayers.routes}
            showZones={visibleLayers.zones}
            showPOIs={visibleLayers.pois}
          />
        )}

        {/* User Location Marker */}
        <UserLocationMarker position={userLocation} />

        {/* Controls */}
        <MapUIControls
          visibleLayers={visibleLayers}
          language={language}
          selectedDistance={selectedDistance}
          onLanguageChange={onLanguageChange}
          onDistanceChange={onDistanceChange}
          onToggleLayer={onToggleLayer}
          translations={translations}
          onLocationFound={handleLocationFound}
        />
        <MapBoundaryControl />
      </MapContainer>
    </div>
  )
}
