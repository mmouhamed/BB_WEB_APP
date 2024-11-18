import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-900">
      <div className="text-center p-6 bg-white rounded-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Welcome to BusyBee
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Your one-stop solution for janitorial and environmental services.
        </p>
        <Link href="/auth/login">
          <span className="inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition">
            Sign In
          </span>
        </Link>
      </div>
    </div>
  );
}
