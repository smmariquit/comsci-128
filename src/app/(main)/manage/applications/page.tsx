import { applicationService } from "@/app/lib/services/application-service";
import { housingService } from "@/app/lib/services/housing-service";
import { roomService } from "@/app/lib/services/room-service";
import Link from "next/link";



type Application = {
  id: number;
  name: string;
  housing: string;
  date: string;
  status: "waiting" | "accepted";
};

export default function ApplicationsPage() {
  //dummies
  const applications: Application[] = [
    {
      id: 1,
      name: "Wei Wuxian",
      housing: "Cloud Recesses",
      date: "2026-02-02",
      status: "waiting",
    },
    {
      id: 2,
      name: "Lan Wangji",
      housing: "Cloud Recesses",
      date: "2026-02-02",
      status: "accepted",
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-8 bg-[var(--cream)] text-[var(--dark-orange)]">

      <h1 className="text-3xl font-bold text-center">
        Applicant List
      </h1>

      {/* Placeholder, to be implemented */}
      <div className="flex gap-4">
        <select className="p-2 border rounded bg-white">
          <option>All Status</option>
          <option>Waiting</option>
          <option>Accepted</option>
        </select>

        <select className="p-2 border rounded bg-white">
          <option>All Housing</option>
          <option>Dorm</option>
          <option>Apartment</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl text-black shadow overflow-x-auto">

        <table className="w-full text-left border-collapse">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Housing</th>
              <th className="p-3">Date Submitted</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-t hover:bg-gray-50">

                <td className="p-3">{app.name}</td>
                <td className="p-3">{app.housing}</td>
                <td className="p-3">{app.date}</td>


                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      app.status === "accepted"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {app.status === "accepted" ? "Accepted" : "Waiting"}
                  </span>
                </td>


                <td className="p-3">
                  <Link href={`/manage/applications/${app.id}`}>
                    <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                      Review
                    </button>
                  </Link>
                </td>

              </tr>
            ))}
          </tbody>


        </table>
      </div>
    </div>
  );
}