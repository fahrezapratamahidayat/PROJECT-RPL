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
      <aside className="hidden lg:block fixed z-20 inset-0 top-[4rem] right-auto w-[14rem] overflow-y-auto border-r">
        <nav className="flex flex-col px-7 py-7 overflow-y-auto overflow-sidebar h-[calc(100vh-5rem)] transition-all ease-in-out">
          <div className="leading-6 space-y-3">
            <Link
              href="/"
              className={`${
                pathname === "/" ? "bg-secondary" : ""
              } flex items-center px-4 py-3 gap-5 hover:bg-secondary rounded-md font-semibold cursor-pointer`}
            >
              <Home className="h-5 w-5" />
              <span className="text-sm">Home</span>
            </Link>
            <Link
              href="/projects"
              className={`${
                pathname === "/projects" ? "bg-secondary" : ""
              } flex items-center px-4 py-3 gap-5 hover:bg-secondary rounded-md font-semibold cursor-pointer`}
            >
              <StickyNote className="h-5 w-5" />
              <span className="text-sm">Projects</span>
            </Link>
            <Link
              href="/"
              className={`${
                pathname === "/chats" ? "bg-secondary" : ""
              } flex items-center px-4 py-3 gap-5 hover:bg-secondary rounded-md font-semibold cursor-pointer`}
            >
              <MessageSquareMore className="h-5 w-5" />
              <span className="text-sm">Chat</span>
            </Link>
            <Link
              href="/"
              className={`${
                pathname === "/timeline" ? "bg-secondary" : ""
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
