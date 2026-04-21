import Link from "next/link";

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">

      <header className="w-full">

        {/*top navbar*/} 
        <nav className="px-6 py-3 bg-[var(--dark-blue)] text-[var(--cream)]">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-10">
              <h1 className="text-lg font-bold">Manager</h1>

              <div className="flex items-center text-sm">
                <Link
                  href="/manage"
                  className="px-4 font-medium hover:text-[var(--light-yellow)] transition-colors"
                >
                  Dashboard
                </Link>

                <span className="mx-2 opacity-60">|</span>

                <Link
                  href="/manage/accommodations"
                  className="px-4 font-medium hover:text-[var(--light-yellow)] transition-colors"
                >
                  Accommodations
                </Link>

                <span className="mx-2 opacity-60">|</span>

                <Link
                  href="/manage/applications"
                  className="px-4 font-medium hover:text-[var(--light-yellow)] transition-colors"
                >
                  Applications
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              {/* change for notifs later*/}
              <Link
                href="/manage" 
                className="hover:text-[var(--light-yellow)] transition-colors"
              >
                Notifications
              </Link>

              <Link
                href="/profile"
                className="hover:text-[var(--light-yellow)] transition-colors"
              >
                Profile
              </Link>
            </div>

          </div>
        </nav>

        {/*breadcrumbs to be implemented*/}
        <nav className="px-6 py-1 bg-[var(--teal)] text-[var(--dark-blue)] text-sm">
            <Link
                href="/manage"
                className="font-medium hover:font-bold"
            >
                Dashboard
            </Link>
        </nav>

      </header>

      <main className="flex-1 px-6 bg-[var(--dark-blue)]">
        {children}
      </main>

      <footer className="bg-[var(--dark-blue)] text-[var(--cream)] px-6 py-10 text-sm">
        © 2026 CMSC 128 Project
      </footer>
    </div>    
  );
}