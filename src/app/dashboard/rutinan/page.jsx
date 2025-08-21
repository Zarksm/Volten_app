"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import TabelRutinan from "@/app/components/TabelRutinan";
import { Input } from "@/components/ui/input";

const RutinanPage = () => {
  const [tugasList, setTugasList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // ambil data dari API
  useEffect(() => {
    const fetchTugas = async () => {
      try {
        const res = await fetch("/api/tugas");
        const data = await res.json();
        setTugasList(data);
      } catch (err) {
        console.error("Gagal fetch data:", err);
      }
    };
    fetchTugas();
  }, []);

  // filter rutinan + search
  const filteredTugas = tugasList
    .filter((tugas) => tugas.jenis_tugas?.toLowerCase() === "rutinan")
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
      <Navbar item="Rutinan" />
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
        <TabelRutinan data={filteredTugas} />
      </div>
    </div>
  );
};

export default RutinanPage;
