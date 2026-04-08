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
        <div className="w-[1440px] h-[900px] inline-flex flex-col justify-start items-start overflow-hidden">
            <div className="w-[1440px] h-40 bg-white flex flex-col justify-start items-center">
                <div className="self-stretch h-28 px-4 bg-gray-500 inline-flex justify-between items-center overflow-hidden">
                    <div className="flex justify-start items-center overflow-hidden">
                        <div className="w-52 h-16 px-9 py-2.5 bg-white flex justify-start items-center">
                            <div className="justify-center text-gray-800 text-4xl font-semibold font-['DM_Sans']">Title</div>
                        </div>
                        <div className="flex justify-start items-center overflow-hidden">
                            <Link href={"/student"} className="self-stretch px-4 flex justify-start items-center">
                                <div className="justify-center text-black text-2xl font-normal font-['DM_Mono']">Dashboard</div>
                            </Link>
                            <div className="w-0 h-16 relative">
                                <div className="w-16 h-0 left-0 top-0 absolute origin-top-left rotate-90 outline outline-2 outline-offset-[-1px] outline-black"></div>
                            </div>
                            <Link href={"/student/housing"} className="self-stretch px-4 flex justify-start items-center">
                                <div className="justify-center text-black text-2xl font-normal font-['DM_Mono']">Browse</div>
                            </Link>
                        </div>
                    </div>
                    <div className="w-52 h-16 p-3 bg-white flex justify-between items-center">
                        <div className="justify-center text-black text-2xl font-normal font-['DM_Mono']">{currUser?.first_name ?? "Username"}</div>
                        <div className="w-12 h-12 bg-neutral-500" />
                    </div>
                </div>
                <div className="self-stretch h-14 px-9 py-2.5 bg-gray-800 inline-flex justify-start items-center gap-2.5 overflow-hidden">
                    <div className="justify-center text-amber-700 text-4xl font-semibold font-['DM_Sans']">Dashboard</div>
                </div>
            </div>
            <div className="self-stretch flex-1 p-2.5 bg-stone-200" />
        </div>
        // <div
        //     style={{
        //         width: "100%",
        //         minHeight: "100%",
        //         background: "white",
        //         display: "inline-flex",
        //         flexDirection: "column",
        //         justifyContent: "flex-start",
        //         alignItems: "stretch",
        //     }}
        // >
        //     <div
        //         style={{
        //             height: 108,
        //             paddingLeft: 18,
        //             paddingRight: 18,
        //             background: "#567375",
        //             overflow: "hidden",
        //             justifyContent: "space-between",
        //             alignItems: "center",
        //             display: "inline-flex",
        //         }}
        //     >
        //         <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        //             <div
        //                 style={{
        //                     width: 215,
        //                     height: 72,
        //                     paddingLeft: 36,
        //                     paddingRight: 36,
        //                     paddingTop: 10,
        //                     paddingBottom: 10,
        //                     background: "white",
        //                     display: "flex",
        //                     alignItems: "center",
        //                 }}
        //             >
        //                 <div style={{ color: "#1C2632", fontSize: 40, fontFamily: "DM Sans", fontWeight: "600" }}>Title</div>
        //             </div>
        //             <div style={{ color: "black", fontSize: 24, fontFamily: "DM Mono" }}>Dashboard</div>
        //             <div style={{ width: 2, height: 36, background: "black" }} />
        //             <Link
        //                 href="/student/housing"
        //                 style={{ color: "black", fontSize: 24, fontFamily: "DM Mono", textDecoration: "none" }}
        //             >
        //                 Browse
        //             </Link>
        //         </div>
        //         <div
        //             style={{
        //                 width: 260,
        //                 height: 72,
        //                 padding: 12,
        //                 background: "white",
        //                 display: "flex",
        //                 justifyContent: "space-between",
        //                 alignItems: "center",
        //             }}
        //         >
        //             <div style={{ color: "black", fontSize: 24, fontFamily: "DM Mono" }}>{currUser?.first_name ?? "Username"}</div>
        //             <div style={{ width: 48, height: 48, background: "#6B6B6B" }} />
        //         </div>
        //     </div>

        //     <div
        //         style={{
        //             height: 54,
        //             paddingLeft: 36,
        //             paddingRight: 36,
        //             paddingTop: 10,
        //             paddingBottom: 10,
        //             background: "#1C2632",
        //             display: "inline-flex",
        //             alignItems: "center",
        //         }}
        //     >
        //         <div style={{ color: "#C9642A", fontSize: 40, fontFamily: "DM Sans", fontWeight: "600" }}>Housing Browser</div>
        //     </div>

        //     <div style={{ padding: 24, background: "#EDE9DE" }}>
        //         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        //             {cards.map((card) => (
        //                 <div key={card.id} style={{ background: "white", borderRadius: 12, overflow: "hidden" }}>
        //                     <Image
        //                         src="/assets/placeholders/housing-414x264.svg"
        //                         alt={`${card.name} placeholder image`}
        //                         width={414}
        //                         height={264}
        //                         style={{ width: "100%", height: "auto", display: "block" }}
        //                     />
        //                     <div style={{ background: "#1C2632", padding: "10px 14px", color: "#C9642A", fontSize: 22, fontFamily: "DM Sans", fontWeight: "600" }}>
        //                         {card.name}
        //                     </div>
        //                 </div>
        //             ))}
        //         </div>
        //     </div>
        // </div>
    );
}
