"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import TabelPenugasan from "../../components/TabelPenugasan";
import { Input } from "@/components/ui/input";

const Penugasan = () => {
  const [user, setUser] = useState(null); // user info
  const [tugasList, setTugasList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Ambil data user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        setUser(data.user); // pastikan response { user: {...} }
      } catch (err) {
        console.error("Gagal fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  // Ambil data tugas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/tugas");
        const data = await res.json();
        setTugasList(data);
      } catch (err) {
        console.error("Gagal fetch tugas:", err);
      }
    };

    fetchData();
  }, []);

  const filteredTugas = tugasList
    .filter((tugas) => tugas.jenis_tugas?.toLowerCase() === "penugasan")
    .filter((tugas) => {
      const lowerTerm = searchTerm.toLowerCase();
      return (
        tugas.description?.toLowerCase().includes(lowerTerm) ||
        tugas.no_tps?.toLowerCase().includes(lowerTerm) ||
        tugas.case_code?.toLowerCase().includes(lowerTerm)
      );
    });

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <Navbar item="Penugasan" />
      <div className="w-full p-5">
        <div className="w-full flex align-center justify-between">
          <div className="mb-4 min-w-md">
            <Input
              type="text"
              placeholder="Cari tugas berdasarkan deskripsi, TPS, atau case..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs"
            />
          </div>
        </div>
        <TabelPenugasan data={filteredTugas} />
      </div>
    </div>
  );
};

export default Penugasan;
