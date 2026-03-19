'use client';

import { useState, useEffect } from 'react';

export default function HousingPage() {
  const [dorms, setDorms] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [singleDorm, setSingleDorm] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    housing_name: '',
    housing_address: '',
    housing_type: 'Non-UP Housing', // Updated to match schema Enum
    rent_price: 0
  });

  // Mock token to pass backend's authorization check
  const authHeader = { 'Authorization': 'Bearer local-dev-token' };

  useEffect(() => {
    fetchDorms();
  }, []);

  // --- Get All Housing ---
  const fetchDorms = async () => {
    try {
      const res = await fetch('/api/housing', { headers: authHeader });
      
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const result = await res.json();
        if (result.data) setDorms(result.data);
      } else {
        const errorText = await res.text();
        console.error("Server returned non-JSON:", errorText);
      }
    } catch (err) {
      console.error("Connection failed:", err);
    }
  };

  // --- Create Record (POST) ---
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/housing', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...authHeader 
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Dormitory added successfully!');
        // Reset form to defaults
        setFormData({ 
          housing_name: '', 
          housing_address: '', 
          housing_type: 'Non-UP Housing', 
          rent_price: 0 
        });
        fetchDorms(); 
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.error}`);
      }
    } catch (err) {
      alert("System error. Check console.");
    }
  };

  // --- Get Housing By ID ---
  const handleSearch = async () => {
  if (!searchId) return;
  try {
    const res = await fetch(`/api/housing/${searchId}`, { headers: authHeader });
    const result = await res.json();
    
    if (res.ok) {
      setSingleDorm(result.data);
    } else {
      alert(result.error);
      setSingleDorm(null);
    }
  } catch (err) {
    alert("An error occurred during the search.");
  }
};

  return (
    <div style={{ padding: '40px', backgroundColor: '#4a0e0e', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ borderBottom: '2px solid white', paddingBottom: '10px' }}>Dormitory Management</h1>

      <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
        
        {/* LEFT SIDE: ADD NEW HOUSING */}
        <section style={{ flex: 1, border: '1px solid rgba(255,255,255,0.3)', padding: '20px', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '1.2rem' }}>Add New Housing</h2>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
              placeholder="Dorm Name" 
              value={formData.housing_name}
              onChange={(e) => setFormData({...formData, housing_name: e.target.value})}
              style={{ padding: '8px', color: 'black' }} required 
            />
            <input 
              placeholder="Address" 
              value={formData.housing_address}
              onChange={(e) => setFormData({...formData, housing_address: e.target.value})}
              style={{ padding: '8px', color: 'black' }} required 
            />
            
            {/* UPDATED: Dropdown for Housing Type Enum */}
            <label style={{ fontSize: '0.8rem', marginBottom: '-5px' }}>Housing Type</label>
            <select 
              value={formData.housing_type}
              onChange={(e) => setFormData({...formData, housing_type: e.target.value})}
              style={{ padding: '8px', color: 'black' }}
            >
              <option value="Non-UP Housing">Non-UP Housing</option>
              <option value="UP Housing">UP Housing</option>
            </select>

            <input 
              type="number" 
              placeholder="Rent Price" 
              value={formData.rent_price}
              onChange={(e) => setFormData({...formData, rent_price: Number(e.target.value)})}
              style={{ padding: '8px', color: 'black' }} required 
            />
            <button type="submit" style={{ padding: '10px', backgroundColor: '#fff', color: '#4a0e0e', fontWeight: 'bold', cursor: 'pointer' }}>
              CREATE RECORD
            </button>
          </form>
        </section>

        {/* RIGHT SIDE: SEARCH BY ID */}
        <section style={{ flex: 1, border: '1px solid rgba(255,255,255,0.3)', padding: '20px', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '1.2rem' }}>Find by ID</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              placeholder="Enter Housing ID" 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              style={{ padding: '8px', color: 'black', flex: 1 }}
            />
            <button onClick={handleSearch} style={{ padding: '8px 15px', cursor: 'pointer', backgroundColor: '#fff', color: '#4a0e0e', border: 'none', fontWeight: 'bold' }}>SEARCH</button>
          </div>

          {singleDorm && (
            <div style={{ marginTop: '15px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '4px' }}>
              <p><strong>Result:</strong> {singleDorm.housing_name}</p>
              <p><strong>Address:</strong> {singleDorm.housing_address}</p>
              <p><strong>Type:</strong> {singleDorm.housing_type}</p>
              <p><strong>Price:</strong> ₱{singleDorm.rent_price}</p>
              <button 
                onClick={() => setSingleDorm(null)} 
                style={{ fontSize: '0.7rem', marginTop: '10px', cursor: 'pointer', background: 'none', color: 'white', border: '1px solid white', padding: '2px 5px' }}
              >
                Clear Result
              </button>
            </div>
          )}
        </section>
      </div>

      {/* TABLE SECTION */}
      <section style={{ marginTop: '40px' }}>
        <h2>Existing Dormitories</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid white' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th style={{ padding: '10px' }}>Name</th>
              <th style={{ padding: '10px' }}>Address</th>
              <th style={{ padding: '10px' }}>Type</th>
              <th style={{ padding: '10px' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {dorms.map((dorm: any) => (
              <tr key={dorm.housing_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '10px' }}>{dorm.housing_id}</td>
                <td style={{ padding: '10px' }}>{dorm.housing_name}</td>
                <td style={{ padding: '10px' }}>{dorm.housing_address}</td>
                <td style={{ padding: '10px' }}>{dorm.housing_type}</td>
                <td style={{ padding: '10px' }}>₱{dorm.rent_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}