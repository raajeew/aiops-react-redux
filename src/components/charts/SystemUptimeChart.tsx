import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SystemUptimeChartProps {
  systemUptime: number;
}

const SystemUptimeChart: React.FC<SystemUptimeChartProps> = ({ systemUptime }) => {
  // Generate mock uptime data for the last 7 days
  const generateUptimeData = () => {
    const labels = [];
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }));
      
      // Generate uptime between 95% and 100% with today being the current uptime
      if (i === 0) {
        data.push(systemUptime);
      } else {
        data.push(95 + Math.random() * 5);
      }
    }
    
    return { labels, data };
  };

  const { labels, data: uptimeData } = generateUptimeData();

  const data = {
    labels,
    datasets: [
      {
        label: 'Uptime %',
        data: uptimeData,
        backgroundColor: uptimeData.map(value => 
          value >= 99 ? '#10B981' : // green-500
          value >= 95 ? '#F59E0B' : // yellow-500
          '#EF4444' // red-500
        ),
        borderColor: uptimeData.map(value => 
          value >= 99 ? '#059669' : // green-600
          value >= 95 ? '#D97706' : // yellow-600
          '#DC2626' // red-600
        ),
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Uptime: ${context.parsed.y.toFixed(2)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      y: {
        beginAtZero: false,
        min: 90,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return `${value}%`;
          },
          font: {
            size: 10,
          },
        },
      },
    },
  };

  return (
    <div className="card p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">System Uptime (7 days)</h3>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
      <div className="mt-3 flex justify-between text-sm text-gray-600">
        <span>Today: {systemUptime}%</span>
        <span>7-day avg: {(uptimeData.reduce((a, b) => a + b, 0) / uptimeData.length).toFixed(1)}%</span>
      </div>
    </div>
  );
};

export default SystemUptimeChart;
