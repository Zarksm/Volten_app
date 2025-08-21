// scripts/seedTugas.mjs
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

// 🔑 inisialisasi Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const jenisList = ["Penugasan", "Rutinan", "Reguler"];
const priorityList = ["High", "Medium", "Low"];
const statusList = ["Open", "In Progress", "Closed"];
const divisiList = ["IT", "Operasional", "Fasilitas"];

function generateDummy() {
  let allData = [];
  let counter = 1;

  for (const jenis of jenisList) {
    // bikin antara 3-5 item tiap jenis
    const jumlah = Math.floor(Math.random() * 3) + 3; // hasil 3,4,5
    for (let i = 0; i < jumlah; i++) {
      allData.push({
        no: String(counter).padStart(5, "0"),
        jenis_tugas: jenis,
        priority: priorityList[i % priorityList.length],
        tanggal: `2025-08-${20 + i}`,
        instruction_date: `2025-08-${15 + i}`,
        description: `${jenis} ke-${i + 1} untuk testing`,
        est_durasi: `${i + 1} hari`,
        status: statusList[i % statusList.length],
        remark: `Remark ${i + 1}`,
        attachment: null,
        no_tps: `TPS-${i + 1}`,
        case_code: `CASE-${counter}`,
        created_by: "21380985-3e6a-42ba-b248-0c0293f1432c",
        divisi: "PJT",
      });
      counter++;
    }
  }

  return allData;
}

async function main() {
  const dataDummy = generateDummy();

  const { data, error } = await supabase.from("tugas").insert(dataDummy).select();

  if (error) {
    console.error("❌ Gagal insert dummy data:", error);
  } else {
    console.log(`✅ Berhasil insert ${data.length} tugas dummy`);
  }
}

main();
