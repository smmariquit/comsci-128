// src/app/(main)/admin/users/page.tsx

import type { Metadata } from "next";
import ApplicationTabs from "@/app/components/admin/user/approval_table_wrapper";
import PageTabs from "@/app/components/admin/user/user_tabs";
import UsersFilterTableWrapper from "@/app/components/admin/user/userfilter_table_wrapper";
import StateMessage from "@/app/components/ui/state-message";
import { applicationData } from "@/app/lib/data/application-data";
import { userData } from "@/lib/data/user-data";

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
  } catch (_error) {
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
    <div className="flex flex-col gap-4 px-1 py-1 font-[family-name:'DM_Sans',sans-serif] sm:px-2 sm:py-2">
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
