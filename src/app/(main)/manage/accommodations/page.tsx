import { applicationService } from "@/app/lib/services/application-service";
import { housingService } from "@/app/lib/services/housing-service";
import { roomService } from "@/app/lib/services/room-service";
import Link from "next/link";


function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col flex-1 items-center">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function AccommodationCard({
  id,
  name,
  image,
  details,
}: {
  id: number;
  name: string;
  image: string;
  details: {label: string; value: string | number} [];
}) {
  return (
    <Link href={`/manage/accommodations/1`}> {/* dummy link for a specific dorm*/}
      <div className="flex items-center gap-4 border rounded-lg p-4 text-white bg-black">

        {/* Image */}
        <div className="w-25 h-25 bg-gray-300 rounded">
          <img src={image} className="w-full h-full object-cover rounded" />
        </div>


        <div className="flex flex-col w-full ">

          {/* Name */}
          <div className="font-semibold mb-2">{name}</div>

          {/* Details */}
          <div className="flex w-full">
            {details.map((detail, index) => (
              <DetailItem
                key={index}
                label={detail.label}
                value={detail.value}
              />
            ))}
          </div>

        </div>
      </div>
    </Link>
  );
}





export default async function MgrAccommodationsPage() {

  return (
    <div className="flex flex-col gap-10 text-black bg-white py-12">

      <section className="flex flex-col gap-4 px-10">
        <h1 className="text-2xl font-semibold">Accommodations List</h1>

        {/* filter */}
        <div className="bg-gray-200 h-10 rounded flex items-center px-3 text-sm text-gray-600">
          Filter (to be implemented)
        </div>
      </section>

      <section className="flex flex-col gap-10 px-10">
        <AccommodationCard
          id={1}
          name="Cloud Recesses"
          image="/assets/placeholders/housing-card.svg"
          details={[
            { label: "Total Occupants", value: 10 },
            { label: "Free Slots", value: 0 },
          ]}
        ></AccommodationCard>

        <AccommodationCard
          id={2}
          name="Wen Camp"
          image="/assets/placeholders/housing-card.svg"
          details={[
            { label: "Total Occupants", value: 2 },
            { label: "Free Slots", value: 1 },
          ]}
        ></AccommodationCard>

        <AccommodationCard
          id={3}
          name="Yiling Burial Mounds"
          image="/assets/placeholders/housing-card.svg"
          details={[
            { label: "Total Occupants", value: 50 },
            { label: "Free Slots", value: 0 },
          ]}
        ></AccommodationCard>
      </section>

    </div>
  );
}