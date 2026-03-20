
import { createClient } from '@supabase/supabase-js';

// Config: Prefer environment variables, fallback to placeholders (update these!)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://uysvjlvoqtqjteuyanrh.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_gCTtnv-NSRVsRkF0s1RN1Q_zizlRWQ5';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
