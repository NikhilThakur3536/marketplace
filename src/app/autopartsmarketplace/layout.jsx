

import { CartProvider } from "./context/cartContext";
import { ChatProvider } from "./context/chatContext";
import { LanguageProvider } from "./context/languageContext";

export default function RootLayout({ children }) {
  return (
    <>
      <ChatProvider>   
        <CartProvider>
          <LanguageProvider>
          {children}
          </LanguageProvider>
        </CartProvider>
      </ChatProvider>  
    </>    
    
  );
}