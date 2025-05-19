import React from "react";
import { Separator } from "@/components/ui/separator";

const OrderSummary = ({
  subtotal,
  tax,
  delivery,
  total,
  showItems = false,
  items = [],
}) => {
  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      {showItems && items.length > 0 && (
        <div className="mb-4 space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-400">
                {item.name} x{item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <Separator className="my-3 bg-gray-800" />
        </div>
      )}

      <div className="space-y-3">
        <div className="flex justify-between text-gray-400">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-400">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-400">
          <span>Delivery</span>
          <span>${delivery.toFixed(2)}</span>
        </div>

        <Separator className="my-3 bg-gray-800" />

        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span className="text-orange-500">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
