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
    <div className="bg-gray-700 p-4 rounded-lg flex items-center gap-4 border-t-4 border-[var(--dark-orange)] shadow-md">
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
  image,
}: {
  id: number;
  name: string;
  image: string;
}) {
  return (
    <Link href={`/manage/accommodations`}> {/*to be modified when there is a specific dorm page*/}
      <div className="relative h-48 rounded-xl overflow-hidden shadow cursor-pointer group">

        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        <div className="absolute bottom-0 w-full bg-[var(--dark-blue)]/50 text-[var(--light-yellow)] p-2 text-center font-semibold">
          {name}
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




export default function MgrDashboardPage() {
  return (
    <div className="flex flex-col gap-10 text-[var(--dark-blue)]">


      <section className="flex flex-col gap-6 px-6">
        <h1 className="text-3xl font-bold">Manager Dashboard</h1>


        <MainStatCard label="Gross Revenue" value="1,245" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <StatCard label="Total Applicants" value="32" />
          <StatCard label="Total Rooms" value="120" />
          <StatCard label="Total Occupants" value="15" />
          <StatCard label="Total Free Slots" value="15" />
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
          <DormCard id={1} name="Dorm A" image="/placeholders/housing-414x264.svg" />
          <DormCard id={2} name="Dorm B" image="/placeholders/housing-414x264.svg" />
          <DormCard id={3} name="Dorm C" image="/placeholders/housing-414x264.svg" />
          <DormCard id={4} name="Dorm D" image="/placeholders/housing-414x264.svg" />
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