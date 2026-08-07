import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen } from "lucide-react";
import UserMenu from "./UserMenu";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-gray-900/95 backdrop-blur-md text-white px-4 sm:px-6 py-3 shadow-lg sticky top-0 z-50">
      <div className="flex items-center justify-between gap-4 w-full max-w-full mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <BookOpen className="w-7 h-7 text-blue-400" />
          <span className="text-xl sm:text-2xl text-blue-400 tracking-wide font-semibold">
            NoteKeeper
          </span>
        </Link>

        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-6 whitespace-nowrap overflow-x-auto no-scrollbar text-sm sm:text-base">
            <Link
              to="/home"
              className={`hover:text-blue-400 transition ${
                location.pathname === "/home" ? "text-blue-400 font-semibold" : "text-gray-300"
              }`}
            >
              Home
            </Link>
            <Link
              to="/create"
              className={`hover:text-blue-400 transition ${
                location.pathname === "/create" ? "text-blue-400 font-semibold" : "text-gray-300"
              }`}
            >
              Create Note
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-end shrink-0">
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;