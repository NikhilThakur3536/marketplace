"use client"

import { useRouter } from 'next/navigation';

export default function MarketplaceSelection() {
  const router = useRouter();

  const handleNavigation = (marketplace) => {
    router.push(`/marketplace/${marketplace}/login`);
  };

  return (
    <div className="container">
      <h1>Select Your Marketplace</h1>
      <div className="buttonContainer">
        <button
          onClick={() => handleNavigation('foodmarketplace')}
          className="marketplaceButton"
        >
          Food Marketplace
        </button>
        <button
          onClick={() => handleNavigation('electronicsmarketplace')}
          className="marketplaceButton"
        >
          Electronics Marketplace
        </button>
        <button
          onClick={() => handleNavigation('automarketplace')}
          className="marketplaceButton"
        >
          Auto Marketplace
        </button>
      </div>
    </div>
  );
}