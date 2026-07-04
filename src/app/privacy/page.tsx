import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How UPLB CASA collects, uses, and protects student and housing data.",
};

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-black mt-1">Privacy Policy</h1>
        <p className="text-sm opacity-70 mt-2 font-[family-name:var(--font-geist-mono)]">
          Last updated: July 4, 2026
        </p>
      </header>

      <article className="space-y-6 text-sm leading-relaxed opacity-90">
        <section>
          <h2 className="text-base font-bold mb-2">What UPLB CASA is</h2>
          <p>
            UPLB CASA (Centralized Accommodation System Application) is a student
            housing portal developed as a CMSC 128 Software Engineering project at
            the University of the Philippines Los Baños. It helps students find and
            apply for on- and off-campus housing, and helps housing administrators,
            landlords, and university staff manage listings, applications, billing,
            and complaints. This is an academic prototype and is{" "}
            <strong>not</strong> an official UPLB administrative system.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Information we collect</h2>

          <h3 className="font-semibold mt-3 mb-1">Account and identity</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Registration data:</strong> name, email address, password
              (stored as a secure hash), role (student, landlord, housing
              administrator, system administrator), and profile details you provide.
            </li>
            <li>
              <strong>Google Sign-In:</strong> if you choose Google login, we receive
              your Google account email, display name, and Google identity identifier
              through Supabase Auth. We do not receive your Google password.
            </li>
            <li>
              <strong>Student information:</strong> college, course, year level,
              contact number, emergency contacts, and other fields required for
              housing applications.
            </li>
          </ul>

          <h3 className="font-semibold mt-3 mb-1">Housing and application data</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Housing preferences, dorm or unit selections, application status, and
              assignment records.
            </li>
            <li>
              Accommodation listings, photos, capacity, pricing, and occupancy
              information submitted by landlords or administrators.
            </li>
            <li>
              Complaints, issue reports, and related correspondence between students
              and housing managers.
            </li>
          </ul>

          <h3 className="font-semibold mt-3 mb-1">Billing data</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Billing records such as rent amounts, payment status, due dates, and
              associated student or unit references. We do not process credit-card
              payments directly through this portal; billing fields are for tracking
              purposes within the system.
            </li>
          </ul>

          <h3 className="font-semibold mt-3 mb-1">Technical and usage data</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Session cookies and authentication tokens to keep you signed in.
            </li>
            <li>
              Audit logs of administrative actions (who changed what and when) for
              accountability during beta testing.
            </li>
            <li>
              Standard server logs (IP address, browser type, timestamps) from our
              hosting provider.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">How we use your information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Authenticate you and route you to the correct dashboard for your role.</li>
            <li>Process housing applications, assignments, and status updates.</li>
            <li>Display listings, occupancy, and billing summaries to authorized users.</li>
            <li>Investigate complaints and maintain an audit trail of administrative changes.</li>
            <li>Improve the portal during beta testing and fix bugs reported by users.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Where data is stored</h2>
          <p>
            User accounts, housing records, applications, billing entries, and audit
            logs are stored in a Supabase-hosted PostgreSQL database. Authentication
            is handled by Supabase Auth, including optional Google OAuth. Files such
            as housing photos may be stored in Supabase Storage or equivalent cloud
            storage configured for the project.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Who can see your data</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Students</strong> can view their own profile, applications, and
              assigned housing information.
            </li>
            <li>
              <strong>Landlords</strong> can view data for accommodations they manage
              and applicants assigned to their units.
            </li>
            <li>
              <strong>Housing administrators</strong> can view student applications,
              assignments, billing summaries, and complaints within their scope.
            </li>
            <li>
              <strong>System administrators</strong> and developers working on the
              CMSC 128 project may access data for maintenance, debugging, and grading
              during the academic term.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Third-party services</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Google</strong> — OAuth sign-in only, if you choose that option.
            </li>
            <li>
              <strong>Supabase</strong> — database, authentication, and file storage.
            </li>
            <li>
              <strong>Hosting provider</strong> — serves the web application and may
              retain access logs.
            </li>
          </ul>
          <p className="mt-2">
            We do not sell your personal information. Data is used solely for the
            housing portal and this academic project.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Data retention</h2>
          <p>
            Data collected during beta testing may be retained for the duration of the
            CMSC 128 course and a reasonable period afterward for academic evaluation.
            Test accounts and sample data may be deleted or anonymized after the
            project concludes. Contact the project team if you want your account
            removed during the beta period.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Your choices</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>You may register with email and password instead of Google Sign-In.</li>
            <li>You can update profile fields available in your dashboard.</li>
            <li>
              You may request correction or deletion of your account data by contacting
              the project team (see Contact).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Security</h2>
          <p>
            Passwords are hashed before storage. Sessions use secure cookies. Access
            to administrative functions is restricted by role. Despite these measures,
            no system is perfectly secure — do not enter real sensitive financial or
            government ID data beyond what is necessary for beta testing.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Children</h2>
          <p>
            This portal is intended for UPLB students and housing partners. It is not
            directed at children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Changes</h2>
          <p>
            We may update this policy as the beta evolves. The &quot;Last updated&quot;
            date at the top will change when we do.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">Contact</h2>
          <p>
            Questions about privacy? Reach the UPLB CASA project team through your
            course instructor or the project repository on GitHub.
          </p>
        </section>
      </article>
    </main>
  );
}
