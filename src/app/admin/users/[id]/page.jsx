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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🔹 Tambahan import untuk edit user
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit3, Save, X } from "lucide-react";

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

  // 🔹 State untuk edit user
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [userForm, setUserForm] = useState({
    username: "",
    nama: "",
    email: "",
  });

  // 🔹 Fetch user
  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      const res = await fetch(`/api/adminUsers/${id}`);
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setUserForm({
          username: data.username,
          nama: data.nama,
          email: data.email,
        });
      }
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

  // 🔹 Save user edit
  const handleSaveUser = async () => {
    try {
      const res = await fetch(`/api/adminUsers/edit/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm),
      });
      if (!res.ok) throw new Error("Gagal update user");

      const updated = await res.json();
      setUser(updated);
      toast.success("✅ User berhasil diperbarui");
      setIsEditingUser(false);
    } catch (err) {
      toast.error("❌ " + err.message);
    }
  };

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6 w-full h-screen flex flex-col overflow-hidden">
      {/* 🔹 Tombol Kembali */}
      <div>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/users")}
          className="cursor-pointer"
        >
          ← Kembali
        </Button>
      </div>

      {/* 🔹 Detail User */}
      <div className="relative border py-6 px-6 rounded-md bg-white max-w-md">
        {/* Tombol Edit */}
        {!isEditingUser && (
          <div className="absolute top-4 right-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-100"
                    onClick={() => setIsEditingUser(true)}
                  >
                    <Edit3 className="h-5 w-5 text-gray-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Edit User</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        <h1 className="text-2xl font-bold mb-4">Detail User</h1>

        {isEditingUser ? (
          <div className="space-y-3">
            <div className="flex flex-col">
              <label className="text-sm font-medium">Username</label>
              <input
                type="text"
                value={userForm.username}
                onChange={(e) =>
                  setUserForm({ ...userForm, username: e.target.value })
                }
                className="border rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium">Nama</label>
              <input
                type="text"
                value={userForm.nama}
                onChange={(e) =>
                  setUserForm({ ...userForm, nama: e.target.value })
                }
                className="border rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={userForm.email}
                onChange={(e) =>
                  setUserForm({ ...userForm, email: e.target.value })
                }
                className="border rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleSaveUser}
                className="flex items-center gap-1"
              >
                <Save className="h-4 w-4" /> Save
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditingUser(false)}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" /> Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="hidden">
              <b>Username:</b> {user.username}
            </p>
            <p>
              <b>Nama:</b> {user.nama}
            </p>
            <p className="hidden">
              <b>Email:</b> {user.email}
            </p>
          </div>
        )}
      </div>

      {/* 🔹 Tabel Tugas */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <h2 className="text-xl font-semibold mb-3">List Tugas yang Dibuat</h2>
        <div className="flex-1 overflow-x-auto overflow-y-auto border rounded-lg">
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

      {/* 🔹 Toast */}
      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
}
