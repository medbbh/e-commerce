import React, { useState, useEffect } from 'react';
import { apiService } from '../../../services/dashbord'; // Add service to fetch sales data

const TopProducts = () => {
    const [topProducts, setTopProducts] = useState([]);
  
    useEffect(() => {
      const fetchTopProducts = async () => {
        try {
          const data = await apiService.getTopProducts();
          setTopProducts(data);
        } catch (error) {
          console.error('Error fetching top products:', error);
        }
      };
  
      fetchTopProducts();
    }, []);
  
    return (
      <div>
        <h3>Top Ordered Products</h3>
        <ul>
          {topProducts.map((product) => (
            <li key={product.name}>
              {product.name}: {product.total_orders} orders
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
export default TopProducts;
  