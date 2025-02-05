import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { dashboardService } from '../../services/dashbord'; // Reference to your updated dashboardService
import Spinner from '../../components/Spinner'; // If you have a spinner component

// Minimal Card components for consistent design:
const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="mb-4 border-b border-gray-200 pb-4">
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h3 className="text-xl font-medium">{children}</h3>
);

const CardContent = ({ children }) => (
  <div>{children}</div>
);

// Colors for different order statuses (Pie slices)
const statusColorMap = {
  Pending: '#FBBF24',   // amber-400
  Shipped: '#3B82F6',   // blue-500
  Delivered: '#10B981', // green-500
  Cancelled: '#EF4444', // red-500
};

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Shipped: 'bg-blue-100 text-blue-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [salesTrends, setSalesTrends] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // 1. Get line chart data (Sales Trends)
        const sales = await dashboardService.getSalesTrends();
        setSalesTrends(sales);

        // 2. Get top products
        const top = await dashboardService.getTopProducts();
        setTopProducts(top);

        // 3. Get order status distribution (Pie)
        const distribution = await dashboardService.getOrderStatusDistribution();
        setOrderStatusData(distribution);

        // 4. Get recent orders
        const orders = await dashboardService.getRecentOrders();
        setRecentOrders(orders);

      } catch (error) {
        console.error('❌ Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* 1️⃣ Sales Trends (Line Chart) */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Sales Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesTrends}>
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2️⃣ Orders by Status (Pie Chart) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 col-span-1 lg:col-span-2">
      <Card>
        <CardHeader>
          <CardTitle>Orders by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                dataKey="count"
                nameKey="status"
                label={(entry) => entry.status}
                outerRadius={100}
              >
                {orderStatusData.map((entry, index) => {
                  const fillColor = statusColorMap[entry.status] || '#A3A3A3';
                  return <Cell key={`slice-${index}`} fill={fillColor} />;
                })}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 3️⃣ Top Products & 4️⃣ Recent Orders side-by-side */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 col-span-1 lg:col-span-2"> */}
        {/* Top Products (Table) */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-3 py-2 text-left">Product</th>
                    <th className="px-3 py-2 text-right">Revenue</th>
                    <th className="px-3 py-2 text-right">Units Sold</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right text-gray-700">
                        {product.revenue} MRU
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right text-gray-700">
                        {product.units_sold}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

                  </div>
        {/* Recent Orders (Table) */}
        <Card className="w-col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-3 py-2 text-left">Order ID</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-right">Total</th>
                    <th className="px-3 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-gray-900 font-medium">
                        #{order.id}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold inline-block ${
                            statusColors[order.status] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right text-gray-700">
                        {order.total_price} MRU
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                        {new Date(order.ordered_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      {/* </div> */}
    </div>
  );
}
