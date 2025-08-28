// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
// import Navbar from "@/app/components/Navbar";

// const AdminTugas = () => {
//   const [data, setData] = useState([]);
//   const [sortField, setSortField] = useState("tanggal");
//   const [sortOrder, setSortOrder] = useState("desc");
//   const [filterUser, setFilterUser] = useState("");

//   // pagination state
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);
//   const [total, setTotal] = useState(0);

//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const query = new URLSearchParams({
//           sortField,
//           sortOrder,
//           page,
//           limit,
//           ...(filterUser ? { created_by: filterUser } : {}),
//         });

//         const res = await fetch(`/api/adminTugas?${query.toString()}`);
//         const result = await res.json();
//         if (!res.ok) throw new Error(result.error);

//         setData(result.data);
//         setTotal(result.total);
//       } catch (err) {
//         console.error("❌ Error fetching data:", err.message);
//       }
//     };
//     fetchAll();
//   }, [sortField, sortOrder, filterUser, page, limit]);

//   const totalPages = Math.ceil(total / limit);

//   const toggleSort = (field) => {
//     if (sortField === field) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortField(field);
//       setSortOrder("asc");
//     }
//   };

//   const renderSortIcon = (field) => {
//     if (sortField !== field) return <FaSort className="inline ml-1" />;
//     return sortOrder === "asc" ? (
//       <FaSortUp className="inline ml-1" />
//     ) : (
//       <FaSortDown className="inline ml-1" />
//     );
//   };

//   return (
//     <div className="flex flex-col w-screen h-screen overflow-hidden">
//       <Navbar item="All Users" />
//       <div className="p-6">
//         <h1 className="text-xl font-bold mb-4">📋 Daftar Semua Tugas</h1>

//         {/* 🔍 Filter Created By */}
//         <div className="flex items-center gap-2 mb-4">
//           <input
//             type="text"
//             placeholder="Filter by Created By (nama)"
//             className="border px-2 py-1 rounded"
//             value={filterUser}
//             onChange={(e) => {
//               setFilterUser(e.target.value);
//               setPage(1); // reset ke halaman 1 kalau filter berubah
//             }}
//           />
//         </div>

//         <div className="rounded-md border p-6">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>No</TableHead>
//                 <TableHead>Jenis Tugas</TableHead>
//                 <TableHead>Priority</TableHead>
//                 <TableHead>
//                   <Button
//                     variant="ghost"
//                     onClick={() => toggleSort("tanggal")}
//                     className="flex items-center gap-1"
//                   >
//                     Tanggal {renderSortIcon("tanggal")}
//                   </Button>
//                 </TableHead>
//                 <TableHead>Instruksi</TableHead>
//                 <TableHead>Description</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Divisi</TableHead>
//                 <TableHead>
//                   <Button
//                     variant="ghost"
//                     onClick={() => toggleSort("created_by")}
//                     className="flex items-center gap-1"
//                   >
//                     Created By {renderSortIcon("created_by")}
//                   </Button>
//                 </TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {data.length > 0 ? (
//                 data.map((item) => (
//                   <TableRow key={item.id}>
//                     <TableCell>{item.no}</TableCell>
//                     <TableCell>{item.jenis_tugas}</TableCell>
//                     <TableCell>{item.priority}</TableCell>
//                     <TableCell>{item.tanggal}</TableCell>
//                     <TableCell>{item.instruction_date}</TableCell>
//                     <TableCell>{item.description}</TableCell>
//                     <TableCell>{item.status}</TableCell>
//                     <TableCell>{item.divisi}</TableCell>
//                     <TableCell>{item.created_user?.nama || "-"}</TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={9} className="text-center">
//                     Tidak ada data tugas
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>

//         {/* 📌 Pagination */}
//         <div className="mt-4 flex justify-center">
//           <Pagination>
//             <PaginationContent>
//               <PaginationItem>
//                 <PaginationPrevious
//                   onClick={() => setPage((p) => Math.max(1, p - 1))}
//                   className={page === 1 ? "pointer-events-none opacity-50" : ""}
//                 />
//               </PaginationItem>

//               {[...Array(totalPages)].map((_, idx) => (
//                 <PaginationItem key={idx}>
//                   <PaginationLink
//                     isActive={page === idx + 1}
//                     onClick={() => setPage(idx + 1)}
//                   >
//                     {idx + 1}
//                   </PaginationLink>
//                 </PaginationItem>
//               ))}

//               <PaginationItem>
//                 <PaginationNext
//                   onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                   className={
//                     page === totalPages ? "pointer-events-none opacity-50" : ""
//                   }
//                 />
//               </PaginationItem>
//             </PaginationContent>
//           </Pagination>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminTugas;

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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Navbar from "@/app/components/Navbar";

const AdminTugas = () => {
  const [data, setData] = useState([]);
  const [sortField, setSortField] = useState("tanggal");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterUser, setFilterUser] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  // pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const query = new URLSearchParams({
          sortField,
          sortOrder,
          page,
          limit,
          ...(filterUser ? { created_by: filterUser } : {}),
        });

        const res = await fetch(`/api/adminTugas?${query.toString()}`);
        const result = await res.json();
        if (!res.ok) throw new Error(result.error);

        setData(result.data);
        setTotal(result.total);
      } catch (err) {
        console.error("❌ Error fetching data:", err.message);
      }
    };
    fetchAll();
  }, [sortField, sortOrder, filterUser, page, limit]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

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

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditValues({
      status: item.status,
      remark: item.remark || "",
      durasi_revisi: item.durasi_revisi || "",
    });
  };

  const handleChange = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (id) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("status", editValues.status);
    formData.append("remark", editValues.remark);
    formData.append("est_durasi", editValues.est_durasi);
    if (editValues.attachment instanceof File) {
      formData.append("attachment", editValues.attachment);
    }

    const res = await fetch("/api/adminTugas", {
      method: "PATCH",
      body: formData, // ❌ jangan pakai JSON.stringify
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Gagal update tugas:", err.error);
      return;
    }

    const updated = await res.json();
    console.log("✅ Update sukses:", updated);
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
            onChange={(e) => {
              setFilterUser(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="rounded-md border p-6 overflow-x-auto">
          <Table className="min-w-[1200px]">
            {/* 🔥 bikin tabel lebih lebar */}
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[60px]">No</TableHead>
                <TableHead className="min-w-[150px]">Jenis Tugas</TableHead>
                <TableHead className="min-w-[120px]">Priority</TableHead>
                <TableHead className="min-w-[160px]">
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("tanggal")}
                    className="flex items-center gap-1"
                  >
                    Tanggal {renderSortIcon("tanggal")}
                  </Button>
                </TableHead>
                <TableHead className="min-w-[180px]">Instruksi</TableHead>
                <TableHead className="min-w-[160px]">
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("created_by")}
                    className="flex items-center gap-1"
                  >
                    Created By {renderSortIcon("created_by")}
                  </Button>
                </TableHead>
                <TableHead className="min-w-[140px]">Divisi</TableHead>

                <TableHead className="min-w-[220px]">Description</TableHead>
                <TableHead className="min-w-[160px]">Status</TableHead>

                <TableHead className="min-w-[200px]">Attachment</TableHead>
                <TableHead className="min-w-[200px]">Remark</TableHead>
                <TableHead className="min-w-[100px]">Aksi</TableHead>
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
                    <TableCell>{item.created_user?.nama || "-"}</TableCell>

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
                          <option value="revisi">Revisi</option>
                          <option value="onprogress">On Progress</option>
                          <option value="closed">Closed</option>
                        </select>
                      ) : (
                        item.status
                      )}
                    </TableCell>

                    {/* ✅ Attachment */}
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

                    {/* ✅ Remark */}
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
                        <Button size="sm" onClick={() => handleEdit(item)}>
                          Edit
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={12} className="text-center">
                    Tidak ada data tugas
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* 📌 Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, idx) => (
                <PaginationItem key={idx}>
                  <PaginationLink
                    isActive={page === idx + 1}
                    onClick={() => setPage(idx + 1)}
                  >
                    {idx + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default AdminTugas;
