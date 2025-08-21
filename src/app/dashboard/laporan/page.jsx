"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/app/components/Navbar";

const LaporanPage = () => {
  const [jenis, setJenis] = useState("");
  const [formData, setFormData] = useState({
    tanggal: "",
    deskripsi: "",
    lampiran: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!jenis) {
      alert("Pilih jenis laporan terlebih dahulu");
      return;
    }
    console.log("Data laporan:", { jenis, ...formData });
    alert("Laporan berhasil dikirim!");
    // TODO: kirim ke backend
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="w-full flex items-center justify-between">
        <Navbar item="Laporan" />
      </div>
      <div className="max-w-max p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pilihan Jenis Laporan */}
          <div>
            <label className="block text-sm mb-1">Jenis Laporan</label>
            <Select onValueChange={setJenis}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih jenis laporan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="penugasan">Penugasan</SelectItem>
                <SelectItem value="rutinan">Rutinan</SelectItem>
                <SelectItem value="reguler">Reguler</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Input Tanggal */}
          <div>
            <label className="block text-sm mb-1">Tanggal</label>
            <Input
              type="date"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm mb-1">Deskripsi</label>
            <Textarea
              name="deskripsi"
              placeholder="Tuliskan detail laporan..."
              value={formData.deskripsi}
              onChange={handleChange}
            />
          </div>

          {/* Lampiran */}
          <div>
            <label className="block text-sm mb-1">Lampiran</label>
            <Input type="file" name="lampiran" onChange={handleChange} />
          </div>

          {/* Tombol Submit */}
          <Button type="submit" className="w-full cursor-pointer">
            Kirim Laporan
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LaporanPage;
