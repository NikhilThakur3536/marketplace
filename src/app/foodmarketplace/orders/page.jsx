"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Package, ChevronDown, ChevronUp } from "lucide-react";
import BottomNav from "../components/BottomNavbar";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState({});
  const [detailsError, setDetailsError] = useState({});

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

        const fetchedOrders = response.data?.data?.rows || [];
        setOrders(fetchedOrders);
        console.log( response.data?.data?.rows)
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
    const token = localStorage.getItem("token");
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

      console.log("Order details API response:", response.data);

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

  const handleOrderClick = (orderId) => {
    if (selectedOrderId === orderId) {
      setSelectedOrderId(null); 
    } else {
      setSelectedOrderId(orderId);
      if (!orderDetails[orderId]) {
        fetchOrderDetails(orderId); 
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    });
  };

  return (
    
    <div className="flex justify-center min-h-screen bg-gray-100">
        <BottomNav/>
      <div className="max-w-md w-full bg-white p-4 flex flex-col gap-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 w-full flex items-center gap-2 px-4 py-4 rounded-xl">
          <Package color="white" size={24} />
          <span className="text-white text-2xl font-semibold">Your Orders</span>
        </div>

        {/* Orders List */}
        <div className="w-full flex flex-col gap-4">
          {loading ? (
            <div className="text-center text-gray-500 py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2">Loading orders...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8 bg-red-50 rounded-xl">
              <p>{error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-xl">
              <p>No orders found.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-xl shadow-sm">
                <button
                  onClick={() => handleOrderClick(order.id)}
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex justify-between items-center"
                  role="region"
                  aria-label={`Order ${order.id}`}
                >
                  <div className="w-[90%]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-600">Order Number</span>
                      <span className="text-sm font-medium text-gray-800">{order.orderNumber}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-600">Date</span>
                      <span className="text-sm font-medium text-gray-800">
                        {formatDate(order.orderDate)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-600">Total Amount</span>
                      <span className="text-sm font-bold text-blue-600">
                        ₹{Number(order.totalAmount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-600">Payment Type</span>
                      <span className="text-sm font-medium text-gray-800">
                        {order.paymentType || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-600">Status</span>
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded-full ${
                          order.orderStatus === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : order.orderStatus === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.orderStatus || "Unknown"}
                      </span>
                    </div>
                  </div>
                  {selectedOrderId === order.id ? (
                    <ChevronUp color="gray" size={20} />
                  ) : (
                    <ChevronDown color="gray" size={20} />
                  )}
                </button>
                {selectedOrderId === order.id && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    {detailsLoading[order.id] ? (
                      <div className="text-center text-gray-500 py-4">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                        <p className="mt-2 text-sm">Loading order details...</p>
                      </div>
                    ) : detailsError[order.id] ? (
                      <div className="text-center text-red-500 py-4">
                        <p className="text-sm">{detailsError[order.id]}</p>
                      </div>
                    ) : orderDetails[order.id] ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-600">Order ID</span>
                          <span className="text-sm font-medium text-gray-800">
                            {orderDetails[order.id].id}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-600">Payment Status</span>
                          <span className="text-sm font-medium text-gray-800">
                            {orderDetails[order.id].paymentStatus}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-600">Store</span>
                          <span className="text-sm font-medium text-gray-800">
                            {orderDetails[order.id].store?.name}
                          </span>
                        </div>
                        <div className="mt-4">
                          <span className="text-sm font-semibold text-gray-600">Items</span>
                          <div className="mt-2 flex flex-col gap-2">
                            {orderDetails[order.id].orderProducts?.map((product) => (
                              <div
                                key={product.id}
                                className="bg-white p-2 rounded-lg flex justify-between items-center"
                              >
                                <div>
                                  <p className="text-sm font-medium text-gray-800">
                                    {product.orderProductDetails[0]?.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {product.quantity}{" "}
                                    {product.productVarientUom?.uom?.uomLanguages[0]?.name}
                                  </p>
                                </div>
                                <p className="text-sm font-bold text-blue-600">
                                  ₹{Number(product.price).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-4">
                        <p className="text-sm">No details available.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}