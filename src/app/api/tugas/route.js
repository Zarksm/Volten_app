import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getUserFromCookie } from "@/lib/getUserFromCookie";

export async function POST(req) {
  try {
    const user = await getUserFromCookie();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

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
          attachment: body.attachment || null, // 🔹 HARUS string URL dari client
          created_by: user.id,
          divisi: user.divisi,
          divisi_branch: body.divisi_branch || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ Insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


// GET - ambil data tugas
// export async function GET() {
//   const user = await getUserFromCookie();
//   if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const { data, error } = await supabase
//     .from("tugas")
//     .select("*")
//     .eq("divisi", user.divisi)
//     .order("tanggal", { ascending: false });

//   if (error) return NextResponse.json({ error: error.message }, { status: 500 });

//   return NextResponse.json(data, { status: 200 });
// }


export async function GET() {
  const user = await getUserFromCookie();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("tugas")
    .select("*")
    .eq("created_by", user.id) // atau user.email kalau field created_by simpan email
    .order("tanggal", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

