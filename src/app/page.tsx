import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">CMSC 128</h1>
        <p className="text-zinc-600">Landing page.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/login" className="rounded bg-black px-4 py-2 text-white">
            Login
          </Link>
          <Link href="/register" className="rounded border px-4 py-2">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
