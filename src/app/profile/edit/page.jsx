// app/dashboard/edit/page.jsx
import React from "react";
import { getUserFromCookie } from "@/lib/getUserFromCookie";
import Sidebar from "@/app/components/Sidebar";
import Navbar from "@/app/components/Navbar";

export default async function EditPage() {
  const user = await getUserFromCookie();

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">Unauthorized. Silakan login dulu.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar kiri */}
      <aside className="w-64 border-r">
        <Sidebar />
      </aside>

      {/* Konten kanan */}
      <div className="flex flex-col w-full">
        {/* Navbar di atas */}
        <header className="border-b">
          <Navbar item="Edit Page" />
        </header>

        {/* Isi halaman */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-2">
            <p>
              <strong>Nama:</strong> {user.nama}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Divisi:</strong> {user.divisi}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
