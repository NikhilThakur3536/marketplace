export default function PromoBanner() {
  return (
    <div className=" bg-gradient-to-r from-[#9FD770] to-[#64C058] rounded-2xl p-6 text-white relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-1">Flat</h2>
        <h2 className="text-3xl font-bold mb-2">60% OFF</h2>
        <p className="text-sm opacity-90 mb-3">On All Electronics Items</p>
        <div className="bg-AADD99 rounded-lg px-3 py-1 inline-block border border-white">
          <span className="text-xs font-medium">Code: SB83028</span>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-20 h-20 bg-[#EEF9FA] bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-[#EEF9FA] bg-opacity-10 rounded-full -mr-8 -mb-8"></div>
    </div>
  )
}