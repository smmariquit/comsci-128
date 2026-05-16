import { supabase } from "@/app/lib/supabase";

export async function getStudentNotifications(studentAccountNumber: number) {
    const { data, error } = await supabase
        .from("application")
        .select(`
            application_id,
            housing_name,
            application_status,
            created_at
        `)
        .eq("student_account_number", studentAccountNumber)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false })
        .limit(10);

    if (error) throw error;
    return data ?? [];
}