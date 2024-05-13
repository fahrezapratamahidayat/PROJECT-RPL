import { firestore } from "@/lib/firebase/init";
import { teamsData } from "@/types";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";


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


export async function leaveTeam(teamId: string, email: string, callback: (success: boolean) => void) {
    try {
        const teamRef = doc(firestore, "teams", teamId);
        const teamData = await getDoc(teamRef);
        if(teamData.exists()){
            const members = teamData.data().members;
            const index = members.findIndex((member: string) => member === email);
            members.splice(index, 1);

            await updateDoc(teamRef, {
                members: members
            });

            callback(true);
        } else {
            callback(false);
        }
    } catch (error: any) {
        callback(false);
    }
}

export async function addMembers(teamId: string, email: string, callback: (success: boolean) => void) {
    try {
        const teamRef = doc(firestore, "teams", teamId);
        const teamData = await getDoc(teamRef);
        if(teamData.exists()){
            const members = teamData.data().members;
            members.push(email);
        }
    } catch (error: any) {
        callback(false);
    }
}

export async function removeMembers(teamId: string, email: string, callback: (success: boolean) => void) {
    try {
        const teamRef = doc(firestore, "teams", teamId);
        const teamData = await getDoc(teamRef);
        if(teamData.exists()){
            const members = teamData.data().members;
            const index = members.findIndex((member: string) => member === email);
            members.splice(index, 1);
        }
    } catch (error: any) {
        callback(false);
    }
}

export async function editTeam(id: string, data: teamsData, callback: (success: boolean) => void) {
    try {
        const docRef = doc(firestore, "teams", id);
        await updateDoc(docRef, data);
        callback(true);
    } catch (error: any) {
        callback(false);
    }
}

export async function updateTeams(data: teamsData) {
    try {
        const docRef = doc(firestore, "teams", data.id);
        await updateDoc(docRef, data);
        return {
            status: true,
            statusCode: 200,
            message: "Teams updated successfully",
        };
    } catch (error) {
        return {
            status: false,
            statusCode: 403,
            message: "something went wrong",
        }
    }
}