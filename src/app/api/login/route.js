import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(req) {
  const { email, password } = await req.json();

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: "Email tidak ditemukan" }, { status: 401 });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return NextResponse.json({ error: "Password salah" }, { status: 401 });
  }

  const token = await new SignJWT({
    id: user.id,
    nama: user.nama,
    email: user.email,
    role: user.role,
    divisi: user.divisi,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("5h")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  const res = NextResponse.json({ success: true });
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60,
  });

  return res;
}
