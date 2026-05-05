
import type { Metadata } from "next";
import { applicationService } from "@/app/lib/services/application-service";
import StateMessage from "@/app/components/ui/state-message";

export const metadata: Metadata = {
  title: "Applications",
  description: "Review and process housing applications submitted by students.",
};
import Link from "next/link";
import ApplicationsClient from "./_components/ApplicationsClient";


export default async function ApplicationsPage() {
  let applications: Awaited<ReturnType<typeof applicationService.getApplications>> = [];
  try {
    applications = await applicationService.getApplications();
  } catch (error) {
    return (
      <StateMessage
        variant="error"
        title="Unable to load applications"
        description="Please try again in a moment."
      />
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8 bg-(--cream) text-(--dark-orange)">

      <h1 className="text-3xl font-bold text-center">
        Applicant List
      </h1>
      <ApplicationsClient applications={applications}/>

    </div>
  );

}