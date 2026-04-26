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
    <div className="flex w-full flex-col items-start justify-start gap-4 sm:max-w-4xl">

      <div className="inline-flex h-9 w-full items-center justify-start gap-2.5 overflow-hidden rounded-full bg-gray-800 px-6 sm:px-9 py-2 shadow-md">
        <div className={hStyle}>Welcome, {userName}</div>
      </div>

      <div className="flex w-full flex-col items-start justify-start overflow-hidden rounded-2xl bg-stone-200 shadow-md">
        <div className="inline-flex h-9 w-full items-center justify-start gap-2.5 bg-gray-800 px-6 sm:px-9 py-2">
          <div className={hStyle}>Application Status</div>
        </div>
        
        {/* grid layout for application progress*/}
        <div className="grid w-full grid-cols-2 gap-y-6 px-4 py-8 sm:flex sm:justify-between sm:px-12">
          {[
            { label: "Dorm\nChosen", idx: 0 },
            { label: "Application\nSubmitted", idx: 1 },
            { label: "Manager\nReview", idx: 2 },
            { label: "Room\nAssigned", idx: 3 },
          ].map((step) => (
            <div key={step.idx} className="flex flex-col items-center justify-center gap-2 text-center">
              {getApplicationStepStatus(step.idx)}
              <div className={`${tStyle} whitespace-pre-line font-semibold leading-tight`}>
                {step.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex w-full flex-col items-start justify-start overflow-hidden rounded-2xl bg-stone-200 shadow-md">
        <div className="inline-flex h-9 w-full items-center justify-start gap-2.5 bg-gray-800 px-6 sm:px-9 py-2">
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