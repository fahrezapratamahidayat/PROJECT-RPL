import { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { LoginUsers } from "./services/auth/services";
import GoogleProvider from "next-auth/providers/google"
import { UserData } from "./types";
export default {
    providers: [
        CredentialsProvider({
            type: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const { email, password } = credentials as {
                    email: string;
                    password: string;
                };
                const user: any = await LoginUsers(email);
                if (!user) {
                    return null;
                }
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (isPasswordValid) {
                    return user;
                } else {
                    return null;
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
} satisfies NextAuthConfig