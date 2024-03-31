// import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcrypt";
// import NextAuth from "next-auth/next";
// import { LoginUsers } from "@/services/auth/services";
// import jwt from "jsonwebtoken";

// const authOptions: NextAuthOptions = {
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXT_AUTH_SECRET,
//   providers: [
//     CredentialsProvider({
//       type: "credentials",
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         const { email, password } = credentials as {
//           email: string;
//           password: string;
//         };
//         const user: any = await LoginUsers(email);
//         if (!user) {
//           return null;
//         }
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (isPasswordValid) {
//           return user;
//         } else {
//           return null;
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, account, user, profile }: any) {
//       if (account?.provider === "credentials") {
//         token.id = user.id;
//         token.email = user.email;
//         token.fullname = user.fullname;
//         token.idp = "credentials";
//         token.createdAt = user.created_At;
//       }
//       return token;
//     },
//     async session({ session, token }: any) {
//       if ("id" in token) {
//         session.user.id = token.id
//       }
//       if ("email" in token) {
//         session.user.email = token.email;
//       }
//       if ("fullname" in token) {
//         session.user.fullname = token.fullname;
//       }
//       if ("idp" in token) {
//         session.user.idp = token.idp;
//       }
//       if ("createdAt" in token) {
//         session.user.createdAt = token.createdAt
//       }

//       const createToken = jwt.sign(
//         token,
//         process.env.NEXT_AUTH_SECRET as string, {
//         "algorithm": "HS256",
//       }
//       )
//       session.accessToken = createToken;

//       return session;
//     },
//   },
//   pages: {
//     signIn: "/auth/login",
//   },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };


export { GET, POST } from "@/auth"