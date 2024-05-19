import ChatRoomList from "@/components/chat/ChatRoomList";
import ConverSationList from "@/components/chat/conversationList";
import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar";
import { redirect } from "next/navigation";

type ChatSlug = {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function PageChats({ params, searchParams }: ChatSlug) {
  const { slug } = params;
  const { type } = searchParams;
  if (!slug || !type) {
    redirect("/chats");
  }
  return (
    <>
      <div className="flex min-h-screen w-full flex-col ">
        <Sidebar />
        <div className="flex flex-col lg:pl-[14rem]">
          <Navbar className="hidden lg:flex" />
          <div className="flex gap-2 lg:py-7 lg:px-7 items-start h-full w-ful">
            <ConverSationList slug={params.slug} className="lg:flex hidden" />
            {!params.slug ? null : <ChatRoomList slug={params.slug} />}
          </div>
        </div>
      </div>
    </>
  );
}
