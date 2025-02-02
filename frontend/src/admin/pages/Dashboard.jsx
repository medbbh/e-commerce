import React, { useEffect, useState } from 'react';
import {
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import { apiService } from '../../services/dashbord'; 

// Card components for consistent design
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


const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Shipped: 'bg-blue-100 text-blue-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const Dashboard = () => {
  const [salesTrends, setSalesTrends] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [marketingEffectiveness, setMarketingEffectiveness] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from API
        const salesData = await apiService.getSalesTrends();
        setSalesTrends(salesData);
        console.log(salesData)

        const topProductsData = await apiService.getTopProducts();
        setTopProducts(topProductsData);

        const marketingData = await apiService.getMarketingEffectiveness();
        setMarketingEffectiveness(marketingData);

        const recentOrdersData = await apiService.getRecentOrders();
        setRecentOrders(recentOrdersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
      {/* Sales Trends */}
      <Card>
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

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.revenue} MRU</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.units_sold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Marketing Effectiveness */}
      <Card>
        <CardHeader>
          <CardTitle>Marketing Effectiveness</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Total Visitors</h3>
              <p className="text-4xl font-bold">{marketingEffectiveness.totalVisitors}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Organic Visitors</h3>
              <p className="text-4xl font-bold">{marketingEffectiveness.organicVisitors}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Paid Visitors</h3>
              <p className="text-4xl font-bold">{marketingEffectiveness.paidVisitors}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Email Conversion Rate</h3>
              <p className="text-4xl font-bold">{marketingEffectiveness.emailConversionRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                    <td className={`px-6 py-4 whitespace-nowrap ${statusColors[order?.status] || 'bg-gray-100 text-gray-800'}`}>                
                        {order.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {order.total_price} MRU
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.ordered_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
