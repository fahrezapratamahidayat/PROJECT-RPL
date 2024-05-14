"use client";
import {
  CalendarFold,
  Home,
  MessageSquareMore,
  StickyNote,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <>
      <aside className="hidden lg:block fixed z-50 inset-0 right-auto w-[14rem] overflow-hidden border-r">
        <nav className="flex flex-col px-7 py-4 overflow-hide overflow-sidebar h-[calc(100vh-5rem)] transition-all ease-in-out">
          <h1 className="text-2xl font-semibold">Task</h1>
          <div className="leading-6 space-y-3 py-10">
            <Link
              href="/dashboard"
              className={`${
                pathname === "/dashboard" ? "bg-secondary" : ""
              } flex items-center px-4 py-3 gap-5 hover:bg-secondary rounded-md font-semibold cursor-pointer`}
            >
              <Home className="h-5 w-5" />
              <span className="text-sm">Dashboard</span>
            </Link>
            {/* <Link
              href="/projects"
              className={`${
                pathname === "/projects" ? "bg-secondary" : ""
              } flex items-center px-4 py-3 gap-5 hover:bg-secondary rounded-md font-semibold cursor-pointer`}
            >
              <StickyNote className="h-5 w-5" />
              <span className="text-sm">Projects</span>
            </Link> */}
            <Link
              href="/chats"
              className={`${
                pathname.startsWith("/chats") ? "bg-secondary" : ""
              } flex items-center px-4 py-3 gap-5 hover:bg-secondary rounded-md font-semibold cursor-pointer`}
            >
              <MessageSquareMore className="h-5 w-5" />
              <span className="text-sm">Chats</span>
            </Link>
            <Link
              href="/calendar"
              className={`${
                pathname === "/calendar" ? "bg-secondary" : ""
              } flex items-center px-4 py-3 gap-5 hover:bg-secondary rounded-md font-semibold cursor-pointer`}
            >
              <CalendarFold className="h-5 w-5" />
              <span className="text-sm">Calendar</span>
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}
