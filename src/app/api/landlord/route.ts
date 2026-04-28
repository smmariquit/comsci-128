import { NextRequest, NextResponse } from "next/server";
import { landlordService } from "@/app/lib/services/landlord-service";
import { NewManager } from "@/app/lib/models/manager";


export async function GET() {
  try {

    const landlord =  await landlordService.fetchAllHousingAdmins();

    return NextResponse.json(
      { data: landlord },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}