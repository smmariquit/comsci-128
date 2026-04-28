"use client";

import type { User } from "@supabase/supabase-js";
import { useState } from "react";
import { getSupabaseBrowserClient } from "@/app/lib/browser-client";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const supabase = getSupabaseBrowserClient();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // const router = useRouter();

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setStatus(error.message);
      setCurrentUser(null);
    } else {
      setStatus("Signed in successfully");
      setCurrentUser(data.user);
      // router.push("/student");
    }
    console.log({ data });
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setStatus("Signed out successfully");
  }

  async function handleGoogleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/google-login`,
        skipBrowserRedirect: false,
      },
    });
  }

  return (
<div className="w-[1440px] h-[900px] relative bg-black/20 overflow-hidden">
    <div className="w-96 h-12 pl-7 pr-56 py-3 left-[834px] top-[305px] absolute bg-gray-800 rounded-3xl outline outline-1 outline-stone-200 inline-flex justify-start items-center gap-2.5">
        <div className="justify-start text-stone-200 text-base font-normal font-['Inter']">| Enter email</div>
    </div>
    <div className="w-96 h-12 pl-7 pr-56 py-3 left-[834px] top-[369px] absolute bg-gray-800 rounded-3xl outline outline-1 outline-stone-200 inline-flex justify-start items-center gap-2.5">
        <div className="justify-start text-stone-200 text-base font-normal font-['Inter']">| Enter password</div>
    </div>
    <div className="w-32 left-[955px] top-[433px] absolute inline-flex flex-col justify-center items-center">
        <div className="self-stretch text-center justify-start text-stone-200 text-sm font-normal font-['Inter']">Forgot password?</div>
        <div className="self-stretch text-center justify-start text-stone-200 text-sm font-bold font-['Inter'] underline">Click here to reset.</div>
    </div>
    <div className="w-32 left-[955px] top-[733px] absolute inline-flex flex-col justify-center items-center">
        <div className="w-52 text-center justify-start text-stone-200 text-sm font-normal font-['Inter']">Don’t have an account?</div>
        <div className="w-52 text-center justify-start text-stone-200 text-sm font-bold font-['Inter'] underline">Click here to sign up.</div>
    </div>
    <div className="w-[576px] h-[867px] left-[18px] top-[16px] absolute bg-gray-500 rounded-[31px] border border-black" />
    <div className="w-20 h-20 left-[981px] top-[132px] absolute bg-zinc-300 rounded-2xl border border-black" />
    <div className="w-64 h-14 pl-4 pr-5 pt-4 pb-5 left-[886px] top-[658px] absolute bg-stone-50 rounded-lg inline-flex justify-start items-center gap-8">
        {/* <img className="w-6 h-6" src="https://placehold.co/25x26" /> */}
        <div className="w-44 h-3.5 text-center justify-start text-black text-base font-normal font-['Inter']">Sign in using Google.</div>
    </div>
    <div data-property-1="Default" className="w-48 h-12 px-16 py-3.5 left-[919px] top-[548px] absolute bg-orange-300 rounded-3xl outline outline-1 outline-offset-[-1px] outline-stone-200 inline-flex justify-center items-center gap-2.5">
        <div className="text-center justify-start text-gray-800 text-base font-bold font-['Inter']">Login</div>
    </div>
    <div className="w-28 h-11 left-[963px] top-[236px] absolute text-center justify-start text-zinc-300 text-3xl font-bold font-['Inter']">Login</div>
</div>
  );
}
