"use client "
import { BreadcrumbProvider } from "./context/BreadCrumbsContext";
import { CartProvider } from "./context/cartContext";
import { ChatProvider } from "./context/chatContext";
import { FavoriteProvider } from "./context/favoriteContext";
import { LanguageProvider } from "./context/languageContext";

export default function RootLayout({ children }) {
  return (
    <>
      <ChatProvider>
        <BreadcrumbProvider marketplace={"electronicsmarketplace"}>   
        <CartProvider>
          <LanguageProvider>
            <FavoriteProvider marketplace={"electronicsmarketplace"}>
          {children}
          </FavoriteProvider>
          </LanguageProvider>
        </CartProvider>
        </BreadcrumbProvider>
      </ChatProvider>  
    </>    
    
  );
}