import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

// Update the metadata for better SEO
export const metadata: Metadata = {
  title: "Rimi Riga Marathon 2025 Map",
  description:
    "Interactive map for the Rimi Riga Marathon 2025. Explore routes, points of interest, and key locations around Riga during the marathon event.",
  keywords: "Riga Marathon, Rimi Riga Marathon 2025, marathon map, Riga running routes, marathon points of interest",
  authors: [{ name: "Rimi Riga Marathon" }],
  openGraph: {
    title: "Rimi Riga Marathon 2025 Interactive Map",
    description: "Explore the routes and points of interest for the Rimi Riga Marathon 2025 in Riga, Latvia.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rimi Riga Marathon 2025 Map",
    description: "Interactive map for the Rimi Riga Marathon 2025 routes and points of interest.",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="https://rimirigamarathon.com/wp-content/themes/maratons2020/assets/images/misc/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="https://rimirigamarathon.com/wp-content/themes/maratons2020/assets/images/misc/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="https://rimirigamarathon.com/wp-content/themes/maratons2020/assets/images/misc/favicon-16x16.png"
        />
        <link
          rel="manifest"
          href="https://rimirigamarathon.com/wp-content/themes/maratons2020/assets/images/misc/site.webmanifest"
        />
        <link
          rel="mask-icon"
          href="https://rimirigamarathon.com/wp-content/themes/maratons2020/assets/images/misc/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <link
          rel="shortcut icon"
          href="https://rimirigamarathon.com/wp-content/themes/maratons2020/assets/images/misc/favicon.ico"
        />
        <meta name="msapplication-TileColor" content="#dc2923" />
        <meta
          name="msapplication-config"
          content="https://rimirigamarathon.com/wp-content/themes/maratons2020/assets/images/misc/browserconfig.xml"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}


import './globals.css'