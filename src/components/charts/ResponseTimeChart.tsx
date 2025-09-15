import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ResponseTimeChartProps {
  avgResponseTime: number;
}

const ResponseTimeChart: React.FC<ResponseTimeChartProps> = ({ avgResponseTime }) => {
  // Generate mock historical data for demonstration
  const generateMockData = () => {
    const labels = [];
    const data = [];
    const baseTime = avgResponseTime;
    
    for (let i = 23; i >= 0; i--) {
      const hour = new Date();
      hour.setHours(hour.getHours() - i);
      labels.push(hour.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }));
      
      // Add some variance to the base response time
      const variance = (Math.random() - 0.5) * 50;
      data.push(Math.max(0, baseTime + variance));
    }
    
    return { labels, data };
  };

  const { labels, data: responseData } = generateMockData();

  const data = {
    labels,
    datasets: [
      {
        label: 'Response Time (ms)',
        data: responseData,
        borderColor: '#3B82F6', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)', // blue-500 with transparency
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#1E40AF', // blue-700
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `${context.parsed.y.toFixed(1)}ms`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 6,
          font: {
            size: 10,
          },
        },
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return `${value}ms`;
          },
          font: {
            size: 10,
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div className="card p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Response Time Trend (24h)</h3>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
      <div className="mt-3 flex justify-between text-sm text-gray-600">
        <span>Current: {avgResponseTime}ms</span>
        <span>Avg: {responseData.reduce((a, b) => a + b, 0) / responseData.length | 0}ms</span>
      </div>
    </div>
  );
};

export default ResponseTimeChart;
