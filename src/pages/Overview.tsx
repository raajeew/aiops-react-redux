import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchOverviewData, acknowledgeAlert, dismissAlert } from '../store/thunks/overviewThunks';
import ServiceHealthChart from '../components/charts/ServiceHealthChart';
import ResponseTimeChart from '../components/charts/ResponseTimeChart';
import SystemUptimeChart from '../components/charts/SystemUptimeChart';
import SituationsOverviewChart from '../components/charts/SituationsOverviewChart';

const Overview: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stats, alerts, loading, error } = useAppSelector((state) => state.overview);

  useEffect(() => {
    dispatch(fetchOverviewData());
  }, [dispatch]);

  const handleAcknowledgeAlert = (alertId: string) => {
    dispatch(acknowledgeAlert(alertId));
  };

  const handleDismissAlert = (alertId: string) => {
    dispatch(dismissAlert(alertId));
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-100 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'error': return 'text-red-600 bg-red-100 border-red-200';
      case 'info': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-700">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">System Overview</h1>
        <p className="text-sm sm:text-base text-gray-600">Real-time monitoring and health status of all services</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="card p-3 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm sm:text-base">🔧</span>
                </div>
              </div>
              <div className="ml-2 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Services</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stats.totalServices}</p>
              </div>
            </div>
          </div>

          <div className="card p-3 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm sm:text-base">✅</span>
                </div>
              </div>
              <div className="ml-2 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Healthy Services</p>
                <p className="text-lg sm:text-2xl font-semibold text-green-600">{stats.healthyServices}</p>
              </div>
            </div>
          </div>

          <div className="card p-3 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                  <span className="text-yellow-600 font-semibold text-sm sm:text-base">⚠️</span>
                </div>
              </div>
              <div className="ml-2 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Warning Services</p>
                <p className="text-lg sm:text-2xl font-semibold text-yellow-600">{stats.warningServices}</p>
              </div>
            </div>
          </div>

          <div className="card p-3 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-md flex items-center justify-center">
                  <span className="text-red-600 font-semibold text-sm sm:text-base">🚨</span>
                </div>
              </div>
              <div className="ml-2 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Critical Services</p>
                <p className="text-lg sm:text-2xl font-semibold text-red-600">{stats.criticalServices}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Key Metrics */}
        {stats && (
          <div className="card p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Key Metrics</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-gray-600">Average Response Time</span>
                <span className="text-sm sm:text-base font-semibold">{stats.avgResponseTime}ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-gray-600">System Uptime</span>
                <span className="text-sm sm:text-base font-semibold text-green-600">{stats.systemUptime}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-gray-600">Open Situations</span>
                <span className="text-sm sm:text-base font-semibold text-yellow-600">{stats.openSituations}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-gray-600">Resolved Situations</span>
                <span className="text-sm sm:text-base font-semibold text-green-600">{stats.resolvedSituations}</span>
              </div>
            </div>
          </div>
        )}

        {/* Recent Alerts */}
        <div className="card p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Recent Alerts</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {alerts.length === 0 ? (
              <p className="text-sm sm:text-base text-gray-500 text-center py-4">No recent alerts</p>
            ) : (
              alerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className={`border rounded-lg p-3 ${getAlertTypeColor(alert.type)}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs mt-1 opacity-75">
                        {alert.source} • {new Date(alert.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex space-x-1 ml-2">
                      {!alert.acknowledged && (
                        <button
                          onClick={() => handleAcknowledgeAlert(alert.id)}
                          className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded hover:bg-opacity-75 transition-colors"
                          title="Acknowledge"
                        >
                          ✓
                        </button>
                      )}
                      <button
                        onClick={() => handleDismissAlert(alert.id)}
                        className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded hover:bg-opacity-75 transition-colors"
                        title="Dismiss"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">
          <ServiceHealthChart stats={stats} />
          <ResponseTimeChart avgResponseTime={stats.avgResponseTime} />
          <SystemUptimeChart systemUptime={stats.systemUptime} />
          <SituationsOverviewChart stats={stats} />
        </div>
      )}
    </div>
  );
};

export default Overview;
