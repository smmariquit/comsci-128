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

export function getComputedNotifications(application: any, billing: any[]) {
    const notifications = [];
    if (application) {
        if (application.application_status === "Approved") {
            notifications.push({
                id: `app-${application.application_id}`,
                type: "SUCCESS",
                title: "Application Approved",
                message: `Congrats! Your application for ${application.room?.housing?.housing_name || 'housing'} has been approved.`,
                created_at: application.updated_at || new Date().toISOString()
            });
        } else if (application.application_status === "Rejected") {
            notifications.push({
                id: `app-${application.application_id}`,
                type: "ERROR",
                title: "Application Rejected",
                message: "Unfortunately, your housing application was not approved at this time.",
                created_at: application.updated_at || new Date().toISOString()
            });
        }
    }

    const unpaidBills = billing.filter(b => b.status === "Unpaid");
    unpaidBills.forEach(bill => {
        notifications.push({
            id: `bill-${bill.transaction_id}`,
            type: "WARNING",
            title: "Pending Payment",
            message: `You have an outstanding ${bill.bill_type} bill of ₱${bill.amount}.`,
            created_at: bill.issue_date
        });
    });

    return notifications.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
}

export async function getCompleteDashboardData(studentAccountNumber: number) {
    try {
        const [application, billing] = await Promise.all([
            getStudentApplicationStatus(studentAccountNumber),
            getStudentBillingHistory(studentAccountNumber)
        ]);

        const steps = getApplicationSteps(application);
        
        const notifications = getComputedNotifications(application, billing);

        return {
            application,
            billing,
            notifications,
            steps
        };
    } catch (error) {
        console.error("Error in getCompleteDashboardData:", error);
        throw error;
    }
}