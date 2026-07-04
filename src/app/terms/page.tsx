import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms for using the UPLB CASA student housing portal.",
};

export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-10 pb-16 text-[#1C2632]">
      <Link
        href="/"
        className="text-sm text-[#567375] hover:text-[#1C2632] hover:underline mb-8 inline-block"
      >
        ← Back to UPLB CASA
      </Link>

      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[#567375]">Legal</p>
        <h1 className="text-3xl font-black mt-1">Terms of Service</h1>
        <p className="text-sm opacity-70 mt-2 font-[family-name:var(--font-geist-mono)]">
          Last updated: July 4, 2026
        </p>
      </header>

      <article className="space-y-6 text-sm leading-relaxed opacity-90">
        <section>
          <h2 className="text-base font-bold mb-2">Agreement</h2>
          <p>
            By creating an account or using UPLB CASA, you agree to these Terms. If
            you do not agree, do not use the portal. UPLB CASA is a CMSC 128 academic
            project and is provided for beta testing and educational purposes.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Eligibility</h2>
          <p>
            You must be a UPLB student, landlord, housing staff member, or authorized
            tester to use role-specific features. You are responsible for keeping your
            login credentials confidential.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Acceptable use</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide accurate information in your profile and housing applications.</li>
            <li>Do not impersonate another person or misrepresent your role.</li>
            <li>
              Do not upload unlawful, harassing, or misleading content in listings,
              complaints, or messages.
            </li>
            <li>
              Do not attempt to access data or admin functions outside your assigned
              role.
            </li>
            <li>
              Do not scrape, overload, or reverse-engineer the system during beta
              testing.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Housing listings and applications</h2>
          <p>
            Listings, availability, and pricing are submitted by landlords and
            administrators. UPLB CASA does not guarantee the accuracy, safety, or
            legality of any accommodation. Housing decisions remain between students,
            landlords, and university housing policies. This portal facilitates
            discovery and workflow — it does not replace official UPLB housing
            processes.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Billing features</h2>
          <p>
            Billing screens track rent and payment status for demonstration purposes.
            They do not constitute a binding invoice or payment processor. Do not rely
            on beta billing data for real financial obligations.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Beta disclaimer</h2>
          <p>
            The portal is under active development. Features may change, break, or be
            reset without notice. Data entered during beta may be lost, modified, or
            deleted as part of testing. Use test data when possible.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Intellectual property</h2>
          <p>
            The UPLB CASA name, logo, and software are property of the project team
            unless otherwise licensed. You may not copy or redistribute the application
            without permission.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, the project team and UPLB are not
            liable for housing disputes, data loss, service interruptions, or damages
            arising from use of this beta portal. The service is provided &quot;as
            is&quot; without warranties.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Termination</h2>
          <p>
            We may suspend or delete accounts that violate these Terms or that are no
            longer needed after the academic project ends.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Changes</h2>
          <p>
            These Terms may be updated during the beta. Continued use after changes
            constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Contact</h2>
          <p>
            Questions? Contact the UPLB CASA project team through your CMSC 128
            instructor or the project repository.
          </p>
        </section>
      </article>
    </main>
  );
}
