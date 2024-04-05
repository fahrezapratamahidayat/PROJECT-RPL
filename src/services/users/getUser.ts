import { firestore } from "@/lib/firebase/init";
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";



export async function getUsers() {
    const q = query(collection(firestore, "users"));
    const querySnapshot = await getDocs(q);
    const getData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    return getData
}

// export async function getUserByEmail(email: string) {
//     const q = query(collection(firestore, "users"), where("email", "==", email));
//     const querySnapshot = await getDocs(q);
//     const getData = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//     }));
//     console.log(getData);
//     return getData
// }


export async function getUserById(id: string) {
    try {
        const snapshotData = await getDoc(doc(firestore, "users", id));
        if (!snapshotData.exists()) {
            return {
                status: false,
                statusCode: 404,
                message: "User not found"
            }
        }
        const data = snapshotData.data();
        const taskLists = data.tasks;
        return {
            status: true,
            statusCode: 200,
            message: "User found",
            data: taskLists
        }
    } catch (error) {
        console.error("Error getting document:", error);
        return {
            status: true,
            statusCode: 200,
            message: "Something went wrong",
        }
    }
}

export async function getUserByName(name: string) {

    const q = query(collection(firestore, "users"), where("name", "==", name));
    const querySnapshot = await getDocs(q);
    const getData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    return getData
}
