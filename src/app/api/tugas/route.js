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
          attachment: body.attachment || null,
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


export async function PATCH(req) {
  try {
    const formData = await req.formData();

    const id = formData.get("id");
    const est_durasi = formData.get("est_durasi");
    const remark = formData.get("remark");
    const status = formData.get("status");
    const file = formData.get("attachment");

    if (!id) return NextResponse.json({ error: "ID wajib ada" }, { status: 400 });

    let attachmentUrl = null;
    if (file && file.size) {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("tugas-attachments")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("tugas-attachments")
        .getPublicUrl(fileName);

      attachmentUrl = data.publicUrl; // pastikan ini dipakai
    }

    const updateData = {
      ...(est_durasi ? { est_durasi } : {}),
      ...(remark !== undefined ? { remark } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(attachmentUrl ? { attachment: attachmentUrl } : {}),
    };

    const { data, error } = await supabase
      .from("tugas")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ PATCH Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID wajib ada" }, { status: 400 });
    }

    const { error } = await supabase
      .from("tugas")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "Tugas berhasil dihapus" });
  } catch (err) {
    console.error("❌ DELETE Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}