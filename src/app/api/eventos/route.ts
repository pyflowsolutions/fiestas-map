import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tipo = searchParams.get('tipo')
  const ciudad = searchParams.get('ciudad')
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const radioKm = searchParams.get('radio') ?? '50'

  const supabase = await createClient()
  let query = supabase
    .from('eventos')
    .select('*')
    .gte('fecha_inicio', new Date().toISOString())
    .order('fecha_inicio', { ascending: true })
    .limit(500)

  if (tipo && tipo !== 'todos') query = query.eq('tipo', tipo)
  if (ciudad) query = query.ilike('ciudad', `%${ciudad}%`)

  // Búsqueda por radio usando PostGIS
  if (lat && lng) {
    query = query.rpc('eventos_cercanos', {
      lat: parseFloat(lat), lng: parseFloat(lng), radio_km: parseFloat(radioKm)
    })
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  const { data, error } = await supabase
    .from('eventos')
    .insert({ ...body, creado_por: user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}