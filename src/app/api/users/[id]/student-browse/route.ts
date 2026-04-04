import { NextRequest, NextResponse } from "next/server";
import { getAllAvailableDorms } from "@/app/lib/data/student-browse";

export async function GET(
    _request: NextRequest,
    _context: { params?: any },
){
    try{
        const url = _request.nextUrl;
        const housingType = url.searchParams.get("housing_type") as 
            "UP Housing" | 
            "Non-UP Housing";
        // const sex = url.searchParams.get("sex") as
        //     "Male" | 
        //     "Female" | 
        //     "Co-ed";
        const sortByPrice = url.searchParams.get("sort_by_price") as
            "asc" | 
            "desc";

        const filters = {
            housing_type: housingType ?? undefined,
            // sex: sex ?? undefined,
            sort_by_price: sortByPrice ?? undefined,
        };

        const dorms = await getAllAvailableDorms(filters);

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