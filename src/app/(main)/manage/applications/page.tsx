// src/app/(main)/manage/applications/page.tsx

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ComponentProps } from "react";
import StateMessage from "@/app/components/ui/state-message";
import { getManagerAccountNumber } from "@/app/lib/auth";
import { applicationService } from "@/app/lib/services/application-service";
import ApplicationsClient from "./_components/ApplicationsClient";

export const metadata: Metadata = {
  title: "Applications",
  description: "Review and process housing applications submitted by students.",
};

type ApplicationsClientApplications = ComponentProps<
  typeof ApplicationsClient
>["applications"];

export default async function ApplicationsPage() {
  const managerAccountNumber = await getManagerAccountNumber();

  if (!managerAccountNumber) {
    redirect("/unauthorized");
  }

  // Supabase-generated types model the joined `student.user` relations as arrays,
  // but the runtime data (and the rest of the app, e.g. dashboard-data) treats
  // them as singular objects. Cast at the boundary instead of duplicating the
  // permissive shape inside ApplicationsClient.
  let applications: ApplicationsClientApplications;
  try {
    applications = (await applicationService.getApplicationsByLandlord(
      managerAccountNumber,
    )) as unknown as ApplicationsClientApplications;
  } catch (_error) {
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
