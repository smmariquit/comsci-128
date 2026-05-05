import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility Library",
  description: "Recommended accessibility tooling for this project.",
};

export default function A11yLibraryPage() {
  return (
    <main className="min-h-screen bg-[#EDE9DE] px-6 py-12 text-[#1C2632]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#567375]">
            Recommendation
          </p>
          <h1 className="text-3xl font-bold">react-aria</h1>
          <p className="text-base text-[#567375]">
            Accessible primitives and hooks from Adobe. Great for App Router
            and custom UI because it handles keyboard interactions, ARIA
            attributes, and focus management for you.
          </p>
        </header>

        <section className="rounded-2xl border border-[#CEC7B0] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Why it fits</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#4B5563]">
            <li>Hook-based API so you can keep your existing UI.</li>
            <li>Consistent keyboard and screen reader behavior.</li>
            <li>SSR-friendly and works well with Next.js App Router.</li>
            <li>Pairs nicely with design systems and Tailwind styling.</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-[#CEC7B0] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Quick start</h2>
          <div className="mt-3 rounded-lg bg-[#1C2632] p-4 text-sm text-[#EDE9DE]">
            <code>npm install react-aria react-stately</code>
          </div>
          <p className="mt-3 text-sm text-[#567375]">
            Docs: https://react-spectrum.adobe.com/react-aria/
          </p>
        </section>
      </div>
    </main>
  );
}
