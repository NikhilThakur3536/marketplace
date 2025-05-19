"use client"

import React, { useState } from "react";
import { ArrowLeft, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from 'next/link';
import CustomLabel from "./ui/CustomLabel";
import CustomInput from "./ui/CustomInput";
import CustomTextarea from "./ui/CustomTexttArea";
import CustomSelect from "./ui/CustomSelect";
import CustomRadio from "./ui/CustomRadio";
import CustomFormMessage from "./ui/CustomFormMessage";
import CustomSeparator from "./ui/CustomSeperator";
import CustomButton from "./ui/CustomButton";

const initialCartItems = [
  { 
    id: 1,
    name: "Pizza Paradise",
    description: "Italian Pizza",
    price: 13,
    quantity: 1,
    size: "Medium",
    image: "/restaurantcard.png",
  },
  {
    id: 2,
    name: "Veggie Delight",
    description: "Vegetarian Pizza",
    price: 11,
    quantity: 2,
    size: "Small",
    image: "/restaurantcard.png",
  },
];

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  name: z.string().min(1, { message: "Name is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipCode: z.string().min(1, { message: "Zip code is required" }),
  deliveryInstructions: z.string().optional(),
  paymentMethod: z.enum(["credit", "paypal", "cash"], {
    required_error: "Please select a payment method",
  }),
});

const Checkout = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [step, setStep] = useState(1); 
  
 
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; 
  const delivery = 2.99;
  const total = subtotal + tax + delivery;

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      deliveryInstructions: "",
      paymentMethod: "credit",
    },
  });

  const handleCheckout = (data) => {
    console.log("Form data:", data);
    setCartItems([]);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
           <Link
            href="/searchpage"
            className="flex items-center space-x-2 text-white hover:text-orange-500 transition-colors"
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
            <p className="text-gray-400 mb-6">Looks like you haven't added anything to your cart yet</p>
            <Link to="/">
              <CustomButton>Browse Menu</CustomButton>
            </Link>
          </div>
        ) : step === 1 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Cart Items ({cartItems.length})</h2>
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-800">
                      <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-800 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <h3 className="font-semibold">{item.name}</h3>
                          <span className="text-orange-500 font-semibold">${item.price.toFixed(2)}</span>
                        </div>
                        
                        <p className="text-gray-400 text-sm">{item.description}</p>
                        <p className="text-gray-400 text-sm">Size: {item.size}</p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center">
                            <button
                              className="h-8 w-8 rounded-full border border-gray-700 bg-transparent text-gray-400 hover:bg-gray-800"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3 mx-auto" />
                            </button>
                            
                            <span className="mx-3 w-5 text-center">{item.quantity}</span>
                            
                            <button
                              className="h-8 w-8 rounded-full border border-gray-700 bg-transparent text-gray-400 hover:bg-gray-800"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3 mx-auto" />
                            </button>
                          </div>
                          
                          <button
                            className="h-8 w-8 text-gray-400 hover:text-red-500"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

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
                  
                  <CustomSeparator />
                  
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-orange-500">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <CustomButton 
                className="w-full py-3 mt-4"
                onClick={() => setStep(2)}
              >
                Proceed to Checkout
              </CustomButton>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Delivery Information</h2>
                
                <form onSubmit={handleSubmit(handleCheckout)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <CustomLabel htmlFor="name">Full Name</CustomLabel>
                      <CustomInput 
                        id="name"
                        placeholder="John Doe" 
                        {...register("name")}
                      />
                      <CustomFormMessage>{errors.name?.message}</CustomFormMessage>
                    </div>
                    
                    <div>
                      <CustomLabel htmlFor="email">Email</CustomLabel>
                      <CustomInput 
                        id="email"
                        placeholder="john@example.com" 
                        type="email"
                        {...register("email")} 
                      />
                      <CustomFormMessage>{errors.email?.message}</CustomFormMessage>
                    </div>

                    <div>
                      <CustomLabel htmlFor="phone">Phone Number</CustomLabel>
                      <CustomInput 
                        id="phone"
                        placeholder="(123) 456-7890" 
                        {...register("phone")}
                      />
                      <CustomFormMessage>{errors.phone?.message}</CustomFormMessage>
                    </div>
                  </div>

                  <CustomSeparator />
                  
                  <h3 className="text-lg font-medium">Delivery Address</h3>
                  
                  <div>
                    <CustomLabel htmlFor="address">Street Address</CustomLabel>
                    <CustomInput 
                      id="address"
                      placeholder="123 Main St" 
                      {...register("address")}
                    />
                    <CustomFormMessage>{errors.address?.message}</CustomFormMessage>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <CustomLabel htmlFor="city">City</CustomLabel>
                      <CustomInput 
                        id="city"
                        placeholder="New York" 
                        {...register("city")}
                      />
                      <CustomFormMessage>{errors.city?.message}</CustomFormMessage>
                    </div>
                    
                    <div>
                      <CustomLabel htmlFor="state">State</CustomLabel>
                      <CustomSelect 
                        id="state"
                        {...register("state")}
                      >
                        <option value="" disabled>Select a state</option>
                        <option value="NY">New York</option>
                        <option value="CA">California</option>
                        <option value="TX">Texas</option>
                        <option value="FL">Florida</option>
                        <option value="IL">Illinois</option>
                      </CustomSelect>
                      <CustomFormMessage>{errors.state?.message}</CustomFormMessage>
                    </div>
                    
                    <div>
                      <CustomLabel htmlFor="zipCode">Zip Code</CustomLabel>
                      <CustomInput 
                        id="zipCode"
                        placeholder="10001" 
                        {...register("zipCode")}
                      />
                      <CustomFormMessage>{errors.zipCode?.message}</CustomFormMessage>
                    </div>
                  </div>
                  
                  <div>
                    <CustomLabel htmlFor="deliveryInstructions">Delivery Instructions (Optional)</CustomLabel>
                    <CustomTextarea 
                      id="deliveryInstructions"
                      placeholder="Special delivery instructions, gate codes, etc."
                      rows={3}
                      {...register("deliveryInstructions")}
                    />
                    <CustomFormMessage>{errors.deliveryInstructions?.message}</CustomFormMessage>
                  </div>
                  
                  <CustomSeparator />
                  
                  <div className="space-y-3">
                    <CustomLabel>Payment Method</CustomLabel>
                    <div className="flex flex-col space-y-2">
                      <CustomRadio
                        id="credit"
                        value="credit"
                        {...register("paymentMethod")}
                        defaultChecked
                      >
                        Credit / Debit Card
                      </CustomRadio>
                      <CustomRadio
                        id="paypal"
                        value="paypal"
                        {...register("paymentMethod")}
                      >
                        PayPal
                      </CustomRadio>
                      <CustomRadio
                        id="cash"
                        value="cash"
                        {...register("paymentMethod")}
                      >
                        Cash on Delivery
                      </CustomRadio>
                    </div>
                    <CustomFormMessage>{errors.paymentMethod?.message}</CustomFormMessage>
                  </div>
                </form>
              </div>
            </div>
            
            <div>
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="mb-4 space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        {item.name} x{item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <CustomSeparator />
                </div>

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
                  
                  <CustomSeparator />
                  
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-orange-500">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <CustomButton 
                className="w-full py-3 mt-4"
                onClick={handleSubmit(handleCheckout)}
                type="submit"
              >
                Place Order
              </CustomButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;