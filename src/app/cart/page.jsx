'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'Toyota Camry Air Filter',
      image: '/placeholder.svg?height=200&width=200',
      price: 24.99,
      originalPrice: 34.99,
      quantity: 1,
      type: 'Aftermarket Premium',
    },
    {
      id: '3',
      name: 'Ford F-150 Brake Pads',
      image: '/placeholder.svg?height=200&width=200',
      price: 89.99,
      originalPrice: 109.99,
      quantity: 2,
      type: 'Aftermarket Premium',
    },
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => (item.id === id ? { ...item, quantity: newQuantity } : item)));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = 12.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Shopping Cart</h1>

      {cartItems.length > 0 ? (
        <>
          <div className="space-y-6">
            {cartItems.map(item => (
              <div key={item.id} className="border rounded-lg p-4 flex gap-4">
                <Image src={item.image || '/placeholder.svg'} alt={item.name} width={80} height={80} className="rounded-md" />
                <div className="flex-1">
                  <Link href={`/products/${item.id}`} className="font-medium text-blue-600 hover:underline block">
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-600">{item.type}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-semibold">${item.price.toFixed(2)}</span>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button className="w-8 h-8 flex items-center justify-center border-r" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <input type="text" readOnly value={item.quantity} className="w-10 h-8 text-center border-none focus:outline-none" />
                      <button className="w-8 h-8 flex items-center justify-center border-l" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">Total: ${(item.price * item.quantity).toFixed(2)}</span>
                    <button className="text-red-600 text-sm" onClick={() => removeItem(item.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t pt-4 space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary w-full mt-4">Proceed to Checkout</button>
            <Link href="/products" className="btn btn-outline w-full mt-2 text-center">
              Continue Shopping
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-10 text-gray-600">
          <p>Your cart is currently empty.</p>
          <Link href="/products" className="btn btn-primary mt-4">Browse Products</Link>
        </div>
      )}
    </div>
  );
}
