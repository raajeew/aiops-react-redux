import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchConfigurationsStart, fetchConfigurationsSuccess, updateConfiguration, setSearchTerm, setSelectedCategory, resetConfiguration } from '../store/slices/configurationSlice';
import { apiService } from '../services/api';
import type { Configuration } from '../types';

const ConfigurationPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { configurations, loading, error, searchTerm, selectedCategory } = useAppSelector((state) => state.configuration);
  const [editingConfig, setEditingConfig] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string | number | boolean>('');

  useEffect(() => {
    const fetchConfigurations = async () => {
      dispatch(fetchConfigurationsStart());
      try {
        const configData = await apiService.getConfigurations();
        dispatch(fetchConfigurationsSuccess(configData));
      } catch (error) {
        console.error('Failed to fetch configurations:', error);
      }
    };

    fetchConfigurations();
  }, [dispatch]);

  const getCategoryColor = (category: Configuration['category']) => {
    switch (category) {
      case 'monitoring': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'alerting': return 'text-red-700 bg-red-100 border-red-200';
      case 'notifications': return 'text-green-700 bg-green-100 border-green-200';
      case 'thresholds': return 'text-purple-700 bg-purple-100 border-purple-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const handleEdit = (config: Configuration) => {
    setEditingConfig(config.id);
    setEditValue(config.value);
  };

  const handleSave = (id: string) => {
    dispatch(updateConfiguration({ id, value: editValue }));
    setEditingConfig(null);
    setEditValue('');
  };

  const handleCancel = () => {
    setEditingConfig(null);
    setEditValue('');
  };

  const handleReset = (id: string) => {
    dispatch(resetConfiguration(id));
  };

  const filteredConfigurations = configurations.filter(config => {
    const matchesCategory = selectedCategory === 'all' || config.category === selectedCategory;
    const matchesSearch = config.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         config.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const groupedConfigurations = filteredConfigurations.reduce((groups, config) => {
    const category = config.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(config);
    return groups;
  }, {} as Record<Configuration['category'], Configuration[]>);

  const renderConfigValue = (config: Configuration) => {
    if (editingConfig === config.id) {
      switch (config.type) {
        case 'boolean':
          return (
            <select
              value={editValue.toString()}
              onChange={(e) => setEditValue(e.target.value === 'true')}
              className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          );
        case 'select':
          return (
            <select
              value={editValue.toString()}
              onChange={(e) => setEditValue(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {config.options?.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          );
        case 'number':
          return (
            <input
              type="number"
              value={editValue.toString()}
              onChange={(e) => setEditValue(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          );
        default:
          return (
            <input
              type="text"
              value={editValue.toString()}
              onChange={(e) => setEditValue(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          );
      }
    }

    return (
      <span className="font-medium">
        {config.type === 'boolean' ? (config.value ? 'True' : 'False') : config.value.toString()}
      </span>
    );
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
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Configuration</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage system settings and parameters</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:gap-4">
          <div className="w-full sm:flex-1">
            <input
              type="text"
              placeholder="Search configurations..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => dispatch(setSelectedCategory(e.target.value as Configuration['category'] | 'all'))}
              className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="monitoring">Monitoring</option>
              <option value="alerting">Alerting</option>
              <option value="notifications">Notifications</option>
              <option value="thresholds">Thresholds</option>
            </select>
          </div>
        </div>
      </div>

      {/* Configuration Groups */}
      <div className="space-y-4 sm:space-y-6">
        {Object.entries(groupedConfigurations).map(([category, configs]) => (
          <div key={category} className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getCategoryColor(category as Configuration['category'])}`}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
                <span className="text-gray-500">({configs.length} settings)</span>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {configs.map((config) => (
                <div key={config.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 mr-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">{config.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{config.description}</p>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Value:</span>
                          {renderConfigValue(config)}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Type:</span>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                            {config.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {editingConfig === config.id ? (
                        <>
                          <button
                            onClick={() => handleSave(config.id)}
                            className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          {config.editable && (
                            <button
                              onClick={() => handleEdit(config)}
                              className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                            >
                              Edit
                            </button>
                          )}
                          {config.editable && (
                            <button
                              onClick={() => handleReset(config.id)}
                              className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                            >
                              Reset
                            </button>
                          )}
                          {!config.editable && (
                            <span className="text-xs px-3 py-1 bg-gray-100 text-gray-500 rounded">
                              Read Only
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {Object.keys(groupedConfigurations).length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            {searchTerm || selectedCategory !== 'all' 
              ? 'No configurations match your filters' 
              : 'No configurations found'}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigurationPage;
