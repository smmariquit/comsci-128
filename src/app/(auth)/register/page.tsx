export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Register</h1>
        <form className="space-y-3">
          <input
            type="text"
            placeholder="Name"
            className="w-full rounded border px-3 py-2"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded border px-3 py-2"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded border px-3 py-2"
          />
          <button
            type="submit"
            className="w-full rounded bg-black py-2 text-white"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
