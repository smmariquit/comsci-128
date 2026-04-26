import { supabase } from "@/app/lib/supabase";
import { AppAction, Permission, UserRole } from "@/models/permissions";
import { createSupabaseServerClient } from "../server-client";

// memory caching to prevent multiple db calls
let permissionsCache: Permission[] | null = null;

async function getPermissions(): Promise<Permission[]> {
    if (permissionsCache) return permissionsCache; 

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("permissions")
        .select("*");

    // console.log("DB Fetch - Error:", error);
    // console.log("DB Fetch - Row Count:", data?.length);
    // console.log("DB Fetch - First Row:", data?.[0]);

    if (error) {
        console.error("Authorization: Error Fetching Permissions", error);
        return []
    }

    permissionsCache = data;
    return data; 
}

// error throwing for unauthorized actions
export async function validateAction(action: AppAction) {
    const role = await getCurrentUserRole();
    const allPermissions = await getPermissions();

    const permissionRow = allPermissions.find((p) => p.action === action);

    if (!permissionRow) {
        throw new Error (`Authorization: Permission Row Not Found "${action}"`);
    }

    const allowed = !!permissionRow[role];

    if (!allowed) {
        throw new Error (`Unauthorized: Role "${role} does not have permission to perform "${action}}".`);
    }

    const supabase = await createSupabaseServerClient();
    return { role, userId: (await supabase.auth.getUser()).data.user?.id };
}

export async function validateOwnership(landlordId: number | string) {
  const supabase = await createSupabaseServerClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Authentication Required!");
  }

  const role = await getCurrentUserRole();

  if (role == "system_admin") {
    return; // System admins bypass ownership checks
  }

  const accountNumber = user?.user_metadata?.account_number;

  if (!accountNumber) {
    throw new Error("Access Denied: Account information missing from session.");
  }

  if (Number(accountNumber) !== Number(landlordId)) {
    throw new Error("Access Denied: You do not own this property.");
  }
  
  console.log(`Ownership Verified: Account ${accountNumber} owns resource ${landlordId}`);
}

async function getCurrentUserRole(): Promise<UserRole> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const accountNumber = user?.user_metadata?.account_number;
    if (!accountNumber) return "public";

    const { data: userData } = await supabase
        .from("user")
        .select("user_type") 
        .eq("account_number", accountNumber)
        .single();
    
    if (!userData) return "public";

    const baseRole = userData.user_type?.toLowerCase();

    if (baseRole === "manager") {
        const { data: managerData } = await supabase
            .from("manager")
            .select("manager_type")
            .eq("account_number", accountNumber)
            .single();

        const subRole = managerData?.manager_type?.toLowerCase();

        if (subRole === "housing administrator" || subRole === "house admin") {
            return "housing_admin";
        }
        return "landlord";
    }

    return baseRole as UserRole;
}
