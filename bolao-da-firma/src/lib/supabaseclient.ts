import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("VITE_SUPABASE_URL is missing or undefined. Check your .env.local file and restart the Vite server.");
}

if (!supabaseAnonKey) {
  throw new Error("VITE_SUPABASE_ANON_KEY is missing or undefined. Check your .env.local file and restart the Vite server.");
}

// Strip trailing slashes just in case
const cleanUrl = supabaseUrl.replace(/\/$/, '');

export const supabase = createClient(cleanUrl, supabaseAnonKey);