"use client";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import React, { useEffect, useState } from "react";
import { DialogConversation } from "./dialogConversation";
import ListChats from "./listChats";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import MessageCard from "./messageCard";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { Textarea } from "../ui/textarea";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase/init";

const message = [
  {
    id: "1",
    sender: "Fahreza",
    content: "Hey there! How's it going?",
    timestamp: "2023-03-24T19:20:00.000Z",
  },
  {
    id: "2",
    sender: "Jane Doe",
    content: "I'm good, thanks! What are you up to?",
    timestamp: "2023-03-24T19:22:00.000Z",
  },
  {
    id: "3",
    sender: "Fahreza",
    content: "I'm just working on a new project. How about you?",
    timestamp: "2023-03-24T19:25:00.000Z",
  },
  {
    id: "4",
    sender: "Jane Doe",
    content:
      "I'm working on a new design for a client. It's going well so far!",
    timestamp: "2023-03-24T19:27:00.000Z",
  },
  {
    id: "5",
    sender: "Fahreza",
    content: "That's great! I'd love to see it when you're done.",
    timestamp: "2023-03-24T19:30:00.000Z",
  },
  {
    id: "6",
    sender: "Jane Doe",
    content: "Sure, I'll send it to you when it's ready.",
    timestamp: "2023-03-24T19:32:00.000Z",
  },
  {
    id: "7",
    sender: "Fahreza",
    content: "Thanks! I appreciate it.",
    timestamp: "2023-03-24T19:35:00.000Z",
  },
  {
    id: "8",
    sender: "Jane Doe",
    content: "No problem at all. So, what's the project you're working on?",
    timestamp: "2023-03-24T19:37:00.000Z",
  },
  {
    id: "9",
    sender: "Fahreza",
    content:
      "It's a web app for managing tasks and projects. I'm building it with React and Firebase.",
    timestamp: "2023-03-24T19:40:00.000Z",
  },
  {
    id: "10",
    sender: "Jane Doe",
    content:
      "That sounds interesting! I'd love to check it out when it's ready.",
    timestamp: "2023-03-24T19:42:00.000Z",
  },
];

export default function ChatUi() {
  const [open, setOpen] = React.useState(false);
  const [querySearch, setQuerySearch] = React.useState("");
  const [usersList, setUserList] = useState([] as any[]);
  useEffect(() => {
    if (open) {
      let q = query(collection(firestore, "users"), orderBy("fullname", "asc"));
      if (querySearch !== "") {
        q = query(q, where("fullname", ">=", querySearch));
      }
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedUsers: any = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // const filteredUsers = fetchedUsers.map((user: any) => ({
        //   ...user,
        //   tasks: [],
        // }));
        const filteredUsers = fetchedUsers
          .filter((user: any) =>
            user.fullname.toLowerCase().includes(querySearch.toLowerCase())
          )
          .map((user: any) => ({
            ...user,
            tasks: [],
          }));
        setUserList(filteredUsers);
      });
      return () => unsubscribe();
    }
  }, [open, querySearch]);
  console.log;
  return (
    <>
      <div className="flex gap-2 items-start max-h-screen">
        <div className="flex flex-col justify-between gap-1 px-5 py-2 rounded-lg w-1/3">
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
          <DialogConversation
            open={open}
            setOpen={setOpen}
            onChange={(e: any) => setQuerySearch(e.target.value)}
          >
            {open &&
              usersList.map((user) => (
                <ListChats key={user.id} showMessage={true} data={user} />
              ))}
          </DialogConversation>
          <div className="flex flex-col gap-4 space-y-2 space-x-1 mt-5 max-h-[530px] overflow-y-auto overflow-x-hidden"></div>
        </div>
        <div className="flex flex-col gap-1 px-5 py-2 rounded-lg border w-[68%]">
          <div className="flex items-center justify-center border-b py-2">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h1 className="text-base font-semibold">
                Fahreza Pratama Hidayat
              </h1>
            </div>
          </div>
          <div className="flex flex-col relative justify-between gap-5 py-3 max-h-[530px] overflow-y-auto overflow-x-hidden overflow-message">
            {message &&
              message.map((item) => {
                const timestamp = new Date(item.timestamp);
                const distance = formatDistanceToNow(timestamp, {
                  addSuffix: true,
                  locale: id,
                  includeSeconds: true,
                });
                // Split distance menjadi array
                const distanceArray = distance.split(" ");
                // Jika waktu lebih dari 1 bulan yang lalu, hilangkan "yang lalu"
                if (
                  distanceArray.includes("months") ||
                  distanceArray.includes("month")
                ) {
                  distanceArray.pop(); // Hapus elemen terakhir
                  distanceArray.pop(); // Hapus elemen terakhir
                }
                const modifiedDistance = distanceArray.join(" "); // Gabungkan kembali array
                return (
                  <MessageCard
                    key={item.id}
                    message={item.content}
                    date={modifiedDistance}
                    className={`${
                      item.sender === "Fahreza"
                        ? "flex-row-reverse mr-1"
                        : "flex-row"
                    }`}
                  />
                );
              })}
            <div className="sticky bottom-0 mx-5 h-full">
              <Textarea
                placeholder="Messages"
                className="flex items-center min-h-0 h-14 px-3 py-2 resize-none overflow-message"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
