
import { applicationService } from "@/app/lib/services/application-service";
import Link from "next/link";
import ApplicationsClient from "./_components/ApplicationsClient";
import { housingService } from "@/app/lib/services/housing-service";


export default async function ApplicationsPage() {

  const [applications, housings] = await Promise.all([
  applicationService.getApplications(),
  housingService.getAllHousing(),
])

  return (
    <div className="flex flex-col gap-8 p-8 bg-(--cream) text-(--dark-orange)">

      <h1 className="text-3xl font-bold text-center">
        Applicant List
      </h1>
      <ApplicationsClient 
        applications={applications} 
        housings={housings ?? []}
      />

    </div>
  );

}