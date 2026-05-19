import Link from "next/link";
import { Check } from "lucide-react";
import StudentBillingHistory from "@/app/components/student/StudentBillingHistory";

export default function NotAssignedDashboard(
  userName: String,
  dashboardData: Object,
) {
  const userHousingDetails = dashboardData as any;
  const application = userHousingDetails?.application;
  const housing = application?.room?.housing;
  const notifications = Array.isArray(userHousingDetails?.notifications)
    ? userHousingDetails.notifications
    : [];
  const billing = Array.isArray(userHousingDetails?.billing)
    ? userHousingDetails.billing
    : [];
  const steps = Array.isArray(userHousingDetails?.steps)
    ? userHousingDetails.steps
    : [];
  const history = Array.isArray(userHousingDetails?.history)
    ? userHousingDetails.history
    : [];
  const unpaidBills = billing.filter(
    (bill: any) => bill.status === "Unpaid" || bill.status === "Pending",
  );
  const status = application?.application_status || "No active applications";

  const isTransient = (() => {
    if (!application?.expected_moveout_date || !application?.created_at) return false;
    const start = new Date(application.created_at);
    const end = new Date(application.expected_moveout_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  })();

  const completedSteps = steps.filter((step: any) => step.isDone).length;
  const stepLabels = steps.length
    ? steps.map((step: any) => step.label)
    : ["Dorm Chosen", "Application Submitted", "Manager Review", "Room Assigned"];

  const card =
    "w-full rounded-2xl border border-[#d9d2c4] bg-white/90 shadow-sm";
  const cardHeader =
    "flex items-center justify-between px-5 py-3 border-b border-[#e3d8c9]";
  const cardTitle = "text-sm font-semibold text-[#1C2632]";
  const label = "text-xs uppercase tracking-wide text-[#567375] font-semibold";
  const value = "text-sm text-[#111820]";

  const stepTone = (index: number, done: boolean) => {
    if (done) return "bg-[#8b3e15] text-white border-[#8b3e15]";
    if (index === completedSteps) return "bg-[#f1e4d7] text-[#8b3e15] border-[#d7c4b4] ring-2 ring-[#8b3e15]/20";
    return "bg-[#fcfcfb] text-[#a0abac] border-dashed border-[#d9d2c4]";
  };

  return (
    <div className="w-full flex-1 flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className={card}>
          <div className={cardHeader}>
            <h2 className={cardTitle}>Status Overview</h2>
            <div className="flex items-center gap-2">
              {isTransient && (
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold uppercase tracking-wide border border-purple-200 shadow-sm animate-pulse">
                  ⚡ Transient Guest
                </span>
              )}
              <span className="text-xs text-[#567375]">{status}</span>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-semibold text-[#1C2632]">Welcome, {userName}</span>
              <span className="text-xs text-[#567375]">
                {unpaidBills.length} pending bill{unpaidBills.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="relative">
              <div className="absolute left-6 right-6 top-5 h-px bg-[#d9d2c4]" aria-hidden="true" />
              <div className="grid grid-cols-4 gap-2">
                {stepLabels.map((labelText: string, index: number) => {
                  const done = index < completedSteps;
                  const isActive = index === completedSteps && !done;
                  return (
                    <div key={labelText} className="relative flex flex-col items-center gap-2 text-center">
                      <div
                        className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border shadow-sm ${stepTone(
                          index,
                          done,
                        )}`}
                      >
                        {done ? (
                          <Check className="h-4.5 w-4.5 stroke-[3]" />
                        ) : (
                          <span className={`text-[11px] font-bold ${isActive ? "text-[#8b3e15]" : "text-[#a0abac]"}`}>
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <div className={`text-[11px] font-semibold leading-tight ${done ? "text-[#1C2632]" : isActive ? "text-[#8b3e15] font-bold" : "text-[#a0abac]"}`}>
                        {labelText}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>


        <section className={card}>
          <div className={cardHeader}>
            <h2 className={cardTitle}>Application Details</h2>
          </div>
          <div className="p-5 space-y-4 max-h-[220px] overflow-y-auto divide-y divide-[#e3d8c9]/40">
            {history.filter((app: any) => app.application_status !== "Cancelled" && app.application_status !== "Rejected").length > 0 ? (
              history
                .filter((app: any) => app.application_status !== "Cancelled" && app.application_status !== "Rejected")
                .map((app: any, idx: number) => (
                  <div key={app.application_id} className={idx > 0 ? "pt-4" : ""}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1C2632] text-sm">
                        {app.housing_name || app.room?.housing?.housing_name || "Preferred Dormitory"}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#f1e4d7] text-[#8b3e15] text-[10px] font-bold uppercase tracking-wide border border-[#d7c4b4]">
                        {app.application_status || "Pending"}
                      </span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 mt-2">
                      <div>
                        <div className={label}>Room Preference</div>
                        <div className={value}>
                          {app.room?.room_type || "Standard Preferred Room"}
                        </div>
                      </div>
                      <div>
                        <div className={label}>Submitted On</div>
                        <div className={value}>
                          {new Date(app.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="rounded-xl border border-dashed border-[#d9d2c4] bg-[#f7f2e8] p-4 text-sm text-[#567375]">
                You have not submitted a housing application yet. Browse available
                housing to get started.
                <div className="mt-3">
                  <Link
                    href="/student/browse"
                    className="inline-flex items-center rounded-full bg-[#8b3e15] px-4 py-2 text-xs font-semibold text-white"
                  >
                    Browse housing
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className={card}>
          <div className={cardHeader}>
            <h2 className={cardTitle}>Updates</h2>
            <span className="text-xs text-[#567375]">
              {notifications.length} update{notifications.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="p-4 space-y-2">
            {notifications.length === 0 ? (
              <div className="text-sm text-[#567375]">
                No notifications yet.
              </div>
            ) : (
              notifications.slice(0, 2).map((note: any) => (
                <div
                  key={note.id}
                  className="rounded-xl border border-[#e6dccf] bg-[#f7f2e8] px-4 py-3"
                >
                  <div className="text-sm font-semibold text-[#1C2632]">
                    {note.title}
                  </div>
                  <div className="text-xs text-[#567375] mt-1 line-clamp-2">
                    {note.message}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className={card}>
          <div className={cardHeader}>
            <h2 className={cardTitle}>Billing Summary</h2>
            <span className="text-xs text-[#567375]">
              {unpaidBills.length} pending
            </span>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <div className={label}>Latest Bill</div>
                <div className={value}>
                  {billing[0]
                    ? `₱${billing[0].amount} • ${billing[0].bill_type}`
                    : "No bills yet"}
                </div>
                <div className="text-xs text-[#567375] mt-1">
                  {billing[0]?.due_date
                    ? `Due ${billing[0].due_date}`
                    : "Payment history will appear here."}
                </div>
              </div>
              <div>
                <div className={label}>Pending Balance</div>
                <div className={value}>
                  ₱{unpaidBills.reduce((sum: number, bill: any) => sum + (bill.amount || 0), 0)}
                </div>
                <div className="text-xs text-[#567375] mt-1">
                  {unpaidBills.length
                    ? "Settle pending balances to avoid delays."
                    : "All payments are up to date."}
                </div>
              </div>
            </div>

            <div className="border-t border-[#e3d8c9] pt-4">
              <h3 className="text-xs uppercase tracking-wide text-[#567375] font-semibold mb-3">Billing History</h3>
              <StudentBillingHistory billing={billing} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
