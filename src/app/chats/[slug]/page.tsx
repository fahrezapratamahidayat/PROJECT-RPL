"use client";
import ChatRoomList from "@/components/chat/ChatRoomList";
import ChatUi from "@/components/chat/chatUi";
import ConverSationList from "@/components/chat/conversationList";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import ChatPanelLayout from "@/components/layouts/chatPanelLayout";
import PagesLayouts from "@/components/layouts/pagesLayouts";
import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar";
import { firestore } from "@/lib/firebase/init";
import { collection, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

type ChatSlug = {
  params: {
    slug: string;
  };
};

type User = {
  id: string;
  fullname: string;
  email: string;
  idp: string;
  profileUrl: string;
  created_At: Date;
};

export default function PageChats(props: ChatSlug) {
  const { params } = props;
  const [userChats, setUserChats] = useState([] as User[]);
  useEffect(() => {
    const fetchUserById = async () => {
      const userId = params.slug;
      try {
        const userDocRef = doc(collection(firestore, "users"), params.slug);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData: any = {
            id: userDocSnapshot.id,
            ...userDocSnapshot.data(),
          };
          setUserChats(userData);
        } else {
        }
      } catch (error) {
        console.error("Error fetching user document:", error);
      }
    };

    fetchUserById();
  }, [params.slug]);

  return (
    <>
      <div className="flex min-h-screen w-full flex-col ">
        <Sidebar />
        <div className="flex flex-col lg:pl-[14rem]">
          <Navbar />
          <ChatPanelLayout>
            <ConverSationList slug={params.slug} className="lg:flex hidden" />
            {!params.slug ? null : (
              <ChatRoomList data={userChats} slug={params.slug} />
            )}
          </ChatPanelLayout>
        </div>
      </div>
    </>
  );
}
