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
        created_by: user.id,   // ✅ langsung dari JWT
        divisi: user.divisi,   // ✅ langsung dari JWT
        divisi_branch: body.divisi_branch || null,
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
export async function GET() {
  const user = await getUserFromCookie();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("tugas")
    .select("*")
    .eq("divisi", user.divisi) // misal hanya ambil data sesuai divisi
    .order("tanggal", { ascending: false });

  if (error) {
    console.error("❌ Fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}


