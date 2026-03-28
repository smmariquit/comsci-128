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
        <nav className="px-6 py-3 bg-[var(--dark-blue)] text-[var(--beige)]">
          
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
              <button className="hover:text-blue-500/50 transition-colors">
                Notifs
              </button>

              <button className="hover:text-blue-500/50 transition-colors">
                Profile
              </button>
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

      <main className="p-6">
        {children}
      </main>
    </div>

    
  );
}