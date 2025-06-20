

import { CartProvider } from "./context/cartContext";

export default function RootLayout({ children }) {
  return (
    <>
        <CartProvider>{children}</CartProvider>
    </>    
    
  );
}