import { supabase } from "@/app/lib/supabase";

export async function getStudentApplicationStatus(studentAccountNumber: number) {
    const { data, error } = await supabase
        .from("application")
        .select(`
            *,
            room:room_id (
                room_type,
                occupancy_status,
                housing:housing_id (
                    housing_name,
                    housing_address
                )
            )
        `)
        .eq("student_account_number", studentAccountNumber)
        .eq("is_deleted", false)
        .order("application_id", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) throw error;
    return data;
}

export function getApplicationSteps(application: any) {
    return [
        { label: "Profile Created", isDone: true },
        { label: "Application Submitted", isDone: !!application },
        { label: "Manager Review", isDone: application?.application_status === "Approved" },
        { label: "Room Assigned", isDone: !!application?.room_id },
    ];
}

export async function getStudentBillingHistory(studentAccountNumber: number) {
    const { data, error } = await supabase
        .from("bill") 
        .select(`
            transaction_id,
            amount,
            status,
            bill_type,
            due_date,
            issue_date,
            date_paid
        `) 
        .eq("student_account_number", studentAccountNumber)
        .order("issue_date", { ascending: false }); // Ordered by issue date for better UX

    if (error) throw error;
    return data;
}

// The main wrapper function your route.ts calls
export async function getCompleteDashboardData(studentAccountNumber: number) {
    try {
        const [application, billing] = await Promise.all([
            getStudentApplicationStatus(studentAccountNumber),
            getStudentBillingHistory(studentAccountNumber)
        ]);

        const steps = getApplicationSteps(application);

        return {
            application,
            billing,
            steps
        };
    } catch (error) {
        console.error("Error in getCompleteDashboardData:", error);
        throw error;
    }
}