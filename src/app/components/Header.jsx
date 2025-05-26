import Image from 'next/image';
import { MapPin } from 'lucide-react';

export default function Header({ handleSearchClick }) {
  return (
    <div className="flex justify-between w-full h-12 absolute">
      <div className="fixed -top-8 left-10 w-24 h-24 z-50">
        <Image
          src="/infoware.png"
          alt="logo"
          fill
          style={{ objectFit: "contain" }}
          priority
        />
      </div>
      <input
        type="text"
        defaultValue="Dubai"
        className="fixed left-[55%] top-1 z-50 w-32 px-8 py-1 bg-orange rounded-md text-white font-semibold shadow-lg transform -translate-y-0.5 placeholder:text-xs placeholder:-top-0.5"
        placeholder="Enter location"
        onClick={handleSearchClick}
      />
      <MapPin color="white" size={20} className="fixed left-[56%] z-60 top-2 transform translate-y-0.5" />
    </div>
  );
}