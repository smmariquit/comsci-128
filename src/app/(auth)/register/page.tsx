"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";



export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    password: "",
    birthday: "",
    home_address: "",
    phone_number: "",
    contact_email: "",
    sex: "",
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        account_email: form.email,
        first_name: form.first_name,
        middle_name: form.middle_name || null,
        last_name: form.last_name,
        password: form.password,
        birthday: form.birthday || null,
        home_address: form.home_address || null,
        phone_number: form.phone_number || null,
        contact_email: form.contact_email || null,
        sex: form.sex || "Prefer not to say",
      };
      const response = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed.");
      router.push("/student");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (

    <div className="w-full min-h-screen flex items-center justify-center bg-gray-950">
      <form
        className="bg-gray-800 rounded-3xl p-10 w-full max-w-md flex flex-col gap-4 shadow-lg"
        onSubmit={step === 3 ? handleRegister : e => { e.preventDefault(); setStep(step + 1); }}
        autoComplete="off"
      >
        <h2 className="text-3xl font-bold text-zinc-300 text-center mb-2">Sign up</h2>
        {error && <div className="text-red-400 text-center">{error}</div>}

        {step === 1 && (
          <>
            <input
              className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200"
              type="text"
              name="first_name"
              placeholder="First name"
              value={form.first_name}
              onChange={handleChange}
              required
            />
            <input
              className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200"
              type="text"
              name="middle_name"
              placeholder="Middle name (optional)"
              value={form.middle_name}
              onChange={handleChange}
            />
            <input
              className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200"
              type="text"
              name="last_name"
              placeholder="Last name"
              value={form.last_name}
              onChange={handleChange}
              required
            />
            <input
              className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200"
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200"
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </>
        )}

        {step === 2 && (
          <>
            <input
              className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200"
              type="date"
              name="birthday"
              placeholder="Birthday"
              value={form.birthday}
              onChange={handleChange}
            />
            <input
              className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200"
              type="text"
              name="home_address"
              placeholder="Home address"
              value={form.home_address}
              onChange={handleChange}
            />
            <input
              className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200"
              type="text"
              name="phone_number"
              placeholder="Phone number"
              value={form.phone_number}
              onChange={handleChange}
            />
            <input
              className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200"
              type="email"
              name="contact_email"
              placeholder="Contact email (optional)"
              value={form.contact_email}
              onChange={handleChange}
            />
            <select
              className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200"
              name="sex"
              value={form.sex}
              onChange={handleChange}
            >
              <option value="">Sex (optional)</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </>
        )}

        {step === 3 && (
          <div className="text-stone-200 space-y-2">
            <div><b>First name:</b> {form.first_name}</div>
            {form.middle_name && <div><b>Middle name:</b> {form.middle_name}</div>}
            <div><b>Last name:</b> {form.last_name}</div>
            <div><b>Email:</b> {form.email}</div>
            <div><b>Birthday:</b> {form.birthday}</div>
            <div><b>Home address:</b> {form.home_address}</div>
            <div><b>Phone number:</b> {form.phone_number}</div>
            <div><b>Contact email:</b> {form.contact_email}</div>
            <div><b>Sex:</b> {form.sex || "Prefer not to say"}</div>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          {step > 1 && (
            <button
              type="button"
              className="flex-1 bg-gray-600 text-white rounded-3xl py-3 hover:bg-gray-700 transition"
              onClick={() => setStep(step - 1)}
              disabled={loading}
            >
              Back
            </button>
          )}
          {step < 3 && (
            <button
              type="button"
              className="flex-1 bg-orange-300 text-gray-800 font-bold rounded-3xl py-3 hover:bg-orange-400 transition"
              onClick={() => setStep(step + 1)}
              disabled={loading}
            >
              Next
            </button>
          )}
          {step === 3 && (
            <button
              type="submit"
              className="flex-1 bg-orange-300 text-gray-800 font-bold rounded-3xl py-3 hover:bg-orange-400 transition"
              disabled={loading}
            >
              {loading ? "Registering..." : "Submit"}
            </button>
          )}
        </div>

        <div className="text-center text-stone-200 mt-2">
          Already have an account?{' '}
          <a href="/login" className="font-bold underline">Login</a>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className="flex-grow h-px bg-stone-400" />
          <span className="text-stone-400 text-xs">or</span>
          <div className="flex-grow h-px bg-stone-400" />
        </div>
        <button
          type="button"
          className="bg-stone-50 text-black rounded-lg py-3 mt-2 flex items-center justify-center gap-2 font-normal"
          // onClick={handleGoogleSignUp} // Implement Google sign up if needed
        >
          Sign up using Google
        </button>
      </form>
    </div>
  );
}
