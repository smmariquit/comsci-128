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
        <div className="flex w-full flex-col items-start justify-start gap-4 lg:max-w-[864px]">
            <div className="inline-flex min-h-[36px] w-full items-center justify-start gap-2.5 overflow-hidden rounded-full bg-gray-800 px-6 sm:px-9 py-2 shadow-md">
                <div className={hStyle}>Hello, {userName}!</div>
            </div>
            
            <div className="flex w-full flex-col items-start justify-start overflow-hidden rounded-2xl bg-stone-200 shadow-md">
                <div className="inline-flex min-h-[36px] w-full items-center justify-start gap-2.5 bg-gray-800 px-6 sm:px-9 py-2">
                    <div className={hStyle}>Housing Information</div>
                </div>

                <div className="w-full flex-1 px-6 py-5 sm:px-9 sm:py-6">
                    <span className={`${tStyle} font-semibold`}>Housing Details</span>
                    <ul className={`${tStyle} pb-4 px-4`}>
                        <li><span className="font-bold">Name:</span>{getHousing()?.housing_name}</li>
                        <li><span className="font-bold">Address:</span>{getHousing()?.housing_address}</li>
                    </ul>
                    <span className={`${tStyle} font-semibold`}>Room Details</span>
                    <ul className={`${tStyle} pb-4 px-4`}>
                        <li><span className="font-bold">Room ID:</span>{getApplication()?.room_id}</li>
                        <li><span className="font-bold">Room Type:</span>{getApplication()?.room?.room_type}</li>
                    </ul>
                    <span className={tStyle}><span className={`${tStyle} font-semibold`}>Expected Move Out Date:</span> {getApplication()?.expected_moveout_date}</span>
                </div>
            </div>

            <div className="flex w-full flex-col items-start justify-start overflow-hidden rounded-2xl bg-stone-200 shadow-md">
                <div className="inline-flex min-h-[36px] w-full items-center justify-start gap-2.5 bg-gray-800 px-6 sm:px-9 py-2">
                    <div className={hStyle}>Billing Status</div>
                </div>
                <div className="w-full flex-1 px-6 py-10 sm:px-9"/>
            </div>
        </div>
    );
}