import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getUserFromCookie } from "@/lib/getUserFromCookie";

export async function GET(req, { params }) {
  try {
    const authUser = await getUserFromCookie();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (authUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = params;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ GET by ID error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
