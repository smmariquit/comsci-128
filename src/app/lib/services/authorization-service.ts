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

export async function validateAction(action: AppAction, role: UserRole) {
    const allowed = await checkPermission(action, role);

    if (!allowed) {
        throw new Error (`Unauthorized: Role "${role} does not have permission to perform "${action}}".`);
    }
}
