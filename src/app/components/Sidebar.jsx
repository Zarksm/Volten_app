"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { GoSidebarCollapse } from "react-icons/go";
import sidebarItems from "../utils/Sidebar";
import ButtonTugas from "./ButtonTugas";

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`${
        isCollapsed ? "w-[70px]" : "w-[230px] min-w-[230px]"
      } h-screen bg-slate-200 py-3 px-3 transition-all duration-300 flex flex-col`}
    >
      <div
        className={
          isCollapsed
            ? "flex flex-col items-center"
            : "flex items-center justify-between"
        }
      >
        {/* Logo */}
        {!isCollapsed && (
          <div className="flex items-center gap-2 mb-6">
            <Image
              src="/assets/images/logo.webp"
              alt="Logo"
              width={40}
              height={40}
            />
            <h2 className="font-bold tracking-wide text-lg">Volten</h2>
          </div>
        )}

        {/* Collapse Button */}
        <div
          className={`${
            isCollapsed ? "flex justify-center" : "flex justify-end"
          } mb-6`}
        >
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-xl text-gray-700 hover:text-black cursor-pointer"
          >
            <GoSidebarCollapse />
          </button>
        </div>
      </div>

      {/* Sidebar List */}
      <nav className="space-y-1">
        <div className="w-full cursor-pointer flex mb-5">
          <ButtonTugas isCollapsed={isCollapsed} />
        </div>

        {sidebarItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center ${
                isCollapsed ? "justify-center" : ""
              } gap-3 px-3 py-2 rounded-md transition-all ${
                isActive
                  ? "bg-white text-black"
                  : "text-slate-600 hover:bg-gray-300"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {!isCollapsed && <span className="text-sm">{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
