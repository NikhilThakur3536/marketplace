"use client";

import { Star, Clock, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Card({ id, name, rating, itemsServ, deliveryTime, costForTwo, image, location, restaurant }) {
  return (
    <Link href={`/foodmarketplace/${restaurant}/${location}/${id}`}>
      <div className="w-full flex flex-col bg-white border border-gray-200 h-76 mt-4 mb-4 rounded-lg cursor-pointer hover:shadow-lg transition-shadow">
        <div className="w-full h-[60%] relative rounded-lg">
          <Image
            src={image}
            alt="restaurant banner"
            fill
            className="object-cover object-center rounded-t-lg"
          />
        </div>
        <div className="flex flex-col w-full px-2 py-2 gap-2">
          <div className="flex justify-between">
            <h2 className="text-black font-bold text-lg">{name}</h2>
            <div className="bg-emerald-600 flex justify-center items-center gap-1 p-1 rounded-xs">
              <Star color="white" fill="white" size={20} />
              <span className="text-sm text-white">{rating}</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm">{itemsServ}</p>
          <div className="flex justify-between w-full"> 
            <div className="flex gap-1 items-center">
              <Clock size={20} color="gray" />
              <span className="text-gray-500">{deliveryTime}</span>
            </div>
            <div className="flex gap-1 items-center">
              <Truck size={20} color="gray" />
              <span className="text-gray-500 text-sm">{costForTwo}</span>
              <span className="text-gray-500 text-sm">for two</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}