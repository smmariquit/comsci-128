"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // required fields
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // temporrary student number placeholder
  const _student_number = 202306777;

  // optional fields
  const [middle_name, setMiddleName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [home_address, setHomeAddress] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [contact_email, _setContactEmail] = useState("");
  const [sex, setSex] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account_email: email,
          first_name,
          middle_name: middle_name || null,
          last_name,
          password: password,
          birthday: birthday || null,
          home_address: home_address || null,
          phone_number: phone_number || null,
          contact_email: contact_email || null,
          sex: sex || "Prefer not to say",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      router.push("/student");
    } catch (_err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="w-[1440px] h-[900px] relative bg-black/20 overflow-hidden">
    <div className="w-96 h-12 pl-7 pr-56 py-3 left-[834px] top-[292px] absolute bg-gray-800 rounded-3xl outline outline-1 outline-stone-200 inline-flex justify-start items-center gap-2.5">
        <div className="justify-start text-stone-200 text-base font-normal font-['Inter']">| Enter first name</div>
    </div>
    <div className="w-96 h-12 pl-7 pr-56 py-3 left-[834px] top-[356px] absolute bg-gray-800 rounded-3xl outline outline-1 outline-stone-200 inline-flex justify-start items-center gap-2.5">
        <div className="justify-start text-stone-200 text-base font-normal font-['Inter']">| Enter last name</div>
    </div>
    <div className="w-96 h-12 pl-7 pr-56 py-3 left-[834px] top-[420px] absolute bg-gray-800 rounded-3xl outline outline-1 outline-stone-200 inline-flex justify-start items-center gap-2.5">
        <div className="justify-start text-stone-200 text-base font-normal font-['Inter']">| Enter email</div>
    </div>
    <div className="w-96 h-12 pl-7 pr-56 py-3 left-[834px] top-[484px] absolute bg-gray-800 rounded-3xl outline outline-1 outline-stone-200 inline-flex justify-start items-center gap-2.5">
        <div className="justify-start text-stone-200 text-base font-normal font-['Inter']">| Enter password</div>
    </div>
    <div className="w-96 h-12 pl-7 pr-56 py-3 left-[834px] top-[548px] absolute bg-gray-800 rounded-3xl outline outline-1 outline-stone-200 inline-flex justify-start items-center gap-2.5">
        <div className="justify-start text-stone-200 text-base font-normal font-['Inter']">| Confirm password</div>
    </div>
    <div className="w-32 left-[955px] top-[781px] absolute inline-flex flex-col justify-center items-center">
        <div className="w-64 text-center justify-start text-stone-200 text-sm font-normal font-['Inter']">Already have an account?</div>
        <div className="self-stretch text-center justify-start text-stone-200 text-sm font-bold font-['Inter'] underline">Click here to login.</div>
    </div>
    <div className="w-[576px] h-[867px] left-[18px] top-[16px] absolute bg-gray-500 rounded-[31px] border border-black" />
    <div className="w-20 h-20 left-[981px] top-[119px] absolute bg-zinc-300 rounded-2xl border border-black" />
    <div className="w-64 h-14 pl-4 pr-5 pt-4 pb-5 left-[886px] top-[706px] absolute bg-stone-50 rounded-lg inline-flex justify-start items-center gap-8">
        {/* <img className="w-6 h-6" src="https://placehold.co/25x26" /> */}
        <div className="w-44 h-3.5 text-center justify-start text-black text-base font-normal font-['Inter']">Sign up using Google.</div>
    </div>
    <div data-property-1="Default" className="w-48 h-12 px-16 py-3.5 left-[919px] top-[626px] absolute bg-orange-300 rounded-3xl outline outline-1 outline-offset-[-1px] outline-stone-200 inline-flex justify-center items-center gap-2.5">
        <div className="text-center justify-start text-gray-800 text-base font-bold font-['Inter']">Continue</div>
    </div>
    <div className="w-28 h-11 left-[963px] top-[211px] absolute text-center justify-start text-zinc-300 text-3xl font-bold font-['Inter']">Sign up</div>
    </div>
  );
}
