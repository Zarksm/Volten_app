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



export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sortField = searchParams.get("sortField") || "tanggal";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const createdBy = searchParams.get("created_by")?.toLowerCase() || "";
    const page = parseInt(searchParams.get("page") || "1", 5);
    const limit = parseInt(searchParams.get("limit") || "5", 5);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

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
      `,
        { count: "exact" } // 🔥 dapet total count
      )
      .order(sortField, { ascending: sortOrder === "asc" })
      .range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    // filter manual by nama
    let filtered = data;
    if (createdBy) {
      filtered = data.filter((row) =>
        row.created_user?.nama?.toLowerCase().includes(createdBy)
      );
    }

    return NextResponse.json({ data: filtered, total: count });
  } catch (err) {
    console.error("❌ API Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


export async function PATCH(req) {
  try {
    const formData = await req.formData(); // ✅ ganti ini

    const id = formData.get("id");
    const est_durasi = formData.get("est_durasi");
    const remark = formData.get("remark");
    const status = formData.get("status");
    const file = formData.get("attachment"); // kalau ada file

    if (!id) {
      return NextResponse.json({ error: "ID wajib ada" }, { status: 400 });
    }

    let attachmentUrl = null;
    if (file && typeof file === "object") {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("attachments") // pastikan nama bucket sama persis
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from("attachments")
        .getPublicUrl(fileName);

      attachmentUrl = publicUrl.publicUrl;
    }

    const { data, error } = await supabase
      .from("tugas")
      .update({
        ...(est_durasi ? { est_durasi } : {}),
        ...(remark ? { remark } : {}),
        ...(status ? { status } : {}),
        ...(attachmentUrl ? { attachment: attachmentUrl } : {}),
      })
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

