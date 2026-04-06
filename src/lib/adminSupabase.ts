import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL ?? ''
const serviceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY ?? ''

export const adminSupabase = serviceKey ? createClient(url, serviceKey) : null
