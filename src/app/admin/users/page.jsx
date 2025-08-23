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

export default function AllUserPages() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: null,
    nama: "",
    email: "",
    password: "",
    divisi: "",
  });

  // fetch user list
  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async () => {
    const method = form.id ? "PUT" : "POST";
    await fetch("/api/users", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ id: null, nama: "", email: "", password: "", divisi: "" });
    setOpen(false);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/users?id=${id}`, { method: "DELETE" });
    fetchUsers();
  };

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <Navbar item="All Users" />

      <div className="p-4">
        <Button onClick={() => setOpen(true)}>Tambah User</Button>

        <table className="w-full text-sm mt-4 border">
          <thead className="bg-gray-100">
            <tr>
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
                <td className="border p-2">{u.nama}</td>
                <td className="border p-2">{u.email}</td>
                <td className="border p-2">{u.divisi}</td>
                <td className="border p-2">{u.role}</td>
                <td className="border p-2 space-x-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setForm({ ...u, password: "" });
                      setOpen(true);
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

      {/* Dialog Form */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit User" : "Tambah User"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
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
            <Select
              value={form.divisi}
              onValueChange={(val) => setForm({ ...form, divisi: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Divisi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="HRD">HRD</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Operasional">Operasional</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <Button className="w-full" onClick={handleSave}>
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
