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

// cabang + divisi
const branches = ["Pekanbaru", "Yogyakarta", "Bandung", "Makassar"];
const divisions = ["CS", "Cleaning Servis", "WH"];

// contoh user per divisi per branch
const generateUsers = async () => {
  const users = [];

  // ambil branch dari DB supaya dapet ID-nya
  const { data: branchData, error: branchError } = await supabase
    .from("branch")
    .select("id, nama_branch");

  if (branchError) {
    console.error("❌ Error fetch branch:", branchError.message);
    process.exit(1);
  }

  for (const branch of branchData) {
    for (const divisi of divisions) {
      users.push({
        nama: `${divisi} ${branch.nama_branch}`,
        username: `${divisi.toLowerCase()}_${branch.nama_branch.toLowerCase()}`,
        email: `${divisi.toLowerCase()}_${branch.nama_branch.toLowerCase()}@example.com`,
        password: "volten123",
        role: "branch",
        divisi,
        branch_id: branch.id,
      });
    }
  }

  return users;
};

async function seedUsers() {
  try {
    const users = await generateUsers();

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      const { error } = await supabase.from("users").insert({
        nama: user.nama,
        username: user.username,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        divisi: user.divisi,
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
