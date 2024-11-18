// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import ExecuteQuery from "@/app/db/dbconfig"; // Adjust the import based on your structure

// const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         username: {
//           label: "Username",
//           type: "text",
//           placeholder: "your username",
//         },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         const query =
//           "SELECT * FROM BB_USERS WHERE USER_NAME = @username AND PASSWORD = @password";
//         const params = {
//           username: credentials.username,
//           password: credentials.password, // Remember to hash passwords in production!
//         };

//         try {
//           const users = await query(
//             'SELECT * FROM "bb_users" WHERE USER_NAME = $1 AND "PASSWORD" = $2',
//             [credentials.userName, credentials.password]
//           );
//           const user = users[0];
//           if (user) {
//             return {
//               id: user.USER_ID,
//               name: user.DISPLAY_NAME,
//               email: user.EMAIL,
//             };
//           }
//           return null; // Return null if user is not found
//         } catch (error) {
//           console.error("Authorization error:", error);
//           throw new Error("Error validating user");
//         }
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/user/login", // Custom sign-in page
//   },
//   session: {
//     strategy: "jwt",
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user.id = token.id;
//       return session;
//     },
//   },
// };

// // Export the NextAuth handler as a default export
// const handler = NextAuth(authOptions);

// // Export the handler for GET and POST requests
// export { handler as GET, handler as POST };




// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       // credentials: {
//       //   username: {
//       //     label: "Username",
//       //     type: "email",
//       //     placeholder: "your username",
//       //   },
//       //   password: { label: "Password", type: "password" },
//       // },
//       async authorize(credentials) {
//         if (credentials) {
//           try {
//             // console.log(credentials);
//             const users = await query(
//               'SELECT * FROM "bb_users" WHERE USER_NAME = $1 AND "PASSWORD" = $2',
//               [credentials.userName, credentials.password]
//             );

//             if (users.length === 0) {
//               return null;
//             }
//             const user = users[0];
//             console.log("PRINT USERRS", user);
//             return {
//               id: user.USER_ID,
//               name: user.DISPLAY_NAME,
//               email: user.EMAIL,
//             };
//           } catch (err) {
//             console.error("Error during authentication:", err);
//             return null; // Return null on any error (could be more specific)
//           }
//         }
//         return null;
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/auth/login",
//   },
//   // session: {
//   //   strategy: "jwt", // Use JWT for sessions
//   // },
//   secret: process.env.AUTH_SECRET,
//   callbacks: {
//     async session(data) {
//       console.log("DATA IN SESSION", data);
//       const { session, token } = data;
//       // Log session and token before modifying session
//       console.log("Session Callback - session before:", session);
//       console.log("Session Callback - token IN SESSION:", token.USER_ID);
//       console.log("Session Callback - token IN SESSION:", token.id);
//       console.log("process.env.AUTH_SECRET", process.env.AUTH_SECRET);
//       // Attach token info to session object
//       session.user = {
//         id: token.id,
//         name: token.name,
//         email: token.email,
//       };

//       // Log session after modifying it
//       console.log("Session Callback - session after:", session);
//       return session;
//     },
//     async jwt(data) {
//       console.log("DATA", data);
//       const { token, user } = data;
//       if (user) {
//         // Include user details in JWT token for use later
//         console.log("JWT Callback - user:", user);
//         token.id = user.id;
//         token.name = user.name;
//         token.email = user.email;
//       }
//       console.log("JWT Callback - token:", token); // Log token after it's updated
//       console.log("Session Callback - token IN TOKEN:", token.accessToken);
//       console.log("Session Callback - token IN TOKEN:", token.id);
//       return token;
//     },
//   },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
