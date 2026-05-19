"use client";

import { useState } from "react";

const feedbackTypes = ["App", "Manager", "Housing"];
const categories = [
  "Bug",
  "UI Issues",
  "Feature Request",
  "App Performance",
  "Cleanliness",
  "Maintenance",
  "Noise",
  "Facilities",
  "Security",
  "Responsiveness",
  "Conduct",
  "Communication",
  "Rules Enforcement",
  "Other",
];

export default function FeedbackForm({ defaultType = "App" }: { defaultType?: string }) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState(defaultType);
  const [category, setCategory] = useState(categories[0]);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [involvedHousingId, setInvolvedHousingId] = useState<string>("");
  const [involvedManagerId, setInvolvedManagerId] = useState<string>("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("subject", subject);
      fd.append("description", description);
      fd.append("type", type);
      fd.append("category", category);
      if (screenshot) fd.append("screenshot", screenshot);
      if (involvedHousingId) fd.append("involved_housing_id", involvedHousingId);
      if (involvedManagerId) fd.append("involved_manager_id", involvedManagerId);

      const res = await fetch("/api/feedback", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to send feedback");
      setStatus("Feedback submitted. Thank you!");
      setSubject("");
      setDescription("");
      setScreenshot(null);
      setInvolvedHousingId("");
      setInvolvedManagerId("");
    } catch (err: any) {
      setStatus(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl mx-auto flex flex-col gap-4">
      <h3 className="text-xl font-semibold text-zinc-200">Send Feedback</h3>

      {status && <div className="text-sm text-stone-200 bg-gray-700 p-2 rounded">{status}</div>}

      <label className="flex flex-col text-stone-200">
        <span className="text-sm mb-1">Subject</span>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} required className="bg-gray-700 text-stone-200 rounded-lg px-3 py-2 outline-none border border-stone-600" />
      </label>

      <label className="flex flex-col text-stone-200">
        <span className="text-sm mb-1">Type</span>
        <select value={type} onChange={(e) => setType(e.target.value)} className="bg-gray-700 text-stone-200 rounded-lg px-3 py-2">
          {feedbackTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </label>

      <label className="flex flex-col text-stone-200">
        <span className="text-sm mb-1">Category</span>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-gray-700 text-stone-200 rounded-lg px-3 py-2">
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>

      <label className="flex flex-col text-stone-200">
        <span className="text-sm mb-1">Description</span>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} required className="bg-gray-700 text-stone-200 rounded-lg px-3 py-2 outline-none border border-stone-600" />
      </label>

      {type === "Housing" && (
        <label className="flex flex-col text-stone-200">
          <span className="text-sm mb-1">Involved Housing ID (optional)</span>
          <input value={involvedHousingId} onChange={(e) => setInvolvedHousingId(e.target.value)} className="bg-gray-700 text-stone-200 rounded-lg px-3 py-2" />
        </label>
      )}

      {type === "Manager" && (
        <label className="flex flex-col text-stone-200">
          <span className="text-sm mb-1">Involved Manager Account Number (optional)</span>
          <input value={involvedManagerId} onChange={(e) => setInvolvedManagerId(e.target.value)} className="bg-gray-700 text-stone-200 rounded-lg px-3 py-2" />
        </label>
      )}

      <label className="flex flex-col text-stone-200">
        <span className="text-sm mb-1">Screenshot (optional)</span>
        <input type="file" accept="image/*" onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)} className="text-stone-200" />
      </label>

      <div className="flex items-center gap-2">
        <button type="submit" disabled={loading} className="bg-orange-300 text-gray-800 font-bold rounded-xl py-2 px-4 hover:bg-orange-400 transition">
          {loading ? "Sending..." : "Send Feedback"}
        </button>
        <button type="button" onClick={() => { setSubject(""); setDescription(""); setScreenshot(null); setStatus(null); }} className="ml-2 text-sm text-stone-300">Reset</button>
      </div>
    </form>
  );
}
