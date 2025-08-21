"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({ nama: "", divisi: "" });
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setUser({ nama: data.nama, divisi: data.divisi });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      window.location.assign("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-5">
        <div>
          <h2>
            {loading ? (
              <Skeleton className="h-[20px] w-[100px] rounded-full" />
            ) : (
              user.nama
            )}
          </h2>
          <p className="text-xs text-slate-400">{loading ? "" : user.divisi}</p>
        </div>
        <div onClick={() => setOpen(!open)} className="cursor-pointer">
          <Image
            src="/assets/images/avatar.webp"
            width={40}
            height={40}
            className="rounded-full"
            alt="Avatar"
          />
        </div>
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow z-20">
          <ul className="py-1">
            <li>
              <Link
                href="/profile/edit"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                Edit
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Profile;
