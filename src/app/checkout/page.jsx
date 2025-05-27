"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import Link from "next/link";

import CustomInput from "./ui/CustomInput";
import CustomTextarea from "./ui/CustomTexttArea";
import CustomRadio from "./ui/CustomRadio";
import CustomSeparator from "./ui/CustomSeperator";
import CustomButton from "./ui/CustomButton";
import { format } from "path";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  deliveryInstructions: z.string().optional(),
  paymentMethod: z.enum(["credit", "paypal", "cash"], {
    required_error: "Please select a payment method",
  }),
});

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("deviceToken");
      const response = await axios.post(
        `${BASE_URL}/user/cart/list`,
        { languageId: "2bfa9d89-61c4-401e-aae3-346627460558" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const items = response.data?.data?.rows || [];
      console.log(items?.[0].id)

      const formattedItems = items.map((item) => ({
        id: item.product.id,
        cartId: item.id,
        name: item.product.productLanguages?.[0]?.name || "No Name",
        description: item.productDetails?.description || "",
        price: item.priceInfo?.price || 0,
        quantity: item.quantity || 1,
        size: item.productSize || "N/A",
        image: item.productDetails?.productImage || "/restaurantcard.png",
      }));
      setCartItems(formattedItems);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartId === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = async (cartId) => {
    try {
      const token = localStorage.getItem("deviceToken");
      await axios.post(
        `${BASE_URL}/user/cart/remove`,
        { cartId:cartId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
    } catch (error) {
      console.error("Failed to remove item:", error);
      alert("Failed to remove item from cart. Please try again.");
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const delivery = 2.99;
  const total = subtotal + tax + delivery;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const handleCheckout = async (formData) => {
    try {
      console.log("Form submitted:", formData);
      alert("Order placed!");
      setCartItems([]);
      setStep(1);
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-white">
        <p>Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/searchpage"
            className="flex items-center space-x-2 text-white hover:text-orange-500"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Continue Shopping</span>
          </Link>
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-6 w-6 text-orange-500" />
            <h1 className="text-2xl font-bold">Your Cart</h1>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-500" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <Link href="/">
              <CustomButton>Browse Menu</CustomButton>
            </Link>
          </div>
        ) : step === 1 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.cartId}
                  className="bg-gray-900 p-4 rounded-md flex items-center gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-md object-cover"
                  />
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{item.name}</h3>
                      <span className="text-orange-500 font-semibold">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                    <p className="text-gray-400 text-sm">Size: {item.size}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            updateQuantity(item.cartId, item.quantity - 1)
                          }
                          className="h-8 w-8 border rounded-full flex items-center justify-center"
                        >
                          <Minus className="h-4 w-4 text-white" />
                        </button>
                        <span className="mx-3">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.cartId, item.quantity + 1)
                          }
                          className="h-8 w-8 border rounded-full flex items-center justify-center"
                        >
                          <Plus className="h-4 w-4 text-white" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.cartId)}
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className="bg-gray-900 p-6 rounded-md">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>${delivery.toFixed(2)}</span>
                  </div>
                  <CustomSeparator />
                  <div className="flex justify-between text-white font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <CustomButton
                  onClick={() => setStep(2)}
                  className="w-full mt-4"
                >
                  Proceed to Checkout
                </CustomButton>
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(handleCheckout)}
            className="space-y-4"
            noValidate
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput label="Name" {...register("name")} error={errors.name?.message} />
              <CustomInput label="Email" {...register("email")} error={errors.email?.message} />
              <CustomInput label="Phone" {...register("phone")} error={errors.phone?.message} />
              <CustomInput label="City" {...register("city")} error={errors.city?.message} />
              <CustomInput label="State" {...register("state")} error={errors.state?.message} />
              <CustomInput label="Zip Code" {...register("zipCode")} error={errors.zipCode?.message} />
            </div>

            <CustomTextarea label="Address" {...register("address")} error={errors.address?.message} />
            <CustomTextarea label="Delivery Instructions" {...register("deliveryInstructions")} />

            <CustomRadio
              label="Payment Method"
              options={[
                { value: "credit", label: "Credit Card" },
                { value: "paypal", label: "PayPal" },
                { value: "cash", label: "Cash on Delivery" },
              ]}
              {...register("paymentMethod")}
              error={errors.paymentMethod?.message}
            />

            <CustomButton type="submit" className="w-full">
              Place Order
            </CustomButton>
          </form>
        )}
      </div>
    </div>
  );
};

export default Checkout;
