export type TipoEvento =
  | 'fiesta_patronal' | 'evento_publico' | 'fiesta_privada'
  | 'concierto' | 'feria' | 'festival' | 'otro'

export type Evento = {
  id: string
  titulo: string
  descripcion: string | null
  tipo: TipoEvento
  fecha_inicio: string
  fecha_fin: string | null
  direccion: string | null
  ciudad: string | null
  ubicacion: { type: 'Point'; coordinates: [number, number] }
  imagen_url: string | null
  creado_por: string | null
}

export const TIPOS_LABEL: Record<TipoEvento, string> = {
  fiesta_patronal: '🎊 Fiesta patronal',
  evento_publico: '🏛️ Evento público',
  fiesta_privada: '🔒 Fiesta privada',
  concierto: '🎵 Concierto',
  feria: '🎪 Feria',
  festival: '🎭 Festival',
  otro: '📌 Otro',
}