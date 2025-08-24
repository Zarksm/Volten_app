
// import { NextResponse } from "next/server";
// import { jwtVerify } from "jose";

// export async function middleware(req) {
//   const token = req.cookies.get("token")?.value;
//   let role = null;

//   if (token) {
//     try {
//       const { payload } = await jwtVerify(
//         token,
//         new TextEncoder().encode(process.env.JWT_SECRET)
//       );
//       console.log("JWT payload:", payload); // cek log di terminal
//       role = payload.role; // pastiin disini bener key nya
//     } catch (err) {
//       console.error("JWT verify failed:", err);
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//   }

//   // Redirect dari root `/`
//   if (req.nextUrl.pathname === "/") {
//     if (!role) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//     if (role === "user") {
//       return NextResponse.redirect(new URL("/dashboard/penugasan", req.url));
//     }
//       return NextResponse.redirect(new URL("/dashboard", req.url));

//   }

//   if (req.nextUrl.pathname === "/login" && role) {
//     if (role === "user") {
//       return NextResponse.redirect(new URL("/dashboard/penugasan", req.url));
//     }
//     return NextResponse.redirect(new URL("/dashboard", req.url));

//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/", "/login", "/dashboard/:path*", "/tugas/:path*", "/admin/:path*"],
// };

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // kalau lagi di /login → biarin lewat, jangan redirect loop
  if (pathname === "/login") {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.next(); // biar bisa buka login page
    }

    // kalau udah login, tendang ke dashboard sesuai role
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
      if (payload.role === "user") {
        return NextResponse.redirect(new URL("/dashboard/penugasan", req.url));
      }
      return NextResponse.redirect(new URL("/dashboard", req.url));
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
    if (role === "user") {
      return NextResponse.redirect(new URL("/dashboard/penugasan", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
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
