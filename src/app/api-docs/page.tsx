import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "API Documentation",
  description: "View all API-related documentations for the UPLB CASA system.",
};
import ApiDocsContent from "./_components/api-docs-content";

export default function ApiDocsPage() {
  return (
    <Suspense>
      <ApiDocsContent />
    </Suspense>
  );
}
