import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { NoteContext } from "../context/NoteContext";

// UserMenu: shows avatar with dropdown containing profile info and logout
export default function UserMenu() {
  const { user, logout } = useContext(NoteContext);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }

    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const initial = (user?.fullname || "U")[0]?.toUpperCase() || "U";

  return (
    <div className="relative" ref={ref}>
      <button
        aria-label="User menu"
        onClick={() => setOpen((v) => !v)}
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold bg-gradient-to-br from-blue-500 to-blue-700 shadow-md hover:scale-105 transition-transform"
      >
        {initial}
      </button>

      {/* Dropdown */}
      <div
        className={`origin-top-right absolute right-0 mt-2 w-64 z-50 transform transition-all duration-200 ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-gray-900/70 backdrop-blur-md rounded-xl p-4 shadow-lg ring-1 ring-black/20">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 text-white text-2xl font-bold">
              {initial}
            </div>
            <div className="text-left overflow-hidden">
              <div className="text-white font-semibold truncate">{user?.fullname || "Unknown User"}</div>
              <div className="text-gray-300 text-sm truncate">{user?.email || "No email"}</div>
            </div>
          </div>

          <div className="my-3 border-t border-white/10"></div>

          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg bg-gray-800 hover:bg-red-600 hover:text-white transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
