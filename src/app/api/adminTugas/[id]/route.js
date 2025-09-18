// app/api/adminTugas/[id]/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req, { params }) {
  try {
    // ✅ params sekarang Promise → harus di-`await`
    const { id } = await params;

    const { searchParams } = new URL(req.url);
    const sortField = searchParams.get("sortField") || "tanggal";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const { data, error } = await supabase
      .from("tugas")
      .select("*")
      .eq("created_by", id)
      .order(sortField, { ascending: sortOrder === "asc" });

    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("❌ API error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { data, error } = await supabase
      .from("tugas")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from("tugas")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json(
      { message: "Tugas berhasil dihapus" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
