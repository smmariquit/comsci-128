import Image from "next/image";
import Link from "next/link";
import { userData } from "@/app/lib/data/user-data";

export default async function DashboardPage() {
    const currUser = await userData.findById(30);
    const cards = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        name: `Housing ${i + 1}`,
    }));

	return (
        
        <div
            style={{
                width: "100%",
                minHeight: "100%",
                background: "#EDE9DE",
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
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
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

            {/*  */}
            <div style={{ padding: 24, background: "#EDE9DE" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                    {cards.map((card) => (
                        <div key={card.id} style={{ background: "white", borderRadius: 12, overflow: "hidden" }}>
                            <Image
                                src="/assets/placeholders/housing-414x264.svg"
                                alt={`${card.name} placeholder image`}
                                width={414}
                                height={264}
                                style={{ width: "100%", height: "auto", display: "block" }}
                            />
                            <div style={{ background: "#1C2632", padding: "10px 14px", color: "#C9642A", fontSize: 22, fontFamily: "DM Sans", fontWeight: "600" }}>
                                {card.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
