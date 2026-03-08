import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABSE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
