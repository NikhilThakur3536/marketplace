"use client";

import React from "react";
import { Icon } from "./Icon";
import { Badge } from "./Badge";
import { usePathname, useRouter } from "next/navigation";

export function Layout({ children, title, showBackButton = false, showHeader = true, showFooter = true }) {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: "Home", icon: "home", path: "/autopartsmarketplace" },
    { name: "Search", icon: "search", path: "/search" },
    { name: "Favorites", icon: "heart", path: "/autopartsmarketplace/favorites" },
    { name: "Profile", icon: "user", path: "/autopartsmarketplace/profile" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white max-w-md mx-auto relative">
      {showHeader && (
        <header className="sticky top-0 z-50 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {showBackButton ? (
                <button onClick={() => router.back()} className="text-white">
                  <Icon name="chevronLeft" size={20} />
                </button>
              ) : (
                <button className="text-white">
                  <Icon name="menu" size={20} />
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
              <button className="relative">
                <Icon name="bell" size={20} />
                <Badge
                  variant="danger"
                  className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0"
                >
                  2
                </Badge>
              </button>
              <button className="relative" onClick={() => router.push("/autopartsmarketplace/cart")}>
                <Icon name="cart" size={20} />
                <Badge variant="info" className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0">
                  3
                </Badge>
              </button>
            </div>
          </div>
        </header>
      )}

      <main className="pb-20">{children}</main>

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
                    <Icon name={item.icon} size={20} />
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
