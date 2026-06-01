'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { TipoEvento } from '@/lib/types'

export default function CrearEvento() {
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({
    titulo: '', descripcion: '', tipo: 'fiesta_patronal' as TipoEvento,
    fecha_inicio: '', ciudad: '', direccion: '',
    lat: 40.4168, lng: -3.7038
  })
  const [err, setErr] = useState('')

  async function geocodificar(dir: string, ciudad: string) {
    const q = encodeURIComponent(`${dir}, ${ciudad}, España`)
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1`)
    const data = await res.json()
    if (data[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    const coords = await geocodificar(form.direccion, form.ciudad)
    if (!coords) { setErr('No se pudo geolocalizar la dirección.'); return }

    const res = await fetch('/api/eventos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: form.titulo,
        descripcion: form.descripcion,
        tipo: form.tipo,
        fecha_inicio: new Date(form.fecha_inicio).toISOString(),
        ciudad: form.ciudad,
        direccion: form.direccion,
        ubicacion: { type: 'Point', coordinates: [coords.lng, coords.lat] }
      })
    })
    if (!res.ok) {
      const { error } = await res.json()
      setErr(error ?? 'Error al crear')
      return
    }
    router.push('/')
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Crear evento</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input required placeholder="Título"
          className="w-full p-2 border rounded"
          value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} />
        <textarea placeholder="Descripción"
          className="w-full p-2 border rounded" rows={3}
          value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
        <select className="w-full p-2 border rounded"
          value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value as TipoEvento })}>
          <option value="fiesta_patronal">Fiesta patronal</option>
          <option value="evento_publico">Evento público</option>
          <option value="fiesta_privada">Fiesta privada</option>
          <option value="concierto">Concierto</option>
          <option value="feria">Feria</option>
          <option value="festival">Festival</option>
          <option value="otro">Otro</option>
        </select>
        <input required type="datetime-local"
          className="w-full p-2 border rounded"
          value={form.fecha_inicio} onChange={e => setForm({ ...form, fecha_inicio: e.target.value })} />
        <input placeholder="Ciudad" className="w-full p-2 border rounded"
          value={form.ciudad} onChange={e => setForm({ ...form, ciudad: e.target.value })} />
        <input placeholder="Dirección completa" className="w-full p-2 border rounded"
          value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} />
        {err && <p className="text-red-600">{err}</p>}
        <button className="w-full bg-rose-600 text-white p-2 rounded hover:bg-rose-700">
          Publicar
        </button>
      </form>
    </main>
  )
}