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
// import { Input } from "@/components/ui/input";
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

// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const AdminTugas = () => {
//   const [data, setData] = useState([]);
//   const [sortField, setSortField] = useState("tanggal");
//   const [sortOrder, setSortOrder] = useState("desc");
//   const [filterUser, setFilterUser] = useState("");
//   const [editingId, setEditingId] = useState(null);
//   const [editValues, setEditValues] = useState({});

//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(5); // ✅ default show 10
//   const [total, setTotal] = useState(0);

//   // Fetch data
//   const fetchData = async () => {
//     try {
//       const query = new URLSearchParams({
//         sortField,
//         sortOrder,
//         page,
//         limit,
//         ...(filterUser ? { created_by: filterUser } : {}),
//       });

//       const res = await fetch(`/api/adminTugas?${query.toString()}`);
//       const result = await res.json();
//       if (!res.ok) throw new Error(result.error);

//       setData(result.data);
//       setTotal(result.total);
//     } catch (err) {
//       console.error("❌ Error fetching data:", err.message);
//       toast.error("Gagal mengambil data tugas");
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [sortField, sortOrder, filterUser, page, limit]); // ✅ tambahin limit

//   const totalPages = Math.max(1, Math.ceil(total / limit));

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

//   const handleEdit = (item) => {
//     setEditingId(item.id);
//     setEditValues({
//       status: item.status ?? "",
//       remark: item.remark ?? "",
//       est_durasi: item.est_durasi ?? "",
//       attachment: null,
//     });
//   };

//   const handleChange = (field, value) => {
//     setEditValues((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSave = async (id) => {
//     const formData = new FormData();
//     formData.append("id", id);
//     formData.append("status", editValues.status);
//     formData.append("remark", editValues.remark);
//     formData.append("est_durasi", editValues.est_durasi);

//     if (editValues.attachment instanceof File) {
//       formData.append("attachment", editValues.attachment);
//     }

//     try {
//       const res = await fetch("/api/adminTugas", {
//         method: "PATCH",
//         body: formData,
//       });
//       const result = await res.json();
//       if (!res.ok) throw new Error(result.error);

//       toast.success("Data tugas berhasil diperbarui!");
//       setEditingId(null);
//       setEditValues({});
//       fetchData();
//     } catch (err) {
//       console.error("❌ Gagal update:", err.message);
//       toast.error("Gagal update tugas!");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Yakin ingin menghapus tugas ini?")) return;

//     try {
//       const res = await fetch(`/api/adminTugas?id=${id}`, {
//         method: "DELETE",
//       });
//       const result = await res.json();
//       if (!res.ok) throw new Error(result.error);

//       toast.success("Tugas berhasil dihapus!");
//       fetchData();
//     } catch (err) {
//       console.error("❌ Gagal hapus:", err.message);
//       toast.error("Gagal menghapus tugas!");
//     }
//   };

//   // 🔹 Render pagination dengan ... biar rapi
//   const renderPaginationItems = () => {
//     const pages = [];
//     const maxVisible = 5;

//     if (totalPages <= maxVisible) {
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       if (page <= 3) {
//         pages.push(1, 2, 3, 4, "...", totalPages);
//       } else if (page >= totalPages - 2) {
//         pages.push(
//           1,
//           "...",
//           totalPages - 3,
//           totalPages - 2,
//           totalPages - 1,
//           totalPages
//         );
//       } else {
//         pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
//       }
//     }
//     return pages.map((p, idx) =>
//       p === "..." ? (
//         <PaginationItem
//           key={`dots-${idx}`}
//           className="pointer-events-none opacity-50"
//         >
//           ...
//         </PaginationItem>
//       ) : (
//         <PaginationItem key={`page-${p}-${idx}`}>
//           <PaginationLink isActive={page === p} onClick={() => setPage(p)}>
//             {p}
//           </PaginationLink>
//         </PaginationItem>
//       )
//     );
//   };

//   return (
//     <div className="flex flex-col w-screen h-screen overflow-x-scroll">
//       <Navbar item="All Tugas" />
//       <div className="p-6">
//         <h1 className="text-xl font-bold mb-4">📋 Daftar Semua Tugas</h1>

//         {/* Filter */}
//         <div className="flex items-center gap-4 mb-4">
//           <Input
//             placeholder="Filter by Created By"
//             value={filterUser}
//             onChange={(e) => {
//               setFilterUser(e.target.value);
//               setPage(1);
//             }}
//           />

//           {/* Dropdown jumlah data */}
//           <select
//             value={limit}
//             onChange={(e) => {
//               setLimit(Number(e.target.value));
//               setPage(1);
//             }}
//             className="border rounded px-2 py-1"
//           >
//             <option value={5}>Show 5</option>
//             <option value={10}>Show 10</option>
//             <option value={30}>Show 30</option>
//             <option value={50}>Show 50</option>
//           </select>
//         </div>

//         {/* Table */}
//         <div className="rounded-md border p-6 overflow-x-auto">
//           <Table className="min-w-[1200px]">
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
//                 <TableHead>
//                   <Button
//                     variant="ghost"
//                     onClick={() => toggleSort("created_by")}
//                     className="flex items-center gap-1"
//                   >
//                     Created By {renderSortIcon("created_by")}
//                   </Button>
//                 </TableHead>
//                 <TableHead>Divisi</TableHead>
//                 <TableHead>Description</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Attachment</TableHead>
//                 <TableHead>Remark</TableHead>
//                 <TableHead>Aksi</TableHead>
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
//                     <TableCell>{item.created_user?.nama || "-"}</TableCell>
//                     <TableCell>{item.divisi}</TableCell>
//                     <TableCell>{item.description}</TableCell>

//                     {/* Status */}
//                     <TableCell>
//                       {editingId === item.id ? (
//                         <select
//                           value={editValues.status}
//                           onChange={(e) =>
//                             handleChange("status", e.target.value)
//                           }
//                           className="border rounded px-2 py-1"
//                         >
//                           <option value="Revisi">Revisi</option>
//                           <option value="On Progress">On Progress</option>
//                           <option value="Closed">Closed</option>
//                         </select>
//                       ) : (
//                         item.status
//                       )}
//                     </TableCell>

//                     {/* Attachment */}
//                     <TableCell>
//                       {editingId === item.id ? (
//                         <input
//                           type="file"
//                           onChange={(e) =>
//                             handleChange("attachment", e.target.files[0])
//                           }
//                           className="border p-1 w-full"
//                         />
//                       ) : item.attachment ? (
//                         <a
//                           href={item.attachment}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-500 underline"
//                         >
//                           Lihat File
//                         </a>
//                       ) : (
//                         "-"
//                       )}
//                     </TableCell>

//                     {/* Remark */}
//                     <TableCell>
//                       {editingId === item.id ? (
//                         <input
//                           type="text"
//                           value={editValues.remark}
//                           onChange={(e) =>
//                             handleChange("remark", e.target.value)
//                           }
//                           className="border px-2 py-1 w-full"
//                         />
//                       ) : (
//                         item.remark || "-"
//                       )}
//                     </TableCell>

//                     {/* Aksi */}
//                     <TableCell className="flex gap-2">
//                       {editingId === item.id ? (
//                         <>
//                           <Button size="sm" onClick={() => handleSave(item.id)}>
//                             Save
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => setEditingId(null)}
//                           >
//                             Cancel
//                           </Button>
//                         </>
//                       ) : (
//                         <>
//                           <Button size="sm" onClick={() => handleEdit(item)}>
//                             Edit
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="destructive"
//                             onClick={() => handleDelete(item.id)}
//                           >
//                             Delete
//                           </Button>
//                         </>
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={12} className="text-center">
//                     Tidak ada data tugas
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>

//         {/* Pagination */}
//         <div className="mt-4 flex justify-between items-center">
//           <p className="text-sm text-muted-foreground">
//             Page {page} of {totalPages}
//           </p>
//           <Pagination>
//             <PaginationContent>
//               <PaginationItem>
//                 <PaginationPrevious
//                   onClick={() => setPage((p) => Math.max(1, p - 1))}
//                   className={page === 1 ? "pointer-events-none opacity-50" : ""}
//                 />
//               </PaginationItem>

//               {renderPaginationItems()}

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
//         <ToastContainer position="top-right" autoClose={1000} />
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Navbar from "@/app/components/Navbar";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminTugas = () => {
  const [data, setData] = useState([]);
  const [sortField, setSortField] = useState("tanggal");
  const [sortOrder, setSortOrder] = useState("desc");
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);

  const [filterUser, setFilterUser] = useState("");
  const [filterJenis, setFilterJenis] = useState("");

  // 🔹 Reset pagination kalau ada filter
  useEffect(() => {
    if (filterUser || filterJenis) {
      setPage(1);
      setLimit(total || 1000); // tampilkan semua hasil filter
    } else {
      setLimit(5); // default
    }
  }, [filterUser, filterJenis, total]);

  // Fetch data
  const fetchData = async () => {
    try {
      const query = new URLSearchParams({
        sortField,
        sortOrder,
        page,
        limit,
        ...(filterUser ? { created_by: filterUser } : {}),
        ...(filterJenis ? { jenis_tugas: filterJenis } : {}),
      });

      const res = await fetch(`/api/adminTugas?${query.toString()}`);
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      setData(result.data);
      setTotal(result.total);
    } catch (err) {
      console.error("❌ Error fetching data:", err.message);
      toast.error("Gagal mengambil data tugas");
    }
  };

  useEffect(() => {
    fetchData();
  }, [sortField, sortOrder, page, limit, filterUser, filterJenis]);

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
      status: item.status ?? "",
      remark: item.remark ?? "",
      est_durasi: item.est_durasi ?? "",
      attachment: null,
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

    try {
      const res = await fetch("/api/adminTugas", {
        method: "PATCH",
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast.success("Data tugas berhasil diperbarui!");
      setEditingId(null);
      setEditValues({});
      fetchData();
    } catch (err) {
      console.error("❌ Gagal update:", err.message);
      toast.error("Gagal update tugas!");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus tugas ini?")) return;

    try {
      const res = await fetch(`/api/adminTugas?id=${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast.success("Tugas berhasil dihapus!");
      fetchData();
    } catch (err) {
      console.error("❌ Gagal hapus:", err.message);
      toast.error("Gagal menghapus tugas!");
    }
  };

  const renderPaginationItems = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages.map((p, idx) =>
      p === "..." ? (
        <PaginationItem
          key={`dots-${idx}`}
          className="pointer-events-none opacity-50"
        >
          ...
        </PaginationItem>
      ) : (
        <PaginationItem key={`page-${p}-${idx}`}>
          <PaginationLink isActive={page === p} onClick={() => setPage(p)}>
            {p}
          </PaginationLink>
        </PaginationItem>
      )
    );
  };

  return (
    <div className="flex flex-col w-screen h-screen overflow-x-scroll">
      <Navbar item="All Tugas" />
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">📋 Daftar Semua Tugas</h1>

        {/* Filter */}
        <div className="flex items-center gap-4 mb-4">
          <Input
            placeholder="Filter by Created By"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
          />

          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Semua Jenis</option>
            <option value="Penugasan">Penugasan</option>
            <option value="Rutinan">Rutinan</option>
            <option value="Reguler">Reguler</option>
          </select>

          {!filterUser && !filterJenis && (
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="border rounded px-2 py-1"
            >
              <option value={5}>Show 5</option>
              <option value={10}>Show 10</option>
              <option value={30}>Show 30</option>
              <option value={50}>Show 50</option>
            </select>
          )}
        </div>

        {/* Table */}
        <div className="rounded-md border p-6 overflow-x-auto">
          <Table className="min-w-[1200px]">
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
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("created_by")}
                    className="flex items-center gap-1"
                  >
                    Created By {renderSortIcon("created_by")}
                  </Button>
                </TableHead>
                <TableHead>Divisi</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attachment</TableHead>
                <TableHead>Remark</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((item, idx) => (
                  <TableRow key={item.id}>
                    <TableCell>{idx + 1}</TableCell>
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
                  <TableCell colSpan={12} className="text-center">
                    Tidak ada data tugas
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination hanya tampil jika tanpa filter */}
        {!filterUser && !filterJenis && (
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className={
                      page === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={1000} />
      </div>
    </div>
  );
};

export default AdminTugas;
