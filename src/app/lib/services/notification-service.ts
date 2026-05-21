import { createSupabaseServerClient } from "../server-client";

export type NotificationItem = {
  id: string;
  type: "application" | "complaint";
  title: string;
  description: string;
  timestamp: string;
  link: string;
  isRead: boolean;
};

export async function getManagerNotifications(
  managerAccountNumber: number,
): Promise<NotificationItem[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const notifications: NotificationItem[] = [];

    const { data: apps, error: appsError } = await supabase
      .from("application")
      .select(`
        application_id,
        housing_name,
        created_at,
        student:student_account_number (
          user:user!account_number (
            first_name,
            last_name
          )
        )
      `)
      .or(
        `landlord_account_number.eq.${managerAccountNumber},manager_account_number.eq.${managerAccountNumber}`,
      )
      .in("application_status", [
        "Pending Manager Approval",
        "Pending Admin Approval",
      ])
      .eq("is_deleted", false);

    if (appsError) {
      console.error(
        "Error fetching pending applications for notifications:",
        appsError,
      );
    } else if (apps) {
      for (const app of apps) {
        const student = app.student as any;
        const user = Array.isArray(student?.user)
          ? student.user[0]
          : student?.user;
        const name = user
          ? `${user.first_name} ${user.last_name}`
          : "A student";

        notifications.push({
          id: `app-${app.application_id}`,
          type: "application",
          title: "Pending Application",
          description: `${name} applied for ${app.housing_name || "accommodation"}.`,
          timestamp: (app as any).created_at || new Date().toISOString(),
          link: "/manage/applications",
          isRead: false,
        });
      }
    }

    const { data: complaints, error: complaintsError } = await supabase
      .from("feedback")
      .select(`
        id,
        subject,
        category,
        created_at,
        housing:involved_housing_id (
          housing_name
        )
      `)
      .eq("involved_manager_id", managerAccountNumber)
      .eq("status", "Pending");

    if (complaintsError) {
      console.error(
        "Error fetching pending complaints for notifications:",
        complaintsError,
      );
    } else if (complaints) {
      for (const complaint of complaints) {
        const housing = complaint.housing as any;
        const housingName = housing
          ? Array.isArray(housing)
            ? housing[0]?.housing_name
            : housing?.housing_name
          : "your property";

        notifications.push({
          id: `complaint-${complaint.id}`,
          type: "complaint",
          title: `New Complaint: ${complaint.category}`,
          description: `Regarding ${housingName}: ${complaint.subject}`,
          timestamp: complaint.created_at || new Date().toISOString(),
          link: "/manage/complaints",
          isRead: false,
        });
      }
    }

    return notifications.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  } catch (error) {
    console.error("Failed to fetch manager notifications:", error);
    return [];
  }
}

export const notificationService = {
  getManagerNotifications,
};
