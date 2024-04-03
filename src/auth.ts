import NextAuth from "next-auth";
import jwt from "jsonwebtoken";
import authConfig from "@/auth.config";
import { LoginGoogle } from "./services/auth/services";

export const {
    handlers: { GET, POST },
    auth,
} = NextAuth({
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, account, user, profile }: any) {
            if (account?.provider === "google") {
                const data: any = {
                    fullame: user.name,
                    email: user.email,
                    idp: "google",
                }
                await LoginGoogle(data, (data: any) => {
                    token.id = data.id
                    token.email = data.email
                    token.fullname = data.fullame
                    token.idp = data.idp
                })
            }
            if (account?.provider === "credentials") {
                token.id = user.id;
                token.email = user.email;
                token.fullname = user.fullname;
                token.idp = "credentials";
                token.createdAt = user.created_At;
            }
            return token;
        },
        async session({ session, token }: any) {
            if ("id" in token) {
                session.user.id = token.id
            }
            if ("email" in token) {
                session.user.email = token.email;
            }
            if ("fullname" in token) {
                session.user.fullname = token.fullname;
            }
            if ("idp" in token) {
                session.user.idp = token.idp;
            }
            if ("createdAt" in token) {
                session.user.createdAt = token.createdAt
            }
            if ("profileUrl" in token) {
                session.user.profileUrl = token.profileUrl
            }

            const createToken = jwt.sign(
                token,
                process.env.NEXT_AUTH_SECRET as string, {
                "algorithm": "HS256",
            }
            )
            session.accessToken = createToken;

            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    ...authConfig
})