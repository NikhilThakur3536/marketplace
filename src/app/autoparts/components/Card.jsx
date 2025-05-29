import Image from "next/image";

export default function Cards({ Icon, imageSrc, tittle, description }) {
  return (
    <div className="w-full border border-gray-400 rounded-lg p-6 flex flex-col items-center gap-2">
      <div className="bg-blue-100 rounded-full w-fit h-fit p-2">
        {Icon ? (
          <Icon size={40} color="blue" />
        ) : (
          <Image src={imageSrc} alt={"image"} width={20} height={20} className="object-contain" />
        )}
      </div>
      <h3 className="font-bold text-2xl text-center">{tittle}</h3>
      <div className="text-center w-[70%]">
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

