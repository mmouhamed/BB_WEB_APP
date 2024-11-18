Let’s enhance the session management with some advanced features, such as secure session handling, token-based authentication, and password hashing. We'll also discuss handling session expiry, re-authentication, and automatic session management.

### Advanced Session Management Features:

1. **Secure Password Storage**: Use **bcrypt** for hashing passwords and **salting** them.
2. **Session Expiry**: Implement session expiration to force re-authentication after a certain period.
3. **JWT Token Authentication**: Use **JWT tokens** for handling sessions in a secure and stateless way.
4. **Automatic Session Renewal**: Periodically renew the session to keep users logged in.

### Step-by-Step Breakdown

---

### Step 1: Install Necessary Packages

We'll need `bcrypt` for securely hashing passwords, and `jsonwebtoken` for handling JSON Web Tokens (JWT). Install them with the following command:

```bash
npm install bcryptjs jsonwebtoken
```

---

### Step 2: Update User Model and Database

In this example, we will hash the password before saving it to the database, and during the login process, we'll compare the entered password with the hashed password stored in the database.

1. **Update your database schema** to store hashed passwords in the `BB_USERS` table. Make sure your `BB_USERS` table has a `password` field where the hashed passwords will be stored.

For example:

```sql
CREATE TABLE BB_USERS (
    USER_ID SERIAL PRIMARY KEY,
    DISPLAY_NAME VARCHAR(100),
    EMAIL VARCHAR(255),
    USER_NAME VARCHAR(50) UNIQUE,
    PASSWORD VARCHAR(255) -- Storing hashed password
);
```

---

### Step 3: Hashing Passwords with `bcryptjs`

In a real-world app, when a user registers, you hash their password and store it in the database. We'll create an API route for user registration that hashes the password.

#### `app/api/auth/register/route.ts` — Registration API

```typescript
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "../../../lib/db";

// Register a new user with a hashed password
export async function POST(request: Request) {
  const { userName, password, displayName, email } = await request.json();

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Store the new user in the database
    await query(
      "INSERT INTO BB_USERS (USER_NAME, PASSWORD, DISPLAY_NAME, EMAIL) VALUES ($1, $2, $3, $4)",
      [userName, hashedPassword, displayName, email]
    );

    return NextResponse.json(
      { message: "User registered successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
```

In this route, we hash the password using `bcrypt.hash(password, 10)` before saving it to the database. This ensures that the password is stored securely as a hashed string.

---

### Step 4: Login and Password Verification with `bcryptjs`

Now, let's modify the login logic to compare the entered password with the stored hashed password using `bcrypt.compare`.

#### `app/api/auth/[...nextauth]/route.ts` — NextAuth Configuration for Login

We’ll modify the `authorize` method inside NextAuth.js to compare the entered password with the hashed password in the database.

```typescript
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import { query } from "../../../lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userName: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials) {
          // Fetch user from DB
          const user = await query(
            "SELECT * FROM BB_USERS WHERE USER_NAME = $1",
            [credentials.userName]
          );

          // If user exists, compare password
          if (user.length > 0) {
            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              user[0].PASSWORD
            );

            if (isPasswordValid) {
              return {
                id: user[0].USER_ID,
                name: user[0].DISPLAY_NAME,
                email: user[0].EMAIL,
              };
            }
          }
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt", // Use JWT for session handling
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in .env
  pages: {
    signIn: "/auth/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

- **`bcrypt.compare()`**: This is where the actual password comparison happens. We fetch the user's hashed password from the database and compare it with the input password using bcrypt's `compare` function.
- **`session: { strategy: 'jwt' }`**: We're now using JWT for session management, which makes it more stateless and scalable.

---

### Step 5: Implement Session Expiry and JWT Refresh Logic

To manage session expiry and automatic session renewal, we will use **JWT** tokens. JWTs can be issued with an expiration date, and upon expiry, users will be forced to log in again.

#### JWT Expiry and Refresh

1. **Session Expiry**: Set an expiry time on the JWT.
2. **Session Renewal**: Create a refresh token flow that allows renewing the JWT without forcing the user to log in again.

In the NextAuth configuration (`authOptions`), we will set a session expiration time and JWT expiration.

```typescript
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    // Credentials provider and other settings remain unchanged
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // Session expires in 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.iat = Date.now(); // Track the time the token was issued
      }

      // Expire the token after 24 hours
      const now = Date.now();
      if (token.iat && now - token.iat > 24 * 60 * 60 * 1000) {
        return {}; // Expired token, clear session
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
};
```

- **`maxAge: 24 * 60 * 60`**: This will expire the session after 24 hours.
- **`jwt.iat`**: We store the issued-at timestamp of the JWT, and we check the difference between the current time and the issued-at time. If it exceeds the `maxAge`, the token is considered expired.

---

### Step 6: Adding a Refresh Token Flow (Optional)

To implement a more complex refresh token flow, you can add a separate API route to issue a new JWT token if the old one is expired. However, with the current NextAuth setup, handling refresh tokens directly is not needed unless you require additional control over the authentication flow. NextAuth already handles automatic session renewal based on JWT expiry.

If you want a **manual refresh token flow**, here's a basic outline:

- Store a **refresh token** in the database when the user logs in.
- When the JWT expires, send a request to refresh the token by sending the refresh token in the request headers.
- Issue a new JWT (with an updated expiration time) and return it to the client.

---

### Step 7: Client-Side Session Handling

Next, let’s ensure that we manage sessions on the client side effectively.

#### Checking User Authentication on the Frontend

You can use `useSession` hook from NextAuth to manage authentication state on the frontend.

```tsx
"use client";

import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-gray-800 p-4">
      {session ? (
        <>
          <div className="text-white">Welcome, {session.user?.name}</div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-red-500 text-white p-2 rounded-md"
          >
            Log Out
          </button>
        </>
      ) : (
        <button
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={() => (window.location.href = "/auth/login")}
        >
          Login
        </button>
      )}
    </header>
  );
}
```

- **`useSession()`**: This hook allows you to check whether the user is logged in and provides session details.
- **`signOut()`**: This function will log the user out and optionally redirect them to a specific URL.

---

### Conclusion

You’ve now added secure session management with JWT tokens, password hashing, and session expiration. With these features, you have:

- **Secure password storage** using bcrypt.
- **JWT-based session management** that supports expiration and renewal.
- **Advanced session handling** with options for auto-renewal.

This approach provides a good balance between security and performance, while also making it easier to scale your authentication system in larger apps. You can further enhance the refresh token flow or integrate OAuth providers (like Google or GitHub) if necessary.
