"use client"

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function PromoBanner() {
  const [coupon, setCoupon] = useState({
    name: 'Flat',
    code: 'SB83028',
    discount: 60, // Fallback discount
    description: 'On All Electronics Items', // Fallback description
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchCoupons = async () => {
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
        const response = await axios.post(`${BASE_URL}/user/coupon/list`, {
          limit: 4000,
          offset: 0,
          totalAmount: "700",
        }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('API Response:', response.data); // Debug log
        if (response.data?.data?.rows?.length > 0) {
          const firstCoupon = response.data.data.rows[0];
          setCoupon({
            name: firstCoupon.name,
            code: firstCoupon.code,
            discount: firstCoupon.discount,
            description: firstCoupon.description,
          });
        }
      } catch (error) {
        console.error('Error fetching coupons:', error);
      }
    };

    fetchCoupons();
  }, []);

  return (
    <div className=" bg-gradient-to-r from-green-400 to-green-500 rounded-2xl p-6 text-white relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-1">{coupon.name}</h2>
        <h2 className="text-3xl font-bold mb-2">{coupon.discount}% OFF</h2>
        <p className="text-sm opacity-90 mb-3">{coupon.description}</p>
        <div className="bg-AADD99 rounded-lg px-3 py-1 inline-block border border-white">
          <span className="text-xs font-medium">Code: {coupon.code}</span>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-20 h-20 bg-[#EEF9FA] bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-[#EEF9FA] bg-opacity-10 rounded-full -mr-8 -mb-8"></div>
    </div>
  )
}