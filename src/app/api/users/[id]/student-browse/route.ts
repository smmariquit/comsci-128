import { NextRequest, NextResponse } from "next/server";
import { getAllDorms } from "@/app/lib/data/student-browse";

export async function GET(
    _request: NextRequest,
    _context: { params?: any },
){
    try{
        const dorms = await getAllDorms();

        if (!dorms || dorms.length === 0) {
            return NextResponse.json(
                { message: "No dorms found" }, 
                { status: 404 }
            );
        }
        return NextResponse.json(dorms, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching dorms:", error);
        return NextResponse.json(
            { message: "Failed fetching dorms", error: error.message }, 
            { status: 500 }
        );
    }
}