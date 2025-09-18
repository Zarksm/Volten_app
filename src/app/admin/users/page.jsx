"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AllUserPages() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: null,
    username: "",
    nama: "",
    email: "",
    password: "",
    role: "",
    branch: "",
    branch_id: null,
    divisi: "",
    subRole: "",
  });

  // mapping branch ke branch_id
  const branchMap = {
    Pekanbaru: 1,
    Yogyakarta: 2,
    Bandung: 3,
    Makassar: 4,
  };

  const divisiOptions = ["WH", "CS", "Cleaning Servis"];

  // fetch user list
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/adminUsers");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("❌ Error fetch users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async () => {
    const method = form.id ? "PUT" : "POST";

    const payload = {
      id: form.id,
      username: form.username,
      nama: form.nama,
      email: form.email,
      password: form.password,
      role: form.role,
      divisi: form.divisi,
      branch_id: form.branch_id,
    };

    console.log("Payload dikirim:", payload);

    try {
      const res = await fetch("/api/adminUsers", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Gagal simpan user");
      toast.success(
        form.id ? "User berhasil diupdate!" : "User berhasil ditambahkan!"
      );
      // reset form
      setForm({
        id: null,
        username: "",
        nama: "",
        email: "",
        password: "",
        role: "",
        branch: "",
        branch_id: null,
        divisi: "",
        subRole: "",
      });

      setOpen(false);
      fetchUsers();
    } catch (err) {
      console.error("❌ Error save:", err);
      toast.error("Gagal menyimpan user!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/adminUsers?id=${id}`, { method: "DELETE" });
      toast.success("User berhasil dihapus!");
      fetchUsers();
    } catch (err) {
      toast.error("Gagal menghapus user!");
    }
  };

  const renderDivisiSelect = () => {
    if (form.role === "branch") {
      return (
        <>
          <Select
            value={form.branch}
            onValueChange={(val) =>
              setForm({
                ...form,
                branch: val,
                branch_id: branchMap[val],
                divisi: "",
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Branch" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(branchMap).map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {form.branch && (
            <Select
              value={form.divisi}
              onValueChange={(val) => setForm({ ...form, divisi: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Divisi" />
              </SelectTrigger>
              <SelectContent>
                {divisiOptions.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </>
      );
    }

    if (form.role === "user") {
      return (
        <>
          <Select
            value={form.subRole}
            onValueChange={(val) =>
              setForm({ ...form, subRole: val, divisi: "" })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Sub Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Operation Manager">
                Operation Manager
              </SelectItem>
              <SelectItem value="BDM">BDM</SelectItem>
            </SelectContent>
          </Select>

          {form.subRole === "Operation Manager" && (
            <Select
              value={form.divisi}
              onValueChange={(val) => setForm({ ...form, divisi: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Divisi Operation Manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PJT">PJT</SelectItem>
                <SelectItem value="FIN">FIN</SelectItem>
                <SelectItem value="GA/WH">GA/WH</SelectItem>
              </SelectContent>
            </Select>
          )}

          {form.subRole === "BDM" && (
            <Select
              value={form.divisi}
              onValueChange={(val) => setForm({ ...form, divisi: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Divisi BDM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Exe. Secretary">Exe. Secretary</SelectItem>
                <SelectItem value="Digital Marketing">
                  Digital Marketing
                </SelectItem>
                <SelectItem value="Marketing Support">
                  Marketing Support
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        </>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col w-screen h-screen overflow-scroll">
      <Navbar item="All Users" />

      <div className="p-4">
        <Button onClick={() => setOpen(true)}>Tambah User</Button>

        <table className="w-full text-sm mt-4 border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Username</th>
              <th className="border p-2">Nama</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Divisi</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="border p-2">{u.username}</td>
                <td className="border p-2">{u.nama}</td>
                <td className="border p-2">{u.email}</td>
                <td className="border p-2">{u.divisi}</td>
                <td className="border p-2">{u.role}</td>
                <td className="border p-2 space-x-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setForm({
                        ...u,
                        password: "",
                        username: u.username || "",
                        branch:
                          Object.keys(branchMap).find(
                            (b) => branchMap[b] === u.branch_id
                          ) || "",
                        branch_id: u.branch_id || null,
                        divisi: u.divisi || "",
                        subRole: "",
                      });
                      setOpen(true); // ✅ buka dialog otomatis
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(u.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit User" : "Tambah User"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <Input
              placeholder="Nama"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
            />
            <Input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <Select
              value={form.role}
              onValueChange={(val) =>
                setForm({
                  ...form,
                  role: val,
                  subRole: "",
                  divisi: "",
                  branch: "",
                  branch_id: null,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="branch">Branch</SelectItem>
              </SelectContent>
            </Select>

            {renderDivisiSelect()}

            <Button className="w-full" onClick={handleSave}>
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
}
