"use client";

import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Card, CardContent } from "../components/Card";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { Badge } from "../components/Badge";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function OrdersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState({});
  const [detailsError, setDetailsError] = useState({});
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        setError("Please log in to view your orders.");
        setLoading(false);
        return;
      }

      try {
        const payload = {
          languageId: "2bfa9d89-61c4-401e-aae3-346627460558",
        };

        const response = await axios.post(
          `${BASE_URL}/user/order/list`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Log raw API response to inspect the data structure
        // console.log("Raw API Response:", response.data?.data?.rows);

        // Normalize orders to ensure items is always an array
        const fetchedOrders = (response.data?.data?.rows || []).map((order) => ({
          ...order,
          items: Array.isArray(order.items) ? order.items : [],
        }));
        // console.log("Fetched Orders:", fetchedOrders); // Log normalized orders
        setOrders(fetchedOrders);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch orders:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setError(err.response?.data?.message || "Failed to load orders. Please try again.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const fetchOrderDetails = async (orderId) => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      setDetailsError((prev) => ({ ...prev, [orderId]: "Please log in to view order details." }));
      return;
    }

    try {
      setDetailsLoading((prev) => ({ ...prev, [orderId]: true }));
      setDetailsError((prev) => ({ ...prev, [orderId]: null }));

      const payload = {
        languageId: "2bfa9d89-61c4-401e-aae3-346627460558",
        orderId,
      };

      const response = await axios.post(
        `${BASE_URL}/user/order/getv1`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const fetchedOrder = response.data?.data || null;
      setOrderDetails((prev) => ({ ...prev, [orderId]: fetchedOrder }));
      setDetailsLoading((prev) => ({ ...prev, [orderId]: false }));
    } catch (err) {
      console.error("Failed to fetch order details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setDetailsError((prev) => ({
        ...prev,
        [orderId]: err.response?.data?.message || "Failed to load order details.",
      }));
      setDetailsLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const filteredOrders = activeTab === "all" ? orders : orders.filter((order) => order.status === activeTab);

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="success">ACTIVE</Badge>;
        case "COMPLETED":
          return <Badge variant="info">COMPLETED</Badge>;
      // case "cancelled":
      //   return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Layout showBackButton title="My Orders">
      <div className="p-4">
        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Icon name="loader" size={48} className="text-gray-400 animate-spin" />
            <p className="text-gray-400 mt-2">Loading orders...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Icon name="alert-circle" size={48} className="text-red-400" />
            <p className="text-red-400 mt-2">{error}</p>
            <Button variant="primary" onClick={() => router.push("/autopartsmarketplace/login")} className="mt-4">
              Log In
            </Button>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              // console.log(`Order ID: ${order.id}, order.items:`, order); // Log order.items
              return (
                <Card key={order.id} className="overflow-hidden">
                  <div className="bg-slate-700 px-4 py-3 flex justify-between items-center">
                    <div>
                      <div className="text-xs text-gray-400">Order ID</div>
                      <div className="font-medium">{order.id}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">{order.date || "N/A"}</div>
                      {getStatusBadge(order.orderProductDetails?.[0]?.status)}
                    </div>
                  </div>
                  <CardContent className="p-0">
                    <div className="p-4 border-b border-slate-700">
                      {Array.isArray(order.orderProducts) && order.orderProducts.length > 0 ? (
                        order.orderProducts.map((item) => {
                          // console.log(`Order ID: ${order.id}, item:`, item); // Log each item
                          return (
                            <div key={item.id} className="flex items-center gap-3 mb-3 last:mb-0">
                              <div className="w-12 h-12 bg-slate-700 rounded-md overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.image || "/placeholder.jpg"}
                                  alt={
                                    Array.isArray(item.orderProductDetails) && item.orderProductDetails.length > 0
                                      ? item.orderProductDetails[0]?.name || "Item"
                                      : item.name || "Item"
                                  }
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-sm font-medium line-clamp-1">
                                  {Array.isArray(item.orderProductDetails) && item.orderProductDetails.length > 0
                                    ? item.orderProductDetails[0]?.name || "Unknown Item"
                                    : item.name || "Unknown Item"}
                                </h3>
                                <p className="text-xs text-gray-400">Qty: {Math.floor(item.quantity) || 1}</p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-gray-400 text-sm">No items in this order.</p>
                      )}
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <div className="text-xs text-gray-400">Total</div>
                        <div className="font-medium">{order.totalAmount || "N/A"}</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (selectedOrderId === order.id) {
                            setSelectedOrderId(null); // Hide details if already shown
                          } else {
                            setSelectedOrderId(order.id);
                            fetchOrderDetails(order.id); // Fetch details if not already fetched
                          }
                        }}
                      >
                        {selectedOrderId === order.id ? "Hide Details" : detailsLoading[order.id] ? "Loading..." : "View Details"}
                      </Button>
                    </div>
                    {/* Order Details Section */}
                    {selectedOrderId === order.id && (
                      <div className="p-4 border-t border-slate-700">
                        {detailsLoading[order.id] ? (
                          <div className="flex items-center justify-center py-4">
                            <Icon name="loader" size={24} className="text-gray-400 animate-spin" />
                            <p className="text-gray-400 ml-2">Loading order details...</p>
                          </div>
                        ) : detailsError[order.id] ? (
                          <div className="flex items-center justify-center py-4">
                            <Icon name="alert-circle" size={24} className="text-red-400" />
                            <p className="text-red-400 ml-2">{detailsError[order.id]}</p>
                          </div>
                        ) : orderDetails[order.id] ? (
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Order Details</h3>
                            <div>
                              <div className="text-xs text-gray-400">Order ID</div>
                              <div className="font-medium">{orderDetails[order.id].id || order.id}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-400">Status</div>
                              {getStatusBadge(orderDetails[order.id]?.orderStatus || order.orderProductDetails?.[0]?.status)}
                              {/* {console.log("status",orderDetails)} */}
                            </div>
                            <div>
                              <div className="text-xs text-gray-400">Total Amount</div>
                              <div className="font-medium">{orderDetails[order.id].totalAmount || order.totalAmount || "N/A"}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-400">Items</div>
                              {Array.isArray(orderDetails[order.id].orderProducts) && orderDetails[order.id].orderProducts.length > 0 ? (
                                orderDetails[order.id].orderProducts.map((item) => (
                                  <div key={item.id} className="flex items-center gap-3 mb-3 last:mb-0">
                                    <div className="w-12 h-12 bg-slate-700 rounded-md overflow-hidden flex-shrink-0">
                                      <Image
                                        src={item.image || "/placeholder.jpg"}
                                        alt={
                                          Array.isArray(item.orderProductDetails) && item.orderProductDetails.length > 0
                                            ? item.orderProductDetails[0]?.name || "Item"
                                            : item.name || "Item"
                                        }
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="text-sm font-medium line-clamp-1">
                                        {Array.isArray(item.orderProductDetails) && item.orderProductDetails.length > 0
                                          ? item.orderProductDetails[0]?.name || "Unknown Item"
                                          : item.name || "Unknown Item"}
                                      </h4>
                                      <p className="text-xs text-gray-400">Qty: {Math.floor(item.quantity) || 1}</p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-gray-400 text-sm">No items in this order.</p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-400 text-sm">No details available.</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
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
              Începeți cumpărăturile
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}