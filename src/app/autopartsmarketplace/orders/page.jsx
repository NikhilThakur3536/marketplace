"use client"

import { useState } from "react"
import { Layout } from "../components/Layout"
import { Card, CardContent } from "../components/Card"
import { Button } from "../components/Button"
import { Icon } from "../components/Icon"
import { Badge } from "../components/Badge"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function OrdersPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")

  const orders = [
    {
      id: "ORD123456",
      date: "15 May 2023",
      status: "delivered",
      total: "₹5,340",
      items: [
        {
          id: "1",
          name: "Brembo Front Brake Pad Set P85121",
          image: "/placeholder.svg?height=80&width=80",
          quantity: 1,
        },
        {
          id: "2",
          name: "Brembo Front Brake Pad Set P54030",
          image: "/placeholder.svg?height=80&width=80",
          quantity: 1,
        },
      ],
    },
    {
      id: "ORD123457",
      date: "10 May 2023",
      status: "processing",
      total: "₹2,890",
      items: [
        {
          id: "3",
          name: "Brembo Front Brake Pad Set P28034",
          image: "/placeholder.svg?height=80&width=80",
          quantity: 1,
        },
      ],
    },
    {
      id: "ORD123458",
      date: "5 May 2023",
      status: "cancelled",
      total: "₹3,120",
      items: [
        {
          id: "4",
          name: "Brembo Front Brake Pad Set P28023",
          image: "/placeholder.svg?height=80&width=80",
          quantity: 1,
        },
      ],
    },
  ]

  const filteredOrders = activeTab === "all" ? orders : orders.filter((order) => order.status === activeTab)

  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return <Badge variant="success">Delivered</Badge>
      case "processing":
        return <Badge variant="info">Processing</Badge>
      case "cancelled":
        return <Badge variant="danger">Cancelled</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <Layout showBackButton title="My Orders">
      <div className="p-4">
        {/* Tabs */}
        <div className="flex overflow-x-auto scrollbar-hide mb-4 pb-1">
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === "all" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Orders
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === "processing" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("processing")}
          >
            Processing
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === "delivered" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("delivered")}
          >
            Delivered
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === "cancelled" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("cancelled")}
          >
            Cancelled
          </button>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <div className="bg-slate-700 px-4 py-3 flex justify-between items-center">
                  <div>
                    <div className="text-xs text-gray-400">Order ID</div>
                    <div className="font-medium">{order.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">{order.date}</div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
                <CardContent className="p-0">
                  <div className="p-4 border-b border-slate-700">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 mb-3 last:mb-0">
                        <div className="w-12 h-12 bg-slate-700 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium line-clamp-1">{item.name}</h3>
                          <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <div className="text-xs text-gray-400">Total</div>
                      <div className="font-medium">{order.total}</div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/orders/${order.id}`)}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-slate-800 rounded-full p-6 mb-4">
              <Icon name="package" size={48} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-medium mb-2">No orders found</h2>
            <p className="text-gray-400 text-center mb-6">
              {activeTab === "all" ? "You haven't placed any orders yet." : `You don't have any ${activeTab} orders.`}
            </p>
            <Button variant="primary" onClick={() => router.push("/")}>
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </Layout>
  )
}
