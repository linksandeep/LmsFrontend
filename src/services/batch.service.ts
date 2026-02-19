import api from './api';

export interface Batch {
  id: string;
  name: string;
  batchCode: string;
  courseId: {
    id: string;
    title: string;
    thumbnail?: string;
    level?: string;
    price?: number;
  };
  status: 'upcoming' | 'active' | 'completed' | 'archived';
  startDate: string;
  endDate?: string;
  duration: number;
  maxLearners: number;
  enrolledLearners: number;
  progress: number;
  description?: string;
  batchManager?: {
    id: string;
    name: string;
    email: string;
  };
  instructors: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  modules: Array<{
    name: string;
    description?: string;
    order: number;
    lessons: Array<any>;
    startDate?: string;
    endDate?: string;
  }>;
  resources?: Array<any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBatchData {
  name: string;
  courseId: string;
  startDate: string;
  duration: number;
  maxLearners?: number;
  description?: string;
}

export interface BatchStats {
  total: number;
  active: number;
  upcoming: number;
  completed: number;
  archived: number;
}

export const batchService = {
  // Get all batches
  async getBatches(params?: { status?: string; search?: string; page?: number; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await api.get(`/batches?${queryParams.toString()}`);
    return response.data;
  },

  // Get batch statistics
  async getBatchStats() {
    const response = await api.get('/batches/stats');
    return response.data;
  },

  // Create new batch
  async createBatch(data: CreateBatchData) {
    const response = await api.post('/batches', data);
    return response.data;
  },

  // Get single batch
  async getBatch(id: string) {
    const response = await api.get(`/batches/${id}`);
    return response.data;
  },

  // Update batch
  async updateBatch(id: string, data: Partial<CreateBatchData>) {
    const response = await api.patch(`/batches/${id}`, data);
    return response.data;
  },

  // Delete batch
  async deleteBatch(id: string) {
    const response = await api.delete(`/batches/${id}`);
    return response.data;
  },

  // Add module to batch
  async addModule(batchId: string, moduleData: any) {
    const response = await api.post(`/batches/${batchId}/modules`, moduleData);
    return response.data;
  },

  // Update module
  async updateModule(batchId: string, moduleIndex: number, moduleData: any) {
    const response = await api.patch(`/batches/${batchId}/modules/${moduleIndex}`, moduleData);
    return response.data;
  },

  // Delete module
  async deleteModule(batchId: string, moduleIndex: number) {
    const response = await api.delete(`/batches/${batchId}/modules/${moduleIndex}`);
    return response.data;
  },

  // Add resource
  async addResource(batchId: string, resourceData: any) {
    const response = await api.post(`/batches/${batchId}/resources`, resourceData);
    return response.data;
  },

  // Get resources
  async getResources(batchId: string) {
    const response = await api.get(`/batches/${batchId}/resources`);
    return response.data;
  },

  // Delete resource
  async deleteResource(batchId: string, resourceId: string) {
    const response = await api.delete(`/batches/${batchId}/resources/${resourceId}`);
    return response.data;
  },

  // Enroll student
  async enrollStudent(batchId: string, studentId: string) {
    const response = await api.post(`/batches/${batchId}/enroll`, { studentId });
    return response.data;
  },

  // Get learners
  async getLearners(batchId: string) {
    const response = await api.get(`/batches/${batchId}/learners`);
    return response.data;
  },

  // Remove student
  async removeStudent(batchId: string, studentId: string) {
    const response = await api.delete(`/batches/${batchId}/learners/${studentId}`);
    return response.data;
  },

  // Update progress
  async updateProgress(batchId: string, progress: number) {
    const response = await api.patch(`/batches/${batchId}/progress`, { progress });
    return response.data;
  },

  // Start batch
  async startBatch(batchId: string) {
    const response = await api.patch(`/batches/${batchId}/start`);
    return response.data;
  },

  // Complete batch
  async completeBatch(batchId: string) {
    const response = await api.patch(`/batches/${batchId}/complete`);
    return response.data;
  },

  // Archive batch
  async archiveBatch(batchId: string) {
    const response = await api.patch(`/batches/${batchId}/archive`);
    return response.data;
  },

  // Get public batch (for students)
  async getPublicBatch(id: string) {
    const response = await api.get(`/batches/public/${id}`);
    return response.data;
  }
};