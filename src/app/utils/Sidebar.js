import { FaHome, FaUser, FaCog, FaClipboardList } from "react-icons/fa";
import { MdAssignment, MdOutgoingMail, MdAnalytics } from "react-icons/md";
import { AiOutlineTeam } from "react-icons/ai";
import { IoDocuments } from "react-icons/io5";
import { IoMdArchive } from "react-icons/io";



const sidebarItems = [
  {
    name: "Penugasan",
    path: "/dashboard/penugasan",
    icon: <MdAssignment />,
  },
  {
    name: "Rutinan",
    path: "/dashboard/rutinan",
    icon: <FaClipboardList />,
  },
  {
    name: "Reguler",
    path: "/dashboard/reguler",
    icon: <FaCog />,
  },
  {
    name: "Laporan",
    path: "/dashboard/laporan",
    icon: <MdOutgoingMail />,
  },

  // khusus admin
  {
    name: "Tugas",
    path: "/admin/tugas",
    icon: <IoDocuments />,
    requiredRole: "admin",
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <FaUser />,
    requiredRole: "admin",
  },
  {
    name: "Divisi / Tim",
    path: "/admin/divisi",
    icon: <AiOutlineTeam />,
    requiredRole: "admin",
  },
    {
    name: "Arsip File",
    path: "/admin/test/get/file",
    icon: <IoMdArchive />,
    requiredRole: "admin",
  },
];

export default sidebarItems;
