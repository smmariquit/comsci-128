import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import { userData } from "@/app/lib/data/user-data";
import { getAllAvailableDorms } from "@/app/lib/data/student-browse";

export default async function DashboardPage() {
    const currUser = await userData.findById(30);
    const allHousing = await getAllAvailableDorms();
    const cards = Array.from({ length: allHousing.length }, (_, i) => ({
        id: allHousing[i].housing_id,
        name: allHousing[i].housing_name,
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
            {/* NAV BAR */}
            <header className="flex h-[10vh] w-full max-w-[1440px] bg-[#1C2632] items-center justify-between px-10 text-m">

                <div className="flex items-center gap-8">
                    <h1 className="text-[#EDE9DE] text-xl font-semibold tracking-tight">Title</h1>

                    <nav className="flex items-center gap-6 border-l border-gray-700 pl-8 ">
                        <a href="/student/dashboard" className="text-[#EDE9DE]">Dashboard</a>
                        <a href="/student" className="text-[#EDE9DE] transition-colors">Accommodations</a>
                    </nav>
                </div>

                <div className="flex items-center gap-6">
                    <button className="text-[#EDE9DE]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>

                    <div className="h-8 w-8 aspect-square rounded-full bg-[#567375] cursor-pointer transition-all"></div>
                </div>

            </header>

            {/* BREAD CRUMBS */}
            <div className="flex flex-col bg-[#567375] px-[36px] py-[6px] justify-center">

                <div className="text-[#EDE9DE] text-[13px] font-sans font-regular">
                    Housing Browser
                </div>
            </div>

            <SearchBar />

            {/* HOUSING CARDS CONTAINER */}
            <div className="bg-[#EDE9DE] w-[90vw] p-6 mx-auto">
                {/* GRID LAYOUT */}
                <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
                    {cards.map((card) => (
                        <div
                            key={card.id}
                            className="overflow-hidden rounded-xl bg-white shadow-sm transition-transform hover:scale-[1.02]"
                        >
                            {/* IMAGE COMPONENT */}
                            <Image
                                src="/assets/placeholders/housing-414x264.svg"
                                alt={`${card.name} placeholder image`}
                                width={414}
                                height={264}
                                className="block h-auto w-full"
                            />

                            {/* CARD FOOTER / NAME */}
                            <div className="bg-[#1C2632] px-3.5 py-2.5 text-m font-semibold text-[#C9642A]">
                                {card.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
