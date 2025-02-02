import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import { apiService } from '../../../services/dashbord'; // Add service to fetch sales data

const SalesTrendsChart = () => {
  const [salesData, setSalesData] = useState({ labels: [], sales: [] });

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const data = await apiService.getSalesTrends();
        setSalesData(data);
      } catch (error) {
        console.error('Error fetching sales trends data:', error);
      }
    };

    fetchSalesData();
  }, []);

  const chartData = {
    labels: salesData.labels,
    datasets: [
      {
        label: 'Sales Trend',
        data: salesData.sales,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default SalesTrendsChart;
