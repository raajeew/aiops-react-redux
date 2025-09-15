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
import type { OverviewStats } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SituationsOverviewChartProps {
  stats: OverviewStats;
}

const SituationsOverviewChart: React.FC<SituationsOverviewChartProps> = ({ stats }) => {
  const data = {
    labels: ['Open', 'Resolved'],
    datasets: [
      {
        label: 'Situations',
        data: [stats.openSituations, stats.resolvedSituations],
        backgroundColor: [
          '#F59E0B', // yellow-500 for open
          '#10B981', // green-500 for resolved
        ],
        borderColor: [
          '#D97706', // yellow-600
          '#059669', // green-600
        ],
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
            const total = stats.openSituations + stats.resolvedSituations;
            const percentage = total > 0 ? ((context.parsed.y / total) * 100).toFixed(1) : '0';
            return `${context.label}: ${context.parsed.y} (${percentage}%)`;
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
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          stepSize: 1,
          font: {
            size: 10,
          },
        },
      },
    },
  };

  return (
    <div className="card p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Situations Overview</h3>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
      <div className="mt-3 flex justify-between text-sm text-gray-600">
        <span>Total: {stats.openSituations + stats.resolvedSituations}</span>
        <span>Resolution rate: {
          stats.openSituations + stats.resolvedSituations > 0 
            ? ((stats.resolvedSituations / (stats.openSituations + stats.resolvedSituations)) * 100).toFixed(1)
            : '0'
        }%</span>
      </div>
    </div>
  );
};

export default SituationsOverviewChart;
