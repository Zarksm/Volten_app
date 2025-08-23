"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
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
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const ITEMS_PER_PAGE = 10;

const TabelReguler = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [replaceFile, setReplaceFile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleEdit = (item) => {
    setEditData(item);
    setReplaceFile(false);
    setOpen(true);
  };

  const handleSave = () => {
    console.log("Data tersimpan:", editData);
    setOpen(false);
  };

  function capitalize(text) {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  return (
    <>
      {/* TABEL */}
      <Table className="text-xs">
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
            <TableRow key={index}>
              <TableCell>{startIndex + index + 1}</TableCell>
              <TableCell>{item.tanggal}</TableCell>
              <TableCell>{item.instruction_date}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell
                className={
                  item.priority?.toLowerCase() === "urgent important"
                    ? "text-red-500 font-semibold"
                    : item.priority?.toLowerCase() === "urgent"
                    ? "text-yellow-500 font-semibold"
                    : "text-green-500 font-semibold"
                }
              >
                {capitalize(item.priority)}
              </TableCell>
              <TableCell>{item.est_durasi}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.remark}</TableCell>
              <TableCell>
                {item.attachment?.name || item.attachment || "—"}
              </TableCell>
              <TableCell className="flex gap-2">
                <div
                  className="cursor-pointer text-lg"
                  onClick={() => handleEdit(item)}
                >
                  <FaRegEdit />
                </div>
                <div className="cursor-pointer text-xl">
                  <MdDeleteOutline />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* PAGINATION */}
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
      </div>

      {/* MODAL EDIT */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Data</DialogTitle>
          </DialogHeader>
          {editData && (
            <form className="flex flex-col gap-3 text-sm">
              {/* Tanggal */}
              <label>
                <span className="block text-xs text-gray-500 mb-1">
                  Tanggal penugasan
                </span>
                <Input
                  placeholder="YYYY-MM-DD"
                  value={editData.tanggal}
                  onChange={(e) =>
                    setEditData({ ...editData, tanggal: e.target.value })
                  }
                />
              </label>

              {/* Instruction Date */}
              <label>
                <span className="block text-xs text-gray-500 mb-1">
                  Tanggal instruksi (dari atasan)
                </span>
                <Input
                  placeholder="YYYY-MM-DD"
                  value={editData.instructionDate}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      instructionDate: e.target.value,
                    })
                  }
                />
              </label>

              {/* Description */}
              <label>
                <span className="block text-xs text-gray-500 mb-1">
                  Deskripsi tugas
                </span>
                <Input
                  placeholder="Tuliskan deskripsi tugas"
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                />
              </label>

              {/* PRIORITY SELECT */}
              <label>
                <span className="block text-xs text-gray-500 mb-1">
                  Tingkat prioritas
                </span>
                <Select
                  value={editData.priority}
                  onValueChange={(val) =>
                    setEditData({ ...editData, priority: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </label>

              {/* Attachment */}
              <label>
                <span className="block text-xs text-gray-500 mb-1">
                  Lampiran file (opsional)
                </span>
                {!replaceFile ? (
                  <div
                    className="cursor-pointer p-2 border rounded text-gray-500 text-xs"
                    onClick={() => setReplaceFile(true)}
                  >
                    {editData.attachment?.name ||
                      editData.attachment ||
                      "Tidak ada file"}
                    <span className="block text-[10px] text-blue-500 mt-1">
                      Klik untuk mengganti file
                    </span>
                  </div>
                ) : (
                  <Input
                    type="file"
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        attachment: e.target.files[0],
                      })
                    }
                  />
                )}
              </label>

              <Button type="button" onClick={handleSave}>
                Simpan
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TabelReguler;
