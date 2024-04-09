"use client";
import { DropdownAvatar } from "../dropdown/dropDownAvatar";
import { AlignRight, Bell } from "lucide-react";
import { DropDownAddNavbar } from "../dropdown/dropDownAddNavbar";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";

export default function Navbar() {
  return (
    <>
      <div className="sticky top-0 flex left-0 z-10 max-w-full w-full items-center justify-between  lg:flex lg:px-7 px-3 py-3 border-b backdrop-blur-lg">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost" className="lg:hidden">
              <AlignRight className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
              <h1>test</h1>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex items-center lg:justify-end justify-between w-full">
          <div className="flex items-center w-max lg:hidden">
            <h1 className="text-2xl font-semibold">Task</h1>
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
      </div>
    </>
  );
}
