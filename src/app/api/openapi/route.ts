import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const specPath = join(process.cwd(), "docs", "openapi.implemented.yaml");
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
