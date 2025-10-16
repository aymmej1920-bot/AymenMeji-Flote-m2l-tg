import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is not set in environment variables. Please create a .env file at the root of your project.');
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is not set in environment variables. Please create a .env file at the root of your project.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const auth = supabase.auth; // Export auth object