import { managerService } from "@/app/lib/services/manager-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {

    try {

        /*
            TODO:
            - authentication middleware
            - role access (role guard) middleware
        */

        // Check request/call user service
        const manager = await managerService.getAllManagers();

        if(!manager){
            return NextResponse.json(
                {message: "Manager not found."},
                {status: 404},
            );
        }
        
        return NextResponse.json(manager, {status:200});

    } catch (error: any) {
        console.error("Error fetching manager", error);
        return NextResponse.json(
            { message: "Failed to fetch manager.", error: error.message },
            { status: 500 },
        );
    }

}



