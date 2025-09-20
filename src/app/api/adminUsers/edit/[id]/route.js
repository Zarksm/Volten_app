// app/api/adminUsers/edit/[id]/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// 🔹 PUT update user by ID
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    const { data, error } = await supabase
      .from("users")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("❌ Error update user:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
