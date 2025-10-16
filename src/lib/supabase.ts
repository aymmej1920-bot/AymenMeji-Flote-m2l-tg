import { supabase } from '@/integrations/supabase/client'; // Import from new client file

export { supabase };
export const auth = supabase.auth; // Export auth object