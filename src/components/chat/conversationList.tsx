"use client";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import React, { useEffect, useState } from "react";
import { DialogConversation } from "./dialogConversation";
import ListChats from "./listChats";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase/init";
import { useSession } from "next-auth/react";

interface User {
  id: string;
  email: string;
  fullname: string;
  // Tambahkan properti lain sesuai kebutuhan
}

interface Chatroom {
  id: string;
  users: string[];
  // Tambahkan properti lain sesuai kebutuhan
}

export default function ConverSationList({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const [querySearch, setQuerySearch] = useState("");
  const [usersList, setUserList] = useState<User[]>([]);
  const [chatrooms, setChatrooms] = useState<User[]>([]);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchUsers = () => {
      let usersQuery = query(collection(firestore, "users"), orderBy("fullname", "asc"));
      if (querySearch !== "") {
        usersQuery = query(usersQuery, where("fullname", ">=", querySearch));
      }
      return onSnapshot(usersQuery, (snapshot) => {
        const fetchedUsers = snapshot.docs
          .filter((doc) => doc.id !== session.user?.id)
          .map((doc) => ({ id: doc.id, ...doc.data() } as User));
        setUserList(fetchedUsers);
      });
    };

    const fetchChatrooms = async () => {
      const chatroomQuery = query(collection(firestore, "chatrooms"), where("users", "array-contains", session.user?.id));
      const chatroomQuerySnapshot = await getDocs(chatroomQuery);
      const chatroomsData = chatroomQuerySnapshot.docs.map((doc) => doc.data() as Chatroom);

      const usersDataPromises = chatroomsData.map(async (chatroom) => {
        return Promise.all(
          chatroom.users.filter((userId) => userId !== session.user?.id).map(async (userId) => {
            const userDoc = await getDoc(doc(firestore, "users", userId));
            return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } as User : null;
          })
        );
      });

      const usersData = (await Promise.all(usersDataPromises)).flat().filter((user): user is User => user !== null);
      setChatrooms(usersData);
    };

    if (open) {
      const unsubscribe = fetchUsers();
      return () => unsubscribe();
    } else {
      fetchChatrooms();
    }
  }, [session, open, querySearch]);

  return (
    <>
      <div
        className={`${className} flex flex-col justify-between gap-1 px-5 py-2 rounded-lg lg:w-1/3 w-full`}
      >
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
        <div className="flex flex-col gap-4 space-y-2 space-x-1 mt-5 max-h-[33rem] overflow-y-auto overflow-x-hidden">
          {/* LIST PEOPLES CHAT WITH USER HERE */}
          {chatrooms.map((user) => (
            <ListChats key={user.id} data={user} slug={slug} />
          ))}
        </div>
      </div>
    </>
  );
}
