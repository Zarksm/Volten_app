"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useState } from "react";
import FormTugas from "@/components/FormTugas";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ButtonTugas = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tugasList, setTugasList] = useState([]);

  const handleTambahTugas = async (newTugas) => {
    try {
      const response = await fetch("/api/tugas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTugas),
      });

      const result = await response.json();
      console.log(">>> API result:", result);
      toast.success("Tugas berhasil dibuat!", { autoClose: 1000 });

      if (!response.ok) {
        toast.error("Gagal menyimpan tugas!", { autoClose: 1000 });

        console.error(
          `❌ Gagal menyimpan tugas: ${result.error || "Unknown error"}`
        );
        return;
      }

      // ⬅️ Tambahkan ke daftar lokal biar langsung kelihatan
      setTugasList((prev) => [...prev, result]);

      setIsOpen(false); // tutup dialog/modal
    } catch (err) {
      console.error(">>> Fetch error:", err);
      alert("❌ Terjadi error saat koneksi ke server.");
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={1000} />

      <Button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-blue-600 text-white"
      >
        <IoIosAddCircleOutline className="text-lg" />
        Tambah Tugas
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Buat Tugas Baru</DialogTitle>
          </DialogHeader>
          <FormTugas onSubmit={handleTambahTugas} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ButtonTugas;
