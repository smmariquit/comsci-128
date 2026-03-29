
import { applicationService } from "@/app/lib/services/application-service";
import ReviewClient from "./_components/ReviewClient";
import Link from "next/link";

export default async function ApplicationReviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
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

  if (!application) {
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
    <main className="min-h-screen flex flex-col p-6 gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-500">Application Review</h1>
          <p className="text-gray-500 text-sm mt-1">Application #{applicationId}</p>
        </div>
        <Link href="/manage/applications" className="text-sm text-gray-500 hover:underline">
          ← Back to Applications
        </Link>
      </div>

  
      <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 text-sm text-gray-700">
        <p><span className="font-semibold">Applicant:</span> {fullName}</p>
        <p><span className="font-semibold">Housing:</span> {application.housing_name ?? "N/A"}</p>
        <p><span className="font-semibold">Room Type:</span> {application.preferred_room_type ?? "N/A"}</p>
        <p><span className="font-semibold">Expected Moveout:</span> {application.expected_moveout_date ?? "N/A"}</p>
        <p>
          <span className="font-semibold">Status: </span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold
            ${application.application_status === "Approved" ? "bg-green-100 text-green-700" : ""}
            ${application.application_status === "Pending" ? "bg-yellow-100 text-yellow-700" : ""}
            ${application.application_status === "Rejected" ? "bg-red-100 text-red-700" : ""}
            ${application.application_status === "Cancelled" ? "bg-gray-100 text-gray-700" : ""}
          `}>
            {application.application_status}
          </span>
        </p>
      </div>

{/* document viewer contained in ReviewClient.tsx*/}
      <ReviewClient
        applicationId={applicationId}
        documents={documents}
      />
    </main>
  )
}