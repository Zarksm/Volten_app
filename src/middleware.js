// import { NextResponse } from "next/server";
// import { jwtVerify } from "jose";

// export async function middleware(req) {
//   const token = req.cookies.get("token")?.value;

//   const protectedRoutes = ["/dashboard", "/tugas", "/admin"];

//   if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
//     if (!token) return NextResponse.redirect(new URL("/login", req.url));

//     try {
//       await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
//     } catch {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//   }

//   // Redirect user ke dashboard kalau buka login tapi sudah login
//   if (req.nextUrl.pathname === "/login" && token) {
//     try {
//       await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
//       return NextResponse.redirect(new URL("/dashboard", req.url));
//     } catch {}
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/login", "/dashboard/:path*", "/tugas/:path*", "/admin/:path*"],
// };

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  let role = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
      console.log("JWT payload:", payload); // cek log di terminal
      role = payload.role; // pastiin disini bener key nya
    } catch (err) {
      console.error("JWT verify failed:", err);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Redirect dari root `/`
  if (req.nextUrl.pathname === "/") {
    if (!role) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (role === "user") {
      return NextResponse.redirect(new URL("/dashboard/penugasan", req.url));
    }
      return NextResponse.redirect(new URL("/dashboard", req.url));

  }

  if (req.nextUrl.pathname === "/login" && role) {
    if (role === "user") {
      return NextResponse.redirect(new URL("/dashboard/penugasan", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));

  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*", "/tugas/:path*", "/admin/:path*"],
};
