'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Evento, TipoEvento, TIPOS_LABEL } from '@/lib/types'

const Mapa = dynamic(() => import('@/components/Mapa'), { ssr: false })

export default function Home() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [tipo, setTipo] = useState<string>('todos')
  const [ciudad, setCiudad] = useState('')
  const [loading, setLoading] = useState(true)

  async function cargar() {
    setLoading(true)
    const params = new URLSearchParams()
    if (tipo !== 'todos') params.set('tipo', tipo)
    if (ciudad) params.set('ciudad', ciudad)
    const res = await fetch(`/api/eventos?${params}`)
    const data = await res.json()
    setEventos(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { cargar() }, [tipo, ciudad])

  return (
    <main className="flex flex-col lg:flex-row h-screen">
      <aside className="lg:w-96 w-full p-4 overflow-y-auto border-r bg-white">
        <h1 className="text-2xl font-bold mb-4">🎉 Fiestas y Eventos</h1>

        <input
          type="text" placeholder="Ciudad..."
          value={ciudad} onChange={e => setCiudad(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        <select
          value={tipo} onChange={e => setTipo(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="todos">Todos los tipos</option>
          {Object.entries(TIPOS_LABEL).map(([k, v]) =>
            <option key={k} value={k}>{v}</option>)}
        </select>

        <Link href="/crear"
          className="block text-center bg-rose-600 text-white p-2 rounded mb-4 hover:bg-rose-700">
          + Añadir evento
        </Link>

        {loading ? <p>Cargando...</p> : (
          <div className="space-y-2">
            {eventos.length === 0 && <p className="text-gray-500">Sin eventos.</p>}
            {eventos.map(e => (
              <div key={e.id} className="p-3 border rounded hover:bg-gray-50 cursor-pointer"
                   onClick={() => {
                     // centrar en el mapa si quieres
                   }}>
                <div className="font-semibold">{e.titulo}</div>
                <div className="text-xs text-gray-600">{TIPOS_LABEL[e.tipo]}</div>
                <div className="text-sm">
                  {new Date(e.fecha_inicio).toLocaleDateString('es-ES')}
                  {e.ciudad && ` · ${e.ciudad}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>

      <div className="flex-1 relative">
        <Mapa eventos={eventos} />
      </div>
    </main>
  )
}