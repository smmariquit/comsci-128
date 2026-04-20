export default function AssignedDashboard(userName: String, userHousingDetails: Object) {
    const userDetails = userHousingDetails as any;
    
    return (
        <div className="w-[864px] flex-1 flex flex-col justify-start items-start gap-4">
            <div className="w-[864px] h-9 px-9 py-2 bg-gray-800 rounded-full shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] inline-flex justify-start items-center gap-2.5 overflow-hidden">
                <div className="justify-center text-white text-lg font-semibold font-[family-name:var(--font-DM_Sans)]">Hello, {userName}!</div>
            </div>
            <div className="w-[864px] flex-1 bg-stone-200 rounded-2xl shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] flex flex-col justify-start items-start overflow-hidden">
                <div className="self-stretch h-9 px-9 py-2 bg-gray-800 inline-flex justify-start items-center gap-2.5 overflow-hidden">
                    <div className="justify-center text-white text-lg font-semibold font-[family-name:var(--font-DM_Sans)]">Housing Information</div>
                </div>
                <div className="self-stretch flex-1 px-9 py-4">
                    <span className="text-black text-lg font-semibold font-[family-name:var(--font-DM_Sans)]">Housing Details</span>
                    <ul className="pb-4 px-4 text-black text-lg font-[family-name:var(--font-DM_Sans)]">
                        <li><span className="font-bold">Name:</span> {userDetails.application.room.housing.housing_name}</li>
                        <li><span className="font-bold">Address:</span> {userDetails.application.room.housing.housing_address}</li>
                    </ul>
                    <span className="text-black text-lg font-semibold font-[family-name:var(--font-DM_Sans)]">Room Details</span>
                    <ul className="pb-4 px-4 text-black text-lg font-[family-name:var(--font-DM_Sans)]">
                        <li><span className="font-bold">Room ID:</span> {userDetails.application.room_id}</li>
                        <li><span className="font-bold">Room Type:</span> {userDetails.application.room.room_type}</li>
                    </ul>
                    <span className="text-black text-lg font-[family-name:var(--font-DM_Sans)]"><span className="text-black text-lg font-semibold font-[family-name:var(--font-DM_Sans)]">Expected Move Out Date:</span> {userDetails.application.expected_moveout_date}</span>
                </div>
            </div>
            <div className="w-[864px] flex-1 bg-stone-200 rounded-2xl shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] flex flex-col justify-start items-start overflow-hidden">
                <div className="self-stretch h-9 px-9 py-2 bg-gray-800 inline-flex justify-start items-center gap-2.5 overflow-hidden">
                    <div className="justify-center text-white text-lg font-semibold font-[family-name:var(--font-DM_Sans)]">Billing Status</div>
                </div>
                <div className="self-stretch flex-1 px-9 py-4" />
            </div>
        </div>
    );
}