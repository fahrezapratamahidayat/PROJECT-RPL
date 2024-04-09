import ChatUi from "@/components/chat/chatUi";
import ConverSationList from "@/components/chat/conversationList";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import ChatPanelLayout from "@/components/layouts/chatPanelLayout";
import PagesLayouts from "@/components/layouts/pagesLayouts";
import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar";
import React from "react";

const text: string = "Lorem ipsum dolor sit amet consectetur adipisicing elit.";
export default function PageChats() {
  return (
    <>
      <div className="flex min-h-screen w-full flex-col ">
        <Sidebar />
        <div className="flex flex-col lg:pl-[14rem]">
          <Navbar />
          <ChatPanelLayout>
            <ConverSationList slug="" />
          </ChatPanelLayout>
        </div>
      </div>
    </>
  );
}
