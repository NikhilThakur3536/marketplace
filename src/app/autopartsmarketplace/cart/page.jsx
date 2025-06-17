import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { Card, CardContent } from "../components/Card";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      name: "Brembo Front Brake Pad Set P85121",
      brand: "Brembo",
      price: 2450,
      originalPrice: 3200,
      quantity: 1,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "2",
      name: "Brembo Front Brake Pad Set P54030",
      brand: "Brembo",
      price: 2890,
      originalPrice: 3750,
      quantity: 2,
      image: "/placeholder.svg?height=200&width=200",
    },
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = cartItems.reduce(
    (sum, item) => sum + (item.originalPrice - item.price) * item.quantity,
    0
  );
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  const formatPrice = (price) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  return (
    <Layout showBackButton title="Shopping Cart">
      <div className="p-4">
        {cartItems.length > 0 ? (
          <>
            <div className="mb-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="mb-3">
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      <div className="w-20 h-20 bg-slate-700 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-blue-400 mb-1">
                          {item.brand}
                        </div>
                        <h3 className="text-sm font-medium mb-2 line-clamp-2">
                          {item.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold">
                              {formatPrice(item.price)}
                            </div>
                            <div className="text-xs text-gray-400 line-through">
                              {formatPrice(item.originalPrice)}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-7 h-7 flex items-center justify-center bg-slate-700 rounded-l-md"
                            >
                              <Icon name="minus" size={14} />
                            </button>
                            <div className="w-8 h-7 flex items-center justify-center bg-slate-700 border-x border-slate-600">
                              {item.quantity}
                            </div>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-7 h-7 flex items-center justify-center bg-slate-700 rounded-r-md"
                            >
                              <Icon name="plus" size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-red-400 flex items-center"
                      >
                        <Icon name="trash" size={14} className="mr-1" />
                        Remove
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mb-4">
              <CardContent>
                <h3 className="font-medium mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Discount</span>
                    <span className="text-green-400">
                      - {formatPrice(discount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span>
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="border-t border-slate-700 pt-2 mt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              variant="primary"
              fullWidth
              onClick={() => router.push("/checkout")}
            >
              Proceed to Checkout
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-slate-800 rounded-full p-6 mb-4">
              <Icon name="cart" size={48} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-gray-400 text-center mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button variant="primary" onClick={() => router.push("/")}>
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
