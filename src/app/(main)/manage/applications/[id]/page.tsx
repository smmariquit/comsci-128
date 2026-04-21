
import { applicationService } from "@/app/lib/services/application-service";

import Link from "next/link";
import ReviewWrapper from "./_components/ReviewWrapper";

export default async function ApplicationReviewPage({

  params,
}: {
  params: Promise<{ id:string }>
}) {

  const{id} = await params
  const applicationId = Number(id)

  if (isNaN(applicationId)) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Invalid application ID.</p>
      </main>
    )
  }

  const [application, documents] = await Promise.all([
    applicationService.getApplicationDetail(applicationId),
    applicationService.getApplicationDocuments(applicationId),
  ])

  if(!application) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Application not found.</p>
      </main>
    )
  }

  const student = application.student as any
  const user = student?.user
  const fullName = user
    ? `${user.first_name} ${user.middle_name ? user.middle_name + " " : ""}${user.last_name}`
    : "Unknown"

  return (
<<<<<<< HEAD
    <div className="flex flex-col gap-6 p-8 bg-(--cream) text-(--dark-orange)">

      <Link href="/manage/applications">
        ← Back to Applications
      </Link>

      <h1 className="text-2xl font-bold">
        Application Review
      </h1>
      <p className="text-gray-500 text-sm mt-1">Application #{applicationId}</p>

      <div className="flex gap-6">

        <ReviewWrapper
          applicationId={applicationId}
          documents={documents}
          fullName={fullName}
          housingName={application.housing_name}
        />

=======
    <main className="min-h-screen  text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-center mb-8">
        Manage Application ID Page
      </h1>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href="/manage/applications"
          className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200"
        >
          Back to Applications
        </Link>
>>>>>>> 7c7bbe325cc2ad1e86e35d3d43d7acfaa20c4023
      </div>
    
    </div>
  );
<<<<<<< HEAD

=======
>>>>>>> 7c7bbe325cc2ad1e86e35d3d43d7acfaa20c4023
}
