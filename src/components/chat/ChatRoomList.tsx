"use client";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import MessageCard from "./messageCard";
import { id } from "date-fns/locale";
import { Button } from "../ui/button";
import { ArrowLeft, SendIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase/init";
import { useRouter } from "next/navigation";

export default function ChatRoomList({
  data,
  slug,
}: {
  data: any;
  slug: string;
}) {
  const [messageInput, setMessageInput] = React.useState<string>("");
  const { data: session }: { data: any } = useSession();
  const [chatrooms, setChatrooms] = useState([] as any);
  const [messages, setMessages] = useState([] as any);
  const router = useRouter();

  // const handleMessageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (!session || !messageInput) return;
  //   const { user } = session;

  //   try {
  //     const chatroomQuery = query(
  //       collection(firestore, "chatrooms"),
  //       where("users", "array-contains-any", [user?.id, slug])
  //     );
  //     const chatroomQuerySnapshot = await getDocs(chatroomQuery);

  //     let chatroomId;
  //     if (chatroomQuerySnapshot.empty) {
  //       const newChatroomRef = await addDoc(
  //         collection(firestore, "chatrooms"),
  //         {
  //           users: [user?.id, slug],
  //           createdAt: new Date(),
  //           content: [],
  //           type: "direct",
  //         }
  //       );
  //       chatroomId = newChatroomRef.id;
  //     } else {
  //       chatroomQuerySnapshot.forEach((doc) => {
  //         chatroomId = doc.id;
  //       });
  //     }

  //     await addDoc(collection(firestore, `chatrooms/${chatroomId}/messages`), {
  //       sender: user?.id,
  //       timestamp: new Date().toISOString(),
  //       content: messageInput,
  //       likes: 0,
  //       dislikes: 0,
  //     });

  //     setMessageInput("");
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //   }
  // };

  // useEffect(() => {
  //   const fetchChatrooms = async () => {
  //     if (!session) return;

  //     const { user } = session;
  //     const chatroomQuery = query(
  //       collection(firestore, "chatrooms"),
  //       where("users", "array-contains", user?.id)
  //     );

  //     try {
  //       const chatroomQuerySnapshot = await getDocs(chatroomQuery);
  //       if (!chatroomQuerySnapshot.empty) {
  //         const chatroomData = chatroomQuerySnapshot.docs[0].data();
  //         setChatrooms({
  //           id: chatroomQuerySnapshot.docs[0].id,
  //           type: chatroomData.type,
  //           content: chatroomData.content,
  //           users: chatroomData.users,
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Error fetching chatrooms:", error);
  //     }
  //   };

  //   fetchChatrooms();
  // }, [session]);

  // useEffect(() => {
  //   if (!chatrooms?.id) return;

  //   const chatroomRef = query(
  //     collection(firestore, `chatrooms/${chatrooms.id}/messages`),
  //     orderBy("timestamp", "desc"),
  //     limit(50)
  //   );
  //   const unsubscribe = onSnapshot(chatroomRef, (snapshot) => {
  //     const messagesData: any = [];
  //     snapshot.forEach((doc) => {
  //       messagesData.push({
  //         id: doc.id,
  //         ...doc.data(),
  //       });
  //     });
  //     setMessages(messagesData.reverse());
  //   });

  //   return () => {
  //     unsubscribe();
  //   };
  // }, [chatrooms.id, messages]);

  const handleMessageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session || !messageInput) return;
    const { user } = session;

    try {
      const chatroomQuery = query(
        collection(firestore, "chatrooms"),
        where("users", "array-contains-any", [user?.id, slug])
      );
      const chatroomQuerySnapshot = await getDocs(chatroomQuery);

      let chatroomId;
      if (chatroomQuerySnapshot.empty) {
        const newChatroomRef = await addDoc(
          collection(firestore, "chatrooms"),
          {
            users: [user?.id, slug],
            createdAt: new Date(),
            type: "direct",
          }
        );
        chatroomId = newChatroomRef.id;
      } else {
        chatroomId = chatroomQuerySnapshot.docs[0].id;
      }

      await addDoc(collection(firestore, `chatrooms/${chatroomId}/messages`), {
        sender: user?.id,
        timestamp: new Date().toISOString(),
        content: messageInput,
        likes: 0,
        dislikes: 0,
      });

      setMessageInput("");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    const fetchChatrooms = async () => {
      if (!session) return;

      const { user } = session;
      const chatroomQuery = query(
        collection(firestore, "chatrooms"),
        where("users", "array-contains", user?.id)
      );

      try {
        const chatroomQuerySnapshot = await getDocs(chatroomQuery);
        if (!chatroomQuerySnapshot.empty) {
          const chatroomData = chatroomQuerySnapshot.docs[0].data();
          setChatrooms({
            id: chatroomQuerySnapshot.docs[0].id,
            type: chatroomData.type,
            content: chatroomData.content,
            users: chatroomData.users,
          });
        }
      } catch (error) {
        console.error("Error fetching chatrooms:", error);
      }
    };

    fetchChatrooms();
  }, [session]);

  useEffect(() => {
    if (!chatrooms?.id) return;

    const chatroomRef = collection(
      firestore,
      `chatrooms/${chatrooms.id}/messages`
    );
    const fetchMessages = async () => {
      try {
        const querySnapshot = await getDocs(
          query(chatroomRef, orderBy("timestamp", "desc"), limit(50))
        );
        const messagesData: any = [];
        querySnapshot.forEach((doc) => {
          messagesData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setMessages(messagesData.reverse());
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [chatrooms.id]);

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

  return (
    <>
      <div className="relative flex flex-col gap-1 rounded-lg border lg:h-[84vh]  lg:w-[68%] w-full">
        <div className="flex items-center border-b py-2 lg:px-5 px-3 gap-2 bg-muted ">
          <Button variant={"ghost"} onClick={() => router.back()} size={"icon"}>
            <ArrowLeft className="" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={data.profileUrl || "https://github.com/shadcn.png"}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col pl-1">
              <h1 className="text-base font-semibold">{data.fullname}</h1>
              {/* <span className="text-sm text-muted-foreground">
                {data.email}
              </span> */}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-5 pt-3 mb-20 lg:pb-3 px-5 lg:max-h-[480px] max-h-[80vh] overflow-y-auto overflow-x-hidden overflow-message">
          {/* MESSAGE DISINi */}
          {messages &&
            messages.length > 0 &&
            messages.map((item: any) => (
              <MessageCard
                profileUrl={
                  item.sender === session?.user?.id
                    ? session.user.profileUrl
                    : data.profileUrl
                }
                key={item.id}
                message={item.content}
                date={timeStapHandle(item)}
                className={`${
                  item.sender === session?.user?.id
                    ? "flex-row-reverse mr-1"
                    : "flex-row"
                }`}
              />
            ))}
          {messages && messages.length === 0 && (
            <div className={`flex items-center gap-2 h-full`}>
              <h1>No Message</h1>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 w-full px-5 py-5">
          <form className="" onSubmit={handleMessageSubmit}>
            <div className="relative flex h-full flex-1 flex-col">
              <div className="flex w-full rounded-md items-center border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <Textarea
                  placeholder="Messages"
                  className="flex h-[50px] max-h-[200px] min-h-0 items-center ring-transparent ring-offset-transparent border-transparent px-3 resize-none m-0 w-full border-0 bg-transparent focus:ring-0 focus-visible:ring-0 dark:bg-transparent py-[10px] pr-[1rem] md:py-3.5 md:pr-[4rem] placeholder-black/50 dark:placeholder-white/50 pl-3 md:pl-4  overflow-message"
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
                <Button
                  size="icon"
                  className="absolute right-3 bottom-1.5 rounded-lg"
                  type="submit"
                  disabled={messageInput.length < 1}
                >
                  <SendIcon />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
