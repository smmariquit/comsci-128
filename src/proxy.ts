import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // grab cookies :D
    const userRole = request.cookies.get('user_role')?.value?.toLowerCase();
    const isLoggedIn = request.cookies.get('is_logged_in')?.value;
    // const accountNumber = request.cookies.get('account_number')?.value;

    // housing admin
    if (pathname.startsWith('/admin')) {
        const houseAdminRoles = ["housing administrator", "house admin"];

        if (!isLoggedIn || !houseAdminRoles.includes(userRole || "")) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // student
    if (pathname.startsWith('student')) {
        if (!isLoggedIn || userRole !== "student") {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // system admin
    if (pathname.startsWith('/sys')) {
        if (!isLoggedIn || (userRole !== "system admin" && userRole !== "admin")) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // manage
    if (pathname.startsWith('/manage')) {
        if (!isLoggedIn || (userRole !== "landlord")) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    if (isLoggedIn && (pathname === '/login' || pathname === '/register')) {
        let target = "/";
        if (userRole === "student") target = "/student";
        else if (userRole === "housing administrator" || userRole === "house admin") target = "/admin";
        else if (userRole === "system admin") target = "/sys";
        else if (userRole === "manager") target = "/manage";

        return NextResponse.redirect(new URL(target, request.url));
    }

    return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/manage/:path*',
    '/student/:path*',
    '/sys/:path*',
    '/login',
    '/register',
  ],
};