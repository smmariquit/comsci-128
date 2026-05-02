import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentComplaintsPage() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("description", description);
    if (screenshot) formData.append("screenshot", screenshot);
    const res = await fetch("/api/complaints", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      setStatus("Complaint submitted successfully.");
      setSubject("");
      setDescription("");
      setScreenshot(null);
      setTimeout(() => router.push("/student/profile"), 1500);
    } else {
      setStatus("Failed to submit complaint.");
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Submit a Formal Complaint</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Subject</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            rows={5}
          />
        </div>
        <div>
          <label className="block font-medium">Screenshot (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setScreenshot(e.target.files?.[0] || null)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Complaint
        </button>
        {status && <div className="mt-2 text-center">{status}</div>}
      </form>
    </div>
  );
}
