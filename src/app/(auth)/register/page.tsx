"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/app/lib/browser-client";
import { setCookie } from "@/app/lib/utils";
import PageLoading from "@/app/components/ui/page-loading";
import { Eye, EyeOff } from "lucide-react";
import ThemedDatePicker from "@/app/components/ui/ThemedDatePicker";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [form, setForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    birthday: "",
    home_address: "",
    phone_number: "",
    contact_email: "",
    sex: "",
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [emailError, setEmailError] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [nameErrors, setNameErrors] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
  });
  const [passwordStrength, setPasswordStrength] = useState({
    label: "Start typing",
    bars: 0,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleSignupPending, setGoogleSignupPending] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [dpaRequired, setDpaRequired] = useState(true);
  const draftKey = "register-form-draft";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function getPasswordStrength(password: string) {
    if (!password) return { label: "Start typing", bars: 0 };

    const variety = [
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ].filter(Boolean).length;

    if (password.length < 8) return { label: "Weak", bars: 1 };
    if (variety <= 1) return { label: "Fair", bars: 2 };
    if (variety === 2) return { label: "Good", bars: 3 };
    return { label: "Strong", bars: 4 };
  }

  useEffect(() => {
    // Read dpa_required from system configuration cookies
    const match = document.cookie
      .split("; ")
      .find((cookie) => cookie.trim().startsWith("dpa_required="));
    if (match) {
      setDpaRequired(match.split("=")[1] !== "false");
    }

    const savedDraft = localStorage.getItem(draftKey);

    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        if (parsedDraft.form) {
          setForm((prev) => ({ ...prev, ...parsedDraft.form }));
          if (parsedDraft.form.password) {
            setPasswordStrength(getPasswordStrength(parsedDraft.form.password));
          }
        }
        if (typeof parsedDraft.step === "number") {
          setStep(parsedDraft.step);
        }
      } catch (err) {
        console.error("Failed to parse register draft:", err);
      }
    }

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

  useEffect(() => {
    localStorage.setItem(
      draftKey,
      JSON.stringify({
        form,
        step,
      }),
    );
  }, [draftKey, form, step]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setStatus("");

    if (name === "email") {
      setEmailError(
        value && !emailRegex.test(value) ? "Enter a valid email address." : "",
      );
    }

    if (name === "password") {
      setPasswordStrength(getPasswordStrength(value));
    }

    if (
      name === "first_name" ||
      name === "middle_name" ||
      name === "last_name"
    ) {
      const trimmedValue = value.trim();
      const hasLetter = /[a-zA-Z]/.test(trimmedValue);

      setNameErrors((prev) => ({
        ...prev,
        [name]:
          trimmedValue === ""
            ? ""
            : hasLetter
              ? ""
              : `${name
                  .replace("_", " ")
                  .replace(/\b\w/g, (letter) =>
                    letter.toUpperCase(),
                  )} must contain at least one letter.`,
      }));
    }
  }

  function validateNameFields(): boolean {
    // Name fields must contain at least one letter
    const hasLetter = (str: string) => /[a-zA-Z]/.test(str);
    const nextErrors = {
      first_name: hasLetter(form.first_name.trim())
        ? ""
        : "First name must contain at least one letter.",
      middle_name:
        form.middle_name.trim() === "" || hasLetter(form.middle_name.trim())
          ? ""
          : "Middle name must contain at least one letter.",
      last_name: hasLetter(form.last_name.trim())
        ? ""
        : "Last name must contain at least one letter.",
    };

    setNameErrors(nextErrors);

    if (nextErrors.first_name) {
      setError("First name must contain at least one letter.");
      return false;
    }

    if (nextErrors.middle_name) {
      setError("Middle name must contain at least one letter.");
      return false;
    }

    if (nextErrors.last_name) {
      setError("Last name must contain at least one letter.");
      return false;
    }

    setError("");
    return true;
  }

  function validateStepOne(): boolean {
    if (!validateNameFields()) {
      return false;
    }

    if (!form.email.trim()) {
      setEmailError("Email is required.");
      setError("Email is required.");
      return false;
    }

    if (!emailRegex.test(form.email.trim())) {
      setEmailError("Enter a valid email address.");
      setError("Enter a valid email address.");
      return false;
    }

    if (!form.password) {
      setError("Password is required.");
      return false;
    }

    if (passwordStrength.bars < 3) {
      setError("Use at least 8 characters with a mix of letters and numbers.");
      return false;
    }

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return false;
    }

    setError("");
    return true;
  }

  async function handleConfirmEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setStatus("");

    const token = confirmationCode.trim();
    if (!token) {
      setError("Enter the confirmation code from your email.");
      return;
    }

    setLoading(true);
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: form.email.trim(),
      token,
      type: "email",
    });

    if (verifyError) {
      setError(verifyError.message);
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    localStorage.removeItem(draftKey);
    router.push("/login");
  }

  async function handleResendCode() {
    setError("");
    setStatus("");
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: form.email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (resendError) {
      setError(resendError.message);
      return;
    }

    setStatus("A new confirmation code was sent.");
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (dpaRequired && !privacyAgreed) {
      setError(
        "Please check the box to agree with the Data Privacy Act compliance terms.",
      );
      return;
    }

    setStatus("");
    setLoading(true);
    try {
      const endpoint = googleSignupPending ? "/api" : "/api/student";
      const payload = {
        account_email: form.email.trim(),
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
        ...(!googleSignupPending ? { authUserAlreadyCreated: true } : {}),
      };

      if (!googleSignupPending) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: form.email.trim(),
          password: form.password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`,
            data: {
              first_name: form.first_name,
              last_name: form.last_name,
            },
          },
        });

        if (signUpError) {
          throw signUpError;
        }
      }

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
        if (!googleSignupPending) {
          setStatus(
            "Confirmation code sent. Check your email to finish signup.",
          );
          setStep(4);
          return;
        }

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
        router.push(target);
        localStorage.removeItem(draftKey);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <PageLoading label="Registering..." />;
  }

  const canContinueStepOne =
    form.first_name.trim() !== "" &&
    form.last_name.trim() !== "" &&
    form.email.trim() !== "" &&
    form.password !== "" &&
    form.confirm_password !== "" &&
    form.password === form.confirm_password &&
    passwordStrength.bars >= 3 &&
    !nameErrors.first_name &&
    !nameErrors.middle_name &&
    !nameErrors.last_name &&
    !emailError;

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-950">
      <form
        className="bg-gray-800 rounded-3xl p-10 w-full max-w-md flex flex-col gap-4 shadow-lg"
        onSubmit={
          step === 3
            ? handleRegister
            : step === 4
              ? handleConfirmEmail
              : (e) => {
                  e.preventDefault();
                  if (step === 1 && !validateStepOne()) {
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
        {status && (
          <div className="text-orange-300 text-center text-sm">{status}</div>
        )}

        {step === 1 && (
          <>
            <div>
              <input
                className={`w-full bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border transition-colors [&:-webkit-autofill]:[box-shadow:0_0_0_30px_#374151_inset_!important] [&:-webkit-autofill]:[-webkit-text-fill-color:white_!important] ${
                  nameErrors.first_name
                    ? "border-red-500"
                    : "border-stone-500/60 focus:border-orange-400"
                }`}
                type="text"
                name="first_name"
                placeholder="First name"
                value={form.first_name}
                onChange={handleChange}
                required
              />
              {nameErrors.first_name && (
                <p className="text-red-400 text-sm mt-1">
                  {nameErrors.first_name}
                </p>
              )}
            </div>
            <div>
              <input
                className={`w-full bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border transition-colors [&:-webkit-autofill]:[box-shadow:0_0_0_30px_#374151_inset_!important] [&:-webkit-autofill]:[-webkit-text-fill-color:white_!important] ${
                  nameErrors.middle_name
                    ? "border-red-500"
                    : "border-stone-500/60 focus:border-orange-400"
                }`}
                type="text"
                name="middle_name"
                placeholder="Middle name (optional)"
                value={form.middle_name}
                onChange={handleChange}
              />
              {nameErrors.middle_name && (
                <p className="text-red-400 text-sm mt-1">
                  {nameErrors.middle_name}
                </p>
              )}
            </div>
            <div>
              <input
                className={`w-full bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border transition-colors [&:-webkit-autofill]:[box-shadow:0_0_0_30px_#374151_inset_!important] [&:-webkit-autofill]:[-webkit-text-fill-color:white_!important] ${
                  nameErrors.last_name
                    ? "border-red-500"
                    : "border-stone-500/60 focus:border-orange-400"
                }`}
                type="text"
                name="last_name"
                placeholder="Last name"
                value={form.last_name}
                onChange={handleChange}
                required
              />
              {nameErrors.last_name && (
                <p className="text-red-400 text-sm mt-1">
                  {nameErrors.last_name}
                </p>
              )}
            </div>
            <div>
              <input
                className={`w-full bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border transition-colors [&:-webkit-autofill]:[box-shadow:0_0_0_30px_#374151_inset_!important] [&:-webkit-autofill]:[-webkit-text-fill-color:white_!important] ${
                  emailError
                    ? "border-red-500"
                    : "border-stone-500/60 focus:border-orange-400"
                }`}
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <div className="mt-1 text-xs">
                <span
                  className={emailError ? "text-red-400" : "text-stone-400"}
                >
                  {form.email === ""
                    ? "Type an email address"
                    : emailError || "Email looks valid"}
                </span>
              </div>
            </div>
            <div>
              <div className="relative">
                <input
                  className="w-full bg-gray-700 text-stone-200 rounded-xl px-4 py-3 pr-12 outline-none border border-stone-500/60 focus:border-orange-400 transition-colors [&:-webkit-autofill]:[box-shadow:0_0_0_30px_#374151_inset_!important] [&:-webkit-autofill]:[-webkit-text-fill-color:white_!important]"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span>Password strength</span>
                  <span className="font-medium text-orange-300">
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        index < passwordStrength.bars
                          ? "bg-orange-300"
                          : "bg-stone-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="relative mt-2">
                <input
                  className="w-full bg-gray-700 text-stone-200 rounded-xl px-4 py-3 pr-12 outline-none border border-stone-500/60 focus:border-orange-400 transition-colors [&:-webkit-autofill]:[box-shadow:0_0_0_30px_#374151_inset_!important] [&:-webkit-autofill]:[-webkit-text-fill-color:white_!important]"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  placeholder="Confirm password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 transition-colors"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">
                Birthday
              </label>
              <ThemedDatePicker
                id="birthday"
                value={form.birthday}
                onChange={(val) =>
                  handleChange({
                    target: { name: "birthday", value: val },
                  } as any)
                }
                maxDate={new Date().toISOString().split("T")[0]}
                placeholder="Select your birthday"
                className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-500/60 focus:border-orange-400 transition-colors w-full"
              />
            </div>
            <input
              className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-500/60 focus:border-orange-400 transition-colors [&:-webkit-autofill]:[box-shadow:0_0_0_30px_#374151_inset_!important] [&:-webkit-autofill]:[-webkit-text-fill-color:white_!important]"
              type="text"
              name="home_address"
              placeholder="Home address"
              value={form.home_address}
              onChange={handleChange}
            />
            <input
              className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-500/60 focus:border-orange-400 transition-colors [&:-webkit-autofill]:[box-shadow:0_0_0_30px_#374151_inset_!important] [&:-webkit-autofill]:[-webkit-text-fill-color:white_!important]"
              type="text"
              name="phone_number"
              placeholder="Phone number"
              value={form.phone_number}
              onChange={handleChange}
            />
            <input
              className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-500/60 focus:border-orange-400 transition-colors [&:-webkit-autofill]:[box-shadow:0_0_0_30px_#374151_inset_!important] [&:-webkit-autofill]:[-webkit-text-fill-color:white_!important]"
              type="email"
              name="contact_email"
              placeholder="Contact email (optional)"
              value={form.contact_email}
              onChange={handleChange}
            />
            <select
              className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-500/60 focus:border-orange-400 transition-colors"
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
          <div className="space-y-4 text-stone-200">
            <div className="rounded-2xl border border-stone-500/60 bg-gray-700/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-300">
                Review profile
              </p>
              <div className="mt-3 grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-stone-300">Name</span>
                  <span className="text-right font-medium text-white">
                    {[form.first_name, form.middle_name, form.last_name]
                      .filter(Boolean)
                      .join(" ")}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-stone-300">Email</span>
                  <span className="text-right font-medium text-white">
                    {form.email}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-stone-300">Birthday</span>
                  <span className="text-right font-medium text-white">
                    {form.birthday || "Not provided"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-stone-300">Sex</span>
                  <span className="text-right font-medium text-white">
                    {form.sex || "Prefer not to say"}
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-stone-500/40 bg-gray-900/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                Contact details
              </p>
              <div className="mt-3 grid gap-2 text-sm text-stone-300">
                <p>{form.home_address || "No home address provided"}</p>
                <p>{form.phone_number || "No phone number provided"}</p>
                <p>{form.contact_email || "No contact email provided"}</p>
              </div>
            </div>

            {/* Data Privacy Compliance Checkbox */}
            {dpaRequired && (
              <div className="flex items-start gap-3 border-t border-white/10 pt-4 bg-[#18222b]/50 p-4 rounded-xl">
                <input
                  id="privacy_conforme"
                  type="checkbox"
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                  className="mt-1 min-w-4 min-h-4 max-w-4 max-h-4 shrink-0 appearance-none rounded border border-zinc-500 bg-zinc-800 checked:bg-orange-500 checked:border-orange-500 focus:ring-orange-500 focus:ring-offset-0 focus:outline-none relative after:content-[''] after:absolute after:hidden checked:after:block after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:rotate-45 cursor-pointer"
                  required
                />
                <label
                  htmlFor="privacy_conforme"
                  className="text-xs text-stone-300 leading-relaxed cursor-pointer select-none"
                >
                  I hereby authorize <b>UPLB CASA</b> to collect, process, and
                  store my personal details in strict compliance with the{" "}
                  <b>
                    Republic of the Philippines Data Privacy Act of 2012 (RA
                    10173)
                  </b>{" "}
                  and its implementing rules.
                </label>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 text-stone-200">
            <div className="rounded-2xl border border-orange-300/50 bg-orange-300/10 p-4">
              <p className="text-sm font-semibold text-orange-200">
                Confirm your email
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-300">
                We sent a confirmation code to {form.email}. Enter it here to
                verify the account before signing in.
              </p>
            </div>
            <input
              className="w-full bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-500/60 focus:border-orange-400 transition-colors [&:-webkit-autofill]:[box-shadow:0_0_0_30px_#374151_inset_!important] [&:-webkit-autofill]:[-webkit-text-fill-color:white_!important]"
              type="text"
              inputMode="numeric"
              placeholder="Confirmation code"
              value={confirmationCode}
              onChange={(event) => setConfirmationCode(event.target.value)}
              required
            />
            <button
              type="button"
              className="text-sm font-semibold text-orange-300 underline underline-offset-4"
              onClick={handleResendCode}
              disabled={loading}
            >
              Resend code
            </button>
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
              className="flex-1 bg-orange-300 text-gray-800 font-bold rounded-3xl py-3 hover:bg-orange-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={() => {
                if (step === 1 && !validateStepOne()) {
                  return;
                }
                setStep(step + 1);
              }}
              disabled={loading || (step === 1 && !canContinueStepOne)}
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
          {step === 4 && (
            <button
              type="submit"
              className="flex-1 bg-orange-300 text-gray-800 font-bold rounded-3xl py-3 hover:bg-orange-400 transition"
              disabled={loading}
            >
              Confirm email
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
