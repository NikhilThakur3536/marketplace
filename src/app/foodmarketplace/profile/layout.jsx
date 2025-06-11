import React from "react";
import BottomNav from "../components/BottomNavbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main content (ProfileCard or other pages) */}
      <main className="flex-grow flex items-center justify-center p-4">
        {children}
      </main>

      {/* Bottom Navbar fixed at the bottom */}
      <footer className="w-full max-w-md sticky bottom-0 left-0 right-0">
        <BottomNav />
      </footer>
    </div>
  );
};

export default Layout;