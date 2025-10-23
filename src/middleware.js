import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname === "/login") {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.next(); // biar bisa buka login page
    }

    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
      if (payload.role === "user" || payload.role === "branch") {
        return NextResponse.redirect(new URL("/dashboard/penugasan", req.url));
      }
      return NextResponse.redirect(new URL("/admin/tugas", req.url));
    } catch (err) {
      console.error("JWT verify failed:", err);
      return NextResponse.next(); // token invalid → tetap bisa login
    }
  }

  // --- selain /login, wajib ada token ---
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  let role = null;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    role = payload.role;
  } catch (err) {
    console.error("JWT verify failed:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // kalau akses root
  if (pathname === "/") {
    if (role === "user" || role === "branch") {
      return NextResponse.redirect(new URL("/dashboard/penugasan", req.url));
    }
    return NextResponse.redirect(new URL("/admin/tugas", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard/:path*",
    "/tugas/:path*",
    "/admin/:path*",
  ],
};
