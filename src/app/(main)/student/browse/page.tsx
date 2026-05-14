import Image from "next/image";
import SearchBar from "./_components/SearchBar";
import StudentNavBar from "@/app/(main)/student/_components/StudentNavBar";
import HousingCards from "./_components/HousingCards";
import { userData } from "@/app/lib/data/user-data";
import { getAllAvailableDorms } from "@/app/lib/data/student-browse";
import type { Metadata } from "next";
import StateMessage from "@/app/components/ui/state-message";
import Pagination from "./_components/pagination";

export const metadata: Metadata = {
    title: "Browse Housing",
    description: "Explore available dormitories and housing options.",
};

export default async function DormBrowsePage({
    searchParams,
}: {
    searchParams: Promise<{ type?: string; sort?: string; search?: string }> | any;
}) {
    let currUser: Awaited<ReturnType<typeof userData.findById>> | null = null;
    let allHousing: Awaited<ReturnType<typeof getAllAvailableDorms>> = [];
    const params = await searchParams;

    try {
        currUser = await userData.findById(30);
    } catch (error) {
        return (
            <StateMessage
                variant="error"
                title="Unable to load housing"
                description="Please try again in a moment."
            />
        );
    }

    // prepare filters
    const filters = {
        housing_type: params?.type as any,
        sort_by_price: params?.sort as any,
        sort_by_application: params?.application as any,  
        search: params?.search as any,
    };

    // fetch from db
    try {
        allHousing = await getAllAvailableDorms(filters);
    } catch (error) {
        return (
            <StateMessage
                variant="error"
                title="Unable to load housing"
                description="Please try again in a moment."
            />
        );
    }

    // pagination
    const CARDS_PER_PAGE = 4;
    const currentPage = parseInt(params?.page || '1');
    const totalPages = Math.ceil(allHousing.length / CARDS_PER_PAGE);
    const start = (currentPage - 1) * CARDS_PER_PAGE;
    
    const cards = allHousing.slice(start, start + CARDS_PER_PAGE).map((item) => ({
        id: item.housing_id,
        name: item.housing_name,
        type: item.housing_type,
        price: item.rent_price,
    }));
    

    

    // //get housing names to put on cards
    // const cards = allHousing.map((item) => ({
    //     id: item.housing_id,
    //     name: item.housing_name,
    //     type: item.housing_type,
    //     price: item.rent_price,
    // }));

    return (
        <div className="w-full min-h-screen bg-[#EDE9DE] flex flex-col">
            <StudentNavBar
                path={"Housing Browser"}
                userId={currUser?.account_number}
            />

            <SearchBar />

            {/* HOUSING CARDS CONTAINER */}
            <div className="w-full max-w-7xl mx-auto mt-4 md:mt-8 flex-1 bg-[#EDE9DE] p-6 md:p-10 rounded-t-[20px] font-[family-name:var(--font-geist-sans)] shadow-inner">
                {cards.length === 0 ? (
                    <StateMessage
                        title="No housing results"
                        description="Try changing your filters or search query."
                    />
                ) : (
                    <>
                    <HousingCards cards={cards} />
                    <Pagination currentPage={currentPage} totalPages={totalPages} />
                </>
                    
                )}
            </div>
        </div>
    );
}
