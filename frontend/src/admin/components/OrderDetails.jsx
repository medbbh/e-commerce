import React, { useEffect, useState } from 'react';
import { X, Truck, Package, User, Phone, MapPin } from 'lucide-react';

const OrderDetailsModal = ({ order, onClose, onUpdateStatus, getDeliveryInfoForCustomer }) => {
  const [address, setAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState(order.status);

  useEffect(() => {
    if (order?.customer) {
      fetchDeliveryInfo();
    }
  }, [order]);

  const fetchDeliveryInfo = async () => {
    setIsLoading(true);
    try {
      const data = await getDeliveryInfoForCustomer(order.customer);
      setAddress(data);
    } catch (err) {
      console.error('Error fetching delivery info:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Shipped: 'bg-blue-100 text-blue-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">Order Details</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Package className="text-gray-500" size={20} />
                <span className="text-lg font-semibold">Order #{order?.id}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{order?.total_price} MRU</p>
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${statusColors[order?.status] || 'bg-gray-100 text-gray-800'}`}>
                {order?.status}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Order Items</h3>
            <ul className="space-y-2">
              {order?.items?.map((item) => (
                <li key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span>{item.quantity} x {item.product}</span>
                  <span className="font-medium">{item.price} MRU</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Delivery Information</h3>
            {isLoading ? (
              <div className="flex justify-center items-center h-24">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : address ? (
              <div className="space-y-2">
                <p className="flex items-center"><Phone size={16} className="mr-2 text-gray-500" /> {address.phone}</p>
                {address.wtsp && <p className="flex items-center"><Phone size={16} className="mr-2 text-gray-500" /> WhatsApp: {address.wtsp}</p>}
                <p className="flex items-center"><MapPin size={16} className="mr-2 text-gray-500" /> {address.city}, {address.street}</p>
                {address.current_location && (
                  <p className="flex items-center"><MapPin size={16} className="mr-2 text-gray-500" /> Current Location: {address.current_location}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No delivery information available.</p>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          <select
            className="px-4 py-2 rounded-md transition-colors"
            value={currentStatus}
            onChange={(e) => {
              onUpdateStatus(order?.id, e.target.value)
              setCurrentStatus(e.target.value)
            }}
          >
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;