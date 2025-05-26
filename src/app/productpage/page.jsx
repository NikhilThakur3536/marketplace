"use client"

import { useState } from "react"
import Button from "./components/Button"
import Card from "./components/Card"
import Badge from "./components/Badge"
import Tabs from "./components/Tabs"
import Avatar from "./components/Avtar"
import Input from "./components/Input"
import Modal from "./components/Modal"
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  MessageCircle,
  Send,
  Shield,
  Truck,
  RotateCcw,
  Zap,
  Battery,
  Camera,
  Wifi,
  X,
} from "lucide-react"

export default function ProductPage() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("description")
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "owner",
      message: "Hi! I'm Alex, the owner. How can I help you with this product?",
      timestamp: "2:30 PM",
    },
  ])
  const [newMessage, setNewMessage] = useState("")

  const productImages = [
    "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1705640288/Croma%20Assets/Communication/Mobiles/Images/303838_oqpio4.png?tr=w-1000",
    "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1705640288/Croma%20Assets/Communication/Mobiles/Images/303838_oqpio4.png?tr=w-1000",
    "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1705640288/Croma%20Assets/Communication/Mobiles/Images/303838_oqpio4.png?tr=w-1000",
    "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1705640288/Croma%20Assets/Communication/Mobiles/Images/303838_oqpio4.png?tr=w-1000",
  ]

  const specifications = {
    Display: '6.7" OLED, 120Hz, 3200x1440',
    Processor: "Snapdragon 8 Gen 3",
    RAM: "12GB LPDDR5X",
    Storage: "256GB UFS 4.0",
    Camera: "200MP Main, 50MP Ultra-wide, 10MP Telephoto",
    Battery: "5000mAh with 45W fast charging",
    OS: "Android 14",
    Connectivity: "5G, Wi-Fi 7, Bluetooth 5.3",
    Dimensions: "163.4 x 78.1 x 8.9 mm",
    Weight: "233g",
    "Water Resistance": "IP68",
    Colors: "Phantom Black, Cream, Green, Lavender",
  }

  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      comment: "Amazing phone! The camera quality is outstanding and battery life is excellent.",
      date: "2 days ago",
    },
    {
      id: 2,
      name: "Mike Chen",
      rating: 4,
      comment: "Great performance and display. Only wish it had a headphone jack.",
      date: "1 week ago",
    },
    {
      id: 3,
      name: "Emma Davis",
      rating: 5,
      comment: "Fast shipping and exactly as described. Highly recommend this seller!",
      date: "2 weeks ago",
    },
  ]

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: chatMessages.length + 1,
        sender: "user",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setChatMessages([...chatMessages, message])
      setNewMessage("")

      // Simulate owner response
      setTimeout(() => {
        const ownerResponse = {
          id: chatMessages.length + 2,
          sender: "owner",
          message: "Thanks for your message! I'll get back to you shortly with more details.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
        setChatMessages((prev) => [...prev, ownerResponse])
      }, 1000)
    }
  }

  const tabContent = {
    description: (
      <Card className="bg-gray-800 border-gray-700">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-white">Product Description</h3>
          <div className="space-y-4 text-gray-300">
            <p>
              The Samsung Galaxy S24 Ultra represents the pinnacle of smartphone technology, combining cutting-edge
              innovation with premium design. This flagship device features a stunning 6.7-inch Dynamic AMOLED 2X
              display with 120Hz refresh rate, delivering incredibly smooth visuals and vibrant colors.
            </p>
            <p>
              Powered by the latest Snapdragon 8 Gen 3 processor and 12GB of RAM, this phone handles everything from
              intensive gaming to professional photography with ease. The revolutionary 200MP main camera system
              captures stunning photos and 8K videos, while the S Pen integration makes it perfect for productivity and
              creativity.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">Fast Performance</span>
              </div>
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-purple-400" />
                <span className="text-sm">Pro Camera</span>
              </div>
              <div className="flex items-center gap-2">
                <Battery className="w-5 h-5 text-green-400" />
                <span className="text-sm">All-Day Battery</span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-blue-400" />
                <span className="text-sm">5G Ready</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    ),
    specifications: (
      <Card className="bg-gray-800 border-gray-700">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-white">Technical Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-700">
                <span className="font-medium text-gray-300">{key}</span>
                <span className="text-gray-400">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    ),
    reviews: (
      <Card className="bg-gray-800 border-gray-700">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-white">Customer Reviews</h3>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-700 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{review.name}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">{review.date}</span>
                </div>
                <p className="text-gray-300">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    ),
    shipping: (
      <Card className="bg-gray-800 border-gray-700">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-white">Shipping & Returns</h3>
          <div className="space-y-4 text-gray-300">
            <div>
              <h4 className="font-medium mb-2">Shipping Options</h4>
              <ul className="space-y-1 text-sm">
                <li>• Standard Shipping (5-7 business days) - FREE</li>
                <li>• Express Shipping (2-3 business days) - $9.99</li>
                <li>• Overnight Shipping (1 business day) - $19.99</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Return Policy</h4>
              <ul className="space-y-1 text-sm">
                <li>• 30-day return window</li>
                <li>• Free returns for defective items</li>
                <li>• Original packaging required</li>
                <li>• Refund processed within 5-7 business days</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    ),
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={productImages[selectedImage] || "/placeholder.svg"}
                alt="Product"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-800 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-blue-500" : "border-transparent hover:border-gray-600"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="primary" className="mb-2">
                Electronics
              </Badge>
              <h1 className="text-3xl font-bold mb-2">Samsung Galaxy S24 Ultra</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-400">(4.8) • 1,234 reviews</span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-green-400">$1,199.99</span>
                <span className="text-xl text-gray-400 line-through">$1,399.99</span>
                <Badge variant="danger">14% OFF</Badge>
              </div>
            </div>

            {/* Brand & Owner Info */}
            <Card className="bg-gray-800 border-gray-700">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar src="/placeholder.svg?height=48&width=48" alt="Alex Thompson" fallback="AT" size="lg" />
                    <div>
                      <h3 className="font-semibold text-white">Alex Thompson</h3>
                      <p className="text-sm text-gray-400">Verified Seller • 4.9★ (2,456 sales)</p>
                      <p className="text-sm text-gray-400">Brand: Samsung Official</p>
                    </div>
                  </div>
                  <Button variant="primary" onClick={() => setIsChatOpen(true)}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat with Owner
                  </Button>
                </div>
              </div>
            </Card>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                    +
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="primary" className="flex-1">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="success" className="flex-1">
                  Buy Now
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-green-400" />
                <span>2 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Truck className="w-4 h-4 text-blue-400" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RotateCcw className="w-4 h-4 text-yellow-400" />
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-8">
          <Tabs
            tabs={[
              { id: "description", label: "Description" },
              { id: "specifications", label: "Specifications" },
              { id: "reviews", label: "Reviews" },
              { id: "shipping", label: "Shipping" },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <div className="mt-6">{tabContent[activeTab]}</div>
        </div>

        {/* Chat Modal */}
        <Modal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)}>
          <Card className="w-full max-w-md h-96 bg-gray-800 border-gray-700 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Chat with Alex Thompson</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsChatOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 flex flex-col p-4">
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"
                      }`}
                    >
                      <p>{message.message}</p>
                      <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button variant="primary" size="sm" onClick={sendMessage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </Modal>
      </div>
    </div>
  )
}
