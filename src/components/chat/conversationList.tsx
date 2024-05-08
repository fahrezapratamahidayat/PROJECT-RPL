"use client";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import ListUsers from "./listUsers";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FormAddGroupChats from "../form/formAddGroupChats";
import { Avatar } from "@radix-ui/react-avatar";
import AvatarGroup from "../avatars/avatarGroup";
import useLocalStorage from "@/hooks/useLocalStorage";

interface User {
  id: string;
  email: string;
  fullname: string;
  profileUrl: string;
}

interface Chatroom {
  id: string;
  name: string;
  users: string[];
  type: "group" | "direct";
  created_at: Date;
}
interface ChatroomDetail {
  id: string;
  name: string;
  type: "group" | "direct";
  created_At: Date;
  users: User[];
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
  const [chatrooms, setChatrooms] = useState<ChatroomDetail[]>([]);
  const [storedValue, setValue] = useLocalStorage("tabs-chats", "direct");

  const fetchAllUsers = useCallback(async () => {
    let usersQuery = query(
      collection(firestore, "users"),
      orderBy("fullname", "asc")
    );
    if (querySearch !== "") {
      usersQuery = query(usersQuery, where("fullname", ">=", querySearch));
    }
    return onSnapshot(usersQuery, (snapshot) => {
      const fetchedUsers = snapshot.docs
        .filter((doc) => doc.id !== undefined)
        .map((doc) => ({ id: doc.id, ...doc.data() } as User));
      setUserList(fetchedUsers);
    });
  }, [querySearch]);

  const fetchDetailRoom = useCallback(async () => {
    setChatrooms([]);
    const chatroomQuery = query(
      collection(firestore, "chatrooms"),
      where("users", "array-contains", session?.user?.id),
      where("type", "==", storedValue)
    );
    const chatroomQuerySnapshot = await getDocs(chatroomQuery);
    const chatroomsData = chatroomQuerySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Chatroom)
    );

    const usersDataPromises = chatroomsData.map(async (chatroom: Chatroom) => {
      return Promise.all(
        chatroom.users
          .filter((userId) => userId !== session?.user?.id)
          .map(async (userId) => {
            const userDoc = await getDoc(doc(firestore, "users", userId));
            return userDoc.exists()
              ? ({ id: userDoc.id, ...userDoc.data() } as User)
              : null;
          })
      );
    });

    const usersData = (await Promise.all(usersDataPromises))
      .flat()
      .filter((user): user is User => user !== null);

    const datas = chatroomsData.map((chatroom) => ({
      id: chatroom.id,
      type: chatroom.type,
      name: chatroom.name,
      created_At: chatroom.created_at,
      users: usersData.filter((user) => chatroom.users.includes(user.id)),
    }));
    setChatrooms(datas);
  }, [storedValue, session?.user?.id]);

  useEffect(() => {
    if (!session?.user?.id) return;

    open && fetchAllUsers();
    fetchDetailRoom();
  }, [open, session?.user?.id, fetchAllUsers, fetchDetailRoom]);

  useEffect(() => {
    setQuerySearch("");
    setChatrooms([]);
  }, [storedValue]);

  const uniqueUsers = useMemo(() => {
    const allUsers = new Set<User>();
    chatrooms.forEach((chatroom) => {
      chatroom.users.forEach((user) => {
        allUsers.add(user);
      });
    });
    return Array.from(allUsers);
  }, [chatrooms]);

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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="text-center text-sm gap-1 mt-5">
              <Plus className="" />{" "}
              {storedValue === "direct" ? "Direct" : "Group"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader className="gap-3">
              <DialogTitle>Start New Chat</DialogTitle>
            </DialogHeader>
            {storedValue === "direct" ? (
              <div className="">
                <Input
                  type="text"
                  placeholder="Search"
                  onChange={(e: any) => setQuerySearch(e.target.value)}
                  className="drop-shadow-lg shadow-lg z-10"
                />
                <div className="max-h-[250px] overflow-y-auto overflow-x-hidden overflow-message">
                  <div className="overflow-hidden space-y-2 mt-5">
                    {open &&
                      usersList.map((user) => (
                        <ListUsers
                          key={user.id}
                          showMessage={true}
                          data={user}
                        />
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="">
                <FormAddGroupChats />
              </div>
            )}
          </DialogContent>
        </Dialog>
        <Tabs value={storedValue} onValueChange={setValue} className="mt-1">
          <TabsList className="bg-transparent">
            <TabsTrigger value="direct" onClick={() => setValue("direct")}>
              Inbox
            </TabsTrigger>
            <TabsTrigger value="group" onClick={() => setValue("group")}>
              Group
            </TabsTrigger>
          </TabsList>
          <TabsContent value="direct">
            <div className="flex flex-col space-y-2 mt-5 max-h-[33rem] overflow-y-auto overflow-x-hidden w-full">
              {/* LIST PEOPLES CHAT WITH USER HERE */}
              {uniqueUsers.map((user) => (
                <ListUsers key={user.id} data={user} slug={slug} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="group">
            <div className="flex flex-col space-y-2 mt-5 max-h-[33rem] overflow-y-auto overflow-x-hidden w-full">
              {chatrooms.map(
                (chatroom) =>
                  chatroom.type === "group" && (
                    <AvatarGroup
                      key={chatroom.id}
                      data={chatroom}
                      slug={slug}
                    />
                  )
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
