import { supabase } from "@/app/lib/supabase";

export async function getHousingAdminDashboardData() {
    const { count: totalStudents } = await supabase
    .from("user")
    .select("*", { count: 'exact', head: true})
    .eq("is_deleted", false);
}