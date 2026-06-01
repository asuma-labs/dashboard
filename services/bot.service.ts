import apiClient from '../lib/axios';
import { ApiResponse } from '../types/api';
import { BotStatus, CloneBot, SystemStats } from '../types/bot';

export const botService = {
  async getStatus(): Promise<ApiResponse<BotStatus>> {
    const response = await apiClient.get<ApiResponse<BotStatus>>('/api/bot/status');
    return response.data;
  },

  async getSystemStats(): Promise<ApiResponse<SystemStats>> {
    const response = await apiClient.get<ApiResponse<SystemStats>>('/api/system/stats');
    return response.data;
  },

  async getClones(): Promise<ApiResponse<CloneBot[]>> {
    const response = await apiClient.get<ApiResponse<CloneBot[]>>('/api/clones');
    return response.data;
  },

  async startClone(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>(`/api/bot/${id}/start`);
    return response.data;
  },

  async stopClone(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>(`/api/bot/${id}/stop`);
    return response.data;
  },

  async restartClone(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>(`/api/bot/${id}/restart`);
    return response.data;
  }
};
