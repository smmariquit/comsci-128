import { useEffect, useState } from "react";

interface Complaint {
  id: number;
  user_id: string;
  subject: string;
  description: string;
  screenshot_url: string | null;
  status: string;
  created_at: string;
}

export default function ManagerComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/complaints?all=1")
      .then(res => res.json())
      .then(data => {
        setComplaints(data.complaints || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Student Complaints</h1>
      {loading ? (
        <div>Loading...</div>
      ) : complaints.length === 0 ? (
        <div>No complaints found.</div>
      ) : (
        <ul className="space-y-4">
          {complaints.map(c => (
            <li key={c.id} className="border rounded p-4">
              <div className="font-semibold">{c.subject}</div>
              <div className="text-gray-700 mb-2">{c.description}</div>
              {c.screenshot_url && (
                <a
                  href={`https://your-supabase-url/storage/v1/object/public/complaints/${c.screenshot_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Screenshot
                </a>
              )}
              <div className="text-xs text-gray-500 mt-2">
                Status: {c.status} | Submitted: {new Date(c.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
