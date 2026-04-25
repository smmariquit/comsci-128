import { supabase } from "@/app/lib/supabase";
import { AppAction, Permission, UserRole } from "@/models/permissions";

// memory caching to prevent multiple db calls
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

// checks if role is allowed to perform the action
export async function checkPermission (
    action: AppAction,
    role: UserRole,
): Promise<boolean> {
    const allPermissions = await getPermissions();

    const permissionRow = allPermissions.find((p) => p.action === action);

    if (!permissionRow) {
        console.warn(`Authorization: Permission Row Not Found "${action}"`);
        return false;
    }

    return !!permissionRow[role];
}

// error throwing for unauthorized actions
export async function validateAction(action: AppAction, role: UserRole) {
    const allowed = await checkPermission(action, role);

    if (!allowed) {
        throw new Error (`Unauthorized: Role "${role} does not have permission to perform "${action}}".`);
    }
}

async function getCurrentUserRole(): Promise<UserRole> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) return "public";

    const { data: user, error } = await supabase
        .from("user")
        .select("role")
        .eq("id", session.user.id)
        .single();
    
    if (error || !user) return "public"

    return user.role as UserRole;
}
