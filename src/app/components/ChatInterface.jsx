"use client"

const ChatInterface = () => {
  return (
    <div className="relative h-[90vh] flex items-center justify-center bg-black">
      {/* Background with blur effect */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-sm"
        style={{
          backgroundImage: "url('path-to-your-background-image.jpg')", // Replace with your background image
        }}
      ></div>

      {/* Chat container */}
      <div className="relative z-10 w-full max-w-md p-4">
        {/* Chat header */}
        <div className="bg-gray-200 rounded-t-lg p-3 flex items-center">
          <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
            SP
          </div>
          <h2 className="text-lg font-semibold">Seller Shop</h2>
        </div>

        {/* Chat messages */}
        <div className="bg-white p-4">
          <div className="flex justify-end mb-2">
            <div className="bg-teal-500 text-white rounded-lg p-2 max-w-xs">
              {/* Placeholder for message */}
              <p className="opacity-0">Message placeholder</p>
            </div>
          </div>
        </div>

        {/* Input area */}
        <div className="bg-gray-100 rounded-b-lg p-3 flex items-center">
          <input
            type="text"
            placeholder="Type here"
            className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none"
          />
          <button className="ml-2 text-purple-500">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
