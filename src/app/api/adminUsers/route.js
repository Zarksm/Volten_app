// app/api/adminUsers/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";
import { getUserFromCookie } from "@/lib/getUserFromCookie"; // auth helper

// Mapping branch ke branch_id
const branchMap = {
  "Pekanbaru": 1,
  "Yogyakarta": 2,
  "Bandung": 3,
  "Makassar": 4,
};

// GET: list user kecuali admin yang login
export async function GET() {
  try {
    const user = await getUserFromCookie();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .neq("id", user.id)      // exclude dirinya sendiri
      .neq("role", "admin");   // exclude semua admin lain

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    const body = await req.json();
    const { username, nama, email, password, role, divisi, branch_id } = body;

    if (!username || !nama || !email || !password || !role)
      return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(">>> Payload diterima:", body);
    console.log(">>> Password hashed");

    const { data, error } = await supabase.from("users").insert([
      { username, nama, email, password: hashedPassword, role, divisi, branch_id }
    ]);

    if (error) {
      console.error("❌ Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "User created successfully", data });
  } catch (err) {
    console.error("❌ Error POST:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, username, nama, email, password, role, divisi, branch_id } = body;

    let updateData = { username, nama, email, role, divisi, branch_id };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    console.log(">>> Update payload:", updateData);

    const { error } = await supabase.from("users").update(updateData).eq("id", id);
    if (error) {
      console.error("❌ Supabase update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("❌ Error PUT:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("❌ Error DELETE:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
