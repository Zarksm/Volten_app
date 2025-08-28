// app/api/tugas/route.js


import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getUserFromCookie } from "@/lib/getUserFromCookie";

export async function POST(req) {
  const user = await getUserFromCookie();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  console.log(">>> Data diterima API:", body);

  const { data, error } = await supabase
    .from("tugas")
    .insert([
      {
        no: body.no,
        jenis_tugas: body.jenisTugas,
        priority: body.priority,
        tanggal: body.tanggal,
        instruction_date: body.instructionDate,
        description: body.description,
        est_durasi: body.estDurasi,
        status: body.status,
        remark: body.remark || null,
        attachment: body.attachment || null,
        created_by: user.id,
        divisi: user.divisi,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("❌ Insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log("✅ Data tersimpan:", data);
  return NextResponse.json(data, { status: 201 });
}

// ✅ Ambil data

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sortField = searchParams.get("sortField") || "tanggal";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const createdBy = searchParams.get("created_by")?.toLowerCase() || "";

    let query = supabase
      .from("tugas")
      .select(
        `
        id,
        no,
        jenis_tugas,
        priority,
        tanggal,
        instruction_date,
        description,
        est_durasi,
        status,
        remark,
        attachment,
        divisi,
        created_by,
        created_user:tugas_created_by_fkey (id, nama)
      `
      )
      .order(sortField, { ascending: sortOrder === "asc" });

    const { data, error } = await query;
    if (error) throw error;

    // filter manual by nama
    let filtered = data;
    if (createdBy) {
      filtered = data.filter((row) =>
        row.created_user?.nama?.toLowerCase().includes(createdBy)
      );
    }

    return NextResponse.json(filtered);
  } catch (err) {
    console.error("❌ API Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}