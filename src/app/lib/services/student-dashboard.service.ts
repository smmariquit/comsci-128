import * as DataLayer from "@/lib/data/student-dashboard";

export function getApplicationSteps(application: any) {
    return [
        { label: "Dorm Chosen", isDone: true },
        { label: "Application Submitted", isDone: !!application },
        { label: "Manager Review", isDone: application?.application_status === "Approved" },
        { label: "Room Assigned", isDone: !!application?.room_id },
    ];
}

export function getComputedNotifications(application: any, billing: any[]) {
    const notifications = [];
    if (application) {
        const status = application.application_status;
        if (status === "Approved") {
            notifications.push({
                id: `app-${application.application_id}`,
                type: "SUCCESS",
                title: "Application Approved",
                message: `Congrats! Your application for ${application.room?.housing?.housing_name || 'housing'} has been approved.`,
                created_at: application.updated_at || new Date().toISOString()
            });
        } else if (status === "Rejected") {
            notifications.push({
                id: `app-${application.application_id}`,
                type: "ERROR",
                title: "Application Rejected",
                message: "Unfortunately, your housing application was not approved at this time.",
                created_at: application.updated_at || new Date().toISOString()
            });
        }
    }

    billing.filter(b => b.status === "Unpaid").forEach(bill => {
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

/**
 * Coordinates all data needed for the student dashboard POV
 */
export async function getCompleteDashboardData(studentAccountNumber: number) {
    try {
        // Parallel fetching for performance
        const [application, billing, history] = await Promise.all([
            DataLayer.getStudentApplicationStatus(studentAccountNumber),
            DataLayer.getStudentBillingHistory(studentAccountNumber),
            DataLayer.getAccommodationHistory(studentAccountNumber)
        ]);

        return {
            application, // Current active application
            billing,     // Current billing records
            history,     // Added: List of all past and present applications
            notifications: getComputedNotifications(application, billing),
            steps: getApplicationSteps(application)
        };
    } catch (error) {
        console.error("Service Layer Error:", error);
        throw error;
    }
}

/**
 * Service to finalize a payment after a file has been uploaded
 */
export async function completePaymentProcess(transactionId: string, publicUrl: string) {
    // You can add validation here to ensure the transaction belongs to the user
    return await DataLayer.updateBillPaymentProof(transactionId, publicUrl);
}