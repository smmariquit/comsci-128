"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocsPage() {
  const searchParams = useSearchParams();
  const selectedSpec =
    searchParams.get("spec") === "planned" ? "planned" : "implemented";
  const specUrl =
    selectedSpec === "planned"
      ? "/api/openapi/planned"
      : "/api/openapi/implemented";

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      <section
        style={{
          display: "flex",
          gap: "0.75rem",
          padding: "1rem",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Link
          href="/api-docs?spec=implemented"
          className="font-bold text-black"
        >
          Implemented Spec
        </Link>
        <Link href="/api-docs?spec=planned" className="font-bold text-black">
          Planned Spec
        </Link>
      </section>
      <SwaggerUI
        url={specUrl}
        docExpansion="list"
        deepLinking={true}
        displayRequestDuration={true}
      />
    </main>
  );
}
