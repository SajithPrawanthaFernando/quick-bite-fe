"use client";

import { useState } from "react";
import Link from "next/link";
import { Scan, X, Search } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Avatar from "@radix-ui/react-avatar";
import { redirect, usePathname } from "next/navigation";
import { logoutUser } from "@/redux/actions/authActions";
import { AppDispatch } from "@/hooks/reduxHooks";
import { useToast } from "./ToastProvider";

const navItems = [
  { name: "Overview", path: "/admin" },
  { name: "Users", path: "/admin/users" },
  { name: "Restaurants", path: "/admin/restaurants" },
  { name: "Riders", path: "/admin/riders" },
  { name: "Orders", path: "/admin/orders" },
  { name: "Reports", path: "/admin/reports" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const dispatch = AppDispatch();
  const { showToast } = useToast();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    showToast("Logged out", "You have been successfully logged out.");
    redirect("/");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white border-r transition-transform duration-200 ease-in-out 
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
      >
        <div className="flex items-center justify-between px-4 py-[13.5px] border-b">
          <Link href="/">
            <h2 className="text-[26px] font-bold text-black">
              Quick<span className="text-[#FDB940]">Bite</span>
            </h2>
          </Link>

          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>
        <nav className="flex flex-col p-4 gap-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                pathname === item.path
                  ? "bg-[#FDB940] text-black"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-3 border-b bg-white">
          {/* Left: Search Bar */}
          <div className="flex items-center gap-4 w-full max-w-[360px]">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-12 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#FDB940]"
              />
              <span className="absolute left-3 top-2.5 text-gray-500">
                <Search className="size-[18px] mt-0.5" />
              </span>
              <span className="absolute right-3 top-2.5 text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded">
                ⌘ K
              </span>
            </div>
          </div>

          {/* Right: Action Buttons & Icons */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Store Selector */}
            <div className="flex items-center border px-3 py-1 rounded-md gap-2 text-sm">
              <img
                src="/images/logo3.png"
                alt="store"
                className="h-6 w-6 rounded-sm"
              />
              <span className="text-gray-300">ADMIN</span>
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                <path d="M5 7L10 12L15 7" stroke="black" strokeWidth="2" />
              </svg>
            </div>

            {/* Add New & POS */}
            <button className="bg-[#FDB940] text-white px-4 py-1.5 rounded-md text-sm font-semibold">
              ⏺ Add New
            </button>
            <button className="bg-[#1E2A52] text-white px-4 py-1.5 rounded-md text-sm font-semibold">
              🖥 POS
            </button>

            {/* Icons */}
            <div className="flex items-center gap-2 ml-3">
              <button className="p-2 rounded-md hover:bg-gray-100">
                <Scan className="size-4 text-gray-400" />
              </button>
              <button className="relative p-2 rounded-md hover:bg-gray-100">
                ✉️
                <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] px-1 rounded-full">
                  1
                </span>
              </button>
              <button className="p-2 rounded-md hover:bg-gray-100">🔔</button>
              <button className="p-2 rounded-md hover:bg-gray-100">⚙️</button>
            </div>

            {/* Avatar */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="focus:outline-none">
                  <Avatar.Root className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 overflow-hidden">
                    <Avatar.Image
                      src="/images/user.jpg"
                      alt="Admin"
                      className="h-full w-full object-cover"
                    />
                    <Avatar.Fallback className="text-sm font-medium text-black">
                      AF
                    </Avatar.Fallback>
                  </Avatar.Root>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content
                className="mt-2 bg-white rounded-md shadow-lg p-2 w-40"
                sideOffset={5}
              >
                <DropdownMenu.Item className="text-sm px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-md">
                  Profile
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1 border-t" />
                <DropdownMenu.Item className="text-sm px-3 py-2 hover:bg-gray-100 text-gray-500 rounded-md">
                  Settings
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1 border-t" />
                <DropdownMenu.Item
                  className="text-sm px-3 py-2 hover:bg-gray-100 rounded-md text-red-600"
                  onClick={handleLogout}
                >
                  Logout
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
