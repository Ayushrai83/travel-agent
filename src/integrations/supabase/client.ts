// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xiikorjtnfagnzkglalu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpaWtvcmp0bmZhZ256a2dsYWx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1MTkwNzgsImV4cCI6MjA1NTA5NTA3OH0.KWCtddFGwCxHley_oeQLZb3r3QnCH7ylO3xWdTN7r28";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);