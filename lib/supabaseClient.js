import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kgqurezgrgpvgjgryerh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtncXVyZXpncmdwdmdqZ3J5ZXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NzcyMTMsImV4cCI6MjA2NjQ1MzIxM30.r-sg4dFDNlSR1_tj14t2dn6ek1EBx1YJHCsYT7m8K8M";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
