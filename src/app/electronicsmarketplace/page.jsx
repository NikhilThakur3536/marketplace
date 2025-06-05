import React from "react";
import Header from "./components/Header";
import PromoBanner from "./components/PromoBanner";
import CategoryTabs from "./components/CategoryTabs";
import ProductGrid from "./components/ProductGrid";
import BottomNav from "./components/BottomNav";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto bg-[#EEF9FA] min-h-screen">
        <Header />
        <div className="px-4 space-y-1">
          <PromoBanner />
          <CategoryTabs />
          <ProductGrid />
        </div>
        <BottomNav />
      </div>
    </div>
  );
};

export default HomePage;