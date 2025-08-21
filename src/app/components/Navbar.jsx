import React from "react";
import Profile from "./Profile";

const Navbar = ({ item }) => {
  return (
    <div className="w-full px-5 py-3 border-b border-slate-300 flex items-center justify-between">
      <h2 className="text-xl font-semibold">{item}</h2>
      <Profile />
    </div>
  );
};

export default Navbar;
