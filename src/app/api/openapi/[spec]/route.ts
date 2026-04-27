import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { NextResponse } from "next/server";

const SPEC_FILES: Record<string, string> = {
  implemented: "docs/openapi.implemented.yaml",
  planned: "docs/openapi.planned.yaml",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ spec: string }> },
) {
  try {
    const { spec } = await context.params;
    const fileName = SPEC_FILES[spec];

    if (!fileName) {
      return NextResponse.json(
        {
          message: "Unsupported OpenAPI spec. Use 'implemented' or 'planned'.",
        },
        { status: 404 },
      );
    }

    const specPath = fileURLToPath(
      new URL(`../../../../../${fileName}`, import.meta.url),
    );
    const specContent = await readFile(specPath, "utf8");

    return new NextResponse(specContent, {
      status: 200,
      headers: {
        "Content-Type": "application/yaml; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to load OpenAPI specification:", error);
    return NextResponse.json(
      { message: "Failed to load OpenAPI specification." },
      { status: 500 },
    );
  }
}
