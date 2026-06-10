import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppProvider } from "@/components/app-provider"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: "Area Agenti | Officina.tech",
  description:
    "Portale vendite e CRM per agenti commerciali Officina.tech: gestione clienti, analisi SEO e social, pipeline e proposte.",
}

export const viewport: Viewport = {
  themeColor: "#17212b",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" className={`bg-background ${inter.className}`}>
      <body className="bg-background text-foreground antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
