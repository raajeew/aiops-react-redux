import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { OverviewStats } from '../../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ServiceHealthChartProps {
  stats: OverviewStats;
}

const ServiceHealthChart: React.FC<ServiceHealthChartProps> = ({ stats }) => {
  const data = {
    labels: ['Healthy', 'Warning', 'Critical'],
    datasets: [
      {
        data: [stats.healthyServices, stats.warningServices, stats.criticalServices],
        backgroundColor: [
          '#10B981', // green-500
          '#F59E0B', // yellow-500
          '#EF4444', // red-500
        ],
        borderColor: [
          '#059669', // green-600
          '#D97706', // yellow-600
          '#DC2626', // red-600
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          '#059669',
          '#D97706',
          '#DC2626',
        ],
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '60%',
  };

  return (
    <div className="card p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Service Health Distribution</h3>
      <div className="h-64">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default ServiceHealthChart;
