// Enhanced KML parser utility that extracts style information including icons
import { DOMParser } from "xmldom"
import * as toGeoJSON from "@tmcw/togeojson"

export async function parseKML(url: string) {
  try {
    const response = await fetch(url)
    const kmlText = await response.text()
    const parser = new DOMParser()
    const kml = parser.parseFromString(kmlText, "text/xml")

    // Convert KML to GeoJSON
    const geoJSON = toGeoJSON.kml(kml)

    // Process the GeoJSON to extract additional style information
    processStyles(kml, geoJSON)

    return geoJSON
  } catch (error) {
    console.error("Error parsing KML:", error)
    throw new Error("Failed to parse KML file")
  }
}

// Process KML styles and add them to GeoJSON properties
function processStyles(kml: Document, geoJSON: any) {
  // Extract all styles from the KML
  const styles: Record<string, any> = {}
  const styleElements = kml.getElementsByTagName("Style")
  const styleMaps = kml.getElementsByTagName("StyleMap")

  // Process each style element
  for (let i = 0; i < styleElements.length; i++) {
    const style = styleElements[i]
    const styleId = style.getAttribute("id")

    if (styleId) {
      // Create a style object
      styles[`#${styleId}`] = extractStyleProperties(style)
    }
  }

  // Process StyleMaps (which can reference other styles)
  for (let i = 0; i < styleMaps.length; i++) {
    const styleMap = styleMaps[i]
    const styleMapId = styleMap.getAttribute("id")

    if (styleMapId) {
      const pairs = styleMap.getElementsByTagName("Pair")
      for (let j = 0; j < pairs.length; j++) {
        const pair = pairs[j]
        const key = pair.getElementsByTagName("key")[0]?.textContent
        const styleUrl = pair.getElementsByTagName("styleUrl")[0]?.textContent

        // We're primarily interested in the normal style
        if (key === "normal" && styleUrl && styles[styleUrl]) {
          styles[`#${styleMapId}`] = { ...styles[styleUrl] }
        }
      }
    }
  }

  // Process each feature in the GeoJSON
  geoJSON.features.forEach((feature: any) => {
    // Initialize properties if not present
    if (!feature.properties) {
      feature.properties = {}
    }

    // Check if the feature has a styleUrl
    const styleUrl = feature.properties.styleUrl
    if (styleUrl && styles[styleUrl]) {
      // Apply the style properties to the feature
      Object.assign(feature.properties, styles[styleUrl])
    }

    // Extract icon URL from ExtendedData if present
    if (feature.properties.ExtendedData) {
      const extendedData = feature.properties.ExtendedData
      if (extendedData.Data) {
        extendedData.Data.forEach((data: any) => {
          if (data.name === "icon" && data.value) {
            feature.properties.icon = data.value
          }
        })
      }
    }
  })
}

// Extract style properties from a Style element
function extractStyleProperties(styleElement: Element): Record<string, any> {
  const properties: Record<string, any> = {}

  // Extract IconStyle
  const iconStyle = styleElement.getElementsByTagName("IconStyle")[0]
  if (iconStyle) {
    const icon = iconStyle.getElementsByTagName("Icon")[0]
    if (icon) {
      const href = icon.getElementsByTagName("href")[0]
      if (href && href.textContent) {
        properties.icon = href.textContent
      }
    }

    // Extract scale if present
    const scale = iconStyle.getElementsByTagName("scale")[0]
    if (scale && scale.textContent) {
      properties.iconScale = Number.parseFloat(scale.textContent)
    }
  }

  // Extract LineStyle
  const lineStyle = styleElement.getElementsByTagName("LineStyle")[0]
  if (lineStyle) {
    const color = lineStyle.getElementsByTagName("color")[0]
    if (color && color.textContent) {
      properties.stroke = kmlColorToHex(color.textContent)
      properties.strokeOpacity = kmlColorToOpacity(color.textContent)
    }

    const width = lineStyle.getElementsByTagName("width")[0]
    if (width && width.textContent) {
      properties.strokeWidth = Number.parseFloat(width.textContent)
    }
  }

  // Extract PolyStyle
  const polyStyle = styleElement.getElementsByTagName("PolyStyle")[0]
  if (polyStyle) {
    const color = polyStyle.getElementsByTagName("color")[0]
    if (color && color.textContent) {
      properties.fill = kmlColorToHex(color.textContent)
      properties.fillOpacity = kmlColorToOpacity(color.textContent)
    }
  }

  return properties
}

// Convert KML color format (aabbggrr) to hex color (#rrggbb)
function kmlColorToHex(kmlColor: string): string {
  if (kmlColor.length !== 8) return "#64748b" // Default color

  // KML colors are in format aabbggrr, we need to convert to #rrggbb
  const alpha = kmlColor.substring(0, 2)
  const blue = kmlColor.substring(2, 4)
  const green = kmlColor.substring(4, 6)
  const red = kmlColor.substring(6, 8)

  return `#${red}${green}${blue}`
}

// Extract opacity from KML color (first byte)
function kmlColorToOpacity(kmlColor: string): number {
  if (kmlColor.length !== 8) return 1.0 // Default opacity

  // First byte is alpha in hex (00-ff)
  const alpha = kmlColor.substring(0, 2)
  return Number.parseInt(alpha, 16) / 255
}
