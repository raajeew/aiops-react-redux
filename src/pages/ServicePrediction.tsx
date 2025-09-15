import React, { useEffect, useState } from 'react';
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

interface ServicePrediction {
  id: string;
  name: string;
  currentHealth: number;
  predictions: {
    time: string;
    health: number;
    confidence: number;
  }[];
  riskLevel: 'low' | 'medium' | 'high';
  predictedIncidents: {
    time: string;
    type: string;
    probability: number;
  }[];
}

const ServicePrediction: React.FC = () => {
  const [predictions, setPredictions] = useState<ServicePrediction[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call for predictions
    setTimeout(() => {
      const mockPredictions: ServicePrediction[] = [
        {
          id: '1',
          name: 'Authentication Service',
          currentHealth: 95,
          riskLevel: 'low',
          predictions: generateHealthPredictions(95, 'stable'),
          predictedIncidents: [
            {
              time: '2025-09-12T08:30:00Z',
              type: 'High Response Time',
              probability: 15,
            },
          ],
        },
        {
          id: '2',
          name: 'Payment Gateway',
          currentHealth: 78,
          riskLevel: 'medium',
          predictions: generateHealthPredictions(78, 'declining'),
          predictedIncidents: [
            {
              time: '2025-09-12T14:15:00Z',
              type: 'Service Degradation',
              probability: 65,
            },
            {
              time: '2025-09-12T18:45:00Z',
              type: 'Connection Timeout',
              probability: 35,
            },
          ],
        },
        {
          id: '3',
          name: 'Database Service',
          currentHealth: 45,
          riskLevel: 'high',
          predictions: generateHealthPredictions(45, 'critical'),
          predictedIncidents: [
            {
              time: '2025-09-12T02:20:00Z',
              type: 'Service Outage',
              probability: 85,
            },
            {
              time: '2025-09-12T09:10:00Z',
              type: 'Memory Leak',
              probability: 70,
            },
          ],
        },
        {
          id: '4',
          name: 'API Gateway',
          currentHealth: 88,
          riskLevel: 'low',
          predictions: generateHealthPredictions(88, 'stable'),
          predictedIncidents: [],
        },
        {
          id: '5',
          name: 'Email Service',
          currentHealth: 62,
          riskLevel: 'medium',
          predictions: generateHealthPredictions(62, 'fluctuating'),
          predictedIncidents: [
            {
              time: '2025-09-12T11:30:00Z',
              type: 'Queue Overflow',
              probability: 45,
            },
          ],
        },
      ];
      setPredictions(mockPredictions);
      setSelectedService(mockPredictions[0]?.id || '');
      setLoading(false);
    }, 1000);
  }, []);

  const generateHealthPredictions = (baseHealth: number, trend: 'stable' | 'declining' | 'critical' | 'fluctuating') => {
    const predictions = [];
    const now = new Date();
    let currentHealth = baseHealth;

    for (let i = 0; i <= 24; i++) {
      const time = new Date(now.getTime() + i * 60 * 60 * 1000);
      
      switch (trend) {
        case 'stable':
          currentHealth += (Math.random() - 0.5) * 5;
          break;
        case 'declining':
          currentHealth -= Math.random() * 3 + (i * 0.5);
          break;
        case 'critical':
          currentHealth -= Math.random() * 8 + (i * 1.2);
          break;
        case 'fluctuating':
          currentHealth += (Math.random() - 0.5) * 10;
          break;
      }

      currentHealth = Math.max(0, Math.min(100, currentHealth));
      
      predictions.push({
        time: time.toISOString(),
        health: Math.round(currentHealth * 100) / 100,
        confidence: Math.random() * 30 + 70, // 70-100% confidence
      });
    }

    return predictions;
  };

  const getChartData = () => {
    const selectedPrediction = predictions.find(p => p.id === selectedService);
    if (!selectedPrediction) return null;

    const labels = selectedPrediction.predictions.map(p => {
      const date = new Date(p.time);
      return date.getHours() + ':00';
    });

    const healthData = selectedPrediction.predictions.map(p => p.health);
    const confidenceData = selectedPrediction.predictions.map(p => p.confidence);

    return {
      labels,
      datasets: [
        {
          label: 'Predicted Health',
          data: healthData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.3,
          fill: true,
        },
        {
          label: 'Confidence Level',
          data: confidenceData,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.3,
          borderDash: [5, 5],
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '24-Hour Service Health Prediction',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Health / Confidence (%)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Time (Next 24 Hours)',
        },
      },
    },
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-green-600';
    if (health >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const selectedPrediction = predictions.find(p => p.id === selectedService);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Service Prediction</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Predictive analytics for service health over the next 24 hours
        </p>
      </div>

      {/* Service Selection */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Select Service</h2>
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {predictions.map((prediction) => (
            <option key={prediction.id} value={prediction.id}>
              {prediction.name} (Current: {prediction.currentHealth}%)
            </option>
          ))}
        </select>
      </div>

      {/* Services Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {predictions.map((prediction) => (
          <div
            key={prediction.id}
            className={`bg-white shadow rounded-lg p-4 sm:p-6 cursor-pointer border-2 transition-colors ${
              selectedService === prediction.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-transparent hover:border-gray-200'
            }`}
            onClick={() => setSelectedService(prediction.id)}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                {prediction.name}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full border ${getRiskLevelColor(prediction.riskLevel)}`}>
                {prediction.riskLevel.charAt(0).toUpperCase() + prediction.riskLevel.slice(1)} Risk
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">Current Health</span>
                <span className={`text-sm sm:text-base font-semibold ${getHealthColor(prediction.currentHealth)}`}>
                  {prediction.currentHealth}%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">Predicted Incidents</span>
                <span className="text-sm sm:text-base font-semibold text-gray-900">
                  {prediction.predictedIncidents.length}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart and Details */}
      {selectedPrediction && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white shadow rounded-lg p-4 sm:p-6">
            <div className="h-64 sm:h-80">
              {getChartData() && (
                <Line data={getChartData()!} options={chartOptions} />
              )}
            </div>
          </div>

          {/* Predicted Incidents */}
          <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              Predicted Incidents
            </h3>
            
            {selectedPrediction.predictedIncidents.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No incidents predicted</p>
            ) : (
              <div className="space-y-3">
                {selectedPrediction.predictedIncidents.map((incident, index) => {
                  const incidentTime = new Date(incident.time);
                  const timeFromNow = Math.round((incidentTime.getTime() - Date.now()) / (1000 * 60 * 60));
                  
                  return (
                    <div key={index} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-900">{incident.type}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          incident.probability >= 70 
                            ? 'bg-red-100 text-red-600' 
                            : incident.probability >= 40 
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {incident.probability}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <div>In {timeFromNow > 0 ? timeFromNow : 0} hours</div>
                        <div>{incidentTime.toLocaleTimeString()}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommendation Section */}
      {selectedPrediction && (
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            Recommendations
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedPrediction.riskLevel === 'high' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-red-800 mb-2">Immediate Actions Required</h4>
                <ul className="text-xs text-red-700 space-y-1">
                  <li>• Scale up resources immediately</li>
                  <li>• Review recent deployments</li>
                  <li>• Activate monitoring alerts</li>
                  <li>• Prepare incident response team</li>
                </ul>
              </div>
            )}
            
            {selectedPrediction.riskLevel === 'medium' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-yellow-800 mb-2">Preventive Measures</h4>
                <ul className="text-xs text-yellow-700 space-y-1">
                  <li>• Monitor service closely</li>
                  <li>• Consider resource scaling</li>
                  <li>• Review performance metrics</li>
                  <li>• Schedule maintenance window</li>
                </ul>
              </div>
            )}
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Optimization Tips</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Enable auto-scaling policies</li>
                <li>• Implement circuit breakers</li>
                <li>• Set up health check endpoints</li>
                <li>• Configure backup systems</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePrediction;
