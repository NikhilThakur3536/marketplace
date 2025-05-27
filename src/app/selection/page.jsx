"use client"

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleClick = (path) => {
    router.push(`/${path}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Select a Category</h1>
      <div className="space-x-4">
        <button
          onClick={() => handleClick('')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl text-lg transition"
        >
          Food
        </button>
        <button
          onClick={() => handleClick('electronicmarketplace')}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl text-lg transition"
        >
          Electronics
        </button>
        <button
          onClick={() => handleClick('hardwaremarketplace')}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-xl text-lg transition"
        >
          Computer
        </button>
      </div>
    </div>
  );
}
