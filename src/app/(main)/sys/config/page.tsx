import { redirect } from "next/navigation";

export const metadata = {
  title: "System Configuration",
  description: "(removed)",
};

export default function Page() {
  // This page was removed. Redirect to the system dashboard.
  redirect("/sys");
}
