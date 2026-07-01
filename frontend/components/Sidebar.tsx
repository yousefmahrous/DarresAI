"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Bot, BarChart3, User as UserIcon, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; 

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth(); // سحبنا دالة الـ logout من الـ Context

  const isParent = user?.role === "parent";

  const menuItems = [
    ...(!isParent ? [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "My Courses", href: "/courses", icon: BookOpen },
      { name: "AI Assistant", href: "/chat", icon: Bot },
    ] : []),
    ...(isParent ? [
      { name: "Progress", href: "/progress", icon: BarChart3 },
    ] : []),
    { name: "Profile", href: "/profile", icon: UserIcon },
  ];

  return (
    <aside className="flex h-screen sticky top-0 w-72 flex-col justify-between border-r border-zinc-800 bg-zinc-950 p-6">
      {/* Logo */}
      <div>
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            DARES<span className="text-blue-500">-AI</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400">Personalized AI Learning</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200
                  ${active ? "bg-blue-600 text-white shadow-lg" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"}`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Section & Logout */}
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
              <UserIcon size={22} />
            </div>
            <div>
              <p className="font-semibold text-white">
                {user?.name || "Loading..."}
              </p>
              <p className="text-sm text-zinc-400 capitalize">
                {user?.role || "User"}
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={logout}
          className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-red-500 transition-colors hover:bg-red-500/20 hover:text-red-400"
        >
          <LogOut size={18} />
          <span className="font-medium">Log out</span>
        </button>
      </div>
    </aside>
  );
}