import React, { useState, useEffect, useRef } from "react";
import { Icon } from "./Icon";
import { Badge } from "./Badge";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "../context/cartContext";
import { useLanguage } from "../context/languageContext";
import { Globe, MessageSquare } from "lucide-react"; // Added MessageSquare import
import { FavoriteProvider } from "../context/FavoriteContext";

const navItems = [
  { name: "Home", path: "/autopartsmarketplace", icon: "home" },
  { name: "Order", path: "/autopartsmarketplace/orders", icon: "list" },
  { name: "Fav", path: "/autopartsmarketplace/favorites", icon: "heart" },
  { name: "Profile", path: "/autopartsmarketplace/profile", icon: "user" },
  { name: "Chat", path: "/autopartsmarketplace/chat", icon: "MessageSquare" }, // Added Chat nav item
];

export default function Layout({ children, title, showBackButton = false, showHeader = true, showFooter = true }) {
  const router = useRouter();
  const pathname = usePathname();
  const { cartItemCount } = useCart();
  const { languages, selectedLanguageId, setSelectedLanguageId, loading: langLoading, error: langError } = useLanguage();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (languageId, languageName) => {
    setSelectedLanguageId(languageId);
    setIsLanguageDropdownOpen(false);
    setShowPopup({
      type: "success",
      message: `Language changed to ${languageName}`,
    });
    setTimeout(() => setShowPopup(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white max-w-md mx-auto relative">
      {showHeader && (
        <header className="sticky top-0 z-50 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {showBackButton && (
                <button onClick={() => router.back()} className="text-white">
                  <Icon name="chevronLeft" size={20} />
                </button>
              )}
              {title && <h1 className="text-lg font-medium">{title}</h1>}
              {!title && (
                <div className="flex items-center gap-1">
                  <Icon name="location" size={16} className="text-blue-400" />
                  <span className="text-sm text-gray-300">Location</span>
                  <span className="text-sm font-medium">India</span>
                  <Icon name="chevronDown" size={16} className="text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative" ref={dropdownRef}>
                <button
                  className="p-2 bg-slate-700 rounded-full text-white hover:bg-slate-600"
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  aria-label="Select Language"
                >
                  <Globe size={15} />
                </button>
                {isLanguageDropdownOpen && (
                  <div className="absolute top-10 right-0 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 w-48 max-h-60 overflow-y-auto">
                    {langLoading ? (
                      <div className="p-2 text-gray-300">Loading languages...</div>
                    ) : langError ? (
                      <div className="p-2 text-red-400">{langError}</div>
                    ) : languages.length > 0 ? (
                      languages.map((language) => (
                        <button
                          key={language.id}
                          className={`w-full text-left px-4 py-2 text-white hover:bg-slate-700 ${
                            selectedLanguageId === language.id ? "bg-blue-600" : ""
                          }`}
                          onClick={() => handleLanguageChange(language.id, language.name)}
                        >
                          {language.name}
                        </button>
                      ))
                    ) : (
                      <div className="p-2 text-gray-300">No languages available</div>
                    )}
                  </div>
                )}
              </div>
              <button
                className="relative"  
                onClick={() => router.push("/autopartsmarketplace/cart")}
              >
                <Icon name="cart" size={20} />
                {cartItemCount > 0 && (
                  <Badge
                    variant="info"
                    className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </button>
            </div>
          </div>
        </header>
      )}
      <main className="pb-20">
        <FavoriteProvider marketplace="autopartsmarketplace">
          {children}
        </FavoriteProvider>
      </main>

      {showFooter && (
        <footer className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 p-2 max-w-md mx-auto">
          <nav className="flex items-center justify-around">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.path)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 ${
                    isActive ? "text-blue-400" : "text-gray-400"
                  }`}
                >
                  <div className={isActive ? "relative" : ""}>
                    {item.icon === "MessageSquare" ? (
                      <MessageSquare size={20} /> // Use Lucide MessageSquare for Chat
                    ) : (
                      <Icon name={item.icon} size={20} />
                    )}
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></span>
                    )}
                  </div>
                  <span className="text-xs">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </footer>
      )}
    </div>
  );
}