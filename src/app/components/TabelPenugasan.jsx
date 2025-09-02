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
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const ITEMS_PER_PAGE = 10;

const TabelPenugasan = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getFileName = (url) => (url ? url.split("/").pop().split("?")[0] : "-");

  function capitalize(text) {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
  return (
    <div className="w-full text-xs">
      {/* TABLE */}
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
            <TableRow key={index} className="text-xs">
              <TableCell className="font-medium">
                {startIndex + index + 1}
              </TableCell>
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
                {item.attachment ? (
                  <a
                    href={item.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    <p>Lihat file</p>
                  </a>
                ) : (
                  "-"
                )}
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

      {/* PAGINATION DI BAWAH TABEL */}
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
    </div>
  );
};

export default TabelPenugasan;
