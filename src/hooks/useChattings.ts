import { firestore } from "@/lib/firebase/init"; // Sesuaikan dengan inisialisasi Firestore Anda
import { ChatRoom, Message } from "@/types";
import { collection, addDoc, query, where, getDocs, Timestamp, orderBy } from "firebase/firestore";

export const getOrCreateChatRoom = async (users: string[], type: string): Promise<ChatRoom> => {
  const chatroomsRef = collection(firestore, "chatrooms");
  const sortedUsers = users.sort();
  const q = query(chatroomsRef, where("users", "==", sortedUsers));

  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    // ChatRoom sudah ada
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as ChatRoom;
  } else {
    // Buat ChatRoom baru
    const newChatRoomData: ChatRoom = {
      created_at: new Date(),
      type: type,
      users: sortedUsers,
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