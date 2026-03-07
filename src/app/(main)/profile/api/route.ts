import { NextRequest, NextResponse } from "next/server";
//TODO: import user service

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "ok" });
}
