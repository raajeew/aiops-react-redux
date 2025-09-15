import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchSituationsStart, fetchSituationsSuccess, updateSituationStatus, setFilters, createSituation } from '../store/slices/situationsSlice';
import { apiService } from '../services/api';
import type { Situation } from '../types';

const Situations: React.FC = () => {
  const dispatch = useAppDispatch();
  const { situations, loading, error, filters } = useAppSelector((state) => state.situations);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [newSituation, setNewSituation] = useState({
    title: '',
    description: '',
    severity: 'medium' as Situation['severity'],
    status: 'open' as Situation['status'],
    tags: '',
    affectedServices: '',
  });

  useEffect(() => {
    const fetchSituations = async () => {
      dispatch(fetchSituationsStart());
      try {
        const situationsData = await apiService.getSituations();
        dispatch(fetchSituationsSuccess(situationsData));
      } catch (error) {
        console.error('Failed to fetch situations:', error);
      }
    };

    fetchSituations();
  }, [dispatch]);

  const getSeverityColor = (severity: Situation['severity']) => {
    switch (severity) {
      case 'low': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'critical': return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (status: Situation['status']) => {
    switch (status) {
      case 'open': return 'text-red-700 bg-red-100 border-red-200';
      case 'investigating': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'resolved': return 'text-green-700 bg-green-100 border-green-200';
      case 'closed': return 'text-gray-700 bg-gray-100 border-gray-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const handleStatusUpdate = (id: string, status: Situation['status']) => {
    dispatch(updateSituationStatus({ id, status }));
  };

  const handleCreateSituation = () => {
    const situationData = {
      ...newSituation,
      tags: newSituation.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      affectedServices: newSituation.affectedServices.split(',').map(id => id.trim()).filter(id => id),
    };
    
    dispatch(createSituation(situationData));
    setShowCreateModal(false);
    setNewSituation({
      title: '',
      description: '',
      severity: 'medium',
      status: 'open',
      tags: '',
      affectedServices: '',
    });
  };

  const filteredSituations = situations.filter(situation => {
    const matchesSeverity = filters.severity === 'all' || situation.severity === filters.severity;
    const matchesStatus = filters.status === 'all' || situation.status === filters.status;
    const matchesSearch = situation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         situation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         situation.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSeverity && matchesStatus && matchesSearch;
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Situations</h1>
            <p className="text-sm sm:text-base text-gray-600">Track and manage ongoing issues and incidents</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* View Switcher */}
            <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
              <button
                onClick={() => setViewMode('card')}
                className={`flex-1 sm:flex-none px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'card'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="hidden sm:inline">Card View</span>
                <span className="sm:hidden">Cards</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex-1 sm:flex-none px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="hidden sm:inline">Table View</span>
                <span className="sm:hidden">Table</span>
              </button>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary w-full sm:w-auto justify-center"
            >
              <span className="hidden sm:inline">Create Situation</span>
              <span className="sm:hidden">Create</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:gap-4">
          <div className="w-full sm:flex-1">
            <input
              type="text"
              placeholder="Search situations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:w-auto">
            <select
              value={filters.severity}
              onChange={(e) => dispatch(setFilters({ severity: e.target.value as Situation['severity'] | 'all' }))}
              className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <select
              value={filters.status}
              onChange={(e) => dispatch(setFilters({ status: e.target.value as Situation['status'] | 'all' }))}
              className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Situations List */}
      {viewMode === 'card' ? (
        // Card View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSituations.map((situation) => (
            <div key={situation.id} className="card p-6 hover:shadow-lg transition-shadow h-fit">
              <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight">{situation.title}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{situation.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(situation.severity)}`}>
                    {situation.severity}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(situation.status)}`}>
                    {situation.status}
                  </span>
                  {situation.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                      #{tag}
                    </span>
                  ))}
                  {situation.tags.length > 2 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                      +{situation.tags.length - 2}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div>
                  <span className="font-medium">Created:</span> {new Date(situation.created).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Assignee:</span> {situation.assignee || 'Unassigned'}
                </div>
              </div>

              {situation.affectedServices.length > 0 && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex flex-wrap text-sm">
                    <span className="font-medium text-gray-600 mr-2 whitespace-nowrap">Affected Services:</span>
                    <span className="text-gray-700">
                      {situation.affectedServices.slice(0, 2).join(', ')}
                      {situation.affectedServices.length > 2 && ` +${situation.affectedServices.length - 2} more`}
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-auto">
                <select
                  value={situation.status}
                  onChange={(e) => handleStatusUpdate(situation.id, e.target.value as Situation['status'])}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="open">Open</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Table View
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Situation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSituations.map((situation) => (
                  <tr key={situation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">{situation.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{situation.description}</div>
                        {situation.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {situation.tags.map((tag) => (
                              <span key={tag} className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(situation.severity)}`}>
                        {situation.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(situation.status)}`}>
                        {situation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {situation.assignee || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(situation.created).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select
                        value={situation.status}
                        onChange={(e) => handleStatusUpdate(situation.id, e.target.value as Situation['status'])}
                        className="text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="open">Open</option>
                        <option value="investigating">Investigating</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredSituations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            {searchTerm || filters.severity !== 'all' || filters.status !== 'all' 
              ? 'No situations match your filters' 
              : 'No situations found'}
          </div>
        </div>
      )}

      {/* Create Situation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-lg font-semibold mb-4">Create New Situation</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newSituation.title}
                  onChange={(e) => setNewSituation({ ...newSituation, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newSituation.description}
                  onChange={(e) => setNewSituation({ ...newSituation, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <select
                  value={newSituation.severity}
                  onChange={(e) => setNewSituation({ ...newSituation, severity: e.target.value as Situation['severity'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newSituation.tags}
                  onChange={(e) => setNewSituation({ ...newSituation, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="urgent, payment, api"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Affected Services (comma-separated IDs)</label>
                <input
                  type="text"
                  value={newSituation.affectedServices}
                  onChange={(e) => setNewSituation({ ...newSituation, affectedServices: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1, 2, 3"
                />
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
                onClick={handleCreateSituation}
                className="btn-primary"
                disabled={!newSituation.title || !newSituation.description}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Situations;
