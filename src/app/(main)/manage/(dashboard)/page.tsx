import type { Metadata } from "next";
import { applicationService } from "@/app/lib/services/application-service";
import { housingService } from "@/app/lib/services/housing-service";
import { roomService } from "@/app/lib/services/room-service";
import { billingService } from "@/app/lib/services/billing-service";
import { getManagerAccountNumber } from "@/app/lib/auth";
import Link from "next/link";

import { Home, FileCheck, FileX, Bed, UserCheck, Armchair} from 'lucide-react';


export const metadata: Metadata = {
  title: "Manager Dashboard",
};

function GrossRevenueCard({ value }: { value: number }) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 flex flex-col justify-between h-full">
      <p className="text-sm text-(--cream) uppercase tracking-widest">Gross Revenue</p>
      <div>
        <p className="text-5xl font-bold text-[var(--dark-orange)]">
          ₱{value.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-gray-400 mt-2">Total from paid bills</p>
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
      <div className="relative h-64 rounded-xl overflow-hidden shadow cursor-pointer group">
        <img
          src={image || "/assets/placeholders/housing-card.svg"}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute bottom-0 w-full bg-[var(--dark-blue)]/60 text-[var(--light-yellow)] p-2 text-center">
          <p className="font-semibold leading-tight">{name}</p>
          <p className="text-xs opacity-80">{location}</p>
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

  const [stats, roomStats, dorms, grossRevenue] = await Promise.all([
    applicationService.getDashboardStats(),
    roomService.getRoomStats(),
    housingService.getAllHousing(),
    billingService.getGrossRevenue(managerAccountNumber ?? undefined),
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
        <h2 className="text-xl text-[var(--dark-blue)] font-semibold">Dorms Managed</h2>
        <div className="bg-gray-200 h-10 rounded flex items-center px-3 text-sm text-gray-600">
          Filter (to be implemented)
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 p-2">
          {dorms && dorms.length > 0 ? (
            dorms.map((dorm: any) => (
              <DormCard
                key={dorm.housing_id}
                id={dorm.housing_id}
                name={dorm.housing_name}
                image="/assets/placeholders/housing-card.svg"
                location={dorm.housing_address}
              />
            ))
          ) : (
            <p className="text-gray-500">No dorms found.</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-4 px-6">
        <h2 className="text-xl font-semibold text-[var(--dark-orange)]">Recent Activities</h2>
        <div className="flex flex-col gap-1 p-4 border-orange-500">
          <ActivityItem text="Wen Ruohan applied to Dorm A" />
          <ActivityItem text="Wen Zhuliu was approved for Dorm B" />
          <ActivityItem text="Wen Chao was rejected for Dorm C" />
        </div>
      </section>

    </div>
  );
}