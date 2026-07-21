import { supabase } from './client';

// Serve a mock/proxy of supabase for the server-side as well
export const supabaseAdmin = supabase;
export default supabaseAdmin;
