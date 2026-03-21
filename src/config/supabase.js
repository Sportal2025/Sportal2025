
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";

// Config: Resilient to both Vite (import.meta.env) and native browser contexts
const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
const SUPABASE_URL = env.VITE_SUPABASE_URL || 'https://uysvjlvoqtqjteuyanrh.supabase.co';
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_gCTtnv-NSRVsRkF0s1RN1Q_zizlRWQ5';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
