// import { cookies } from "next/headers";
// import { jwtVerify } from "jose";

// export async function getUserFromCookie() {
//   try {
//     const cookieStore = cookies();            
//     const tokenCookie = cookieStore.get("token"); // ambil token
//     if (!tokenCookie) return null;

//     const token = tokenCookie.value;

//     // verify JWT secara async
//     const { payload } = await jwtVerify(
//       token,
//       new TextEncoder().encode(process.env.JWT_SECRET)
//     );

//     return payload; // { id, nama, divisi, email, role, ... }
//   } catch (err) {
//     console.error("JWT verify failed:", err);
//     return null;
//   }
// }


// lib/getUserFromCookie.js
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function getUserFromCookie() {
  try {
    // ✅ tunggu cookies selesai di-load
    const cookieStore = await cookies();            
    const tokenCookie = cookieStore.get("token"); // ambil token
    if (!tokenCookie) return null;

    const token = tokenCookie.value;

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    return payload; // { id, nama, divisi, email, role, ... }
  } catch (err) {
    console.error("JWT verify failed:", err);
    return null;
  }
}
