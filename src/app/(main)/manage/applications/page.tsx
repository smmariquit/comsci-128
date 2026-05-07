
import type { Metadata } from "next";
import { applicationService } from "@/app/lib/services/application-service";
import StateMessage from "@/app/components/ui/state-message";
import { getManagerAccountNumber } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Applications",
  description: "Review and process housing applications submitted by students.",
};
import ApplicationsClient from "./_components/ApplicationsClient";


export default async function ApplicationsPage() {
  const managerAccountNumber = await getManagerAccountNumber();

  if(!managerAccountNumber) {
    redirect("/unauthorized");
  }

  let applications: any = [];
  try {
    applications = await applicationService.getApplicationsByLandlord(managerAccountNumber);
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
    <div className="flex flex-col gap-6 bg-(--cream) p-4 text-(--dark-orange) sm:gap-8 sm:p-6 md:p-8">
      <h1 className="text-center text-2xl font-bold sm:text-3xl">
        Applications
      </h1>
      <ApplicationsClient applications={applications} />
    </div>
  );

}