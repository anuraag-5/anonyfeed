import { NextRequest , NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middlware(request : NextRequest){
    const token = await getToken({req : request})
    const url = request.nextUrl

    const publicPaths = ["/signin", "/signup", "/verify", "/"];
    const isPublicPath = publicPaths.some((path) => url.pathname.startsWith(path));

    if (!token) {
        if (!isPublicPath) {
          // Redirect unauthenticated users to the home page
          return NextResponse.redirect(new URL("/home", request.url));
    }

          return NextResponse.next();
    }

    if (token) {
        if (isPublicPath) {
          // Redirect unauthenticated users to the home page
          return NextResponse.redirect(new URL("/dashboard", request.url));
    }

          return NextResponse.next();
    }
    return NextResponse.next();

}

export const config = {
    matcher : [
        "/signin",
        "/signup",
        "/",
        "/dashboard/:path*" ,
        "/verify/:path*"
    ]
}