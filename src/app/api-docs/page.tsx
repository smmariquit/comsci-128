import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "API Documentation",
};
import ApiDocsContent from "./_components/api-docs-content";

export default function ApiDocsPage() {
  return (
    <Suspense>
      <ApiDocsContent />
    </Suspense>
  );
}
