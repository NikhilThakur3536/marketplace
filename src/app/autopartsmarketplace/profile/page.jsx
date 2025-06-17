"use client"

import { Layout } from "../components/Layout"
import { Card, CardContent } from "../components/Card"
import { Button } from "../components/Button"
import { Icon } from "../components/Icon"
import { Badge } from "../components/Badge"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()

  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    avatar: "/placeholder.svg?height=100&width=100",
    memberSince: "Jan 2023",
  }

  const menuItems = [
    {
      icon: "truck",
      title: "My Orders",
      description: "Track, return, or buy things again",
      onClick: () => router.push("/orders"),
      badge: "4",
    },
    {
      icon: "heart",
      title: "My Wishlist",
      description: "Products you have saved",
      onClick: () => router.push("/favorites"),
      badge: "12",
    },
    {
      icon: "settings",
      title: "Account Settings",
      description: "Address, payment methods, and more",
      onClick: () => router.push("/settings"),
    },
    {
      icon: "bell",
      title: "Notifications",
      description: "Manage your notification preferences",
      onClick: () => router.push("/notifications"),
      badge: "2",
    },
    {
      icon: "help",
      title: "Help & Support",
      description: "FAQs, contact support",
      onClick: () => router.push("/support"),
    },
  ]

  return (
    <Layout title="My Profile">
      <div className="p-4">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-700">
                  <Image
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                  <Icon name="edit" size={12} className="text-white" />
                </button>
              </div>
              <div>
                <h2 className="text-lg font-medium">{user.name}</h2>
                <p className="text-sm text-gray-400">{user.email}</p>
                <p className="text-sm text-gray-400">{user.phone}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-xs text-gray-400">Member since {user.memberSince}</div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => router.push("/profile/edit")}
              >
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <Card key={index} onClick={item.onClick} className="cursor-pointer hover:bg-slate-750">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                    <Icon name={item.icon} size={20} className="text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{item.title}</h3>
                      {item.badge && (
                        <Badge variant="info" className="ml-2">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                  <Icon name="chevronRight" size={16} className="text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Logout Button */}
        <div className="mt-6">
          <Button
            variant="outline"
            fullWidth
            className="text-red-400 border-red-400/30 hover:bg-red-400/10"
          >
            <Icon name="logout" size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </Layout>
  )
}
