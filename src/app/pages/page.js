import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-yellow-500 to-yellow-700 ">
      {/* // <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-green-300 to-blue-300 "> */}
      <h1 className="text-4xl font-bold text-center text-white mb-4 ">
        Welcome to BusyBee
      </h1>
      <h2 className="text-lg text-center text-white mb-2  ">
        Work order System - Environmental Services
      </h2>
      <p className="text-lg text-center text-white mb-6">
        Safe, Healthy, Stylish, and Professional
      </p>
      <Link href="/pages/login">
        <button className="bg-black text-white px-6 py-3 rounded-lg border shadow-lg hover:bg-indigo-700 transition duration-300 ">
          Submit Work Order
        </button>
      </Link>
    </div>
  );
}
