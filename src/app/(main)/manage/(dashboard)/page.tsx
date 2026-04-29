import type { Metadata } from "next";
import { applicationService } from "@/app/lib/services/application-service";
import { housingService } from "@/app/lib/services/housing-service";
import { getRoomStats } from "@/app/lib/services/room-service";
import { billingService } from "@/app/lib/services/billing-service";
import { getManagerAccountNumber } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { auditLogService } from "@/app/lib/services/audit-log-service";
import DormsSection from "./DormsSection";
import Link from "next/link";

import { Home, FileCheck, FileX, Bed, UserCheck, Armchair} from 'lucide-react';


export const metadata: Metadata = {
  title: "Manager Dashboard",
  description: "Overview of properties, applications, and tenant activity for managed properties",
};

function GrossRevenueCard({ value }: { value: number }) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 flex flex-col justify-between h-full">
      <p className="text-3xl text-(--cream) uppercase tracking-widest">Gross Revenue</p>
      <div>
        <p className="text-6xl font-bold text-[var(--dark-orange)]">
          ₱{value.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
        </p>
        <p className="text-sm text-gray-400 mt-2">Total from paid bills</p>
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
    <div className="bg-[var(--cream)] py-3 px-6 rounded-lg flex items-center gap-4 border-t-4 border-[var(--dark-orange)] shadow-md">
      <IconComponent className="w-12 h-12 text-orange-800" strokeWidth={1.5} />
      <div className="flex flex-col justify-center">
        <p className="text-lg font-bold text-[var(--dark-blue)]">{value}</p>
        <p className="text-sm text-[var(--dark-orange)]">{label}</p>
      </div>
    </div>
  );
}

function DormCard({
  id,
  name,
  image,
  location,
}: {
  id: number;
  name: string;
  image: string;
  location: string;
}) {
  return (
    <Link href={`/manage/accommodations/${id}`}>
      <div className="relative h-84 rounded-xl overflow-hidden shadow cursor-pointer group border border-gray-800">
        <img
          src={image || "/assets/placeholders/housing-card.svg"}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute bottom-0 w-full bg-[var(--dark-blue)]/90 text-[var(--light-yellow)] p-2 text-center">
          <p className="font-bold leading-tight">{name}</p>
          <p className="text-xs opacity-90">{location}</p>
        </div>
      </div>
    </Link>
  );
}

function ActivityItem({ text }: { text: string }) {
  return (
    <div className="bg-gray-100 p-3 rounded text-sm text-gray-800">
      {text}
    </div>
  );
}

export default async function MgrDashboardPage() {
  const managerAccountNumber = await getManagerAccountNumber()

  if (!managerAccountNumber) {
    redirect("/unauthorized")
  }

  const [stats, roomStats, dorms, grossRevenue, logs] = await Promise.all([
    applicationService.getDashboardStats(managerAccountNumber),
    getRoomStats(managerAccountNumber),
    housingService.getAllHousing(),
    billingService.getGrossRevenue(managerAccountNumber ?? undefined),
    auditLogService.getRecentLogs()
  ])

  return (
    <div className="flex flex-col gap-10 text-[var(--dark-orange)] bg-[var(--cream)]">

      <section className="flex flex-col gap-6 p-6">
        <h1 className="text-2xl font-bold text-[var(--dark-blue)]">Manager Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="md:col-span-1">
            <GrossRevenueCard value={grossRevenue} />
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <StatCard label="Total Occupants" value={roomStats.totalOccupants} icon={UserCheck} />
            <StatCard label="New Applicants" value={stats.pending} icon={Home} />
            <StatCard label="Approved Applications" value={stats.approved} icon={FileCheck} />
            <StatCard label="Rejected Applications" value={stats.rejected} icon={FileX} />
            <StatCard label="Total Rooms" value={roomStats.totalRooms} icon={Bed} />
            <StatCard label="Vacant Rooms" value={roomStats.totalFreeRooms} icon={Armchair}/>
          </div>

        </div>
      </section>

      <section className="flex flex-col gap-4 p-6 bg-[var(--teal)]/70">
        <h2 className="text-3xl text-[var(--dark-blue)] font-extrabold"> Dorms Managed</h2>

        <DormsSection dorms={dorms ?? []} />

      </section>

      <section className="flex flex-col gap-4 px-6 pb-6">
        <h2 className="text-xl font-semibold text-[var(--dark-orange)]">Recent Activities</h2>
        <div className="flex flex-col gap-2">
          {logs.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent activity.</p>
          ) : (
            logs.map((log: any) => (
              <div
                key={log.audit_id}
                className="bg-gray-100 p-3 rounded text-sm text-gray-800 flex justify-between items-center border border-gray-300"
              >
                <span><span className="font-bold">{log.action_type}</span> — {log.audit_description ?? "No description"}</span>
                <span className="text-sm text-gray-110 shrink-0 ml-4">
                  {new Date(log.timestamp).toLocaleString("en-PH")}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  );
}