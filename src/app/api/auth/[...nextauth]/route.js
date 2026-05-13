import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import sql from '@/lib/db';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          const users = await sql`SELECT * FROM users WHERE email = ${credentials.email}`;
          if (users.length === 0) return null;
          
          const user = users[0];
          const isMatch = await bcrypt.compare(credentials.password, user.password);
          
          if (!isMatch) return null;
          
          return { id: user.id, name: user.name, email: user.email };
        } catch (e) {
          console.error(e);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET || "secreto_super_seguro_temporal",
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google' || account.provider === 'facebook') {
        // Here we could auto-register OAuth users into the Neon database if they don't exist
        try {
          const existing = await sql`SELECT * FROM users WHERE email = ${user.email}`;
          if (existing.length === 0) {
            // Register them using a random password
            const randomPassword = Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(randomPassword, salt);
            await sql`
              INSERT INTO users (name, email, password, is_verified) 
              VALUES (${user.name || 'Usuario'}, ${user.email}, ${hashed}, 1)
            `;
          }
        } catch (e) {
          console.error("Error auto-registering OAuth user:", e);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST };
