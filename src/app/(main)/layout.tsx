import GlobalNetworkStatus from "@/app/components/ui/GlobalNetworkStatus";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <GlobalNetworkStatus />
      <main>{children}</main>
    </div>
  );
}
