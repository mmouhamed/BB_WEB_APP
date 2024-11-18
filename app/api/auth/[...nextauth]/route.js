import NextAuth from "next-auth";
import { authOptions } from "@/app/lib/authOptions";

// Export the NextAuth handler as a default export
const handler = NextAuth(authOptions);

// Export the handler for GET and POST requests
export { handler as GET, handler as POST };
