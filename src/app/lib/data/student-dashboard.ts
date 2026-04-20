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
            date_paid,
            proof_of_payment_url
        `) 
        .eq("student_account_number", studentAccountNumber)
        .order("issue_date", { ascending: false });

    if (error) throw error;
    return data;
}

/**
 * Fetches all non-deleted applications to show history
 */
export async function getAccommodationHistory(studentAccountNumber: number) {
    const { data, error } = await supabase
        .from("application")
        .select(`
            application_id,
            application_status,
            created_at,
            room:room_id (
                room_type,
                housing:housing_id (housing_name)
            )
        `)
        .eq("student_account_number", studentAccountNumber)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}

/**
 * Links the uploaded proof of payment URL to a specific bill
 */
export async function updateBillPaymentProof(transactionId: string, publicUrl: string) {
    const { data, error } = await supabase
        .from("bill")
        .update({ 
            proof_of_payment_url: publicUrl, 
            status: "Pending", // Change from 'Unpaid' to 'Pending' for manager review
            date_paid: new Date().toISOString() 
        })
        .eq("transaction_id", transactionId)
        .select();

    if (error) throw error;
    return data;
}