import { addDoc, collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import app from "@/lib/firebase/init";
import bcrypt from "bcryptjs";

const firestore = getFirestore(app);


export async function getDataByField(collectionName: string, field: string, value: string) {
    const q = query(collection(firestore, collectionName), where(field, "==", value));
    const querySnapshot = await getDocs(q);
    const getData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    return getData
}
export async function RegistersUsers(collectionName: string, data: any) {
    const getUsers = await getDataByField(collectionName, "email", data.email);

    if (getUsers.length > 0) {
        return {
            status: false,
            statusCode: 400,
            message: "Email already exists"
        }
    }
    data.created_At = new Date();
    data.updated_At = new Date();
    data.password = await bcrypt.hash(data.password, 10);
    try {
        await addDoc(collection(firestore, collectionName), data);
        return {
            status: true,
            statusCode: 200,
            message: "User created successfully"
        }
    } catch (error) {
        return {
            status: false,
            statusCode: 400,
            message: "Something went wrong please try again later"
        }
    }
}

export async function LoginUsers(email: string) {
    const getUser = await getDataByField("users", "email", email);

    if (getUser.length > 0) {
        return getUser[0];
    } else {
        return {
            status: false,
            statusCode: 404,
            message: "User not found",
        };
    }
}

export async function LoginGoogle(data: {
    fullname: string,
    email: string,
    idp: string,
}, callBack: Function) {
    const getUsers = await getDataByField("users", "email", data.email);
    if (!data.idp) {
        data.idp = "google"
    }
    if (getUsers.length > 0) {
        return callBack(getUsers[0]);
    } else {
        const docRef = await addDoc(collection(firestore, "users"), data);
        if (docRef) {
            const docId = docRef.id;
            console.log(docId)
            callBack(docId);
            return callBack(docId);
        }
    }
}