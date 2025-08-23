// app/api/users/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";

export async function GET() {
  const { data, error } = await supabase
    .from("users")
    .select("id, nama, email, role, divisi")
    .eq("role", "user");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { nama, email, password, divisi } = body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase.from("users").insert([
      { nama, email, password: hashedPassword, role: "user", divisi },
    ]);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: "User created", data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: "User deleted" });
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, nama, email, password, divisi } = body;

    let updateData = { nama, email, divisi };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const { error } = await supabase.from("users").update(updateData).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ message: "User updated" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
