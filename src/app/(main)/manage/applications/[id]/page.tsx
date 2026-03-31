import Link from "next/link";

export default async function ApplicationReviewPage(){
  // dummy for now, add IDs
  const application = {
    name: "Wei Wuxian",
    housing: "Cloud Recesses",
    files: [
      { id: 1, name: "ID Card.pdf" },
      { id: 2, name: "Proof of Enrollment.pdf" },
    ],
  };

  return (
    <div className="flex flex-col gap-6 p-8 bg-[var(--cream)] text-[var(--dark-orange)]">

      <Link href="/manage/applications">
        ← Back to Applications
      </Link>

      <h1 className="text-2xl font-bold">
        Application Review
      </h1>

      <div className="flex gap-6">

        <div className="w-2/3 bg-white rounded-xl shadow p-4 flex items-center justify-center text-black">
          <p>File Preview Area</p>
        </div>


        <div className="w-1/3 flex flex-col gap-4">

          <div className="bg-white rounded-xl shadow p-4 text-black">
            <h2 className="font-semibold mb-2">Applicant Info</h2>

            <p><strong>Name:</strong> {application.name}</p>
            <p><strong>Housing Applied for:</strong> {application.housing}</p>
          </div>



          <div className="bg-white rounded-xl shadow p-4 text-black">
            <h2 className="font-semibold mb-2">Submitted Files</h2>

            <ul className="flex flex-col gap-2">
              {application.files.map((file) => (
                <li
                  key={file.id}
                  className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
                >
                  {file.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center gap-4 pt-12">
            <button className="px-4 py-2 bg-green-500 text-white rounded">
              Accept
            </button>

            <button className="px-4 py-2 bg-red-500 text-white rounded">
              Reject
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}