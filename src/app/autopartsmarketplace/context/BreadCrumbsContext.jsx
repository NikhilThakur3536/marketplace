"use client";

import { createContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

// Define marketplace-specific home paths for food, electronics, and autoparts
const marketplaceHomePaths = {
  foodmarketplace: {
    label: "Home",
    path: "/foodmarketplace",
  },
  electronicsmarketplace: {
    label: "Home",
    path: "/electronicsmarketplace",
  },
  autopartsmarketplace: {
    label: "Home",
    path: "/autopartsmarketplace",
  },
};

const labelMap = {
  "tasty-bites": "Tasty Bites",
  "paldi-ahmedabad": "Paldi, Ahmedabad",
};

const BreadcrumbContext = createContext({
  breadcrumbs: [],
  setBreadcrumbs: () => {},
});

export const BreadcrumbProvider = ({ children, marketplace }) => {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const detectedMarketplace = pathSegments[0] in marketplaceHomePaths ? pathSegments[0] : marketplace;
    const homeConfig = detectedMarketplace in marketplaceHomePaths 
      ? marketplaceHomePaths[detectedMarketplace]
      : { label: "Home", path: "/" };

    let newBreadcrumbs = [];

    if (pathSegments.length === 0 || !detectedMarketplace) {
      newBreadcrumbs = [{ label: homeConfig.label, path: homeConfig.path }];
    } else if (detectedMarketplace === "foodmarketplace" && pathSegments.length >= 3) {
      // Handle /foodmarketplace/[restaurantName]/[locationName]
      const restaurantSegment = pathSegments[1];
      const locationSegment = pathSegments[2];
      const restaurantLabel = labelMap[restaurantSegment] || 
        restaurantSegment
          .split("-")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      const locationLabel = labelMap[locationSegment] || 
        locationSegment
          .split("-")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      const combinedLabel = `${restaurantLabel}, ${locationLabel}`;
      newBreadcrumbs = [
        { label: homeConfig.label, path: homeConfig.path },
        {
          label: combinedLabel,
          path: `${homeConfig.path}/${restaurantSegment}/${locationSegment}`,
        },
      ];
    } else if (["electronicsmarketplace", "autopartsmarketplace"].includes(detectedMarketplace) && pathSegments.length >= 2) {
      // Handle /marketplace/[product]/[id]
      const productSegment = pathSegments[1];
      const idSegment = pathSegments[2];
      const productLabel = labelMap[productSegment] || 
        productSegment
          .split("-")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      newBreadcrumbs = [
        { label: homeConfig.label, path: homeConfig.path },
        {
          label: productLabel,
          path: `${homeConfig.path}/${productSegment}/${idSegment}`,
        },
      ];
    } else {
      // Default case for other valid paths
      newBreadcrumbs = [
        { label: homeConfig.label, path: homeConfig.path },
        ...pathSegments.slice(1).map((segment, index) => {
          const formattedLabel = labelMap[segment] || 
            segment
              .split("-")
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          return {
            label: formattedLabel,
            path: `${homeConfig.path}/${pathSegments.slice(1, index + 2).join("/")}`,
          };
        }),
      ];
    }

    setBreadcrumbs(newBreadcrumbs);
  }, [pathname, marketplace]);

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export default BreadcrumbContext;