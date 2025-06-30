"use client"

import Layout from "../components/Layout"
import { Card, CardContent } from "../components/Card"
import { Button } from "../components/Button"
import { Icon } from "../components/Icon"
import { Badge } from "../components/Badge"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ProfilePage() {
  const router = useRouter()
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [addressError, setAddressError] = useState(null)
  const [cartMessage, setCartMessage] = useState("")
  const [isEdit, setIsEdit] = useState(false)
  const [formData, setFormData] = useState({
    customerAddressId: "",
    name: "",
    addressLine1: "",
    addressLine2: "",
    road: "",
    landmark: "",
    mobile: "",
    defaultAddress: false,
    label: "",
    latitude: "",
    longitude: "",
  })

  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    avatar: "/placeholder.svg?height=100&width=100",
    memberSince: "Jan 2023",
  }

  const BASE_URL = "https://api.autopartsmarketplace.com" // Replace with your actual API base URL

  const fetchAddresses = async () => {
    // Placeholder for fetching addresses; implement as needed
    // console.log("Fetching addresses...")
  }

  const handleAddressSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("userToken") || localStorage.getItem("token")
      if (!token) {
        router.push("/autopartsmarketplace/login")
        return
      }

      const url = isEdit
        ? `${BASE_URL}/user/customerAddress/edit`
        : `${BASE_URL}/user/customerAddress/add`
      const payload = isEdit
        ? {
            customerAddressId: formData.customerAddressId,
            name: formData.name,
            addressLine1: formData.addressLine1,
            landmark: formData.landmark,
            defaultAddress: formData.defaultAddress,
          }
        : {
            name: formData.name,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            road: formData.road,
            landmark: formData.landmark,
            mobile: formData.mobile,
            defaultAddress: formData.defaultAddress,
            label: formData.label,
            latitude: formData.latitude,
            longitude: formData.longitude,
          }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${isEdit ? "update" : "add"} address.`)
      }

      await fetchAddresses()
      setShowAddressModal(false)
      setAddressError(null)
      setCartMessage(`Address ${isEdit ? "updated" : "added"} successfully!`)
      setTimeout(() => setCartMessage(""), 3000)
    } catch (err) {
      setAddressError(err.message || `Failed to ${isEdit ? "update" : "add"} address.`)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const openAddressModal = (edit = false, address = {}) => {
    setIsEdit(edit)
    setFormData({
      customerAddressId: address.customerAddressId || "",
      name: address.name || "",
      addressLine1: address.addressLine1 || "",
      addressLine2: address.addressLine2 || "",
      road: address.road || "",
      landmark: address.landmark || "",
      mobile: address.mobile || "",
      defaultAddress: address.defaultAddress || false,
      label: address.label || "",
      latitude: address.latitude || "",
      longitude: address.longitude || "",
    })
    setShowAddressModal(true)
  }

  const menuItems = [
    {
      icon: "truck",
      title: "My Orders",
      description: "Track, return, or buy things again",
      onClick: () => router.push("/autopartsmarketplace/orders"),
    },
    {
      icon: "heart",
      title: "My Wishlist",
      description: "Products you have saved",
      onClick: () => router.push("/autopartsmarketplace/favorites"),
    },
    {
      icon: "settings",
      title: "Account Settings",
      description: "Address, payment methods, and more",
      onClick: () => openAddressModal(false), 
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

        {/* Address Modal */}
        {showAddressModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardContent className="p-6">
                <h2 className="text-lg font-medium mb-4">{isEdit ? "Edit Address" : "Add Address"}</h2>
                {addressError && (
                  <p className="text-red-400 mb-4">{addressError}</p>
                )}
                {cartMessage && (
                  <p className="text-green-400 mb-4">{cartMessage}</p>
                )}
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded bg-slate-800 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Address Line 1</label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded bg-slate-800 text-white"
                      required
                    />
                  </div>
                  {!isEdit && (
                    <>
                      <div>
                        <label className="block text-sm font-medium">Address Line 2</label>
                        <input
                          type="text"
                          name="addressLine2"
                          value={formData.addressLine2}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded bg-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Road</label>
                        <input
                          type="text"
                          name="road"
                          value={formData.road}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded bg-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Mobile</label>
                        <input
                          type="text"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded bg-slate-800 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Label</label>
                        <input
                          type="text"
                          name="label"
                          value={formData.label}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded bg-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Latitude</label>
                        <input
                          type="text"
                          name="latitude"
                          value={formData.latitude}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded bg-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Longitude</label>
                        <input
                          type="text"
                          name="longitude"
                          value={formData.longitude}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded bg-slate-800 text-white"
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-sm font-medium">Landmark</label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded bg-slate-800 text-white"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="defaultAddress"
                      checked={formData.defaultAddress}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label className="text-sm font-medium">Set as Default Address</label>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddressModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {isEdit ? "Update Address" : "Add Address"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

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