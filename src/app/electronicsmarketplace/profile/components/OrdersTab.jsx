import { Package, Calendar, DollarSign, Truck } from "lucide-react";

const OrdersTab = () => {
  const orders = [
    {
      id: "#ORD-001",
      item: "Wireless Headphones",
      date: "Dec 8, 2024",
      amount: "$129.99",
      status: "Delivered"
    },
    {
      id: "#ORD-002", 
      item: "Smart Watch",
      date: "Dec 5, 2024",
      amount: "$299.99",
      status: "Shipped"
    },
    {
      id: "#ORD-003",
      item: "Phone Case",
      date: "Dec 1, 2024", 
      amount: "$24.99",
      status: "Processing"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">Recent Orders</h3>
        <Package className="w-5 h-5 text-green-500" />
      </div>
      
      {orders.map((order) => (
        <div key={order.id} className="p-3 bg-green-50 rounded-lg border border-green-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">{order.id}</span>
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          <p className="text-sm text-gray-700">{order.item}</p>
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{order.date}</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-3 h-3" />
              <span>{order.amount}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersTab;