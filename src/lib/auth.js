import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions = {
  // Disable debug in production
  debug: process.env.NODE_ENV === 'development',

  // Use Prisma as the adapter for database operations
  adapter: PrismaAdapter(prisma),
  
  // Configure the authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Validate input
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Check if user exists
        if (!user) {
          throw new Error('No user found with this email');
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        // Return user object for session
        return {
          id: user.id,
          email: user.email,
          name: user.name
        };
      }
    })
  ],

  // Session management configuration
  session: {
    strategy: "jwt", // Use JSON Web Tokens for session management
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Callbacks to customize token and session behavior
  callbacks: {
    // Customize the JWT token
    async jwt({ token, user }) {
      // Add user ID and other details to the token when user logs in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },

    // Customize the session object
    async session({ session, token }) {
      // Add user details to the session
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },

  // Configure custom pages for authentication
  pages: {
    signIn: "/auth/login",
    error: "/auth/login"
  },

  // Use a secure secret for signing tokens
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
