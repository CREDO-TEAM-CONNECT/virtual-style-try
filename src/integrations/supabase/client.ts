
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kdjkytqmdedfneahlfqn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtkamt5dHFtZGVkZm5lYWhsZnFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5NTIxNzYsImV4cCI6MjA1NzUyODE3Nn0.W5nEN7Mc2_2wp6Hx7i6Lg9GXXzj4PV4xkCMliB0xd4s";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
