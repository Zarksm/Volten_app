"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "tanggal",
    order: "desc",
  });
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ status: "", remark: "" });

  // 🔹 Fetch user
  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      const res = await fetch(`/api/adminUsers/${id}`);
      const data = await res.json();
      if (res.ok) setUser(data);
    };
    fetchUser();
  }, [id]);

  // 🔹 Fetch tasks
  useEffect(() => {
    if (!id) return;
    const fetchTasks = async () => {
      const query = new URLSearchParams({
        sortField: sortConfig.field,
        sortOrder: sortConfig.order,
      });
      const res = await fetch(`/api/adminTugas/${id}?${query}`);
      const json = await res.json();
      if (res.ok) setTasks(json.data || []);
    };
    fetchTasks();
  }, [id, sortConfig]);

  const toggleSort = (field) => {
    setSortConfig((prev) => ({
      field,
      order: prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const renderSortIcon = (field) => {
    if (sortConfig.field !== field) return "⇅";
    return sortConfig.order === "asc" ? "↑" : "↓";
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setEditValues({ status: task.status, remark: task.remark || "" });
  };

  const handleChange = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (taskId) => {
    try {
      const res = await fetch(`/api/adminTugas/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editValues),
      });
      if (!res.ok) throw new Error("Gagal update tugas");

      const updated = await res.json();
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...updated } : t))
      );

      toast.success("✅ Tugas berhasil diperbarui");
    } catch (err) {
      toast.error("❌ " + err.message);
    } finally {
      setEditingId(null);
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm("Yakin ingin menghapus tugas ini?")) return;
    try {
      const res = await fetch(`/api/adminTugas/${taskId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal hapus tugas");

      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      toast.success("🗑️ Tugas berhasil dihapus");
    } catch (err) {
      toast.error("❌ " + err.message);
    }
  };

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6 w-full overflow-x-hidden overflow-y-auto">
      {/* 🔹 Detail User */}
      <div>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/users")}
          className="cursor-pointer"
        >
          ← Kembali
        </Button>
      </div>
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">Detail User</h1>
      </div>

      <div className="space-y-1">
        <p>
          <b>Username:</b> {user.username}
        </p>
        <p>
          <b>Nama:</b> {user.nama}
        </p>
        <p>
          <b>Email:</b> {user.email}
        </p>
        <p>
          <b>Role:</b> {user.role}
        </p>
        <p>
          <b>Divisi:</b> {user.divisi}
        </p>
      </div>

      {/* 🔹 Tabel Tugas */}
      <div>
        <h2 className="text-xl font-semibold mb-3">List Tugas yang Dibuat</h2>
        <div className="overflow-x-auto">
          <Table className="min-w-[1100px]">
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Jenis Tugas</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("tanggal")}
                    className="flex items-center gap-1"
                  >
                    Tanggal {renderSortIcon("tanggal")}
                  </Button>
                </TableHead>
                <TableHead>Instruksi</TableHead>
                <TableHead>Divisi</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attachment</TableHead>
                <TableHead>Remark</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.length > 0 ? (
                tasks.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.jenis_tugas}</TableCell>
                    <TableCell>{item.priority}</TableCell>
                    <TableCell>{item.tanggal}</TableCell>
                    <TableCell>{item.instruction_date}</TableCell>
                    <TableCell>{item.divisi}</TableCell>
                    <TableCell>{item.description}</TableCell>

                    {/* Status */}
                    <TableCell>
                      {editingId === item.id ? (
                        <select
                          value={editValues.status}
                          onChange={(e) =>
                            handleChange("status", e.target.value)
                          }
                          className="border rounded px-2 py-1"
                        >
                          <option value="Revisi">Revisi</option>
                          <option value="On Progress">On Progress</option>
                          <option value="Closed">Closed</option>
                        </select>
                      ) : (
                        item.status
                      )}
                    </TableCell>

                    {/* Attachment */}
                    <TableCell>
                      {editingId === item.id ? (
                        <input
                          type="file"
                          onChange={(e) =>
                            handleChange("attachment", e.target.files[0])
                          }
                          className="border p-1 w-full"
                        />
                      ) : item.attachment ? (
                        <a
                          href={item.attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          Lihat File
                        </a>
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    {/* Remark */}
                    <TableCell>
                      {editingId === item.id ? (
                        <input
                          type="text"
                          value={editValues.remark}
                          onChange={(e) =>
                            handleChange("remark", e.target.value)
                          }
                          className="border px-2 py-1 w-full"
                        />
                      ) : (
                        item.remark || "-"
                      )}
                    </TableCell>

                    {/* Aksi */}
                    <TableCell className="flex gap-2">
                      {editingId === item.id ? (
                        <>
                          <Button size="sm" onClick={() => handleSave(item.id)}>
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" onClick={() => handleEdit(item)}>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} className="text-center">
                    Tidak ada data tugas
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
}
