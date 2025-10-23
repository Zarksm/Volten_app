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

import { supabase } from "@/lib/supabaseClient";

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
    divisi_branch: "",
  });

  const [errors, setErrors] = useState({});

  // Ambil divisi dari cookie
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) return;
        const data = await res.json();
        setForm((prev) => ({
          ...prev,
          role: data.role,
          divisi: data.divisi,
        }));
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
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

  const handleDivChange = (value) => {
    setForm((prev) => ({ ...prev, divisi_branch: value }));
    if (errors.divisi_branch)
      setErrors((prev) => ({ ...prev, divisi_branch: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDASI SIZE ATTACHMENT
    if (form.attachment) {
      const file = form.attachment;
      const fileType = file.type;
      const fileSize = file.size;

      const maxImageSize = 2 * 1024 * 1024; // 2 MB
      const maxVideoSize = 5 * 1024 * 1024; // 5 MB

      // CEK IMAGE (2 MB)
      if (fileType.startsWith("image/") && fileSize > maxImageSize) {
        setErrors((prev) => ({
          ...prev,
          attachment: "Ukuran gambar maksimal 2 MB!",
        }));
        return;
      }

      // CEK VIDEO (5 MB)
      if (fileType.startsWith("video/") && fileSize > maxVideoSize) {
        setErrors((prev) => ({
          ...prev,
          attachment: "Ukuran video maksimal 5 MB!",
        }));
        return;
      }

      // PDF & WORD → SKIP VALIDASI SIZE
    }

    const newErrors = {};
    for (const key in form) {
      if (["attachment", "remark", "divisi_branch"].includes(key)) continue;
      if (form[key].toString().trim() === "")
        newErrors[key] = "Field ini tidak boleh kosong";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Validasi tetap sama
    // const newErrors = {};
    // for (const key in form) {
    //   if (["attachment", "remark", "divisi_branch"].includes(key)) continue;
    //   if (form[key].toString().trim() === "")
    //     newErrors[key] = "Field ini tidak boleh kosong";
    // }
    // if (Object.keys(newErrors).length > 0) {
    //   setErrors(newErrors);
    //   return;
    // }

    let attachmentUrl = null;

    if (form.attachment) {
      const fileExt = form.attachment.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from("tugas-attachments")
        .upload(fileName, form.attachment);

      if (error) return console.error("Gagal upload file!");

      const { data } = supabase.storage
        .from("tugas-attachments")
        .getPublicUrl(fileName);

      attachmentUrl = data.publicUrl;
    }

    // Kirim ke API
    await onSubmit({ ...form, attachment: attachmentUrl });

    // Reset form
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
      divisi: "",
      divisi_branch: "",
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="mb-2">Priority</Label>
            <Select onValueChange={handlePriorityChange} value={form.priority}>
              <SelectTrigger className="w-full !shadow-none">
                <SelectValue placeholder="Pilih priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Priority</SelectLabel>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="Urgent Important">
                    Urgent Important
                  </SelectItem>
                  <SelectItem value="Reguler">Reguler</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.priority && (
              <p className="text-red-500 text-sm">{errors.priority}</p>
            )}
          </div>
          {form.role === "branch" && (
            <div className="space-y-2">
              <Label className="mb-2">Divisi</Label>
              <Select
                onValueChange={handleDivChange}
                value={form.divisi_branch}
              >
                <SelectTrigger className="w-full !shadow-none">
                  <SelectValue placeholder="Pilih divisi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Pilih Divisi</SelectLabel>
                    <SelectItem value="cs">CS</SelectItem>
                    <SelectItem value="wh">WH</SelectItem>
                    <SelectItem value="cleaning servis">
                      Cleaning Servis
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.divisi_branch && (
                <p className="text-red-500 text-sm">{errors.divisi_branch}</p>
              )}
            </div>
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
          <Label htmlFor="remark">Remark</Label>
          <Textarea
            id="remark"
            name="remark"
            value={form.remark}
            onChange={handleChange}
            placeholder=""
            className="!shadow-none bg-gray-100 cursor-not-allowed"
            disabled // ✅ Field remark nonaktif
          />
        </div>

        {/* Attachment */}
        <div className="space-y-2">
          <Label htmlFor="attachment">
            Attachment (opsional)
            {/* <span className="text-red-300 text-[10px] italic">
              *Max size 5mb!
            </span> */}
          </Label>
          <Input
            id="attachment"
            name="attachment"
            type="file"
            onChange={handleChange}
            className="!shadow-none "
          />
          {errors.attachment && (
            <p className="text-red-500 text-sm">{errors.attachment}</p>
          )}
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
