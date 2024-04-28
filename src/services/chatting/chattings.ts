import { firestore } from "@/lib/firebase/init";
import { ChatRoom, Message } from "@/types";
import { collection, addDoc, query, where, getDocs, Timestamp, orderBy } from "firebase/firestore";

export const getOrCreateChatRoom = async (users: string[], type: string, name?: string) => {
  const chatroomsRef = collection(firestore, "chatrooms");
  const sortedUsers = [...users].sort();
  const sortedUsersString = [...users].sort().join(",");
  const q = query(chatroomsRef, where("usersString", "==", sortedUsersString));
  const querySnapshot = await getDocs(q);
  const getData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))

  if (!querySnapshot.empty) {
    console.log("Found existing chatroom with the same users: ", getData);
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as ChatRoom;
  } else {
    const newChatRoomData: ChatRoom = {
      ...(name && type === "group" ? { name: name } : {}),
      type: type,
      users: sortedUsers,
      usersString: sortedUsersString, 
      created_at: new Date(),
    };
    const docRef = await addDoc(chatroomsRef, {
      ...newChatRoomData,
      created_at: Timestamp.fromDate(newChatRoomData.created_at),
    });
    return { id: docRef.id, ...newChatRoomData };
  }
};

export const sendMessage = async (chatRoomId: string, message: string, sender: string): Promise<void> => {
    const messagesRef = collection(firestore, `chatrooms/${chatRoomId}/messages`);
    const newMessage: Message = {
      message: message,
      sender: sender,
      timestamp: new Date(),
    };
    await addDoc(messagesRef, {
      ...newMessage,
      timestamp: Timestamp.fromDate(newMessage.timestamp),
    });
  };

export const getMessages = async (chatRoomId: string): Promise<Message[]> => {
    const messagesRef = collection(firestore, `chatrooms/${chatRoomId}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "asc")); // Mengurutkan pesan berdasarkan timestamp secara ascending
  
    const querySnapshot = await getDocs(q);
    const messages: Message[] = [];
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(), // Konversi Timestamp Firebase ke objek Date JavaScript
      } as Message);
    });
  
    return messages;
  };