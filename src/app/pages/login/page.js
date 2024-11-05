"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (result.error) {
      setError(result.error);
    } else {
      router.push("/home");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-4">Login</h1>
      <form onSubmit={handleLogin} className="bg-white p-12 rounded-lg">
        <input
          type="email"
          className="w-full h-12 border-gray-300 border px-4 mb-4"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full h-12 border-gray-300 border px-4 mb-4"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full h-12 font-semibold bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-300">
          Login
        </button>
        <Link
          href="/"
          className="flex justify-center items-center text-gray-900 font-medium mt-4"
        >
          Don't have an account?
          <span className="text-indingo-600 font-semibold pl-2">Sign Up</span>
        </Link>
      </form>
    </div>
  );
}
