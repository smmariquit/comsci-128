import SearchBar from "./_components/SearchBar";
import StudentNavBar from "@/app/(main)/student/_components/StudentNavBar";
import BrowseContent from "./_components/BrowseContent";
import { userData } from "@/app/lib/data/user-data";
import { getAllAvailableDorms } from "@/app/lib/data/student-browse";
import type { Metadata } from "next";
import StateMessage from "@/app/components/ui/state-message";

export const metadata: Metadata = {
  title: "Browse Housing",
  description:
    "Explore available dormitories and housing options near UPLB campus.",
};

export default async function DormBrowsePage({
  searchParams,
}: {
  searchParams:
    | Promise<{ type?: string; sort?: string; search?: string }>
    | any;
}) {
  let currUser: Awaited<ReturnType<typeof userData.findById>> | null = null;
  let allHousing: Awaited<ReturnType<typeof getAllAvailableDorms>> = [];
  const params = await searchParams;

  try {
    currUser = await userData.findById(30);
  } catch (error) {
    console.error("Offline: Failed to fetch user data", error);
  }

  // prepare filters
  const filters = {
    housing_type: params?.type as any,
    sort_by_price: params?.sort as any,
    search: params?.search as any,
    sex: params?.sex as any,
  };

  // fetch from db
  try {
    allHousing = await getAllAvailableDorms(filters);
  } catch (error) {
    console.error("Offline: Failed to fetch housing catalog", error);
  }

  const cards = allHousing.map((item) => ({
    id: item.housing_id,
    name: item.housing_name,
    type: item.housing_type,
    price: item.rent_price,
    image: item.housing_image,
    lat: item.latitude ?? null,
    lng: item.longitude ?? null,
    // Amenities
    has_wifi: item.has_wifi ?? false,
    has_aircon: item.has_aircon ?? false,
    has_laundry: item.has_laundry ?? false,
    has_parking: item.has_parking ?? false,
    has_no_curfew: item.has_no_curfew ?? false,
    allows_visitors: item.allows_visitors ?? false,
    is_furnished: item.is_furnished ?? false,
    has_kitchen: item.has_kitchen ?? false,
    has_security: item.has_security ?? false,
    has_utilities_included: item.has_utilities_included ?? false,
  }));

  return (
    <div className="w-full min-h-screen bg-[var(--cream)] flex flex-col">
      <StudentNavBar
        path={"Housing Browser"}
        userId={currUser?.account_number}
      />

      <BrowseContent
        cards={cards}
        searchBar={<SearchBar />}
        emptyState={
          cards.length === 0 ? (
            <StateMessage
              title="No housing results"
              description="Try changing your filters or search query."
            />
          ) : null
        }
      />
    </div>
  );
}
