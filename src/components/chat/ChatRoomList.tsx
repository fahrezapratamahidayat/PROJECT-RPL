"use client";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import MessageCard from "./messageCard";
import { id } from "date-fns/locale";
import { Button } from "../ui/button";
import { ArrowLeft, SendIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getMessages,
  getOrCreateChatRoom,
  sendMessage,
} from "@/services/chatting/chattings";
import { collection, doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase/init";

type User = {
  id: string;
  fullname: string;
  email: string;
  idp: string;
  created_At: Date;
  profileUrl: string;
};

export default function ChatRoomList({ slug }: { slug: string }) {
  const [messageInput, setMessageInput] = React.useState<string>("");
  const { data: session }: { data: any } = useSession();
  const [chatroom, setChatroom] = useState([] as any);
  const [message, setMessages] = useState([] as any);
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const [userChats, setUserChats] = useState({} as User);

  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const userDocRef = doc(collection(firestore, "users"), slug);
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
  }, [slug]);

  const getChatRooms = useCallback(async () => {
    if (!session) return;
    const { user } = session;
    if (type === "direct") {
      const users = [user.id, slug];
      const chatRoom = await getOrCreateChatRoom(
        users,
        "direct",
        undefined,
        undefined
      );
      setChatroom(chatRoom);
    } else if (type === "group") {
      const chatRoom = await getOrCreateChatRoom(
        [user.id],
        "group",
        undefined,
        undefined
      );
      setChatroom(chatRoom);
    }
  }, [session, slug, type]);

  useEffect(() => {
    getChatRooms();
  }, [getChatRooms]);

  useEffect(() => {
    if (!chatroom.id) return;

    const fetchMessages = async () => {
      const loadedMessages = await getMessages(chatroom.id);
      setMessages(loadedMessages);
    };

    fetchMessages();
  }, [chatroom.id]);

  const handleMessageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session || !messageInput || !chatroom.id) return;
    const { user } = session;

    try {
      await sendMessage(chatroom.id, messageInput, user.id);
      setMessageInput("");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  function timeStapHandle(item: any) {
    const timestamp = new Date(item.timestamp);
    const distance = formatDistanceToNow(timestamp, {
      addSuffix: true,
      locale: id,
      includeSeconds: true,
    });
    // Split distance menjadi array
    const distanceArray = distance.split(" ");
    // Jika waktu lebih dari 1 bulan yang lalu, hilangkan "yang lalu"
    if (distanceArray.includes("months") || distanceArray.includes("month")) {
      distanceArray.pop(); // Hapus elemen terakhir
      distanceArray.pop(); // Hapus elemen terakhir
    }
    const modifiedDistance = distanceArray.join(" "); // Gabungkan kembali array
    return modifiedDistance;
  }

  // console.log("messgae",message);
  // console.log("users chats", userChats);
  // console.log("chatroom", chatroom);
  return (
    <>
      <div className="flex flex-col gap-1 rounded-lg border lg:h-[84vh] md-h-[84vh] sm:h-[84vh] h-screen lg:w-[68%] w-full">
        <header className="flex items-center border-b py-2 lg:px-5 px-3 gap-2 bg-muted">
          <Button variant={"ghost"} onClick={() => router.back()} size={"icon"}>
            <ArrowLeft className="" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={userChats.profileUrl || "https://github.com/shadcn.png"}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col pl-1">
              <h1 className="text-base font-semibold">
                {type === "direct" ? userChats.fullname : chatroom.name}
              </h1>
              {/* <span className="text-sm text-muted-foreground">
                {data.email}
              </span> */}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 overflow-message">
          {message &&
            message.length > 0 &&
            message.map((item: any) => (
              <MessageCard
                profileUrl={
                  item.sender === session?.user?.id
                    ? session.user.profileUrl
                    : userChats.profileUrl
                }
                key={item.id}
                message={item.message}
                date={timeStapHandle(item)}
                className={`${
                  item.sender === session?.user?.id
                    ? "flex-row-reverse mr-1"
                    : "flex-row"
                }`}
              />
            ))}
          {message && message.length === 0 && (
            <div className={`flex items-start gap-2 h-[80vh]`}>
              <h1>No Message</h1>
            </div>
          )}
        </div>
        <div className="w-full px-5 py-5 shadow-lg rounded-t-lg drop-shadow backdrop-blur-md">
          <form className="" onSubmit={handleMessageSubmit}>
            <div className="flex items-center justify-between w-full gap-5">
              <div className="w-full">
                <Textarea
                  placeholder="Type your message..."
                  className="flex h-[50px] max-h-[200px] min-h-0 items-center px-3 resize-none m-0 w-full dark:bg-transparent py-[10px] pr-[1rem] md:py-3.5 md:pr-[4rem] placeholder-black/50 dark:placeholder-white/50 pl-3 md:pl-4  overflow-message"
                  id="message"
                  name="message"
                  rows={1}
                  dir="auto"
                  tabIndex={0}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onInput={(e) => {
                    const textarea = e.target as HTMLTextAreaElement;
                    textarea.style.height = "auto";
                    textarea.style.height = `${textarea.scrollHeight}px`;
                  }}
                />
              </div>
              <Button
                size="icon"
                className="rounded-lg"
                type="submit"
                disabled={messageInput.length < 1}
              >
                <SendIcon />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
