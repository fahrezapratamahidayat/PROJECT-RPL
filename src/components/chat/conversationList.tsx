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

export default function ConverSationList({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const { data: session } = useSession();
  const [querySearch, setQuerySearch] = React.useState("");
  const [usersList, setUserList] = useState([] as any[]);
  const [chatrooms, setChatrooms] = useState<any[]>([]);

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
        const filteredUsers = fetchedUsers
          .filter(
            (user: any) =>
              user !== session?.user?.id && user.email !== session?.user?.email
          )
          .map((user: any) => ({
            ...user,
            tasks: [],
          }));
        setUserList(filteredUsers);
      });
      return () => unsubscribe();
    }
  }, [open, querySearch, session]);

  useEffect(() => {
    const fetchChatrooms = async () => {
      if (!session) return;

      const { user } = session;
      const chatroomQuery = query(
        collection(firestore, "chatrooms"),
        where("users", "array-contains", user?.id)
      );

      const chatroomQuerySnapshot = await getDocs(chatroomQuery);
      const chatroomsData: any = chatroomQuerySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const usersData = [];
      for (const chatroom of chatroomsData) {
        for (const userId of chatroom.users) {
          if (userId !== user?.id) {
            const userDoc = await getDoc(doc(firestore, "users", userId));
            if (userDoc.exists()) {
              const userData = {
                id: userDoc.id,
                ...userDoc.data(),
              };
              usersData.push(userData);
            }
          }
        }
      }
      setChatrooms(usersData);
    };

    fetchChatrooms();
  }, [session]);

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
