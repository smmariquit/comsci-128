import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const specPath = fileURLToPath(
			new URL("../../../../docs/openapi.implemented.yaml", import.meta.url),
		);
		const spec = await readFile(specPath, "utf8");

		return new NextResponse(spec, {
			status: 200,
			headers: {
				"Content-Type": "application/yaml; charset=utf-8",
				"Cache-Control": "no-store",
			},
		});
	} catch {
		return NextResponse.json(
			{ message: "Failed to load OpenAPI" },
			{ status: 500 },
		);
	}
}
