"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { DropdownAvatar } from "../dropdown/dropDownAvatar";
import { Bell, Plus } from "lucide-react";
import { DropDownAddNavbar } from "../dropdown/dropDownAddNavbar";

export default function Navbar() {
  const { data: session, status }: { data: any; status: string } = useSession();
  return (
    <>
      <div className="sticky max-w-full w-full items-center justify-between font-semibold lg:flex px-10 py-3 border">
        <div className="flex items-center w-max">
          <h1 className="text-2xl">Task</h1>
        </div>
        <div className="flex items-center w-max">
          <div className="flex items-center gap-3 space-x-3 ">
            <DropDownAddNavbar />
            <div className="flex items-center relative">
              <Bell />
              <div className="w-2 h-2 bg-red-500 rounded-full absolute top-0.5 left-3.5"></div>
            </div>
            <DropdownAvatar />
          </div>
        </div>
      </div>
    </>
  );
}
