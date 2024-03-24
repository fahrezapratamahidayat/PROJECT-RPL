import { CalendarFold, ClipboardList, Home, MessageSquareMore, StickyNote } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <>
      <aside className="hidden lg:block fixed z-20 inset-0 top-[4rem] right-auto w-[14rem] overflow-y-auto border-r">
        <nav className="flex flex-col px-7 py-7 overflow-y-auto overflow-sidebar h-[calc(100vh-5rem)] transition-all ease-in-out">
          <ul className="leading-6 space-y-3">
            <li className="flex items-center gap-5 px-4 py-3 hover:bg-secondary rounded-md text-sm font-semibold cursor-pointer">
              <Home className="h-5 w-5" />
              <Link href="/" className="text-sm">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-5 px-4 py-3 hover:bg-secondary rounded-md text-sm font-semibold cursor-pointer">
              <ClipboardList className="h-5 w-5" />
              <Link href="/" className="text-sm">
                My Task
              </Link>
            </li>
            <li className="flex items-center gap-5 px-4 py-3 hover:bg-secondary rounded-md text-sm font-semibold cursor-pointer">
              <StickyNote className="h-5 w-5" />
              <Link href="/" className="text-sm">
                Projects
              </Link>
            </li>
            <li className="flex items-center gap-5 px-4 py-3 hover:bg-secondary rounded-md text-sm font-semibold cursor-pointer">
              <MessageSquareMore className="h-5 w-5" />
              <Link href="/" className="text-sm">
                Chat
              </Link>
            </li>
            <li className="flex items-center gap-5 px-4 py-3 hover:bg-secondary rounded-md text-sm font-semibold cursor-pointer">
              <CalendarFold className="h-5 w-5" />
              <Link href="/" className="text-sm">
                Calender
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
