"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HardwareBot() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [conversationState, setConversationState] = useState("greeting");
  const [order, setOrder] = useState({
    first: { vehicle: "", quantity: 1, budget: null, part: null },
    second: { vehicle: "", quantity: 1, budget: null, part: null },
  });
  const [currentPart, setCurrentPart] = useState("first");
  const messagesEndRef = useRef(null);
  const balls = [0, 1, 2, 3, 4];
  const [randomLefts, setRandomLefts] = useState([]);

  const partsSuppliers = {
    car: [
      { name: "AutoParts Hub", location: "123 Gear St", image: "https://th.bing.com/th/id/OIP.wrWb0UxjNxhGZBOxQb6ytAHaEK?rs=1&pid=ImgDetMain", price: 50 },
      { name: "CarZone", location: "456 Motor Ave", image: "https://www.cxmagazine.com/wp-content/uploads/2017/04/oreilly-auto-i-5-design-manufacure-768x508.jpg", price: 60 },
      { name: "DriveMart", location: "789 Engine Rd", image: "https://th.bing.com/th/id/OIP.tmmeifrQ7gfgrfz9l8OLJgAAAA?w=250&h=250&rs=1&pid=ImgDetMain", price: 45 },
    ],
    truck: [
      { name: "TruckParts Depot", location: "321 Axle St", image: "https://th.bing.com/th/id/OIP.cLve2acbc6w-2GrS_Rq_qAHaFJ?rs=1&pid=ImgDetMain", price: 80 },
      { name: "HeavyDuty Spares", location: "654 Load Dr", image: "https://th.bing.com/th/id/OIP.dIXuqVqw5qbd8tfq-BEw9AAAAA?rs=1&pid=ImgDetMain", price: 90 },
    ],
    motorcycle: [
      { name: "BikeBits", location: "987 Chain Ln", image: "https://th.bing.com/th/id/OIP.mivJVVKmmOFgMRep4v8D1gHaD0?rs=1&pid=ImgDetMain", price: 30 },
      { name: "CycleWorks", location: "147 Rider Ave", image: "https://th.bing.com/th/id/OIP.ZU0gwwo8JDyck6bRk5EzgQHaFj?rs=1&pid=ImgDetMain", price: 25 },
    ],
  };

  const vehicleOptions = ["Car", "Truck", "Motorcycle"];
  const partOptions = {
    car: [
      { name: "Brake Pads, New, OEM", image: "https://m.media-amazon.com/images/I/71xIToYU4cL._SL1500_.jpg", price: 55 },
      { name: "Air Filter, Used, Local", image: "https://i.ebayimg.com/00/s/MTYwMFgxNjAw/z/q2IAAOSwu6taT-wo/$_57.JPG?set_id=8800005007", price: 20 },
      { name: "Spark Plugs, New, Local", image: "https://th.bing.com/th/id/OIP.7A1aVajGC2PUJ2DXWis2bgHaE8?rs=1&pid=ImgDetMain", price: 15 },
    ],
    truck: [
      { name: "Fuel Pump, New, OEM", image: "https://www.sinotrukhowospareparts.com/wp-content/uploads/2023/03/Original-Genuine-truck-fuel-pump-4930965.jpg", price: 120 },
      { name: "Oil Filter, Used, Local", image: "https://www.heavydutytruckfilters.com/photo/heavydutytruckfilters/editor/20190325135810_46529.jpg", price: 30 },
      { name: "Brake Discs, New, Local", image: "https://th.bing.com/th/id/OIP.SzuPmIlvF_cRuHQl26SImQHaEq?rs=1&pid=ImgDetMain", price: 80 },
    ],
    motorcycle: [
      { name: "Chain, New, OEM", image: "https://images.unsplash.com/photo-1605550911-2c3a4124d3b6", price: 40 },
      { name: "Tires, Used, Local", image: "https://images.unsplash.com/photo-1605550911-2c3a4124d3b7", price: 25 },
      { name: "Brake Pads, New, Local", image: "https://images.unsplash.com/photo-1605550911-2c3a4124d3b8", price: 20 },
    ],
  };

  const quantityOptions = [1, 2, 3];
  const budgetOptions = [
    { label: "$10-$50", min: 10, max: 50 },
    { label: "$50-$100", min: 50, max: 100 },
    { label: "$100+", min: 100, max: Infinity },
  ];

  useEffect(() => {
    const generatedLefts = balls.map(() => Math.floor(Math.random() * 260));
    setRandomLefts(generatedLefts);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const greetingMessage = {
      id: Date.now(),
      text: "Hello! Welcome to AutoParts Marketplace. Would you like to order vehicle parts?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      buttons: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
    };
    setMessages([greetingMessage]);
  }, []);

  const handleImageClick = (value) => {
    const userMessage = {
      id: Date.now(),
      text: value.charAt(0).toUpperCase() + value.slice(1),
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMessage]);
    handleBotResponse(value.toLowerCase());
  };

  const handleBotResponse = (value) => {
    let botMessage = {
      id: Date.now() + 1,
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const currentVehicle = order[currentPart].vehicle;
    const nextPart = currentPart === "first" ? "second" : "first";

    switch (conversationState) {
      case "greeting":
        if (value === "yes") {
          botMessage.text = "Great! Let's start with the first vehicle. What type of vehicle are you looking parts for?";
          botMessage.buttons = vehicleOptions.map((vehicle) => ({
            label: vehicle,
            value: vehicle.toLowerCase(),
          }));
          setConversationState("vehicleSelection_first");
        } else {
          botMessage.text = "Alright, let me know if you need parts later!";
          botMessage.buttons = [{ label: "Order Parts", value: "yes" }];
        }
        break;

      case "vehicleSelection_first":
      case "vehicleSelection_second":
        if (vehicleOptions.map((v) => v.toLowerCase()).includes(value)) {
          setOrder((prev) => ({
            ...prev,
            [currentPart]: { ...prev[currentPart], vehicle: value },
          }));
          botMessage.text = `Nice! Please provide your location to find nearby suppliers for ${value} parts.`;
          botMessage.buttons = [
            { label: "Dubai", value: "Dubai" },
            { label: "India", value: "India" },
          ];
          setConversationState(`location_${currentPart}_${value}`);
        } else {
          botMessage.text = "Please choose a valid vehicle type.";
        }
        break;

      case `location_first_car`:
      case `location_first_truck`:
      case `location_first_motorcycle`:
      case `location_second_car`:
      case `location_second_truck`:
      case `location_second_motorcycle`:
        const vehicleType = conversationState.split("_")[2];
        botMessage.text = `How many ${vehicleType} parts would you like to order?`;
        botMessage.buttons = quantityOptions.map((qty) => ({
          label: `${qty}`,
          value: qty.toString(),
        }));
        setConversationState(`quantity_${currentPart}_${vehicleType}`);
        break;

      case `quantity_first_car`:
      case `quantity_first_truck`:
      case `quantity_first_motorcycle`:
      case `quantity_second_car`:
      case `quantity_second_truck`:
      case `quantity_second_motorcycle`:
        const qtyType = conversationState.split("_")[2];
        const quantity = parseInt(value);
        setOrder((prev) => ({
          ...prev,
          [currentPart]: { ...prev[currentPart], quantity },
        }));
        botMessage.text = `Got it! You want ${quantity} ${qtyType} part${quantity > 1 ? "s" : ""}. What's your budget for this part?`;
        botMessage.buttons = budgetOptions.map((budget) => ({
          label: budget.label,
          value: budget.label,
        }));
        setConversationState(`budget_${currentPart}_${qtyType}`);
        break;

      case `budget_first_car`:
      case `budget_first_truck`:
      case `budget_first_motorcycle`:
      case `budget_second_car`:
      case `budget_second_truck`:
      case `budget_second_motorcycle`:
        const budgetType = conversationState.split("_")[2];
        const selectedBudgetOption = budgetOptions.find((b) => b.label === value);
        setOrder((prev) => ({
          ...prev,
          [currentPart]: { ...prev[currentPart], budget: selectedBudgetOption },
        }));
        const nearbySuppliers = partsSuppliers[budgetType].filter(
          (s) => s.price * order[currentPart].quantity >= selectedBudgetOption.min && s.price * order[currentPart].quantity <= selectedBudgetOption.max
        );
        if (nearbySuppliers.length === 0) {
          botMessage.text = `Sorry, no suppliers match your budget of ${value} for ${order[currentPart].quantity} ${budgetType} part${order[currentPart].quantity > 1 ? "s" : ""}. Try a different budget or quantity.`;
          botMessage.buttons = budgetOptions.map((budget) => ({
            label: budget.label,
            value: budget.label,
          }));
          setConversationState(`budget_${currentPart}_${budgetType}`);
        } else {
          botMessage.text = `Here are nearby suppliers within your budget (${value}):\n${nearbySuppliers
            .map((s) => `${s.name} (${s.location}, $${s.price * order[currentPart].quantity})`)
            .join("\n")}\n\nClick an image to select a supplier!`;
          botMessage.images = nearbySuppliers.map((s) => s.image);
          botMessage.names = nearbySuppliers.map((s) => s.name);
          botMessage.values = nearbySuppliers.map((s) => s.name.toLowerCase());
          setConversationState(`supplier_${currentPart}_${budgetType}`);
        }
        break;

      case `supplier_first_car`:
      case `supplier_first_truck`:
      case `supplier_first_motorcycle`:
      case `supplier_second_car`:
      case `supplier_second_truck`:
      case `supplier_second_motorcycle`:
        const type = conversationState.split("_")[2];
        const filteredParts = partOptions[type].filter(
          (p) => p.price * order[currentPart].quantity >= order[currentPart].budget.min && p.price * order[currentPart].quantity <= order[currentPart].budget.max
        );
        if (filteredParts.length === 0) {
          botMessage.text = `Sorry, no ${type} parts match your budget of ${order[currentPart].budget.label} for ${order[currentPart].quantity} item${order[currentPart].quantity > 1 ? "s" : ""}. Try a different budget.`;
          botMessage.buttons = budgetOptions.map((budget) => ({
            label: budget.label,
            value: budget.label,
          }));
          setConversationState(`budget_${currentPart}_${type}`);
        } else {
          botMessage.text = `Please select your ${type} part specifications by clicking an image (within ${order[currentPart].budget.label}).`;
          botMessage.images = filteredParts.map((p) => p.image);
          botMessage.names = filteredParts.map((p) => p.name);
          botMessage.values = filteredParts.map((p) => p.name.toLowerCase());
          setConversationState(`specifications_${currentPart}_${type}`);
        }
        break;

      case `specifications_first_car`:
      case `specifications_first_truck`:
      case `specifications_first_motorcycle`:
        const fType1 = conversationState.split("_")[2];
        const selectedPart1 = partOptions[fType1].find((p) => p.name.toLowerCase() === value);
        setOrder((prev) => ({
          ...prev,
          first: { ...prev.first, part: selectedPart1 },
        }));
        botMessage.text = `Great! First part selected: ${selectedPart1.name} for ${fType1}. Now, let's select the second vehicle part. What type of vehicle?`;
        botMessage.buttons = vehicleOptions.map((vehicle) => ({
          label: vehicle,
          value: vehicle.toLowerCase(),
        }));
        setCurrentPart("second");
        setConversationState("vehicleSelection_second");
        break;

      case `specifications_second_car`:
      case `specifications_second_truck`:
      case `specifications_second_motorcycle`:
        const fType2 = conversationState.split("_")[2];
        const selectedPart2 = partOptions[fType2].find((p) => p.name.toLowerCase() === value);
        setOrder((prev) => ({
          ...prev,
          second: { ...prev.second, part: selectedPart2 },
        }));
        const totalCostFirst = order.first.part ? order.first.part.price * order.first.quantity : 0;
        const totalCostSecond = selectedPart2.price * order.second.quantity;
        const totalCost = totalCostFirst + totalCostSecond;
        botMessage.text = `Thank you! Your order is confirmed:\n- ${order.first.quantity} ${fType2 === order.first.vehicle ? fType2 : order.first.vehicle} part (${order.first.part.name}), Total: $${totalCostFirst}\n- ${order.second.quantity} ${fType2} part (${selectedPart2.name}), Total: $${totalCostSecond}\nGrand Total: $${totalCost}\nRedirecting...`;
        setMessages((prev) => [...prev, botMessage]);
        setConversationState("greeting");
        setOrder({
          first: { vehicle: "", quantity: 1, budget: null, part: null },
          second: { vehicle: "", quantity: 1, budget: null, part: null },
        });
        setCurrentPart("first");
        setTimeout(() => {
          router.push("/checkout");
        }, 2000);
        return;

      default:
        botMessage.text = "Oops! Would you like to order vehicle parts?";
        botMessage.buttons = [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ];
        setConversationState("greeting");
    }

    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-black">
      <div className="bg-[#2a1548] h-[500px] w-[300px] rounded-xl flex flex-col overflow-hidden">
        <div className="z-20 w-full h-full px-2 py-3 overflow-y-auto relative">
          <div className="absolute inset-0 z-10 overflow-hidden">
            {randomLefts.length > 0 &&
              balls.map((ball, index) => (
                <motion.div
                  key={index}
                  className="absolute bottom-0 w-6 h-6 rounded-full bg-fuchsia-500 blur-lg"
                  style={{ left: `${randomLefts[index]}px` }}
                  initial={{ y: 100 }}
                  animate={{ y: -700 }}
                  transition={{
                    duration: 6 + Math.random() * 8,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                    delay: index * 0.5,
                  }}
                />
              ))}
          </div>
          <div className="relative z-20">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 rounded-lg text-sm whitespace-pre-line max-w-[80%] ${
                    msg.sender === "user" ? "bg-cyan-800 text-white" : "bg-gray-200/20 text-white"
                  }`}
                >
                  {msg.text}
                  {msg.images && (
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {msg.images.map((img, idx) => (
                        <div key={idx} className="text-center">
                          <img
                            src={img}
                            alt={msg.names[idx]}
                            className={`w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity ${
                              msg.values ? "hover:border-2 hover:border-fuchsia-600" : ""
                            }`}
                            onClick={msg.values ? () => handleImageClick(msg.values[idx]) : undefined}
                          />
                          {msg.names && <p className="text-xs mt-1">{msg.names[idx]}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                  {msg.buttons && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.buttons.map((btn, i) => (
                        <button
                          key={i}
                          onClick={() => handleImageClick(btn.value)}
                          className="bg-[#2a1548] text-white text-xs px-2 py-1 rounded hover:bg-[#3d1f68]"
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="text-[10px] text-right mt-1 opacity-70">{msg.timestamp}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>
        </div>
      </div>
    </div>
  );
}