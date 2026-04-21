export default function NotAssignedDashboard(userName: String, dashboardData: Object) {
  const userHousingDetails = dashboardData as any;
  
  const hStyle = "justify-center text-white text-lg font-semibold font-[family-name:var(--font-DM_Sans)]";
  const tStyle = "text-black text-lg font-[family-name:var(--font-DM_Sans)]";
  const checkIcon =
    <svg className="w-24 h-24 fill-green-700" viewBox="0 0 640 640">
      <path d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z" />
    </svg>;
  const crossIcon =
    <svg className="w-24 h-24 fill-red-600" viewBox="0 0 640 640">
      <path d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM320 384C302.3 384 288 398.3 288 416C288 433.7 302.3 448 320 448C337.7 448 352 433.7 352 416C352 398.3 337.7 384 320 384zM320 192C301.8 192 287.3 207.5 288.6 225.7L296 329.7C296.9 342.3 307.4 352 319.9 352C332.5 352 342.9 342.3 343.8 329.7L351.2 225.7C352.5 207.5 338.1 192 319.8 192z" />
    </svg>;
  function getApplicationStepStatus(stepIndex: number) {
    const stepStatus = userHousingDetails.steps[stepIndex].isDone

    if(stepStatus) {
      return checkIcon;
    }

    return crossIcon;
  }

  return (
    <div className="w-216 flex-1 flex flex-col justify-start items-start gap-4">
      <div className="w-216 h-9 px-9 py-2 bg-gray-800 rounded-full shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] inline-flex justify-start items-center gap-2.5 overflow-hidden">
        <div className={hStyle}>Welcome, User!</div>
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
            <li><span className="font-bold">Name:</span> {userHousingDetails.application.room.housing.housing_name}</li>
            <li><span className="font-bold">Address:</span> {userHousingDetails.application.room.housing.housing_address}</li>
          </ul>
          <span className={`${tStyle} font-semibold `}>Room Details</span>
          <ul className={`${tStyle} pb-4 px-4`}>
            <li><span className="font-bold">Room ID:</span> {userHousingDetails.application.room_id}</li>
            <li><span className="font-bold">Room Type:</span> {userHousingDetails.application.room.room_type}</li>
          </ul>
          <span className={tStyle}><span className={`${tStyle} font-semibold `}>Expected Move Out Date:</span> {userHousingDetails.application.expected_moveout_date}</span>
        </div>
      </div>
    </div>
  );
}