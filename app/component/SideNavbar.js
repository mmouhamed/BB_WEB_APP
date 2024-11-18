// components/SideNavbar.tsx

"use client";

import { signOut, useSession } from "next-auth/react";
import { FaUserCircle } from "react-icons/fa"; // Using React Icons for user icon
import {
  HiOutlineViewGrid,
  HiPlusCircle,
  HiClipboardList,
  HiArchive,
  HiLogout,
} from "react-icons/hi"; // Other icons

const SideNavbar = () => {
  const { data: session } = useSession(); // Get session data

  return (
    <div className="flex flex-col h-full bg-gray-800 text-white w-64 p-4">
      {/* User Info Section */}
      <div className="flex items-center space-x-4 mb-8">
        <FaUserCircle className="text-4xl" />
        <div>
          <p className="font-semibold">{session?.user?.name}</p>
          <p className="text-sm text-gray-400">{session?.user?.email}</p>
        </div>
      </div>

      {/* Navbar Links */}
      <nav className="flex flex-col space-y-4">
        <a
          href="/dashboard"
          className="flex items-center space-x-2 hover:text-gray-400"
        >
          <HiOutlineViewGrid className="text-xl" />
          <span>Dashboard</span>
        </a>
        <a
          href="/work-orders/create"
          className="flex items-center space-x-2 hover:text-gray-400"
        >
          <HiPlusCircle className="text-xl" />
          <span>Create Work Order</span>
        </a>
        <a
          href="/work-orders"
          className="flex items-center space-x-2 hover:text-gray-400"
        >
          <HiClipboardList className="text-xl" />
          <span>All Work Orders</span>
        </a>
        <a
          href="/work-orders/closed"
          className="flex items-center space-x-2 hover:text-gray-400"
        >
          <HiArchive className="text-xl" />
          <span>Closed Work Orders</span>
        </a>
        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="flex items-center space-x-2 text-red-500 hover:text-red-400 mt-6"
        >
          <HiLogout className="text-xl" />
          <span>Sign Out</span>
        </button>
      </nav>
    </div>
  );
};

export default SideNavbar;
