import 'dotenv/config';

import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum di-set di .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const userData = {
  nama: "Fathul",
  username: "Fathul",
  email: "fathul@gmail.com",
  password: "volten123",
  role: "user",
  divisi: "PJT",
};

async function createUser() {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const { error } = await supabase
      .from("users")
      .insert({
        nama: userData.nama,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        divisi: userData.divisi,
      });

    if (error) {
      console.error("❌ Gagal membuat user:", error.message);
    } else {
      console.log(`✅ User ${userData.email} berhasil dibuat`);
    }
  } catch (err) {
    console.error("❌ Terjadi error:", err.message);
  }
}

createUser();
