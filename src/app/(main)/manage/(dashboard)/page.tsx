
import { applicationService } from "@/app/lib/services/application-service";
import { housingService } from "@/app/lib/services/housing-service";
import Link from "next/link";


function MainStatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gray-700 p-4 rounded-lg flex items-center gap-4">
      {/* pic placeholder*/}
      <div className="w-10 h-10 bg-white rounded"></div>

      <div>
        <p className="text-lg font-bold text-white">{value}</p>
        <p className="text-sm text-gray-300">{label}</p>
      </div>
    </div>
  );
}

function DormCard({
  id,
  name,
  location,
}: {
  id: number;
  name: string;
  location: string;
}) {
  return (
    <Link href={`/manage/accommodations/`}> {/* Specific dorm page to do */}
      <div className="bg-white p-4 rounded shadow hover:shadow-lg transition cursor-pointer">
        <h3 className="font-bold text-lg text-gray-800">{name}</h3>
        <p className="text-sm text-gray-600">{location}</p>
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

  const [stats, dorms] = await Promise.all([
    applicationService.getDashboardStats(),
    housingService.getAllHousing(),

  ])

  return (
    <div className="flex flex-col gap-10 text-[var(--dark-blue)]">


      <section className="flex flex-col gap-6 px-6">
        <h1 className="text-3xl font-bold">Manager Dashboard</h1>


        <MainStatCard label="Total Applicants" value={stats.total} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="New Applicants" value={stats.pending} />
          <StatCard label="Approved Applications" value={stats.approved} />
          <StatCard label="Rejected Applications" value={stats.rejected} />
        </div>
      </section>




      <section className="flex flex-col gap-4 p-6 bg-[var(--teal)]/30 ">
        <h2 className="text-xl font-semibold">Dorms Managed</h2>

        {/* filter */}
        <div className="bg-gray-200 h-10 rounded flex items-center px-3 text-sm text-gray-600">
          Filter (to be implemented)
        </div>


        {/* Dorm Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-2">

          {/* <DormCard id={1} name="Dorm A" location="Grove" />
          <DormCard id={2} name="Dorm B" location="Umali" />
          <DormCard id={3} name="Dorm C" location="Umali" />
          <DormCard id={4} name="Dorm D" location="Grove" /> */}

          {dorms && dorms.length > 0 ? (
            dorms.map((dorm) => (
              <DormCard
                key={dorm.housing_id}
                id={dorm.housing_id}
                name={dorm.housing_name}
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

        <div className="flex flex-col gap-2 p-4 border-orange-500">
          <ActivityItem text="Wen Ruohan applied to Dorm A" />
          <ActivityItem text="Wen Zhuliu was approved for Dorm B" />
          <ActivityItem text="Wen Chao was rejected for Dorm C" />
        </div>
      </section>

    </div>
  );
}