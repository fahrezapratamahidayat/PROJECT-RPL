"use client";
import React, { useEffect, useState } from "react";
import { id } from "date-fns/locale";
import { addDoc, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/lib/firebase/init";
import ChatPanelLayout from "../layouts/chatPanelLayout";
import ConverSationList from "./conversationList";
import ChatRoomList from "./ChatRoomList";
import { useSession } from "next-auth/react";

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

type User = {
  id: string;
  fullname: string;
  email: string;
  idp: string;
  profileUrl: string;
  created_At: Date;
};

export default function ChatUi({ slug }: { slug: string }) {
  const [userChats, setUserChats] = useState([] as User[]);
  useEffect(() => {
    const fetchUserById = async () => {
      const userId = slug;
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
  console.log(userChats)
  
  return (
    <>
      <ChatPanelLayout>
        <ConverSationList slug={slug} />
        {!slug ? null : (
          <ChatRoomList data={userChats} slug={slug} />
        )}
      </ChatPanelLayout>
    </>
  );
}
