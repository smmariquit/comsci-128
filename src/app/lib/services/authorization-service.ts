import { supabase } from "@/app/lib/supabase";
import { AppAction, Permission, UserRole } from "@/models/permissions";

let permissionsCache: Permission[] | null = null;

async function getPermissions(): Promise<Permission[]> {
    if (permissionsCache) return permissionsCache; 

    const { data, error } = await supabase
        .from("permissions")
        .select("*");

    if (error) {
        console.error("Authorization: Error Fetching Permissions", error);
        return []
    }

    permissionsCache = data;
    return data;
        
}
