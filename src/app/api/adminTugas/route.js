import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sortField = searchParams.get("sortField") || "tanggal";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const createdBy = searchParams.get("created_by")?.toLowerCase() || "";
    const jenisTugas = searchParams.get("jenis_tugas") || ""; // ✅ case sensitive biar pas

    const page = searchParams.has("page") ? parseInt(searchParams.get("page")) : null;
    const limit = searchParams.has("limit") ? parseInt(searchParams.get("limit")) : null;
    const from = page && limit ? (page - 1) * limit : null;
    const to = page && limit ? from + limit - 1 : null;

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
        { count: "exact" }
      )
      .order(sortField, { ascending: sortOrder === "asc" });

    if (from !== null && to !== null) query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    let filtered = data;

    if (createdBy) {
      filtered = filtered.filter((row) =>
        row.created_user?.nama?.toLowerCase().includes(createdBy)
      );
    }

    // ✅ Filter by jenis tugas (Penugasan, Rutinan, Reguler)
  if (jenisTugas) {
    filtered = filtered.filter((row) => row.jenis_tugas?.toLowerCase() === jenisTugas.toLowerCase());
  }


    return NextResponse.json({ data: filtered, total: count });
  } catch (err) {
    console.error("❌ API Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
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
