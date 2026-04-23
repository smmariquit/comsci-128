import Image from "next/image";
import SearchBar from "./_components/SearchBar";
import StudentNavBar from "@/app/(main)/student/_components/StudentNavBar";
import HousingCards from "./_components/HousingCards";
import { userData } from "@/app/lib/data/user-data";
import { getAllAvailableDorms } from "@/app/lib/data/student-browse";

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
    }));

    return (

        <div
            style={{
                width: "100%",
                minHeight: "100%",
                background: "#1C2632",
                display: "inline-flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "stretch",
            }}
        >
            <StudentNavBar
                path={"Housing Browser"}
                userId={currUser?.account_number}
            />

            <SearchBar />

            {/* HOUSING CARDS CONTAINER */}
            <div className="mx-auto w-[90vw] flex-1 bg-[#EDE9DE] p-6">
                <HousingCards cards={cards} />
            </div>
        </div>
    );
}
