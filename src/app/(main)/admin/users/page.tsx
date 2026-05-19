import type { Metadata } from "next";
import UsersFilterTableWrapper from "@/app/components/admin/user/userfilter_table_wrapper";
import { userData } from "@/lib/data/user-data";
import { applicationData } from "@/app/lib/data/application-data";
import ApplicationTabs from "@/app/components/admin/user/approval_table_wrapper";
import PageTabs from "@/app/components/admin/user/user_tabs";
import StateMessage from "@/app/components/ui/state-message";

export const metadata: Metadata = { title: "User Management" };

export default async function UsersPage() {
  const managedHousingIds = [3, 12, 13, 14, 16, 18]; // temporary — no auth yet

  let liveUsers: Awaited<ReturnType<typeof userData.getUsersForHousingAdmin>> =
    [];
  let liveApplications: Awaited<
    ReturnType<typeof applicationData.getApplicationsForApproval>
  > = [];

  try {
    [liveUsers] = await Promise.all([
      userData.getUsersForHousingAdmin(managedHousingIds),
    ]);
    liveApplications =
      await applicationData.getApplicationsForApproval(managedHousingIds);
  } catch (error) {
    return (
      <StateMessage
        variant="error"
        title="Unable to load users"
        description="Please try again in a moment."
      />
    );
  }

  if (liveUsers.length === 0 && liveApplications.length === 0) {
    return (
      <StateMessage
        title="No users or applications yet"
        description="Once users sign up or submit applications, they will appear here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6 font-sans">
      <PageTabs
        usersContent={
          <UsersFilterTableWrapper
            liveUsers={liveUsers}
            liveApplications={[]}
          />
        }
        applicationsContent={
          <ApplicationTabs liveApplications={liveApplications} />
        }
      />
    </div>
  );
}
