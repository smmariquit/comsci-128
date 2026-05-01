import type { Metadata } from "next";
import UsersFilterTableWrapper from "@/app/components/admin/user/userfilter_table_wrapper";
import { userData } from "@/lib/data/user-data";
import { applicationData } from "@/app/lib/data/application-data";
import ApplicationTabs from "@/app/components/admin/user/approval_table_wrapper";
import PageTabs from "@/app/components/admin/user/user_tabs";

export const metadata: Metadata = { title: "User Management" };

export default async function UsersPage() {
  const managedHousingIds = [3, 12, 13, 14, 16, 18]; // temporary — no auth yet

  const [liveUsers] = await Promise.all([
    userData.getUsersForHousingAdmin(managedHousingIds),
  ]);

  const liveApplications = await applicationData.getApplicationsForApproval(managedHousingIds);

  return (
    <div className="flex flex-col gap-4 p-6 font-sans">
      <PageTabs
        usersContent={
          <UsersFilterTableWrapper liveUsers={liveUsers} liveApplications={[]} />
        }
        applicationsContent={
          <ApplicationTabs liveApplications={liveApplications} />
        }
      />
    </div>
  );
}
