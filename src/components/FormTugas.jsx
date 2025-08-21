"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";

const FormTugas = ({ onSubmit }) => {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    tanggal: today,
    no: "",
    instructionDate: "",
    description: "",
    jenisTugas: "",
    priority: "",
    estDurasi: "",
    status: "Open",
    remark: "",
    attachment: null,
    noTps: "",
    case: "",
  });

  const [errors, setErrors] = useState({});

  // Ambil divisi dari cookie
  useEffect(() => {
    const getDivisiFromCookie = () => {
      if (typeof document !== "undefined") {
        const cookies = document.cookie.split(";").reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split("=");
          acc[key] = decodeURIComponent(value);
          return acc;
        }, {});
        return cookies.divisi || "";
      }
      return "";
    };

    const divisi = getDivisiFromCookie();
    if (divisi) {
      setForm((prev) => ({ ...prev, divisi }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleJenisTugasChange = (value) => {
    setForm((prev) => ({ ...prev, jenisTugas: value }));
    if (errors.jenisTugas) setErrors((prev) => ({ ...prev, jenisTugas: null }));
  };

  const handlePriorityChange = (value) => {
    setForm((prev) => ({ ...prev, priority: value }));
    if (errors.priority) setErrors((prev) => ({ ...prev, priority: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(">>> handleSubmit terpanggil, form data:", form);

    const newErrors = {};
    for (const key in form) {
      if (["attachment", "remark"].includes(key)) continue; // ❌ skip remark & attachment

      if (form[key].toString().trim() === "") {
        newErrors[key] = "Field ini tidak boleh kosong";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(form);

    // ✅ Reset setelah kirim
    setForm({
      tanggal: today,
      no: "",
      instructionDate: "",
      description: "",
      jenisTugas: "",
      priority: "",
      estDurasi: "",
      status: "Open",
      remark: "",
      attachment: null,
      noTps: "",
      case: "",
      divisi: "",
    });
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nomor Tugas */}
          <div className="space-y-2">
            <Label htmlFor="no">Nomor Tugas</Label>
            <Input
              id="no"
              name="no"
              value={form.no}
              onChange={handleChange}
              placeholder="Masukkan nomor tugas"
              className="!shadow-none"
            />
            {errors.no && <p className="text-red-500 text-sm">{errors.no}</p>}
          </div>

          {/* Jenis Tugas */}
          <div className="space-y-2">
            <Label className="mb-2">Jenis Tugas</Label>
            <Select
              onValueChange={handleJenisTugasChange}
              value={form.jenisTugas}
            >
              <SelectTrigger className="w-full !shadow-none">
                <SelectValue placeholder="Pilih jenis tugas" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Jenis Tugas</SelectLabel>
                  <SelectItem value="penugasan">Penugasan</SelectItem>
                  <SelectItem value="rutinan">Rutinan</SelectItem>
                  <SelectItem value="reguler">Reguler</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.jenisTugas && (
              <p className="text-red-500 text-sm">{errors.jenisTugas}</p>
            )}
          </div>
        </div>

        {/* Priority */}
        <div>
          <Label className="mb-2">Priority</Label>
          <Select onValueChange={handlePriorityChange} value={form.priority}>
            <SelectTrigger className="w-full !shadow-none">
              <SelectValue placeholder="Pilih priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Priority</SelectLabel>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.priority && (
            <p className="text-red-500 text-sm">{errors.priority}</p>
          )}
        </div>

        {/* Tanggal */}
        <div className="space-y-2">
          <Label htmlFor="tanggal">Tanggal</Label>
          <Input
            type="date"
            id="tanggal"
            name="tanggal"
            value={form.tanggal}
            readOnly
            className="bg-gray-100 cursor-not-allowed !shadow-none"
          />
        </div>

        {/* Tanggal Instruksi */}
        <div className="space-y-2">
          <Label htmlFor="instructionDate">Tanggal Instruksi</Label>
          <Input
            type="date"
            id="instructionDate"
            name="instructionDate"
            value={form.instructionDate}
            onChange={handleChange}
            className="!shadow-none"
          />
        </div>

        {/* Deskripsi */}
        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Masukkan deskripsi tugas"
            className="!shadow-none"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        {/* Estimasi Durasi */}
        <div className="space-y-2">
          <Label htmlFor="estDurasi">Estimasi Durasi</Label>
          <Input
            id="estDurasi"
            name="estDurasi"
            value={form.estDurasi}
            onChange={handleChange}
            placeholder="Masukkan estimasi durasi"
            className="!shadow-none"
          />
          {errors.estDurasi && (
            <p className="text-red-500 text-sm">{errors.estDurasi}</p>
          )}
        </div>

        {/* Remark */}
        <div className="space-y-2">
          <Label htmlFor="remark">Remark (opsional)</Label>
          <Textarea
            id="remark"
            name="remark"
            value={form.remark}
            onChange={handleChange}
            placeholder="Masukkan remark"
            className="!shadow-none"
          />
        </div>

        {/* Attachment */}
        <div className="space-y-2">
          <Label htmlFor="attachment">Attachment (opsional)</Label>
          <Input
            id="attachment"
            name="attachment"
            type="file"
            onChange={handleChange}
            className="!shadow-none"
          />
        </div>

        {/* No TPS & Case */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="noTps">No TPS</Label>
            <Input
              id="noTps"
              name="noTps"
              value={form.noTps}
              onChange={handleChange}
              placeholder="Masukkan nomor TPS"
              className="!shadow-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="case">Case</Label>
            <Input
              id="case"
              name="case"
              value={form.case}
              onChange={handleChange}
              placeholder="Masukkan case code"
              className="!shadow-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="w-full flex justify-end">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            Buat Tugas
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormTugas;
