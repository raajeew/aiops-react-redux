import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchServices, updateServiceStatus, createService } from '../store/thunks/servicesThunks';
import type { Service } from '../types';

const Services: React.FC = () => {
  const dispatch = useAppDispatch();
  const { services, loading, error } = useAppSelector((state) => state.services);
  const [filter, setFilter] = useState<'all' | Service['status']>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    version: '',
    environment: 'production' as Service['environment'],
    status: 'healthy' as Service['status'],
  });

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const getStatusColor = (status: Service['status']) => {
    switch (status) {
      case 'healthy': return 'text-green-700 bg-green-100 border-green-200';
      case 'warning': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'critical': return 'text-red-700 bg-red-100 border-red-200';
      case 'unknown': return 'text-gray-700 bg-gray-100 border-gray-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-600';
    if (health >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleStatusUpdate = (id: string, status: Service['status']) => {
    console.log('handleStatusUpdate called with:', { id, status });
    const health = status === 'healthy' ? 95 : status === 'warning' ? 75 : 45;
    console.log('Dispatching updateServiceStatus with:', { id, status, health });
    dispatch(updateServiceStatus({ id, status, health }));
  };

  const handleCreateService = async () => {
    console.log('handleCreateService called!');
    console.log('Creating service with data:', newService);
    try {
      const result = await dispatch(createService(newService));
      console.log('Service created successfully:', result);
    } catch (error) {
      console.error('Error creating service:', error);
    }
    
    setShowCreateModal(false);
    setNewService({
      name: '',
      description: '',
      version: '',
      environment: 'production',
      status: 'healthy',
    });
  };

  const filteredServices = services.filter(service => {
    const matchesFilter = filter === 'all' || service.status === filter;
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Services</h1>
            <p className="text-sm sm:text-base text-gray-600">Monitor and manage all your services and their health status</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary w-full sm:w-auto justify-center"
          >
            <span className="hidden sm:inline">Create Service</span>
            <span className="sm:hidden">Create</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:gap-4">
          <div className="w-full sm:flex-1">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:w-auto">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | Service['status'])}
              className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Services</option>
              <option value="healthy">Healthy</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(service.status)}`}>
                {service.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Health Score</span>
                <span className={`font-semibold ${getHealthColor(service.health)}`}>
                  {service.health}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Response Time</span>
                <span className="font-semibold">{service.responseTime}ms</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Uptime</span>
                <span className="font-semibold text-green-600">{service.uptime}%</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Version</span>
                <span className="font-semibold">{service.version}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Environment</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  service.environment === 'production' ? 'bg-red-100 text-red-700' :
                  service.environment === 'staging' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {service.environment}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Last Updated</span>
                  <span>{new Date(service.lastUpdated).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleStatusUpdate(service.id, 'healthy')}
                className="flex-1 bg-green-100 text-green-700 text-xs px-3 py-2 rounded hover:bg-green-200 transition-colors"
              >
                Mark Healthy
              </button>
              <button
                onClick={() => handleStatusUpdate(service.id, 'warning')}
                className="flex-1 bg-yellow-100 text-yellow-700 text-xs px-3 py-2 rounded hover:bg-yellow-200 transition-colors"
              >
                Mark Warning
              </button>
              <button
                onClick={() => handleStatusUpdate(service.id, 'critical')}
                className="flex-1 bg-red-100 text-red-700 text-xs px-3 py-2 rounded hover:bg-red-200 transition-colors"
              >
                Mark Critical
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            {searchTerm || filter !== 'all' ? 'No services match your filters' : 'No services found'}
          </div>
        </div>
      )}

      {/* Create Service Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-lg font-semibold mb-4">Create New Service</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., User Authentication API"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the service"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                <input
                  type="text"
                  value={newService.version}
                  onChange={(e) => setNewService({ ...newService, version: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., v1.0.0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
                <select
                  value={newService.environment}
                  onChange={(e) => setNewService({ ...newService, environment: e.target.value as Service['environment'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="development">Development</option>
                  <option value="staging">Staging</option>
                  <option value="production">Production</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Status</label>
                <select
                  value={newService.status}
                  onChange={(e) => setNewService({ ...newService, status: e.target.value as Service['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="healthy">Healthy</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateService}
                className="btn-primary"
                disabled={!newService.name || !newService.description || !newService.version}
              >
                Create Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
