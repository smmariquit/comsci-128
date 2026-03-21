'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Page() {
  const [searchId, setSearchId] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // 1. Fetch User by ID (Task 1 logic)
  const handleSearch = async () => {
    if (!searchId) return;
    setLoading(true);
    try {
      // We pass the ID in the header as your API expects
      const res = await fetch(`/api/users`, {
        method: 'GET',
        headers: { 'x-user-id': searchId }
      });
      const data = await res.json();
      
      if (res.ok) {
        setUserData(data);
      } else {
        alert(data.message || "User not found");
        setUserData(null);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Update Allowed Fields (Task 2 logic)
  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': searchId 
        },
        // Only send fields we want to update
        body: JSON.stringify({
          first_name: userData.first_name,
          middle_name: userData.middle_name,
          last_name: userData.last_name,
          phone_number: userData.phone_number,
          home_address: userData.home_address,
          // account_email is excluded; service layer will block it anyway
        }),
      });

      const result = await res.json();
      if (res.ok) {
        alert("Profile updated in Supabase!");
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Profile Management</h1>

      <div className="w-full max-w-md space-y-6">
        {/* Search Bar */}
        <div className="flex gap-2">
          <input 
            type="number" 
            placeholder="Account Number (e.g. 17)" 
            className="grow p-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-blue-500"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button 
            onClick={handleSearch} 
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-bold transition"
            disabled={loading}
          >
            {loading ? '...' : 'Search'}
          </button>
        </div>

        {/* User Card */}
        {userData && (
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg shadow-xl space-y-4">
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-wider">Account Email</label>
              <p className="text-zinc-300 font-mono text-sm">{userData.account_email}</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col">
                <label className="text-xs text-zinc-500 mb-1">First Name</label>
                <input 
                  className="bg-zinc-800 p-2 rounded border border-zinc-700"
                  value={userData.first_name || ''}
                  onChange={(e) => setUserData({...userData, first_name: e.target.value})}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-zinc-500 mb-1">Middle Name</label>
                <input 
                  className="bg-zinc-800 p-2 rounded border border-zinc-700"
                  value={userData.middle_name || ''}
                  onChange={(e) => setUserData({...userData, middle_name: e.target.value})}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-zinc-500 mb-1">Last Name</label>
                <input 
                  className="bg-zinc-800 p-2 rounded border border-zinc-700"
                  value={userData.last_name || ''}
                  onChange={(e) => setUserData({...userData, last_name: e.target.value})}
                />
              </div>
            </div>

            <button 
              onClick={handleUpdate}
              disabled={updating}
              className="w-full bg-white text-black py-2 rounded font-bold hover:bg-gray-200 mt-4 transition"
            >
              {updating ? 'Saving...' : 'Update Allowed Fields'}
            </button>
          </div>
        )}

        <div className="pt-4 flex justify-center">
          <Link href="/student" className="text-zinc-500 hover:text-white underline text-sm">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}