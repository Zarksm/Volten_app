import { FaHome, FaUser, FaCog } from "react-icons/fa";
import { MdAssignment, MdOutgoingMail } from "react-icons/md";


const sidebarItems = [
  {
    name: "Penugasan",
    path: "/dashboard",
    icon: <MdAssignment />,
  },
  {
    name: "Rutinan",
    path: "/dashboard/rutinan",
    icon: <FaUser />,
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
  }
];

export default sidebarItems;
