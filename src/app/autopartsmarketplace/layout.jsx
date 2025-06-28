

import { CartProvider } from "./context/cartContext";
import { ChatProvider } from "./context/chatContext";

export default function RootLayout({ children }) {
  return (
    <>
      <ChatProvider>   
        <CartProvider>
          {children}
        </CartProvider>
      </ChatProvider>  
    </>    
    
  );
}