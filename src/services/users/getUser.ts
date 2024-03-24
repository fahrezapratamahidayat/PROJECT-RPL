import app from "@/lib/firebase/init";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";

const firestore = getFirestore(app);


export async function getUsers(){
    const q = query(collection(firestore, "users"));
    const querySnapshot = await getDocs(q);
    const getData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    return getData
}