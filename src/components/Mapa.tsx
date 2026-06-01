'use client'
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Evento, TIPOS_LABEL } from '@/lib/types'

const COLORES: Record<string, string> = {
  fiesta_patronal: '#e11d48',
  evento_publico: '#2563eb',
  fiesta_privada: '#7c3aed',
  concierto: '#ea580c',
  feria: '#16a34a',
  festival: '#ca8a04',
  otro: '#64748b',
}

export default function Mapa({
  eventos, onMarkerClick
}: { eventos: Evento[]; onMarkerClick?: (e: Evento) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!ref.current || mapRef.current) return
    const map = L.map(ref.current).setView([40.4168, -3.7038], 6) // Madrid
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap', maxZoom: 19
    }).addTo(map)
    mapRef.current = map
    return () => { map.remove(); mapRef.current = null }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    // limpia marcadores previos
    map.eachLayer(l => { if (l instanceof L.Marker) map.removeLayer(l) })
    eventos.forEach(e => {
      const [lng, lat] = e.ubicacion.coordinates
      const color = COLORES[e.tipo] ?? '#64748b'
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background:${color};width:22px;height:22px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>`,
        iconSize: [22, 22], iconAnchor: [11, 11]
      })
      const marker = L.marker([lat, lng], { icon }).addTo(map)
      marker.bindPopup(`
        <strong>${e.titulo}</strong><br/>
        <small>${TIPOS_LABEL[e.tipo]}</small><br/>
        ${new Date(e.fecha_inicio).toLocaleDateString('es-ES')}<br/>
        ${e.ciudad ?? ''}
      `)
      if (onMarkerClick) marker.on('click', () => onMarkerClick(e))
    })
  }, [eventos, onMarkerClick])

  return <div ref={ref} className="w-full h-full min-h-[500px] z-0" />
}