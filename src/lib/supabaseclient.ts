import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const cleanUrl = supabaseUrl ? supabaseUrl.replace(/\/$/, '') : 'https://missing-url.supabase.co';
const key = supabaseAnonKey || 'missing-key';

export const supabase = createClient(cleanUrl, key);