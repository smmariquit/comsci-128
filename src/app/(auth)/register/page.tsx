"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/app/lib/browser-client";
import { setCookie } from "@/app/lib/utils";
import PageLoading from "@/app/components/ui/page-loading";
import { useAutoSave } from "@/app/hooks/useAutoSave";
import AutosaveStatus from "@/app/components/ui/AutosaveStatus";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [form, setForm, clearSaved, _hasSavedData, saveState] = useAutoSave(
    "casa-register",
    {
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      birthday: "",
      home_address: "",
      phone_number: "",
      contact_email: "",
      sex: "",
    }
  );
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleSignupPending, setGoogleSignupPending] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedStep = localStorage.getItem("casa-register-step");
    if (!savedStep) return;
    const parsed = Number(savedStep);
    if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= 3) {
      setStep(parsed);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("casa-register-step", String(step));
  }, [step]);

  useEffect(() => {
    const googleData = sessionStorage.getItem("googleSignupData");
    if (googleData) {
      try {
        const data = JSON.parse(googleData);
        if (data.googleError) {
          setError(data.googleError);
        }
        if (data.googleFirstName || data.googleLastName || data.googleEmail) {
          setForm((prev) => ({
            ...prev,
            first_name: data.googleFirstName || prev.first_name,
            last_name: data.googleLastName || prev.last_name,
            email: data.googleEmail || prev.email,
          }));
          setGoogleSignupPending(true);
        }
        sessionStorage.removeItem("googleSignupData");
      } catch (err) {
        console.error("Failed to parse Google signup data:", err);
      }
    }
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validateNameFields(): boolean {
    // Name fields must contain at least one letter
    const hasLetter = (str: string) => /[a-zA-Z]/.test(str);
    
    if (!hasLetter(form.first_name.trim())) {
      setError("First name must contain at least one letter.");
      return false;
    }
    
    if (form.middle_name && !hasLetter(form.middle_name.trim())) {
      setError("Middle name must contain at least one letter.");
      return false;
    }
    
    if (!hasLetter(form.last_name.trim())) {
      setError("Last name must contain at least one letter.");
      return false;
    }
    
    setError("");
    return true;
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = googleSignupPending ? "/api" : "/api/student";
      const payload = {
        account_email: form.email,
        first_name: form.first_name,
        middle_name: form.middle_name || null,
        last_name: form.last_name,
        password,
        birthday: form.birthday || null,
        home_address: form.home_address || null,
        phone_number: form.phone_number || null,
        contact_email: form.contact_email || null,
        sex: form.sex || "Prefer not to say",
        ...(googleSignupPending ? { googleSignup: true } : {}),
      };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      // Role-based redirection logic
      const profile = data.user;
      if (profile) {
        const userType = profile.user_type?.toLowerCase();

        await supabase.auth.updateUser({
          data: { account_number: profile.account_number },
        });

        setCookie("account_number", String(profile.account_number), 1);
        setCookie("is_logged_in", "true", 1);

        if (userType === "manager") {
          const managerType = data.manager_type?.toLowerCase();
          setCookie("user_role", managerType || "manager", 1);
        } else {
          setCookie("user_role", userType, 1);
        }

        let target = "/";

        if (userType === "student") {
          target = "/student";
        } else if (userType === "system admin" || userType === "admin") {
          target = "/sys";
        } else if (userType === "manager") {
          // Fetch manager details to determine if they are a Housing Admin or Landlord
          const { data: manager } = await supabase
            .from("manager")
            .select("manager_type")
            .eq("account_number", profile.account_number)
            .single();

          const managerType = manager?.manager_type?.toLowerCase();
          if (
            managerType === "housing administrator" ||
            managerType === "house admin"
          ) {
            target = "/admin";
          } else {
            target = "/manage";
          }
        }
        clearSaved();
        setPassword("");
        if (typeof window !== "undefined") {
          localStorage.removeItem("casa-register-step");
        }
        router.push(target);
      }
    } catch (_err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <PageLoading label="Registering..." />;
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-950">
      <form
        className="bg-gray-800 rounded-3xl p-10 w-full max-w-md flex flex-col gap-4 shadow-lg"
        onSubmit={
          step === 3
            ? handleRegister
            : (e) => {
                e.preventDefault();
                if (step === 1 && !validateNameFields()) {
                  return;
                }
                setStep(step + 1);
              }
        }
        autoComplete="off"
      >
        <h2 className="text-3xl font-bold text-zinc-300 text-center mb-2">
          Sign up
        </h2>
        {error && <div className="text-red-400 text-center">{error}</div>}
        <AutosaveStatus saveState={saveState} className="mx-auto" />

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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            <div>
              <b>First name:</b> {form.first_name}
            </div>
            {form.middle_name && (
              <div>
                <b>Middle name:</b> {form.middle_name}
              </div>
            )}
            <div>
              <b>Last name:</b> {form.last_name}
            </div>
            <div>
              <b>Email:</b> {form.email}
            </div>
            <div>
              <b>Birthday:</b> {form.birthday}
            </div>
            <div>
              <b>Home address:</b> {form.home_address}
            </div>
            <div>
              <b>Phone number:</b> {form.phone_number}
            </div>
            <div>
              <b>Contact email:</b> {form.contact_email}
            </div>
            <div>
              <b>Sex:</b> {form.sex || "Prefer not to say"}
            </div>
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
          Already have an account?{" "}
          <a href="/login" className="font-bold underline">
            Login
          </a>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className="flex-grow h-px bg-stone-400" />
          <span className="text-stone-400 text-xs">or</span>
          <div className="flex-grow h-px bg-stone-400" />
        </div>
        <button
          type="button"
          className="bg-stone-50 text-black rounded-lg py-3 mt-2 flex items-center justify-center gap-2 font-normal"
          onClick={async () => {
            setLoading(true);
            await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: `${window.location.origin}/google-login?intent=signup`,
                skipBrowserRedirect: false,
              },
            });
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign up using Google
        </button>
      </form>
    </div>
  );
}
