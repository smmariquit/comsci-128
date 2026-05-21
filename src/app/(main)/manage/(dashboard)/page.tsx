import { Armchair, Bed, FileCheck, FileX, Home, UserCheck } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getManagerAccountNumber } from "@/app/lib/auth";
import { applicationService } from "@/app/lib/services/application-service";
import { auditLogService } from "@/app/lib/services/audit-log-service";
import { billingService } from "@/app/lib/services/billing-service";
import { housingService } from "@/app/lib/services/housing-service";
import { getRoomStats } from "@/app/lib/services/room-service";
import StateMessage from "@/app/components/ui/state-message";
import ExportButtonsClient from "./ExportButtonsClient";
import DormsSection from "./DormsSection";

export const metadata: Metadata = {
  title: "Manager Dashboard",
  description:
    "Overview of properties, applications, and tenant activity for managed properties",
};

function GrossRevenueCard({ value }: { value: number }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-[#1C2632] p-6 text-white shadow-[0_20px_40px_rgba(28,38,50,0.22)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(227,175,100,0.18),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(86,115,117,0.24),transparent_35%)]" />
      <div className="relative flex min-h-[260px] flex-col justify-between gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-white/70">
            Gross Revenue
          </p>
          <p className="mt-3 text-5xl font-semibold leading-tight text-[var(--dark-orange)] lg:text-6xl">
            ₱{value.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <p className="text-sm text-white/70">Total from paid bills</p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: IconComponent,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-[20px] border border-[#d8d0c2] bg-white/90 px-5 py-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3e7d5] text-[#8b3e15]">
          <IconComponent className="h-6 w-6" strokeWidth={1.8} />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-xl font-bold leading-none text-[var(--dark-blue)]">
            {value}
          </p>
          <p className="mt-1 text-sm text-[var(--dark-orange)]">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default async function MgrDashboardPage() {
  const managerAccountNumber = await getManagerAccountNumber();

  if (!managerAccountNumber) {
    redirect("/unauthorized");
  }

  let stats: Awaited<ReturnType<typeof applicationService.getDashboardStats>>;
  let roomStats: Awaited<ReturnType<typeof getRoomStats>>;
  let dorms: Awaited<ReturnType<typeof housingService.getAllHousingByManager>>;
  let grossRevenue: number;
  let logs: Array<Record<string, any>>;

  try {
    [stats, roomStats, dorms, grossRevenue, logs] = await Promise.all([
      applicationService.getDashboardStats(managerAccountNumber),
      getRoomStats(managerAccountNumber),
      housingService.getAllHousingByManager(managerAccountNumber),
      billingService.getGrossRevenue(managerAccountNumber ?? undefined),
      auditLogService.getRecentLogsByManager(managerAccountNumber),
    ]);
  } catch (_error) {
    return (
      <div className="flex h-full min-h-[60vh] w-full items-center justify-center p-6">
        <StateMessage
          variant="error"
          title="Unable to load dashboard"
          description="You appear to be offline or our servers are temporarily unreachable."
        />
      </div>
    );
  }

  const recentLogs = (logs || []).slice(0, 5);

  return (
    <div className="min-h-full bg-[var(--cream)] text-[var(--dark-orange)]">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-[var(--dark-blue)]">
              Manager Dashboard
            </h1>
          </div>
          <div className="self-start lg:self-auto">
            <ExportButtonsClient logs={logs ?? []} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_1.9fr]">
          <GrossRevenueCard value={grossRevenue} />

          <div className="grid grid-cols-2 gap-4">
            <StatCard
              label="Total Occupants"
              value={roomStats.totalOccupants}
              icon={UserCheck}
            />
            <StatCard
              label="New Applicants"
              value={stats.pending}
              icon={Home}
            />
            <StatCard
              label="Approved Applications"
              value={stats.approved}
              icon={FileCheck}
            />
            <StatCard
              label="Rejected Applications"
              value={stats.rejected}
              icon={FileX}
            />
            <StatCard
              label="Total Rooms"
              value={roomStats.totalRooms}
              icon={Bed}
            />
            <StatCard
              label="Rooms with vacancy"
              value={roomStats.totalFreeRooms}
              icon={Armchair}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-6 md:px-8">
        <div className="flex flex-col gap-4 mb-4">
          <h2 className="text-2xl font-bold text-[var(--dark-blue)]">
            Dorms Managed
          </h2>
        </div>
        <DormsSection dorms={dorms ?? []} />
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-8 md:px-8">
        <div className="rounded-[28px] border border-[#d8d0c2] bg-white/90 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[var(--dark-blue)]">
            Recent Activities
          </h2>
          <div className="mt-4 flex flex-col gap-2">
            {recentLogs.length === 0 ? (
              <p className="text-sm text-[#567375]">No recent activity.</p>
            ) : (
              recentLogs.map((log) => (
                <div
                  key={log.audit_id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-[#e4d9ca] bg-[#f7f2e8] p-3.5 text-sm text-[#111820]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="font-bold text-[#1C2632]">
                      {log.action_type}
                    </span>{" "}
                    — {log.audit_description ?? "No description"}
                  </span>
                  <span className="shrink-0 text-xs text-[#567375]">
                    {new Date(log.timestamp).toLocaleString("en-PH")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
