import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Nodemailer from "next-auth/providers/nodemailer";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendMagicLinkEmail } from "@/lib/email/magic-link";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/portal/login",
    verifyRequest: "/portal/login?verify=1",
    error: "/portal/login",
  },
  providers: [
    Nodemailer({
      server: { host: "localhost", port: 25, auth: { user: "", pass: "" } },
      from: "noreply@bluecrest-group.com",
      sendVerificationRequest: async ({ identifier: email, url }) => {
        await sendMagicLinkEmail(email, url);
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Invite-only: reject sign-in if user doesn't exist in our users table
      if (!user.email) return false;
      const existing = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, user.email))
        .limit(1);
      return existing.length > 0;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // Fetch role from our users table
        const dbUser = await db
          .select({ role: users.role })
          .from(users)
          .where(eq(users.id, user.id))
          .limit(1);
        session.user.role = dbUser[0]?.role ?? "client";
      }
      return session;
    },
  },
});

// Type augmentation for session
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: "admin" | "client";
    };
  }
}
