export default function AssignedDashboard(userName: String) {
    return (
        <div className="w-[864px] flex-1 flex flex-col justify-start items-start gap-4">
            <div className="w-[864px] h-9 px-9 py-2 bg-gray-800 rounded-full shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] inline-flex justify-start items-center gap-2.5 overflow-hidden">
                <div className="justify-center text-white text-lg font-semibold font-['DM_Sans']">Hello, {userName}!</div>
            </div>
            <div className="w-[864px] flex-1 bg-stone-200 rounded-2xl shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] flex flex-col justify-start items-start overflow-hidden">
                <div className="self-stretch h-9 px-9 py-2 bg-gray-800 inline-flex justify-start items-center gap-2.5 overflow-hidden">
                    <div className="justify-center text-white text-lg font-semibold font-['DM_Sans']">Housing Information</div>
                </div>
                <div className="self-stretch flex-1 px-9 py-4" />
            </div>
            <div className="w-[864px] flex-1 bg-stone-200 rounded-2xl shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] flex flex-col justify-start items-start overflow-hidden">
                <div className="self-stretch h-9 px-9 py-2 bg-gray-800 inline-flex justify-start items-center gap-2.5 overflow-hidden">
                    <div className="justify-center text-white text-lg font-semibold font-['DM_Sans']">Billing Status</div>
                </div>
                <div className="self-stretch flex-1 px-9 py-4" />
            </div>
        </div>
    );
}