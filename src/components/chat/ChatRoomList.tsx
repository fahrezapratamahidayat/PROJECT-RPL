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
  getGroupChatRoom,
  getMessages,
  getOrCreateChatRoom,
  sendMessage,
} from "@/services/chatting/chattings";
import { collection, doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase/init";
import { getUsersByIds } from "@/services/users/getUser";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import ListUsers from "./listUsers";

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
  const [userInChatsRoom, setUserInChatsRoom] = useState([] as any);
  const [openDialog, setOpenDialog] = useState(false);

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
    try {
      if (type === "direct") {
        const users = [user.id, slug];
        const chatRoom = await getOrCreateChatRoom(
          users,
          "direct",
          undefined,
          undefined
        );
        if (chatRoom?.users) {
          const getUsersDataInTeams = await getUsersByIds(chatRoom.users);
          setUserInChatsRoom(getUsersDataInTeams);
          setChatroom(chatRoom);
        }
      } else if (type === "group") {
        const chatRoom = await getGroupChatRoom(slug);
        if (chatRoom?.users) {
          const getUsersDataInTeams = await getUsersByIds(chatRoom.users);
          setUserInChatsRoom(getUsersDataInTeams);
          setChatroom(chatRoom);
        }
      }
    } catch (error) {
      console.error("Error creating chat room:", error);
    }
  }, [session, slug, type]);

  useEffect(() => {
    getChatRooms();
  }, [getChatRooms]);

  // useEffect(() => {
  //   if (!chatroom.id) return;

  //   const fetchMessages = async () => {
  //     const loadedMessages = await getMessages(chatroom.id);
  //     setMessages(loadedMessages);
  //   };

  //   fetchMessages();
  // }, [chatroom.id]);

  useEffect(() => {
    if (!chatroom.id) return;

    const unsubscribe = getMessages(chatroom.id, (newMessages) => {
      setMessages(newMessages);
    });

    return () => unsubscribe();
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
    const distanceArray = distance.split(" ");
    if (distanceArray.includes("months") || distanceArray.includes("month")) {
      distanceArray.pop();
      distanceArray.pop();
    }
    const modifiedDistance = distanceArray.join(" ");
    return modifiedDistance;
  }

  return (
    <>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="mb-2">
              <div className="flex flex-wrap">
                {chatroom.type === "group"
                  ? `${chatroom.name} - Members`
                  : "Direct Chat"}
              </div>
            </DialogTitle>
            <ScrollArea className="flex flex-col gap-2 max-h-[250px] ,b-">
              {userInChatsRoom.length > 0 &&
                userInChatsRoom.map((user: any) => (
                  <ListUsers
                    className={`${
                      user.email === session?.user?.email ? "bg-muted" : ""
                    }`}
                    key={user.id}
                    isValid={user.email !== session?.user?.email}
                    leader={
                      user.id === chatroom.createdBy
                        ? "Leader"
                        : "" || user.id === session?.user?.id
                        ? "You"
                        : ""
                    }
                    showMessage={true}
                    data={user}
                  />
                ))}
            </ScrollArea>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col gap-1 rounded-lg border lg:h-[84vh] h-screen lg:w-[68%] w-full">
        <header className="flex items-center border-b py-2 lg:px-5 px-3 gap-2 bg-muted">
          <Button variant={"ghost"} onClick={() => router.back()} size={"icon"}>
            <ArrowLeft className="" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="flex items-center gap-2">
            <Avatar onClick={() => setOpenDialog(true)}>
              <AvatarImage
                src={userChats.profileUrl || "https://github.com/shadcn.png"}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col pl-1">
              <h1 className="text-base font-semibold">
                {type === "direct" ? userChats.fullname : chatroom.name}
              </h1>
              {chatroom.type === "group" && (
                <p className="text-sm text-muted-foreground">
                  {chatroom.users.length} members
                </p>
              )}
            </div>
          </div>
        </header>
        <ScrollArea className="flex-1 p-6 space-y-4">
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
                    ? "flex-row-reverse mr-1 mt-2"
                    : "flex-row"
                }`}
              />
            ))}
          {message && message.length === 0 && (
            <div
              className={`flex justify-center flex-col gap-5 items-center h-full mt-20`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="184"
                height="152"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
              </svg>
              <p className="text-center text-sm text-muted-foreground">
                No messages yet
              </p>
            </div>
          )}
        </ScrollArea>
        <div className="w-full px-5 py-5 shadow-lg rounded-t-lg drop-shadow backdrop-blur-md">
          <form className="" onSubmit={handleMessageSubmit}>
            <div className="flex items-center justify-between w-full gap-5">
              <div className="w-full">
                <Textarea
                  placeholder="Type your message..."
                  className="flex h-[50px] overflow-message max-h-[200px] min-h-0 items-center px-3 resize-none m-0 w-full dark:bg-transparent py-[10px] pr-[1rem] md:py-3.5 md:pr-[4rem] placeholder-black/50 dark:placeholder-white/50 pl-3 md:pl-4"
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
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleMessageSubmit(
                        e as unknown as React.FormEvent<HTMLFormElement>
                      );
                      setMessageInput("");
                    }
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
