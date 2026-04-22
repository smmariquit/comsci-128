import type { Metadata } from "next";
import UsersFilterTableWrapper from "@/app/components/admin/user/userfilter_table_wrapper";

export const metadata: Metadata = {
  title: "User Management",
};
import { userData } from "@/lib/data/user-data";

export default async function UsersPage() {
  const managedHousingIds = [3, 12, 13, 14, 16, 18]; //Temporary since no auth yet

  const liveUsers = await userData.getUsersForHousingAdmin(managedHousingIds);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 16,
      padding: "24px",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <UsersFilterTableWrapper liveUsers={liveUsers} />
    </div>
  );
}
