import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fiestas y Eventos - Mapa',
  description: 'Descubre fiestas patronales, eventos públicos y privados cerca de ti'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}