"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import BottomNav from "../components/BottomNav";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detailsError, setDetailsError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view your orders.");
        setLoading(false);
        return;
      }

      try {
        const payload = {
          languageId: "2bfa9d89-61c4-401e-aae3-346627460558",
        };

        const response = await axios.post(`${BASE_URL}/user/order/listv2`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const fetchedOrders = response.data?.data?.rows || [];
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError(err.response?.data?.message || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const fetchOrderDetails = async (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setDetailsError("Please log in to view order details.");
      return;
    }

    try {
      setDetailsLoading(true);
      setDetailsError(null);

      const payload = {
        orderId,
      };

      const response = await axios.post(`${BASE_URL}/user/order/getv2`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setSelectedOrder(response.data?.data);
    } catch (err) {
      console.error("Failed to fetch order details:", err);
      setDetailsError(err.response?.data?.message || "Failed to load order details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const getProductName = (product) => {
    const detail = product.orderProductDetails?.find(
      (d) => d.languageId === "2bfa9d89-61c4-401e-aae3-346627460558"
    );
    return detail?.name || product.varient?.varientLanguages?.[0]?.name || "Unknown Product";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <BottomNav />
      <div className="max-w-md w-full min-h-screen bg-gray-100 p-2 flex flex-col gap-4">
        {/* Header */}
        <div className="w-full rounded-xl px-4 bg-gradient-to-r from-green-400 to-green-500">
          <div className="p-4">
            <span className="font-bold text-white text-xl">Your Orders</span>
          </div>
        </div>

        {/* Orders List */}
        <div className="w-full flex flex-col gap-4 p-2 flex-1 overflow-y-auto">
          {orders.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">You have no orders yet.</p>
          ) : (
            orders.map((order) => (
              <button
                key={order.id}
                onClick={() => fetchOrderDetails(order.id)}
                className="w-full bg-white rounded-xl p-4 shadow-sm hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <p className="text-lg font-semibold text-gray-800">
                      Order #{order.orderNumber}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.orderDate)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: {order.paymentStatus || "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">
                      ${order.totalAmount?.toFixed(2)}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-11/12 max-w-md max-h-[80vh] overflow-y-auto">
              {detailsLoading ? (
                <div className="text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
                  <p className="mt-2 text-gray-600">Loading order details...</p>
                </div>
              ) : detailsError ? (
                <div className="text-center">
                  <p className="text-red-500 font-medium">{detailsError}</p>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="mt-4 px-4 py-2 bg-green-400 text-white rounded-lg hover:bg-green-500 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      Order #{selectedOrder.orderNumber}
                    </h2>
                    <button onClick={() => setSelectedOrder(null)}>
                      <X color="gray" size={24} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Date: {formatDate(selectedOrder.orderDate)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Payment: {selectedOrder.paymentType} ({selectedOrder.paymentStatus})
                      </p>
                      <p className="text-sm text-gray-500">
                        Token: {selectedOrder.tokenNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        Invoice: {selectedOrder.invoiceNumber}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Items</h3>
                      {selectedOrder.orderProducts?.map((product) => (
                        <div
                          key={product.id}
                          className="flex justify-between items-center border-t py-2"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {getProductName(product)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Qty: {parseFloat(product.quantity).toFixed(0)}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-blue-600">
                            ${product.price?.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-semibold text-gray-800">Total</p>
                        <p className="text-lg font-bold text-blue-600">
                          ${selectedOrder.totalAmount?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="w-full mt-4 py-2 bg-gradient-to-r from-[#9FD770] to-[#64C058] text-white rounded-lg hover:from-orange-600 hover:to-orange-800 transition-colors"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}