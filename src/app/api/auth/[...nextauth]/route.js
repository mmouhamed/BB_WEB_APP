import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDB from "../../../lib/db";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "email", placeholder: "your email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const query =
          "SELECT * FROM BB_USERS WHERE USER_NAME = @username and PASSWORD = @password";
        const params = {
          username: credentials.username,
          password: credentials.password,
        };

        const results = await connectToDB(query, params);
        const user = results[0];

        if (user) {
          return {
            id: user.USER_ID,
            name: DISPLAY_NAME,
            email: user.EMAIL,
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/pages/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
