// lib/getUserFromCookie.js
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function getUserFromCookie() {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  try {
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
