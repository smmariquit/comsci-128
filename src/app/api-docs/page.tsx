import { Suspense } from "react";
import ApiDocsContent from "./_components/api-docs-content";

export default function ApiDocsPage() {
  return (
    <Suspense>
      <ApiDocsContent />
    </Suspense>
  );
}
