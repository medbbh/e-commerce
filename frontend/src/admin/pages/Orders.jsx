import React, { useEffect, useState } from 'react';
import { OrderAPI } from '../../services/orderApi'; // Adjust the import path accordingly
import OrdersTable from '../components/OrdersTable';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await OrderAPI.getAllOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await OrderAPI.updateOrderStatus(orderId, { status });
      // Refresh orders list after updating
      const fetchedOrders = await OrderAPI.getAllOrders();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getDeliveryInfoForCustomer = async (customerId) => {
    try {
      const data = await OrderAPI.getDeliveryInfo(customerId)
      return data
    }catch(err){
      console.log('while getting user delivery info')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold leading-tight">Orders Management</h1>
      <OrdersTable orders={orders} onUpdateStatus={updateOrderStatus} getDeliveryInfoForCustomer={getDeliveryInfoForCustomer}/>
    </div>
  );
};

export default Orders;
