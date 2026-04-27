import { CheckCircle2, AlertCircle } from "lucide-react";

export default function NotAssignedDashboard(userName: String, dashboardData: Object) {
  const userHousingDetails = dashboardData as any;
  
  const hStyle = "justify-center text-white text-lg font-semibold font-[family-name:var(--font-DM_Sans)]";
  const tStyle = "text-black text-lg font-[family-name:var(--font-DM_Sans)]";
  const checkIcon = <CheckCircle2 size={96} className="text-green-700" strokeWidth={1.5} />;
  const crossIcon = <AlertCircle size={96} className="text-red-600" strokeWidth={1.5} />;

  function getApplicationStepStatus(stepIndex: number) {
    const stepStatus = userHousingDetails.steps[stepIndex].isDone

    if(stepStatus) {
      return checkIcon;
    }

    return crossIcon;
  }

  function getApplication() {
    return userHousingDetails?.application;
  }

  function getHousing() {
    return getApplication()?.room?.housing;
  }

  return (
    <div className="w-216 flex-1 flex flex-col justify-start items-start gap-4">
      <div className="w-216 h-9 px-9 py-2 bg-gray-800 rounded-full shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] inline-flex justify-start items-center gap-2.5 overflow-hidden">
        <div className={hStyle}>Welcome, {userName}</div>
      </div>
      <div className="w-216 flex-1 bg-stone-200 rounded-2xl shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] flex flex-col justify-start items-start overflow-hidden">
        <div className="self-stretch h-9 px-9 py-2 bg-gray-800 inline-flex justify-start items-center gap-2.5 overflow-hidden">
          <div className={hStyle}>Application Status</div>
        </div>
        <div className="self-stretch flex-1 px-24 py-4 inline-flex justify-between items-center overflow-hidden">
          <div className="p-2.5 inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
            {getApplicationStepStatus(0)}
            <div className={`${tStyle} text-center justify-center font-semibold `}>Dorm<br />Chosen</div>
          </div>
          <div className="p-2.5 inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
            {getApplicationStepStatus(1)}
            <div className={`${tStyle} text-center justify-center font-semibold `}>Application<br />Submitted</div>
          </div>
          <div className="p-2.5 inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
            {getApplicationStepStatus(2)}
            <div className={`${tStyle} text-center justify-center font-semibold `}>Manager<br />Review</div>
          </div>
          <div className="p-2.5 inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
            {getApplicationStepStatus(3)}
            <div className={`${tStyle} text-center justify-center font-semibold `}>Room<br />Assigned</div>
          </div>
        </div>
      </div>
      <div className="w-216 flex-1 bg-stone-200 rounded-2xl shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] flex flex-col justify-start items-start overflow-hidden">
        <div className="self-stretch h-9 px-9 py-2 bg-gray-800 inline-flex justify-start items-center gap-2.5 overflow-hidden">
          <div className={hStyle}>Application Details</div>
        </div>
        <div className="self-stretch flex-1 px-9 py-4">
          <span className={`${tStyle} font-semibold `}>Housing Details</span>
          <ul className={`${tStyle} pb-4 px-4`}>
            <li><span className="font-bold">Name:</span> {getHousing()?.housing_name}</li>
            <li><span className="font-bold">Address:</span> {getHousing()?.housing_address}</li>
          </ul>
          <span className={`${tStyle} font-semibold `}>Room Details</span>
          <ul className={`${tStyle} pb-4 px-4`}>
            <li><span className="font-bold">Room ID:</span> {getApplication()?.room_id}</li>
            <li><span className="font-bold">Room Type:</span> {getApplication()?.room.room_type}</li>
          </ul>
          <span className={tStyle}><span className={`${tStyle} font-semibold `}>Expected Move Out Date:</span> {getApplication()?.expected_moveout_date}</span>
        </div>
      </div>
    </div>
  );
}