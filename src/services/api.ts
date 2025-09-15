import type { Service, Situation, Alert, Configuration } from '../types';
import {
  mockServices,
  mockSituations,
  mockAlerts,
  mockOverviewStats,
  mockMetrics,
  mockConfigurations,
} from '../data/mockData';

// Create a mutable copy of mock services for API operations
let servicesData: Service[] = JSON.parse(JSON.stringify(mockServices));

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ApiService {
  // Overview API
  async getOverviewData() {
    await delay(500);
    return {
      stats: mockOverviewStats,
      alerts: mockAlerts,
      metrics: mockMetrics,
    };
  }

  // Services API
  async getServices(): Promise<Service[]> {
    await delay(300);
    return servicesData;
  }

  async getServiceById(id: string): Promise<Service | null> {
    await delay(200);
    return servicesData.find(service => service.id === id) || null;
  }

  async updateServiceStatus(id: string, status: Service['status'], health: number): Promise<Service> {
    await delay(400);
    const serviceIndex = servicesData.findIndex(s => s.id === id);
    if (serviceIndex === -1) {
      throw new Error('Service not found');
    }
    
    // Deep clone the services data to avoid readonly property issues
    const clonedServicesData = JSON.parse(JSON.stringify(servicesData));
    const service = clonedServicesData[serviceIndex];
    
    // Update the cloned service
    service.status = status;
    service.health = health;
    service.lastUpdated = new Date().toISOString();
    
    // Replace the entire array with the updated clone
    servicesData = clonedServicesData;
    
    return service;
  }

  async createService(serviceData: Omit<Service, 'id' | 'lastUpdated' | 'health' | 'responseTime' | 'uptime'>): Promise<Service> {
    console.log('API: Creating service with data:', serviceData);
    console.log('API: Current servicesData length:', servicesData.length);
    console.log('API: servicesData is extensible:', Object.isExtensible(servicesData));
    
    await delay(500);
    
    try {
      const newService: Service = {
        ...serviceData,
        id: Date.now().toString(),
        health: serviceData.status === 'healthy' ? 95 : serviceData.status === 'warning' ? 75 : 45,
        responseTime: Math.floor(Math.random() * 500) + 50,
        uptime: Math.floor(Math.random() * 10) + 90,
        lastUpdated: new Date().toISOString(),
      };
      console.log('API: Created new service:', newService);
      
      // Create a new array instead of pushing to the existing one
      servicesData = [...servicesData, newService];
      console.log('API: Total services after creation:', servicesData.length);
      return newService;
    } catch (error) {
      console.error('API: Error creating service:', error);
      throw error;
    }
  }

  // Situations API
  async getSituations(): Promise<Situation[]> {
    await delay(400);
    return mockSituations;
  }

  async getSituationById(id: string): Promise<Situation | null> {
    await delay(200);
    return mockSituations.find(situation => situation.id === id) || null;
  }

  async createSituation(situationData: Omit<Situation, 'id' | 'created' | 'updated'>): Promise<Situation> {
    await delay(500);
    const newSituation: Situation = {
      ...situationData,
      id: Date.now().toString(),
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };
    mockSituations.unshift(newSituation);
    return newSituation;
  }

  async updateSituationStatus(id: string, status: Situation['status']): Promise<Situation> {
    await delay(300);
    const situation = mockSituations.find(s => s.id === id);
    if (!situation) {
      throw new Error('Situation not found');
    }
    situation.status = status;
    situation.updated = new Date().toISOString();
    return situation;
  }

  async assignSituation(id: string, assignee: string): Promise<Situation> {
    await delay(300);
    const situation = mockSituations.find(s => s.id === id);
    if (!situation) {
      throw new Error('Situation not found');
    }
    situation.assignee = assignee;
    situation.updated = new Date().toISOString();
    return situation;
  }

  // Alerts API
  async getAlerts(): Promise<Alert[]> {
    await delay(200);
    return mockAlerts;
  }

  async acknowledgeAlert(id: string): Promise<void> {
    await delay(200);
    const alert = mockAlerts.find(a => a.id === id);
    if (alert) {
      alert.acknowledged = true;
    }
  }

  async dismissAlert(id: string): Promise<void> {
    await delay(200);
    const alertIndex = mockAlerts.findIndex(a => a.id === id);
    if (alertIndex > -1) {
      mockAlerts.splice(alertIndex, 1);
    }
  }

  // Configuration API
  async getConfigurations(): Promise<Configuration[]> {
    await delay(300);
    return mockConfigurations;
  }

  async updateConfiguration(id: string, value: Configuration['value']): Promise<Configuration> {
    await delay(400);
    const config = mockConfigurations.find(c => c.id === id);
    if (!config) {
      throw new Error('Configuration not found');
    }
    if (!config.editable) {
      throw new Error('Configuration is not editable');
    }
    config.value = value;
    return config;
  }

  async resetConfiguration(id: string): Promise<Configuration> {
    await delay(300);
    const config = mockConfigurations.find(c => c.id === id);
    if (!config) {
      throw new Error('Configuration not found');
    }
    if (!config.editable) {
      throw new Error('Configuration is not editable');
    }
    
    // Reset to default values based on type
    if (config.type === 'boolean') {
      config.value = false;
    } else if (config.type === 'number') {
      config.value = 0;
    } else {
      config.value = '';
    }
    
    return config;
  }

  // Health Check API
  async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'down'; timestamp: string }> {
    await delay(100);
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  }
}

export const apiService = new ApiService();
