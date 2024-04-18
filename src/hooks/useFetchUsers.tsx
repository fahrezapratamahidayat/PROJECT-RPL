'use client';
import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";import { firestore } from "@/lib/firebase/init";
import { useSession } from "next-auth/react";

interface User {
    id: string;
    email: string;
    fullname: string;
  }

function useFetchUsers(querySearch: string) {
  const [usersList, setUserList] = useState<User[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id) return;

    let usersQuery = query(collection(firestore, "users"), orderBy("fullname", "asc"));
    if (querySearch !== "") {
      usersQuery = query(usersQuery, where("fullname", ">=", querySearch));
    }

    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const fetchedUsers = snapshot.docs
        .filter((doc) => doc.id !== session.user?.id)
        .map((doc) => ({ id: doc.id, ...doc.data() } as User));
      setUserList(fetchedUsers);
    });

    return () => unsubscribe();
  }, [querySearch, session]);

  return usersList;
}

export default useFetchUsers;