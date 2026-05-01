
import type { Metadata } from "next";
import { applicationService } from "@/app/lib/services/application-service";
import { getManagerAccountNumber } from "@/app/lib/auth";
import { redirect } from "next/navigation";


export const metadata: Metadata = {
  title: "Applications",
  description: "Review and process housing applications submitted by students.",
};
import Link from "next/link";
import ApplicationsClient from "./_components/ApplicationsClient";


export default async function ApplicationsPage() {

  const managerAccountNumber = await getManagerAccountNumber();

  if(!managerAccountNumber) {
    redirect("/unauthorized")
  }


  const applications = await applicationService.getApplicationsByLandlord(managerAccountNumber)

  return (
    <div className="flex flex-col gap-8 p-8 bg-(--cream) text-(--dark-orange)">

      <h1 className="text-3xl font-bold text-center">
        Applicant List
      </h1>
      <ApplicationsClient applications={applications}/>

    </div>
  );

}