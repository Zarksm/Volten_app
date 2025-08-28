// seedUser.mjs
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

// daftar user fix
const users = [
  { nama: "Hadi Smay", username: "hadi", email: "hadi@gmail.com", password: "volten123", role: "branch", branch_id: 1 },
  { nama: "Mira", username: "mira", email: "mira@gmail.com", password: "volten123", role: "branch", branch_id: 2 },
  { nama: "Asiana", username: "asiana", email: "asiana@gmail.com", password: "volten123", role: "branch", branch_id: 4 },
  { nama: "Arini", username: "arini", email: "arini@gmail.com", password: "volten123", role: "branch", branch_id: 3 },
];

async function seedUsers() {
  try {
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      const { error } = await supabase.from("users").insert({
        nama: user.nama,
        username: user.username,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        branch_id: user.branch_id,
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

seedUsers();
