import { firestore } from "@/lib/firebase/init";
import { teamsData } from "@/types";
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, where } from "firebase/firestore";


export async function addTeams(teamsData: teamsData) {
    if (teamsData.leader === undefined) {
        teamsData.leader = "";
    }
    try {
        await addDoc(collection(firestore, "teams"), teamsData);
        return {
            status: true,
            statusCode: 200,
            message: "teams created successfully"
        }
    } catch (error) {
        return {
            status: false,
            statusCode: 400,
            message: "something went wrong"
        }
    }
}

export function getTeams(email: string, callback: (teams: any[]) => void) {
    const q = query(collection(firestore, "teams"), where("members", "array-contains", email));
    return onSnapshot(q, (querySnapshot) => {
        const teams = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        callback(teams);
    });
}

export async function deleteTeams(id: string) {
    try {
        const docRef = doc(firestore, "teams", id);
        deleteDoc(docRef);
        return {
            status: true,
            statusCode: 200,
            message: "Teams deleted successfully",
        };
    } catch (error) {
        return {
            status: false,
            statusCode: 403,
            message: "something went wrong",
        }
    }
}