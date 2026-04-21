// 1. Update the State Interface
const [form, setForm] = useState<RoomForm>({
  housing_id:        initial?.housing_id        ?? "",     // Use ID, not Name
  room_code:         initial?.room_code         ?? "",     // Added this
  room_type:         initial?.room_type         ?? "Women Only", // Match DB Enum
  maximum_occupants: initial?.maximum_occupants ?? 1,
  occupancy_status:  initial?.occupancy_status  ?? "Empty",
  payment_status:    initial?.payment_status    ?? "Pending", // Added this
});

// 2. Update the Property Select
<Field label="Property" htmlFor="rm-property">
  <select
    id="rm-property"
    value={form.housing_id}
    onChange={(e) => setForm({ ...form, housing_id: e.target.value })}
    style={selectStyle}
  >
    <option value="">Select property...</option>
    {housingOptions.map((h) => (
      <option key={h.id} value={h.id}>{h.name}</option> // Pass ID to the DB
    ))}
  </select>
</Field>

// 3. Add the Room Code Field
<Field label="Room Code/Number" htmlFor="rm-code">
  <input 
    id="rm-code"
    type="number"
    value={form.room_code}
    onChange={(e) => setForm({ ...form, room_code: e.target.value })}
    style={inputStyle}
    placeholder="e.g. 101"
  />
</Field>