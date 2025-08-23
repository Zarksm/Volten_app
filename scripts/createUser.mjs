import "dotenv/config";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum di-set di .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const usersData = [
  {
    nama: "Nabila Alya",
    username: "nabila",
    email: "nabila@gmail.com",
    password: "volten123",
    role: "user",
    divisi: "Fin, Acc, Tax & HR",
  },
  {
    nama: "Sheila Indah",
    username: "sheila",
    email: "sheila@gmail.com",
    password: "volten123",
    role: "user",
    divisi: "GA & WH",
  },
  {
    nama: "Fathul",
    username: "fathul",
    email: "fathul@gmail.com",
    password: "volten123",
    role: "user",
    divisi: "PJT",
  },
  {
    nama: "Admin",
    username: "Super Admin",
    email: "admin@gmail.com",
    password: "volten123",
    role: "admin",
    divisi: "Admin",
  },
];

async function createUsers() {
  try {
    for (const user of usersData) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      const { error } = await supabase.from("users").insert({
        nama: user.nama,
        username: user.username,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        divisi: user.divisi,
      });

      if (error) {
        console.error(`❌ Gagal membuat user ${user.email}:`, error.message);
      } else {
        console.log(`✅ User ${user.email} berhasil dibuat`);
      }
    }
  } catch (err) {
    console.error("❌ Terjadi error:", err.message);
  }
}

createUsers();
