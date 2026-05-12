"use client";

import { useEffect, useState } from "react";
import PageLoading from "@/app/components/ui/page-loading";
import StateMessage from "@/app/components/ui/state-message";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadComplaints = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/complaints?all=1");
        if (!response.ok) {
          throw new Error("Could not load complaints right now.");
        }

        const data = await response.json();
        if (!cancelled) {
          setComplaints(data.complaints || []);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError instanceof Error ? fetchError.message : "Could not load complaints right now.");
          setComplaints([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadComplaints();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <PageLoading label="Loading complaints" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#eae8e1] px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <StateMessage
            title="Could not load complaints"
            description={error}
            variant="error"
          />
          <button
            onClick={() => window.location.reload()}
            className="mx-auto mt-4 block rounded-full bg-[#1a2332] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eae8e1] px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#CEC7B0]">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-[#1C2632]">Student Complaints</h1>
          <p className="mt-1 text-sm text-[#1C2632]/60">Review concerns and open screenshots in context.</p>
        </div>
      {complaints.length === 0 ? (
        <StateMessage
          title="No complaints yet"
          description="New complaints will appear here once students submit them."
        />
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
    </div>
  );
}
