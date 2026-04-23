import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const userRole = request.cookies.get('user_role')?.value?.toLowerCase();
    // const accountNumber = request.cookies.get('account_number')?.value;

    if (pathname.startsWith('/admin')) {
        const validRoles = ["housing administrator", "house admin"];

        if (!userRole || !validRoles.includes(userRole)) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}