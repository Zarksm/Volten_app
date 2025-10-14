"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const GetFileAttachment = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState("");
  const [deleting, setDeleting] = useState("");
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Ambil file berdasarkan tanggal
  const getFilesByDate = async () => {
    if (!selectedDate) return alert("Pilih tanggal dulu lur 😄");
    setLoading(true);
    setFiles([]);

    const { data, error } = await supabase.storage
      .from("tugas-attachments")
      .list("", { limit: 1000 });

    if (error) {
      console.error(error);
      alert("Gagal ambil file dari storage!");
      setLoading(false);
      return;
    }

    const dateOnly = selectedDate;
    const filtered = data.filter((file) => {
      const createdDate =
        file.created_at?.split("T")[0] || file.updated_at?.split("T")[0];
      return createdDate === dateOnly;
    });

    if (filtered.length === 0) alert("Tidak ada file di tanggal itu 😅");
    setFiles(filtered);
    setLoading(false);
  };

  // Download satu file
  const downloadFile = async (fileName) => {
    try {
      setDownloading(fileName);
      const { data, error } = await supabase.storage
        .from("tugas-attachments")
        .createSignedUrl(fileName, 120);
      setDownloading("");

      if (error) {
        console.error("❌ Error createSignedUrl:", error);
        alert("Gagal membuat link download!");
        return;
      }

      const link = document.createElement("a");
      link.href = data.signedUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("❌ Error downloadFile:", err);
      alert("Terjadi kesalahan saat mendownload file!");
    }
  };

  // Download semua file jadi ZIP
  const downloadAllAsZip = async () => {
    if (files.length === 0) return alert("Tidak ada file untuk diunduh 😅");

    setDownloading("ALL");
    const zip = new JSZip();

    for (const file of files) {
      const { data, error } = await supabase.storage
        .from("tugas-attachments")
        .download(file.name);

      if (error) {
        console.error("Gagal download:", file.name, error);
        continue;
      }

      zip.file(file.name, data);
    }

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `arsip-tanggal-${selectedDate}.zip`);
    setDownloading("");
  };

  // Hapus satu file
  const deleteFile = async (fileName) => {
    if (!confirm(`Yakin mau hapus file "${fileName}" lur? 😢`)) return;
    setDeleting(fileName);

    const { error } = await supabase.storage
      .from("tugas-attachments")
      .remove([fileName]);
    setDeleting("");

    if (error) {
      console.error("Gagal hapus file:", error);
      alert("Gagal menghapus file!");
    } else {
      alert(`✅ File "${fileName}" berhasil dihapus.`);
      setFiles(files.filter((f) => f.name !== fileName));
      if (previewFile?.name === fileName) {
        setPreviewFile(null);
        setPreviewUrl("");
      }
    }
  };

  // Hapus semua file
  const deleteAllFiles = async () => {
    if (files.length === 0) return alert("Tidak ada file untuk dihapus 😅");
    if (!confirm("Yakin mau hapus SEMUA file di tanggal ini? 🗑️")) return;

    setDeleting("ALL");
    const fileNames = files.map((f) => f.name);
    const { error } = await supabase.storage
      .from("tugas-attachments")
      .remove(fileNames);
    setDeleting("");

    if (error) {
      console.error("❌ Gagal hapus semua:", error);
      alert("Gagal menghapus beberapa file!");
    } else {
      alert("Semua file berhasil dihapus!");
      setFiles([]);
      setPreviewFile(null);
      setPreviewUrl("");
    }
  };

  // Preview file
  const previewFileHandler = async (file) => {
    setPreviewFile(file);
    setPreviewUrl("");
    const { data, error } = await supabase.storage
      .from("tugas-attachments")
      .createSignedUrl(file.name, 120);

    if (error) {
      alert("Gagal memuat preview file!");
      console.error(error);
      return;
    }

    setPreviewUrl(data.signedUrl);
  };

  // File yang bisa dipreview
  const isPreviewable = (name) => {
    const ext = name.split(".").pop().toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "pdf", "txt", "webp"].includes(ext);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto h-screen flex flex-col">
      <h1 className="text-xl font-semibold mb-4 text-center">
        File Arsip Berdasarkan Tanggal Upload
      </h1>

      {/* Input tanggal */}
      <div className="flex items-center gap-2 mb-4 justify-center">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border px-3 py-2 rounded-md"
        />
        <button
          onClick={getFilesByDate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Tampilkan"}
        </button>
      </div>

      {/* Dua kolom */}
      <div className="flex-1 border rounded-md flex overflow-hidden shadow-sm">
        {/* KIRI */}
        <div className="w-1/2 border-r p-4 bg-gray-50 overflow-y-auto">
          {files.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              Belum ada file ditampilkan
            </p>
          ) : (
            <>
              <ul className="space-y-3">
                {files.map((file) => (
                  <li
                    key={file.name}
                    onClick={() =>
                      isPreviewable(file.name) && previewFileHandler(file)
                    }
                    className={`p-2 border rounded-md cursor-pointer hover:bg-gray-100 ${
                      previewFile?.name === file.name
                        ? "bg-blue-50 border-blue-400"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(
                            file.created_at || file.updated_at
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadFile(file.name);
                          }}
                          disabled={downloading === file.name}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          {downloading === file.name ? "..." : "Download"}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFile(file.name);
                          }}
                          disabled={deleting === file.name}
                          className="text-red-600 hover:underline text-xs"
                        >
                          {deleting === file.name ? "..." : "Hapus"}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {files.length > 0 && (
                <div className="mt-4 flex flex-col items-center gap-2">
                  <button
                    onClick={downloadAllAsZip}
                    disabled={downloading === "ALL"}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 w-full"
                  >
                    {downloading === "ALL"
                      ? "Mengemas ZIP..."
                      : "Download Semua (ZIP)"}
                  </button>

                  <button
                    onClick={deleteAllFiles}
                    disabled={deleting === "ALL"}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 w-full"
                  >
                    {deleting === "ALL"
                      ? "Menghapus Semua..."
                      : "Hapus Semua File"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* KANAN */}
        <div className="w-1/2 p-4 flex flex-col items-center justify-start bg-white overflow-auto">
          {!previewFile ? (
            <p className="text-gray-500 italic text-sm mt-20">
              Pilih file di kiri untuk melihat preview 👈
            </p>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-2">{previewFile.name}</h2>
              <div
                className="border rounded-md bg-gray-100 flex justify-center items-center"
                style={{
                  width: "100%",
                  height: "500px",
                }}
              >
                {previewUrl ? (
                  previewFile.name.endsWith(".pdf") ? (
                    <iframe
                      src={previewUrl}
                      className="w-full h-full"
                      title="PDF Preview"
                    ></iframe>
                  ) : (
                    <img
                      src={previewUrl}
                      alt="preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  )
                ) : (
                  <p>Memuat preview...</p>
                )}
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => downloadFile(previewFile.name)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                >
                  Download
                </button>
                <button
                  onClick={() => deleteFile(previewFile.name)}
                  className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                >
                  Hapus
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetFileAttachment;
