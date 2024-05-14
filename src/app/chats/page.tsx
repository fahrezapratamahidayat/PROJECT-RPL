import ConverSationList from "@/components/chat/conversationList";
import ChatPanelLayout from "@/components/layouts/chatPanelLayout";
import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar";

export default async function PageChats() {
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
