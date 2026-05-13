"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/app/lib/browser-client";
import { setCookie } from "@/app/lib/utils";



export default function RegisterPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
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
  const [googleSignupPending, setGoogleSignupPending] = useState(false);

  useEffect(() => {
    const googleData = sessionStorage.getItem("googleSignupData");
    if (googleData) {
      try {
        const data = JSON.parse(googleData);
        if (data.googleError) {
          setError(data.googleError);
        }
        if (data.googleFirstName || data.googleLastName || data.googleEmail) {
          setForm(prev => ({
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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
        password: form.password,
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
          data: { account_number: profile.account_number }
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
        router.push(target);
      }
    } catch (_err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-950 font-[family-name:var(--font-geist-sans)]">
      {/* Left side - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#1C2632]">
        <img
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=2000"
          alt="Cozy Room"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C2632] via-transparent to-[#1C2632]/50" />
        
        <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[#C9642A] rounded-xl flex items-center justify-center text-white font-bold text-xl">C</div>
              <span className="text-2xl font-bold tracking-tighter text-white">UPLB CASA</span>
            </div>
            <h1 className="text-5xl font-bold text-[#EDE9DE] leading-tight max-w-md">
              Start your journey with <span className="text-[#C9642A]">UPLB CASA</span>.
            </h1>
          </div>
          
          <div className="space-y-4">
            <p className="text-lg text-stone-300 max-w-sm">
              Create an account and get instant access to the best student housing options.
            </p>
            <div className="flex gap-4">
              <div className="h-1 w-4 bg-stone-600 rounded-full" />
              <div className="h-1 w-12 bg-[#C9642A] rounded-full" />
              <div className="h-1 w-4 bg-stone-600 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <form
            className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 md:p-12 w-full flex flex-col gap-6 shadow-2xl"
            onSubmit={step === 3 ? handleRegister : e => { e.preventDefault(); setStep(step + 1); }}
            autoComplete="off"
          >
            <div className="text-center space-y-2 mb-2">
              <h2 className="text-3xl font-bold text-white tracking-tight">Create account</h2>
              <p className="text-stone-400 text-sm">Join the community today</p>
              
              {/* Step indicator */}
              <div className="flex justify-center gap-2 pt-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${step >= s ? 'w-8 bg-[#C9642A]' : 'w-2 bg-gray-700'}`} />
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm text-center animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">First Name</label>
                      <input
                        className="w-full bg-gray-900/50 text-white rounded-xl px-4 py-3 outline-none border border-gray-700 focus:border-[#C9642A] transition-all"
                        type="text"
                        name="first_name"
                        placeholder="John"
                        value={form.first_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">Last Name</label>
                      <input
                        className="w-full bg-gray-900/50 text-white rounded-xl px-4 py-3 outline-none border border-gray-700 focus:border-[#C9642A] transition-all"
                        type="text"
                        name="last_name"
                        placeholder="Doe"
                        value={form.last_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">Middle Name (Optional)</label>
                    <input
                      className="w-full bg-gray-900/50 text-white rounded-xl px-4 py-3 outline-none border border-gray-700 focus:border-[#C9642A] transition-all"
                      type="text"
                      name="middle_name"
                      placeholder="Quincy"
                      value={form.middle_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">Email Address</label>
                    <input
                      className="w-full bg-gray-900/50 text-white rounded-xl px-4 py-3 outline-none border border-gray-700 focus:border-[#C9642A] transition-all"
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">Password</label>
                    <input
                      className="w-full bg-gray-900/50 text-white rounded-xl px-4 py-3 outline-none border border-gray-700 focus:border-[#C9642A] transition-all"
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">Birthday</label>
                      <input
                        className="w-full bg-gray-900/50 text-white rounded-xl px-4 py-3 outline-none border border-gray-700 focus:border-[#C9642A] transition-all"
                        type="date"
                        name="birthday"
                        value={form.birthday}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">Sex</label>
                      <select
                        className="w-full bg-gray-900/50 text-white rounded-xl px-4 py-3 outline-none border border-gray-700 focus:border-[#C9642A] transition-all appearance-none"
                        name="sex"
                        value={form.sex}
                        onChange={handleChange}
                      >
                        <option value="">Select...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Prefer not to say">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">Home Address</label>
                    <input
                      className="w-full bg-gray-900/50 text-white rounded-xl px-4 py-3 outline-none border border-gray-700 focus:border-[#C9642A] transition-all"
                      type="text"
                      name="home_address"
                      placeholder="Street, City, Province"
                      value={form.home_address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">Phone Number</label>
                    <input
                      className="w-full bg-gray-900/50 text-white rounded-xl px-4 py-3 outline-none border border-gray-700 focus:border-[#C9642A] transition-all"
                      type="text"
                      name="phone_number"
                      placeholder="09123456789"
                      value={form.phone_number}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">Contact Email (Optional)</label>
                    <input
                      className="w-full bg-gray-900/50 text-white rounded-xl px-4 py-3 outline-none border border-gray-700 focus:border-[#C9642A] transition-all"
                      type="email"
                      name="contact_email"
                      placeholder="alt@example.com"
                      value={form.contact_email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="bg-gray-900/50 rounded-2xl p-6 space-y-3 border border-gray-700">
                    <h3 className="text-white font-bold text-sm uppercase tracking-widest border-b border-gray-700 pb-2 mb-4">Summary</h3>
                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                      <span className="text-stone-500">Name</span>
                      <span className="text-white text-right">{form.first_name} {form.last_name}</span>
                      
                      <span className="text-stone-500">Email</span>
                      <span className="text-white text-right truncate pl-4">{form.email}</span>
                      
                      <span className="text-stone-500">Birthday</span>
                      <span className="text-white text-right">{form.birthday}</span>
                      
                      <span className="text-stone-500">Address</span>
                      <span className="text-white text-right line-clamp-1">{form.home_address}</span>
                      
                      <span className="text-stone-500">Phone</span>
                      <span className="text-white text-right">{form.phone_number}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-stone-500 text-center px-4">
                    By clicking submit, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-2">
              {step > 1 && (
                <button
                  type="button"
                  className="flex-1 bg-gray-700 text-white font-bold rounded-xl py-3.5 hover:bg-gray-600 active:scale-[0.98] transition-all"
                  onClick={() => setStep(step - 1)}
                  disabled={loading}
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className="flex-[2] bg-[#C9642A] text-white font-bold rounded-xl py-3.5 hover:bg-[#b5561f] active:scale-[0.98] transition-all shadow-lg shadow-[#C9642A]/20"
                disabled={loading}
              >
                {step === 3 ? (loading ? "Registering..." : "Submit") : "Continue"}
              </button>
            </div>

            {step === 1 && (
              <>
                <div className="relative flex items-center gap-4 my-2">
                  <div className="flex-grow h-px bg-gray-700" />
                  <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">or sign up with</span>
                  <div className="flex-grow h-px bg-gray-700" />
                </div>

                <button
                  type="button"
                  className="bg-white hover:bg-stone-100 text-black rounded-xl py-3 flex items-center justify-center gap-3 font-semibold transition-all active:scale-[0.98]"
                  onClick={async () => {
                    await supabase.auth.signInWithOAuth({
                      provider: "google",
                      options: {
                        redirectTo: `${window.location.origin}/google-login?intent=signup`,
                        skipBrowserRedirect: false,
                      },
                    });
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
              </>
            )}

            <div className="text-center text-sm text-stone-400 mt-2">
              Already have an account?{' '}
              <a href="/login" className="font-bold text-[#C9642A] hover:underline">Login</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

}
