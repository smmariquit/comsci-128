import Link from "next/link";
import { userData } from "@/app/lib/data/user-data";
import { getHousingStatus } from "@/app/lib/data/student-dashboard";

export default async function DashboardPage() {
    const currUser = await userData.findById(22);
    const userHousingStatus = await getHousingStatus(currUser!.account_number);

	return (
        // MAIN PAGE
        <div className="w-[1440px] h-[900px] inline-flex flex-col justify-start items-start overflow-hidden">
            {/* NAVBAR */}
            <div className="w-[1440px] h-40 bg-white flex flex-col justify-start items-center">
                <div className="self-stretch h-28 p-4 bg-gray-800 inline-flex justify-between items-center overflow-hidden">
                    <div className="flex justify-start items-center overflow-hidden">
                        <div className="w-52 h-16 px-9 py-2.5 flex justify-start items-center">
                            <div className="justify-center text-white text-4xl font-semibold font-['DM_Sans']">Title</div>
                        </div>
                        <div className="flex justify-start items-center overflow-hidden">
                            <Link href="/student" className="px-4 py-2 flex justify-start items-center">
                                <div className="justify-center text-white text-2xl font-normal font-['DM_Mono']">Dashboard</div>
                            </Link>
                            <div className="w-0 self-stretch relative">
                                <div className="w-14 h-0 left-0 top-0 absolute origin-top-left rotate-90 outline outline-2 outline-offset-[-1px] outline-white"></div>
                            </div>
                            <Link href="/student/housing" className="px-4 py-2 flex justify-start items-center">
                                <div className="justify-center text-white text-2xl font-normal font-['DM_Mono']">Browse</div>
                            </Link>
                        </div>
                    </div>
                    {/* USER PROFILE */}
                    <Link href="/profile" className="h-16 p-3 inline-flex justify-end items-center gap-5">
                        <div className="justify-center text-white text-2xl font-normal font-['DM_Mono']">{currUser?.first_name}</div>
                        <div className="w-12 h-12 bg-zinc-300 rounded-full" />
                    </Link>
                </div>
                <div className="self-stretch h-14 px-9 py-2 bg-gray-500 inline-flex justify-start items-center gap-2.5 overflow-hidden">
                    <div className="justify-center text-white text-4xl font-semibold font-['DM_Sans']">Dashboard</div>
                </div>
            </div>
            {/* BODY */}
            <div className="self-stretch flex-1 px-9 py-4 bg-stone-200 flex flex-col justify-start items-center gap-4 overflow-hidden">
                <div className="w-[864px] h-9 px-9 py-2 bg-gray-800 rounded-full shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] inline-flex justify-start items-center gap-2.5 overflow-hidden">
                    <div className="justify-center text-white text-lg font-semibold font-['DM_Sans']">Hello, {currUser?.first_name} {currUser?.last_name}!</div>
                </div>
                <div className="w-[864px] h-80 bg-stone-200 rounded-2xl shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] flex flex-col justify-start items-start overflow-hidden">
                    <div className="self-stretch h-9 px-9 py-2 bg-gray-800 inline-flex justify-start items-center gap-2.5 overflow-hidden">
                        <div className="justify-center text-white text-lg font-semibold font-['DM_Sans']">Application Status</div>
                    </div>
                    <div className="self-stretch flex-1 px-9 py-4" />
                </div>
                <div className="w-[864px] flex-1 bg-stone-200 rounded-2xl shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] flex flex-col justify-start items-start overflow-hidden">
                    <div className="self-stretch h-9 px-9 py-2 bg-gray-800 inline-flex justify-start items-center gap-2.5 overflow-hidden">
                        <div className="justify-center text-white text-lg font-semibold font-['DM_Sans']">Application Details</div>
                    </div>
                    <div className="self-stretch flex-1 px-9 py-4" />
                </div>
            </div>
        </div>
    );
}
