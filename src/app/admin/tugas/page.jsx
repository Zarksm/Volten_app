"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Navbar from "@/app/components/Navbar";

const AdminTugas = () => {
  const [data, setData] = useState([]);
  const [sortField, setSortField] = useState("tanggal");
  const [sortOrder, setSortOrder] = useState("desc"); // asc | desc
  const [filterUser, setFilterUser] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const query = new URLSearchParams({
          sortField,
          sortOrder,
          ...(filterUser ? { created_by: filterUser } : {}),
        });

        const res = await fetch(`/api/adminTugas?${query.toString()}`);
        const result = await res.json();
        if (!res.ok) throw new Error(result.error);
        setData(result);
      } catch (err) {
        console.error("❌ Error fetching data:", err.message);
      }
    };
    fetchAll();
  }, [sortField, sortOrder, filterUser]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="inline ml-1" />;
    return sortOrder === "asc" ? (
      <FaSortUp className="inline ml-1" />
    ) : (
      <FaSortDown className="inline ml-1" />
    );
  };

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <Navbar item="All Users" />
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">📋 Daftar Semua Tugas</h1>

        {/* 🔍 Filter Created By */}

        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Filter by Created By (nama)"
            className="border px-2 py-1 rounded"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
          />
        </div>

        <div className="rounded-md border p-6">
          <Table>
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
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Divisi</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("created_by")}
                    className="flex items-center gap-1"
                  >
                    Created By {renderSortIcon("created_by")}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.no}</TableCell>
                    <TableCell>{item.jenis_tugas}</TableCell>
                    <TableCell>{item.priority}</TableCell>
                    <TableCell>{item.tanggal}</TableCell>
                    <TableCell>{item.instruction_date}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.divisi}</TableCell>
                    <TableCell>{item.created_user?.nama || "-"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    Tidak ada data tugas
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminTugas;
