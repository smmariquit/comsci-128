"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("");

  // Step 1: Ask for email
  // Step 2: Ask for code
  // Step 3: Ask for new password

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("");
    // Here you would trigger the email send (extensible for real backend)
    setStep(2);
  }

  function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("");
    // Here you would verify the code (extensible for real backend)
    setStep(3);
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Password changed! (Demo only)");
    // Here you would actually change the password (extensible for real backend)
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-950">
      <form className="bg-gray-800 rounded-3xl p-10 w-full max-w-md flex flex-col gap-4 shadow-lg" autoComplete="off"
        method="POST"
        onSubmit={
          step === 1 ? handleEmailSubmit : step === 2 ? handleCodeSubmit : handlePasswordSubmit
        }
      >
        <h2 className="text-3xl font-bold text-zinc-300 text-center mb-2">Forgot Password</h2>
        {status && (
          <div className={`text-center p-3 rounded-xl ${status.includes("Demo") || status.includes("successful") ? "bg-green-900/30 text-green-400" : "bg-blue-900/30 text-blue-400"}`}>
            {status}
          </div>
        )}
        {step === 1 && (
          <>
            <input
              className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="bg-orange-300 text-gray-800 font-bold rounded-3xl py-3 hover:bg-orange-400 transition">Send reset code</button>
          </>
        )}
        {step === 2 && (
          <>
            <input
              className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200"
              type="text"
              placeholder="Enter code from email"
              value={code}
              onChange={e => setCode(e.target.value)}
              required
            />
            <button type="submit" className="bg-orange-300 text-gray-800 font-bold rounded-3xl py-3 hover:bg-orange-400 transition">Verify code</button>
          </>
        )}
        {step === 3 && (
          <>
            <input
              className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
            <button type="submit" className="bg-orange-300 text-gray-800 font-bold rounded-3xl py-3 hover:bg-orange-400 transition">Change password</button>
          </>
        )}
        <div className="text-center text-stone-200 mt-2">
          <a href="/login" className="font-bold underline">Back to login</a>
        </div>
      </form>
    </div>
  );
}
