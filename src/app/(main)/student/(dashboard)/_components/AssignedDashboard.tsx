"use client";

import { exportDocumentToPDF } from "@/app/lib/export_utils";

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
                    
                    <div className="flex gap-4 mt-6">
                        <button 
                            onClick={() => {
                                exportDocumentToPDF(
                                    "Accommodation Notice", 
                                    "accommodation_notice", 
                                    userName.toString(), 
                                    [
                                        `This official notice confirms that you have been granted an accommodation.`,
                                        `Housing Name: ${getHousing()?.housing_name}`,
                                        `Housing Address: ${getHousing()?.housing_address}`,
                                        `Room Type: ${getApplication()?.room?.room_type}`,
                                        `Room ID: ${getApplication()?.room_id}`,
                                        `Expected Move-out Date: ${getApplication()?.expected_moveout_date}`,
                                        ``,
                                        `Please present this document to the dormitory manager upon arrival.`
                                    ]
                                );
                            }}
                            className="bg-teal-700 text-white px-4 py-2 rounded shadow hover:bg-teal-800 transition-colors"
                        >
                            Download Accommodation Notice
                        </button>

                        <button 
                            onClick={() => {
                                exportDocumentToPDF(
                                    "Clearance Form", 
                                    "clearance_form", 
                                    userName.toString(), 
                                    [
                                        `This official clearance form signifies that the student has settled all responsibilities.`,
                                        `Housing Name: ${getHousing()?.housing_name}`,
                                        `Room ID: ${getApplication()?.room_id}`,
                                        ``,
                                        `Status: CLEARED`,
                                        `Clearance Date: ${new Date().toLocaleDateString()}`
                                    ]
                                );
                            }}
                            className="bg-gray-700 text-white px-4 py-2 rounded shadow hover:bg-gray-800 transition-colors"
                        >
                            Download Clearance Form
                        </button>
                    </div>
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