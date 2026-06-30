"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  BookOpen,
  Bot,
  BarChart3,
  Settings,
  User,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Courses",
    href: "/courses",
    icon: BookOpen,
  },
  {
    name: "AI Assistant",
    href: "/chat",
    icon: Bot,
  },
  {
    name: "Progress",
    href: "/progress",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-72 flex-col justify-between border-r border-zinc-800 bg-zinc-950 p-6">

      {/* Logo */}
      <div>

        <div className="mb-12">

          <h1 className="text-3xl font-bold tracking-tight text-white">
            DARES<span className="text-blue-500">-AI</span>
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Personalized AI Learning
          </p>

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
                  ${
                    active
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
              >

                <Icon size={20} />

                <span className="font-medium">
                  {item.name}
                </span>

              </Link>

            );
          })}

        </nav>

      </div>

      {/* User */}

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">

            <User size={22} />

          </div>

          <div>

            <p className="font-semibold text-white">
              Mahmoud
            </p>

            <p className="text-sm text-zinc-400">
              AI & Data Science
            </p>

          </div>

        </div>

      </div>

    </aside>
  );
}