import ChatUi from "@/components/chat/chatUi";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import PagesLayouts from "@/components/layouts/pagesLayouts";
import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar";
import React from "react";

const text: string = "Lorem ipsum dolor sit amet consectetur adipisicing elit.";
export default function PageChats() {
  return (
    <>
      <Navbar />
      <Sidebar />
      <PagesLayouts>
        <ChatUi />
      </PagesLayouts>
      <DarkModeToggle />
    </>
  );
}
