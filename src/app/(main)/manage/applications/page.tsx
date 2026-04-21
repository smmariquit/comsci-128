<<<<<<< HEAD
=======
import Link from "next/link";
>>>>>>> 7c7bbe325cc2ad1e86e35d3d43d7acfaa20c4023

import { applicationService } from "@/app/lib/services/application-service";
import Link from "next/link";
import ApplicationsClient from "./_components/ApplicationsClient";


export default async function ApplicationsPage() {

  const applications = await applicationService.getApplications()

  return (
    <div className="flex flex-col gap-8 p-8 bg-(--cream) text-(--dark-orange)">

      <h1 className="text-3xl font-bold text-center">
        Applicant List
      </h1>
      <ApplicationsClient applications={applications}/>

    </div>
  );

}