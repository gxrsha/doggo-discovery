"use client";

import { useRouter } from "next/navigation";
import { FaBone } from "react-icons/fa";
import { api } from "../services/api";

export function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.logout();
      router.push("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const handleHomeClick = () => {
    router.push("/search");
  };

  return (
    <nav className="bg-[#1b1f26] shadow-sm backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-16 items-center gap-4">
          <button
            onClick={handleHomeClick}
            className="flex-shrink-0 flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <FaBone className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            <h1 className="text-xl sm:text-3xl font-bold text-foreground truncate">
              Doggo Discovery
            </h1>
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium bg-white rounded-xl text-gray-900 whitespace-nowrap flex-shrink-0"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
