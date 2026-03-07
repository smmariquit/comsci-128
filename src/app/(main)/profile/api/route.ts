import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
//TODO: import user service

// FOR TESTING ONLY since nasa pr pa ang mock db & getProfile
// TOBE replaced by import
const getProfile = async (userId: string) => {
    const MOCK_USERS = [
        {id: "1", name: "Mahoraga", email:"nahidadapt@mappa.com"},          //This serves as the mock 'Database' to test functions
        {id: "2", name: "John", email:"johnkaisen@mappa.com"},
        {id: "3", name: "Susan", email:"susangrotto@mgmail.com"},
        {id: "4", name: "Bruce Wayne", email:"alfredbuttler@wayne.com"},
        {id: "5", name: "Allan", email:"allancruz@gov.ph"},
    ];
    
    const user = MOCK_USERS.find((u) => u.id === userId);

    if (!user) {
        return null;
    }

    return user;
}

// For retrieving profile information of current user
// Default route for /profile/api
export async function GET(request: NextRequest) {
    try{
        // Check auth
        const headersList = await headers();
        const userId = headersList.get("x-user-id"); //must be added by middleware after user auth

        if(!userId){
            return NextResponse.json({
                message: "Unauthorized: Invalid Token."
            },{ status: 401})
        }
        // Check request/call user service
        const user = await getProfile(userId); 
        
        // Send Response
        if (!user) { // User not found
            return NextResponse.json(
                { message: 'User not found.' }, 
                { status: 404 }
            );
        }
        
        // User found
        return NextResponse.json(user, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json(
            { message: 'Failed to fetch user.', error: error.message }, 
            { status: 500 }
        );
    }
}
