import Image from "next/image";
import SearchBar from "./_components/SearchBar";
import StudentNavBar from "@/app/(main)/student/_components/StudentNavBar";
import HousingCards from "./_components/HousingCards";
import { userData } from "@/app/lib/data/user-data";
import { getAllAvailableDorms } from "@/app/lib/data/student-browse";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Browse Housing",
    description: "Explore avaialble dormitories and hosuing options.",
}

export default async function DormBrowsePage({
    searchParams,
}: {
    searchParams: Promise<{ type?: string; sort?: string; search?: string }> | any;
}) {
    const currUser = await userData.findById(30);
    const params = await searchParams;

    // prepare filters
    const filters = {
        housing_type: params?.type as any,
        sort_by_price: params?.sort as any,
        search: params?.search as any,
    };

    // fetch from db
    let allHousing = await getAllAvailableDorms(filters);

    //get housing names to put on cards
    const cards = allHousing.map((item) => ({
        id: item.housing_id,
        name: item.housing_name,
        type: item.housing_type,
        price: item.rent_price,
    }));

    return (
        <div className="w-full min-h-screen bg-[#EDE9DE] flex flex-col">
            <StudentNavBar
                path={"Housing Browser"}
                userId={currUser?.account_number}
            />

            <SearchBar />

            {/* HOUSING CARDS CONTAINER */}
            <div className="w-full max-w-7xl mx-auto mt-4 md:mt-8 flex-1 bg-[#EDE9DE] p-6 md:p-10 rounded-t-[20px] font-[family-name:var(--font-geist-sans)] shadow-inner">
                <HousingCards cards={cards} />
            </div>
        </div>
    );
}
