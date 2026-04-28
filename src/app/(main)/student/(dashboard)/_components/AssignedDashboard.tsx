export default function AssignedDashboard(userName: String, dashboardData: Object) {
    const userHousingDetails = dashboardData as any;

    const hStyle = "justify-center text-white text-lg font-semibold font-[family-name:var(--font-DM_Sans)]";
    const tStyle = "text-black text-lg font-[family-name:var(--font-DM_Sans)]";

    function getApplication() {
        return userHousingDetails?.application;
    }

    function getHousing() {
        return getApplication()?.room?.housing;
    }

    return (
        <div className="w-full flex-1 flex flex-col justify-start items-start gap-4">
            <div className="w-full h-auto min-h-9 px-4 md:px-9 py-2 bg-gray-800 rounded-full shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] inline-flex justify-start items-center gap-2.5 overflow-hidden">
                <div className={hStyle}>Hello, {userName}!</div>
            </div>
            <div className="w-full flex-1 bg-stone-200 rounded-2xl shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] flex flex-col justify-start items-start overflow-hidden">
                <div className="self-stretch h-auto min-h-9 px-4 md:px-9 py-2 bg-gray-800 inline-flex justify-start items-center gap-2.5 overflow-hidden">
                    <div className={hStyle}>Housing Information</div>
                </div>
                <div className="self-stretch flex-1 px-4 md:px-9 py-4">
                    <span className={`${tStyle} font-semibold`}>Housing Details</span>
                    <ul className={`${tStyle} pb-4 px-4`}>
                        <li><span className="font-bold">Name:</span> {getHousing()?.housing_name}</li>
                        <li><span className="font-bold">Address:</span> {getHousing()?.housing_address}</li>
                    </ul>
                    <span className={`${tStyle} font-semibold`}>Room Details</span>
                    <ul className={`${tStyle} pb-4 px-4`}>
                        <li><span className="font-bold">Room ID:</span> {getApplication()?.room_id}</li>
                        <li><span className="font-bold">Room Type:</span> {getApplication()?.room?.room_type}</li>
                    </ul>
                    <span className={tStyle}><span className={`${tStyle} font-semibold`}>Expected Move Out Date:</span> {getApplication()?.expected_moveout_date}</span>
                </div>
            </div>
            <div className="w-full flex-1 bg-stone-200 rounded-2xl shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] flex flex-col justify-start items-center overflow-hidden">
                <div className="self-stretch h-auto min-h-9 px-4 md:px-9 py-2 bg-gray-800 inline-flex justify-start items-center gap-2.5 overflow-hidden">
                    <div className={hStyle}>Billing Status</div>
                </div>
                <div className="self-stretch flex-1 px-4 md:px-9 py-4" />
            </div>
        </div>
    );
}