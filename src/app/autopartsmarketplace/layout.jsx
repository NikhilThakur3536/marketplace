"use client "
import { CartProvider } from "./context/cartContext";
import { ChatProvider } from "./context/chatContext";
import { FavoriteProvider } from "./context/favoriteContext";
import { LanguageProvider } from "./context/languageContext";

export default function RootLayout({ children }) {
  return (
    <>
      <ChatProvider>   
        <CartProvider>
          <LanguageProvider>
            <FavoriteProvider marketplace={"electronicsmarketplace"}>
          {children}
          </FavoriteProvider>
          </LanguageProvider>
        </CartProvider>
      </ChatProvider>  
    </>    
    
  );
}