"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSupabaseBrowserClient } from "@/app/lib/browser-client";
import { setCookie } from "@/app/lib/utils";
import { useToast } from "@/app/components/ui/Toast";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const toast = useToast();
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
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validateStep(currentStep: number): boolean {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!form.first_name.trim()) {
        errors.first_name = "First name is required";
        isValid = false;
      }
      if (!form.last_name.trim()) {
        errors.last_name = "Last name is required";
        isValid = false;
      }
      if (!form.email.trim()) {
        errors.email = "Email is required";
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = "Please enter a valid email address";
        isValid = false;
      }
      if (!form.password) {
        errors.password = "Password is required";
        isValid = false;
      } else if (form.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
        isValid = false;
      }
    }

    setFieldErrors(errors);
    return isValid;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function handleNextStep(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      toast.error("Please fix the errors below");
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      toast.success("Registration successful! Redirecting...");

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
        router.push(target);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-950 py-6">
      <form
        className="bg-gray-800 rounded-3xl p-10 w-full max-w-md flex flex-col gap-4 shadow-lg"
        onSubmit={step === 3 ? handleRegister : handleNextStep}
        autoComplete="off"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-zinc-300">Sign up</h2>
          <span className="text-xs text-stone-400">Step {step} of 3</span>
        </div>

        {step === 1 && (
          <>
            <p className="text-sm text-stone-300 mb-2">Enter your basic information</p>
            <div className="flex flex-col gap-3">
              <div>
                <label htmlFor="first_name" className="text-stone-300 text-sm font-medium mb-1 block">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="first_name"
                  className={`w-full bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border ${
                    fieldErrors.first_name ? "border-red-500" : "border-stone-200"
                  } focus:border-orange-300 transition`}
                  type="text"
                  name="first_name"
                  placeholder="John"
                  value={form.first_name}
                  onChange={handleChange}
                  disabled={loading}
                />
                {fieldErrors.first_name && (
                  <p className="text-red-400 text-xs mt-1">{fieldErrors.first_name}</p>
                )}
              </div>

              <div>
                <label htmlFor="middle_name" className="text-stone-300 text-sm font-medium mb-1 block">
                  Middle Name <span className="text-stone-500">(optional)</span>
                </label>
                <input
                  id="middle_name"
                  className="w-full bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200 focus:border-orange-300 transition"
                  type="text"
                  name="middle_name"
                  placeholder="Michael"
                  value={form.middle_name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="last_name" className="text-stone-300 text-sm font-medium mb-1 block">
                  Last Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="last_name"
                  className={`w-full bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border ${
                    fieldErrors.last_name ? "border-red-500" : "border-stone-200"
                  } focus:border-orange-300 transition`}
                  type="text"
                  name="last_name"
                  placeholder="Doe"
                  value={form.last_name}
                  onChange={handleChange}
                  disabled={loading}
                />
                {fieldErrors.last_name && (
                  <p className="text-red-400 text-xs mt-1">{fieldErrors.last_name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="text-stone-300 text-sm font-medium mb-1 block">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  id="email"
                  className={`w-full bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border ${
                    fieldErrors.email ? "border-red-500" : "border-stone-200"
                  } focus:border-orange-300 transition`}
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="email"
                />
                {fieldErrors.email && (
                  <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="text-stone-300 text-sm font-medium mb-1 block">
                  Password <span className="text-red-400">*</span>
                </label>
                <input
                  id="password"
                  className={`w-full bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border ${
                    fieldErrors.password ? "border-red-500" : "border-stone-200"
                  } focus:border-orange-300 transition`}
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="new-password"
                />
                <p className="text-stone-400 text-xs mt-1">At least 8 characters</p>
                {fieldErrors.password && (
                  <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>
                )}
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-sm text-stone-300 mb-2">Add additional details (optional)</p>
            <div className="flex flex-col gap-3">
              <div>
                <label htmlFor="birthday" className="text-stone-300 text-sm font-medium mb-1 block">
                  Birthday
                </label>
                <input
                  id="birthday"
                  className="w-full bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200 focus:border-orange-300 transition"
                  type="date"
                  name="birthday"
                  value={form.birthday}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="home_address" className="text-stone-300 text-sm font-medium mb-1 block">
                  Home Address
                </label>
                <input
                  id="home_address"
                  className="w-full bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200 focus:border-orange-300 transition"
                  type="text"
                  name="home_address"
                  placeholder="123 Main St, City"
                  value={form.home_address}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="phone_number" className="text-stone-300 text-sm font-medium mb-1 block">
                  Phone Number
                </label>
                <input
                  id="phone_number"
                  className="w-full bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200 focus:border-orange-300 transition"
                  type="tel"
                  name="phone_number"
                  placeholder="+63 9XX XXX XXXX"
                  value={form.phone_number}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="contact_email" className="text-stone-300 text-sm font-medium mb-1 block">
                  Alternative Contact Email
                </label>
                <input
                  id="contact_email"
                  className="w-full bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200 focus:border-orange-300 transition"
                  type="email"
                  name="contact_email"
                  placeholder="alternate@example.com"
                  value={form.contact_email}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="sex" className="text-stone-300 text-sm font-medium mb-1 block">
                  Gender
                </label>
                <select
                  id="sex"
                  className="w-full bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200 focus:border-orange-300 transition"
                  name="sex"
                  value={form.sex}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Select (optional)</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-sm text-stone-300 mb-4">Please review your information</p>
            <div className="bg-gray-700 rounded-xl p-4 space-y-2 text-stone-200 mb-4">
              <div className="flex justify-between">
                <span className="text-stone-400">Name:</span>
                <span>{form.first_name} {form.middle_name} {form.last_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Email:</span>
                <span>{form.email}</span>
              </div>
              {form.birthday && (
                <div className="flex justify-between">
                  <span className="text-stone-400">Birthday:</span>
                  <span>{form.birthday}</span>
                </div>
              )}
              {form.phone_number && (
                <div className="flex justify-between">
                  <span className="text-stone-400">Phone:</span>
                  <span>{form.phone_number}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-stone-400 mb-4">Click "Complete Registration" to finish creating your account.</p>
          </>
        )}

        <div className="flex gap-3 mt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              disabled={loading}
              className="flex-1 bg-gray-600 text-stone-200 font-semibold rounded-3xl py-3 hover:bg-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-orange-300 text-gray-800 font-bold rounded-3xl py-3 hover:bg-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
            )}
            {loading ? "Processing..." : step === 3 ? "Complete Registration" : "Next"}
          </button>
        </div>

        <div className="text-center text-stone-200 mt-2 text-sm">
          Already have an account?{" "}
          <a href="/login" className="font-bold underline hover:text-stone-100">
            Login
          </a>
        </div>
      </form>
    </div>
  );
}
