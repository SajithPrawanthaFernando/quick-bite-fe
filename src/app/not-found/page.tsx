"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white text-center px-6">
      <XCircle className="w-16 h-16 text-[#FDB940] mb-6" />
      <h1 className="text-5xl font-bold text-black mb-4">404</h1>
      <p className="text-xl text-gray-700 font-medium mb-2">Page Not Found</p>
      <p className="text-gray-500 mb-8 max-w-md">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-black text-white px-6 py-3 rounded-md hover:bg-[#FDB940] hover:text-black font-medium transition"
      >
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
