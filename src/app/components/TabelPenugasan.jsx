// "use client";

// import { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import { FaRegEdit } from "react-icons/fa";
// import { MdDeleteOutline } from "react-icons/md";

// const ITEMS_PER_PAGE = 10;

// const TabelPenugasan = ({ data }) => {
//   const [currentPage, setCurrentPage] = useState(1);

//   const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const paginatedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   const getFileName = (url) => (url ? url.split("/").pop().split("?")[0] : "-");

//   const handleEdit = async (item) => {
//     // contoh update status jadi "in progress"
//     const res = await fetch("/api/tugas", {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id: item.id, status: "in progress" }),
//     });

//     if (res.ok) {
//       const updated = await res.json();
//       alert("✅ Data updated!");
//       onEditSuccess?.(updated); // optional callback ke parent
//     } else {
//       const err = await res.json();
//       alert("❌ " + err.error);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Yakin mau hapus data ini?")) return;

//     const res = await fetch("/api/tugas", {
//       method: "DELETE",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id }),
//     });

//     if (res.ok) {
//       alert("🗑️ Data deleted!");
//       onDeleteSuccess?.(id); // optional callback ke parent
//     } else {
//       const err = await res.json();
//       alert("❌ " + err.error);
//     }
//   };

//   function capitalize(text) {
//     if (!text) return "";
//     return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
//   }
//   return (
//     <div className="w-full text-xs">
//       {/* TABLE */}
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>No</TableHead>
//             <TableHead>Tanggal</TableHead>
//             <TableHead>Instruction Date</TableHead>
//             <TableHead>Description</TableHead>
//             <TableHead>Priority</TableHead>
//             <TableHead>Est Durasi</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Remark</TableHead>
//             <TableHead>Attachment</TableHead>
//             <TableHead>Action</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {paginatedData.map((item, index) => (
//             <TableRow key={index} className="text-xs">
//               <TableCell className="font-medium">
//                 {startIndex + index + 1}
//               </TableCell>
//               <TableCell>{item.tanggal}</TableCell>
//               <TableCell>{item.instruction_date}</TableCell>
//               <TableCell>{item.description}</TableCell>
//               <TableCell
//                 className={
//                   item.priority?.toLowerCase() === "urgent important"
//                     ? "text-red-500 font-semibold"
//                     : item.priority?.toLowerCase() === "urgent"
//                     ? "text-yellow-500 font-semibold"
//                     : "text-green-500 font-semibold"
//                 }
//               >
//                 {capitalize(item.priority)}
//               </TableCell>
//               <TableCell>{item.est_durasi}</TableCell>
//               <TableCell>{item.status}</TableCell>
//               <TableCell>{item.remark}</TableCell>
//               <TableCell>
//                 {item.attachment ? (
//                   <a
//                     href={item.attachment}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-500 underline"
//                   >
//                     <p>Lihat file</p>
//                   </a>
//                 ) : (
//                   "-"
//                 )}
//               </TableCell>

//               <TableCell className="flex gap-2">
//                 <div
//                   className="cursor-pointer text-lg"
//                   onClick={() => handleEdit(item)}
//                 >
//                   <FaRegEdit />
//                 </div>
//                 <div
//                   className="cursor-pointer text-xl text-red-500"
//                   onClick={() => handleDelete(item.id)}
//                 >
//                   <MdDeleteOutline />
//                 </div>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       {/* PAGINATION DI BAWAH TABEL */}
//       <div className="flex justify-center py-4">
//         <Pagination>
//           <PaginationContent>
//             <PaginationItem>
//               <PaginationPrevious
//                 href="#"
//                 onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//               />
//             </PaginationItem>

//             {[...Array(totalPages)].map((_, i) => (
//               <PaginationItem key={i}>
//                 <PaginationLink
//                   href="#"
//                   isActive={currentPage === i + 1}
//                   onClick={() => setCurrentPage(i + 1)}
//                 >
//                   {i + 1}
//                 </PaginationLink>
//               </PaginationItem>
//             ))}

//             <PaginationItem>
//               <PaginationNext
//                 href="#"
//                 onClick={() =>
//                   setCurrentPage((p) => Math.min(totalPages, p + 1))
//                 }
//               />
//             </PaginationItem>
//           </PaginationContent>
//         </Pagination>
//       </div>
//     </div>
//   );
// };

// export default TabelPenugasan;

"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ITEMS_PER_PAGE = 10;

const TabelPenugasan = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditValues({
      est_durasi: item.est_durasi ?? "",
      remark: item.remark ?? "",
      status: item.status ?? "",
      attachment: null, // file baru kalau user upload
    });
  };

  const handleChange = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (id) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("est_durasi", editValues.est_durasi);
    formData.append("remark", editValues.remark);
    formData.append("status", editValues.status);

    if (editValues.attachment instanceof File) {
      formData.append("attachment", editValues.attachment);
    }

    try {
      const res = await fetch("/api/tugas", {
        method: "PATCH",
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast.success("✅ Data berhasil diperbarui!");
      setEditingId(null);
      setEditValues({});
    } catch (err) {
      console.error("❌ Gagal update:", err.message);
      toast.error("Gagal update tugas!");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus tugas ini?")) return;

    try {
      const res = await fetch(`/api/tugas?id=${id}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast.success("Tugas berhasil dihapus!");
    } catch (err) {
      console.error("❌ Gagal hapus:", err.message);
      toast.error("Gagal menghapus tugas!");
    }
  };

  return (
    <div className="w-full text-xs">
      <div className="max-h-[30rem] overflow-y-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Instruction Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Est Durasi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Remark</TableHead>
              <TableHead>Attachment</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow key={item.id} className="text-xs">
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell>{item.tanggal}</TableCell>
                <TableCell>{item.instruction_date}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.priority}</TableCell>

                {/* Est Durasi */}
                <TableCell>
                  {editingId === item.id ? (
                    <input
                      type="text"
                      className="border px-1"
                      value={editValues.est_durasi}
                      onChange={(e) =>
                        handleChange("est_durasi", e.target.value)
                      }
                    />
                  ) : (
                    item.est_durasi
                  )}
                </TableCell>

                {/* Status */}
                <TableCell>
                  {editingId === item.id ? (
                    <input
                      type="text"
                      className="border px-1"
                      value={editValues.status}
                      onChange={(e) => handleChange("status", e.target.value)}
                    />
                  ) : (
                    item.status
                  )}
                </TableCell>

                {/* Remark */}
                <TableCell>
                  {editingId === item.id ? (
                    <input
                      type="text"
                      className="border px-1"
                      value={editValues.remark}
                      onChange={(e) => handleChange("remark", e.target.value)}
                    />
                  ) : (
                    item.remark
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
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      <div className="flex justify-center py-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <ToastContainer position="top-right" autoClose={1000} />
      </div>
    </div>
  );
};

export default TabelPenugasan;
