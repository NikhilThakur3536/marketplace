"use client"

import { useState } from "react"
import { Layout } from "../../components/Layout"
import { Card, CardContent } from "../../components/Card"
import { Button } from "../../components/Button"
import { Badge } from "../../components/Badge"
import { Icon } from "../../components/Icon"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function ProductPage(props) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")

  // Mock product data
  const product = {
    id: props.params.id,
    name: "Brembo Front Brake Pad Set P85121 for VW Ameo, Polo, Vento (1.2L)",
    brand: "Brembo",
    price: "₹2,450",
    originalPrice: "₹3,200",
    discount: "-23%",
    rating: 4.5,
    reviews: 128,
    description:
      "High-performance brake pads designed specifically for VW models. These pads offer superior stopping power, reduced brake dust, and longer life compared to standard pads.",
    specifications: [
      { name: "Material", value: "Semi-metallic" },
      { name: "Position", value: "Front" },
      { name: "Compatibility", value: "VW Ameo, Polo, Vento (1.2L)" },
      { name: "Warranty", value: "1 Year" },
      { name: "Package Contents", value: "4 Brake Pads" },
    ],
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    inStock: true,
    freeShipping: true,
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const addToCart = () => {
    router.push("/cart")
  }

  return (
    <Layout showBackButton title="Product Details">
      <div className="p-4">
        {/* Product Images */}
        <div className="relative mb-4">
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-64 object-contain"
            />
          </div>
          {product.discount && (
            <Badge variant="danger" className="absolute top-2 right-2">
              {product.discount}
            </Badge>
          )}
          <div className="absolute bottom-2 right-2 flex gap-2">
            <button className="bg-slate-700/80 backdrop-blur-sm p-2 rounded-full">
              <Icon name="heart" size={20} className="text-white" />
            </button>
            <button className="bg-slate-700/80 backdrop-blur-sm p-2 rounded-full">
              <Icon name="share" size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="mb-4">
          <div className="text-sm text-blue-400 mb-1">{product.brand}</div>
          <h1 className="text-xl font-semibold mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              <Icon name="star" size={16} className="text-yellow-400" />
              <span className="ml-1 text-sm">{product.rating}</span>
            </div>
            <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">{product.price}</span>
            <span className="text-gray-400 line-through">{product.originalPrice}</span>
          </div>
          {product.freeShipping && (
            <div className="mt-2">
              <Badge variant="success">Free Shipping</Badge>
            </div>
          )}
        </div>

        {/* Quantity Selector */}
        <Card className="mb-4">
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Quantity</span>
              <div className="flex items-center">
                <button
                  onClick={decrementQuantity}
                  className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded-l-md"
                  disabled={quantity <= 1}
                >
                  <Icon name="minus" size={16} />
                </button>
                <div className="w-10 h-8 flex items-center justify-center bg-slate-700 border-x border-slate-600">
                  {quantity}
                </div>
                <button
                  onClick={incrementQuantity}
                  className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded-r-md"
                >
                  <Icon name="plus" size={16} />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="mb-4">
          <div className="flex border-b border-slate-700">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "description" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400"
              }`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "specifications" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400"
              }`}
              onClick={() => setActiveTab("specifications")}
            >
              Specifications
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "reviews" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </button>
          </div>
          <div className="py-4">
            {activeTab === "description" && <p className="text-sm text-gray-300">{product.description}</p>}
            {activeTab === "specifications" && (
              <div className="space-y-2">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-400">{spec.name}</span>
                    <span className="text-white">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-400">Reviews coming soon</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">
            Buy Now
          </Button>
          <Button variant="primary" className="flex-1" onClick={addToCart}>
            Add to Cart
          </Button>
        </div>
      </div>
    </Layout>
  )
}
