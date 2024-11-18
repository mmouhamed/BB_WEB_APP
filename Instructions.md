Steps to create a full-stack Next.js landing page with login and logout functionality. We'll use **TypeScript**, **Tailwind CSS**, **App Router**, and **PostgreSQL** for the backend. I'll guide you through setting up the project structure, API routes for authentication, and handling user login/logout.

### Step 1: Project Setup

#### 1.1 Create a New Next.js Project with TypeScript

If you don’t have Next.js installed yet, you can start by running the following:

```bash
npx create-next-app@latest my-landing-page --typescript
cd my-landing-page
```

#### 1.2 Install Required Packages

You'll need to install several dependencies for this project:

- `next-auth` for authentication
- `pg` for PostgreSQL database interaction
- `tailwindcss` for styling
- `prisma` (optional but recommended) for easier database handling

Install the necessary packages:

```bash
npm install next-auth pg prisma
npm install @prisma/client
npm install tailwindcss postcss autoprefixer
```

#### 1.3 Set Up Tailwind CSS

Run the following command to set up Tailwind CSS:

```bash
npx tailwindcss init -p
```

In `tailwind.config.js`, replace the content section with:

```js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

In `globals.css` (inside `styles` folder), import Tailwind's base styles:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### 1.4 Initialize Prisma (Optional)

If you're using **Prisma** to interact with PostgreSQL (which is recommended for ease of use), you'll need to initialize Prisma:

```bash
npx prisma init
```

Configure your PostgreSQL connection in `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"
```

Run the following to generate Prisma models:

```bash
npx prisma db push
```

The above command syncs the Prisma schema with the database. (This is assuming your PostgreSQL database is already set up and running.)

### Step 2: Backend Setup (App Router)

#### 2.1 Set Up API Routes

The `app` directory in Next.js with App Router is where we’ll define the routes.

1. **Authentication using NextAuth.js**  
   Create the necessary API route in `app/api/auth/[...nextauth]/route.ts` to configure NextAuth.js for handling login and logout.

```typescript
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions } from "next-auth"

import { query } from "../../../lib/db"  // We'll set this up for DB queries

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        userName: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (credentials) {
          const user = await query(
            'SELECT * FROM BB_USERS WHERE USER_NAME = $1 AND "PASSWORD" = $2',
            [credentials.userName, credentials.password]
          )
          if (user) {
            return {
              id: user[0].USER_ID,
              name: user[0].DISPLAY_NAME,
              email: user[0].EMAIL,
            }
          }
        }
        return null
      }
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

In this code:

- We use the **Credentials Provider** to handle user login with `userName` and `password`.
- The `authorize` function checks the database (`BB_USERS` table) to validate the user credentials.
- `NextAuth` handles the session management.

2. **Database Helper**  
   We need a database query helper (`lib/db.ts`) to query the PostgreSQL database.

```typescript
import { Client } from "pg"

// Database connection setup
const client = new Client({
  connectionString: process.env.DATABASE_URL,
})

client.connect()

export const query = (text: string, params: any[]) => {
  return client.query(text, params).then((res) => res.rows)
}
```

Make sure to add your PostgreSQL connection string to `.env`.

### Step 3: Frontend Setup

#### 3.1 Landing Page

Create the landing page in `app/page.tsx`:

```tsx
import Link from "next/link"

export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to Our Landing Page</h1>
        <p className="text-lg mt-4">Sign up and log in to get started!</p>
        <div className="mt-6">
          <Link
            href="/auth/login"
            className="px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
```

#### 3.2 Login Page

Create the login page in `app/auth/login/page.tsx`:

```tsx
'use client'

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Login() {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await signIn("credentials", {
      redirect: false,
      userName,
      password,
    })

    if (res?.error) {
      setError("Invalid credentials")
    } else {
      router.push("/") // Redirect to homepage on successful login
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center">Login</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              id="username"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  )
}
```

#### 3.3 Logout Button

You can use `next-auth`'s `signOut` method to handle logging out. Create a `Logout` button in `components/LogoutButton.tsx`:

```tsx
'use client'

import { signOut } from "next-auth/react"

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
    >
      Log Out
    </button>
  )
}
```

#### 3.4 Add Logout to the Landing Page

In your `app/page.tsx`, you can conditionally render the logout button if the user is logged in. For this, use the `useSession` hook from `next-auth`.

```tsx
'use client'

import { useSession } from "next-auth/react"
import LogoutButton from "../components/LogoutButton"

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8">
        {session ? (
          <>
            <h1 className="text-4xl font-bold text-gray-800">Welcome, {session.user?.name

}!</h1>
            <LogoutButton />
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-gray-800">Welcome to Our Landing Page</h1>
            <p className="text-lg mt-4">Sign up and log in to get started!</p>
            <div className="mt-6">
              <Link
                href="/auth/login"
                className="px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
```

### Step 4: Final Thoughts

You now have:

- A **landing page** with a login button.
- A **login page** that allows users to authenticate using credentials stored in your PostgreSQL database.
- A **logout button** for authenticated users.

Make sure to adjust the database queries based on your exact schema. Also, you might want to implement more advanced security practices, like password hashing with `bcrypt` for real-world applications. You can add user registration and more advanced session management as needed.