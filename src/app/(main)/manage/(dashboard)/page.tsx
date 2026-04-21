
import { applicationService } from "@/app/lib/services/application-service";
import { housingService } from "@/app/lib/services/housing-service";
import { roomService } from "@/app/lib/services/room-service";
import Link from "next/link";


function MainStatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl min-h-80 flex flex-col justify-center">      
      <p className="text-sm text-[var(--cream)]">{label}</p>
      <p className="text-3xl font-bold text-[var(--dark-orange)]">{value}</p>
    </div>
  );
}

function StatCard({ 
  label, 
  value,
  icon,
}: { 
  label: string; 
  value: string | number;
  icon: string; 
}) {
  return (
    <div className="h-30 bg-[var(--cream)] py-3 px-6 rounded-lg flex items-center gap-4 border-t-4 border-[var(--dark-orange)] shadow-md">
      {/* pic placeholder*/}
       <img
        src={icon || "/assets/placeholders/housing-card.svg"}
        alt={label}
        className="w-12 h-12 object-contain flex-shrink-0"
      />

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
    <Link href={`/manage/accommodations/${id}`}> {/*to be modified when there is a specific dorm page*/}
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

  const [stats, roomStats, dorms] = await Promise.all([
    applicationService.getDashboardStats(),
    roomService.getRoomStats(),
    housingService.getAllHousing(),

  ])

  return (
    <div className="flex flex-col gap-10 text-[var(--dark-orange)] bg-[var(--cream)]">


      <section className="flex flex-col gap-6 p-6">

        <MainStatCard label="Gross Revenue" value={stats.total} />

        {/* placeholder for statistics*/} 

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="New Applicants" value={stats.pending} icon='/assets/placeholders/avatar-128x128.svg' />
          <StatCard label="Approved Applications" value={stats.approved} icon='/assets/placeholders/avatar-128x128.svg'/>
          <StatCard label="Rejected Applications" value={stats.rejected} icon='/assets/placeholders/avatar-128x128.svg'/>

          <StatCard label="Total Rooms" value={roomStats.totalRooms} icon='/assets/placeholders/avatar-128x128.svg'/>
          <StatCard label="Total Occupants" value={roomStats.totalOccupants} icon='/assets/placeholders/avatar-128x128.svg'/>
          <StatCard label="Vacant Rooms" value={roomStats.totalFreeRooms} icon='/assets/placeholders/avatar-128x128.svg'/>
        </div>

      </section>




      <section className="flex flex-col gap-4 p-6 bg-[var(--teal)]/70 ">
        <h2 className="text-xl text-[var(--dark-blue)] font-semibold">Dorms Managed</h2>

        {/* filter */}
        <div className="bg-gray-200 h-10 rounded flex items-center px-3 text-sm text-gray-600">
          Filter (to be implemented)
        </div>


        {/* Dorm Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 p-2">

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
                image={'/assets/placeholders/housing-card.svg'}
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
