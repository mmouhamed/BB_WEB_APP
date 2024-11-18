import CredentialsProvider from "next-auth/providers/credentials";
import ExecuteQuery from "./pgDB"; // your database query function

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userName: {
          label: "Username",
          type: "text",
          placeholder: "your username",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const query = `
          SELECT * FROM "bb_users" WHERE USER_NAME = $1 AND "PASSWORD" = $2
        `;
        const params = [credentials.userName, credentials.password]; // Array of parameters

        try {
          const results = await ExecuteQuery(query, params);
          const user = results[0]; // PostgreSQL returns rows as an array

          if (user) {
            return {
              id: user.user_id,
              name: user.display_name,
              email: user.email,
            };
          }
          return null; // Return null if no matching user is found
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error("Error validating user");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login", // Custom sign-in page
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // Session expires in 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("IN TOKEN:::::::::::");
      console.log("Token USER", user);
      console.log("TOKEN TOKEN", token);
      token.iat = Date.now();

      const now = Date.now();
      if (token.iat && now - token.iat > 24 * 60 * 60 * 1000) {
        return {};
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      return session;
    },
  },
};

