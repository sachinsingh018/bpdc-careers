import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { userRepository } from "@/lib/repositories";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim();
        const password = credentials?.password ?? "";
        if (!email || !password) return null;

        const student = await userRepository.findByEmailForAuth(email);
        if (!student) return null;
        if (!student.passwordHash) {
          return null; // Legacy user must set password via signup
        }

        const { compare } = await import("bcryptjs");
        const valid = await compare(password, student.passwordHash);
        return valid ? { id: student.id, email: student.email } : null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/signout",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
