"use client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe, Layers, MapPin, Route, MapIcon } from "lucide-react"
import type { Language, Translations } from "@/lib/translations"
import type { RouteDistance } from "./layer-selector"

interface MapControlsProps {
  visibleLayers: {
    routes: boolean
    zones: boolean
    pois: boolean
  }
  onToggleLayer: (layer: keyof typeof visibleLayers) => void
  language: Language
  onLanguageChange: (language: Language) => void
  selectedDistance: RouteDistance
  onDistanceChange: (distance: RouteDistance) => void
  translations: Translations
}

export default function MapControls({
  visibleLayers,
  onToggleLayer,
  language,
  onLanguageChange,
  selectedDistance,
  onDistanceChange,
  translations,
}: MapControlsProps) {
  return (
    <div className="absolute left-0 right-0 top-0 z-[1000] flex items-center gap-2 overflow-x-auto bg-white/90 px-2 py-1 shadow-sm">
      {/* Distance Selector */}
      <DistanceSelector
        selectedDistance={selectedDistance}
        onDistanceChange={onDistanceChange}
        translations={translations}
      />

      {/* Layer Controls */}
      <LayerControls visibleLayers={visibleLayers} onToggleLayer={onToggleLayer} translations={translations} />

      {/* Language Switcher */}
      <LanguageSwitcher currentLanguage={language} onLanguageChange={onLanguageChange} />
    </div>
  )
}

// Distance Selector Component
function DistanceSelector({
  selectedDistance,
  onDistanceChange,
  translations,
}: {
  selectedDistance: RouteDistance
  onDistanceChange: (distance: RouteDistance) => void
  translations: Translations
}) {
  // Helper function to get the current distance label
  const getCurrentDistanceName = () => {
    switch (selectedDistance) {
      case "42km":
        return translations.layers.marathon.name
      case "21km":
        return translations.layers.halfMarathon.name
      case "10km":
        return translations.layers.tenK.name
      case "6km":
        return translations.layers.fiveK.name
      case "mile":
        return translations.layers.mile.name
      default:
        return translations.layers.marathon.name
    }
  }

  const currentName = getCurrentDistanceName()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2 px-3 text-sm">
          <MapPin className="h-3.5 w-3.5" />
          <span>{currentName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel>{translations.layers.title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DistanceMenuItem
          distance="42km"
          name={translations.layers.marathon.name}
          distanceText={translations.layers.marathon.distance}
          isSelected={selectedDistance === "42km"}
          onClick={() => onDistanceChange("42km")}
        />
        <DistanceMenuItem
          distance="21km"
          name={translations.layers.halfMarathon.name}
          distanceText={translations.layers.halfMarathon.distance}
          isSelected={selectedDistance === "21km"}
          onClick={() => onDistanceChange("21km")}
        />
        <DistanceMenuItem
          distance="10km"
          name={translations.layers.tenK.name}
          distanceText={translations.layers.tenK.distance}
          isSelected={selectedDistance === "10km"}
          onClick={() => onDistanceChange("10km")}
        />
        <DistanceMenuItem
          distance="6km"
          name={translations.layers.fiveK.name}
          distanceText={translations.layers.fiveK.distance}
          isSelected={selectedDistance === "6km"}
          onClick={() => onDistanceChange("6km")}
        />
        <DistanceMenuItem
          distance="mile"
          name={translations.layers.mile.name}
          distanceText={translations.layers.mile.distance}
          isSelected={selectedDistance === "mile"}
          onClick={() => onDistanceChange("mile")}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Distance Menu Item Component
function DistanceMenuItem({
  distance,
  name,
  distanceText,
  isSelected,
  onClick,
}: {
  distance: string
  name: string
  distanceText: string
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <DropdownMenuItem onClick={onClick} className={isSelected ? "bg-slate-100" : ""}>
      <div className="flex w-full items-center justify-between">
        <span>{name}</span>
        {distanceText && <span className="text-xs text-slate-500">{distanceText}</span>}
      </div>
    </DropdownMenuItem>
  )
}

// Layer Controls Component
function LayerControls({
  visibleLayers,
  onToggleLayer,
  translations,
}: {
  visibleLayers: {
    routes: boolean
    zones: boolean
    pois: boolean
  }
  onToggleLayer: (layer: keyof typeof visibleLayers) => void
  translations: Translations
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-3">
          <Layers className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel>Layers</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2" onSelect={(e) => e.preventDefault()}>
          <Checkbox
            id="routes-checkbox"
            checked={visibleLayers.routes}
            onCheckedChange={() => onToggleLayer("routes")}
          />
          <label
            htmlFor="routes-checkbox"
            className="flex w-full cursor-pointer items-center gap-2 text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <Route className="h-3.5 w-3.5" />
            {translations.controls.routes}
          </label>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2" onSelect={(e) => e.preventDefault()}>
          <Checkbox id="zones-checkbox" checked={visibleLayers.zones} onCheckedChange={() => onToggleLayer("zones")} />
          <label
            htmlFor="zones-checkbox"
            className="flex w-full cursor-pointer items-center gap-2 text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <MapIcon className="h-3.5 w-3.5" />
            {translations.controls.zones}
          </label>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2" onSelect={(e) => e.preventDefault()}>
          <Checkbox id="pois-checkbox" checked={visibleLayers.pois} onCheckedChange={() => onToggleLayer("pois")} />
          <label
            htmlFor="pois-checkbox"
            className="flex w-full cursor-pointer items-center gap-2 text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <MapPin className="h-3.5 w-3.5" />
            {translations.controls.pois}
          </label>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Language Switcher Component
function LanguageSwitcher({
  currentLanguage,
  onLanguageChange,
}: {
  currentLanguage: Language
  onLanguageChange: (language: Language) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 px-3">
          <Globe className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem
          className={currentLanguage === "en" ? "bg-slate-100" : ""}
          onClick={() => onLanguageChange("en")}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          className={currentLanguage === "lv" ? "bg-slate-100" : ""}
          onClick={() => onLanguageChange("lv")}
        >
          Latviešu
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
