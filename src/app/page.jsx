"use client"

import { useRouter } from 'next/navigation';

export default function MarketplaceSelection() {
  const router = useRouter();

  const handleNavigation = (marketplace) => {
    router.push(`/${marketplace}/login`);
  };

  return (
    <div className="container">
      <h1>Select Your Marketplace</h1>
      <div className="buttonContainer">
        <button
          onClick={() => handleNavigation('foodmarketplace')}
          className="p-2 bg-blue-100"
        >
          Food Marketplace
        </button>
        <button
          onClick={() => handleNavigation('electronicsmarketplace')}
          className="p-2 bg-green-100"
        >
          Electronics Marketplace
        </button>
        <button
          onClick={() => handleNavigation('automarketplace')}
          className="p-2 bg-yellow-100"
        >
          Auto Marketplace
        </button>
      </div>
    </div>
  );
}