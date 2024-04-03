import ListChats from "@/components/chat/listChats";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar";;
import { Button } from "@/components/ui/button";
import { Ellipsis, Plus } from "lucide-react";
import React from "react";

const text: string = "Lorem ipsum dolor sit amet consectetur adipisicing elit.";
export default function PageChats() {
  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="lg:pl-[15.5rem] py-7 mr-9 flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-1 px-5 py-2 rounded-lg border w-1/3">
          <div className="flex flex-items-center justify-center">
            <div className="flex flex-col">
              <h1 className="text-lg font-bold ">Chats</h1>
              <p className="text-sm text-muted-foreground">
                Direct and teams messages
              </p>
            </div>
            <Button variant={"ghost"} className={"ml-auto p-2"}>
              <Ellipsis />
              <span className="sr-only">More</span>
            </Button>
          </div>
          <Button className="text-center text-sm gap-1 mt-5">
            <Plus className="" /> Create chat
          </Button>
          <div className="flex flex-col gap-4 space-y-2 space-x-1 mt-5">
            <ListChats />
            <ListChats />
            <ListChats />
            <ListChats />
          </div>
        </div>
      </main>
      <DarkModeToggle />
    </>
  );
}
