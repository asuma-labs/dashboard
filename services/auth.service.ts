import apiClient from '../lib/axios';
import { ApiResponse } from '../types/api';
import { LoginResponse, RegisterRequest, User } from '../types/auth';

export const authService = {
  async login(identifier: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/login', { identifier, password });
    return response.data;
  },

  async register(data: RegisterRequest): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>('/api/register', data);
    return response.data;
  },

  async getUser(id: string | number): Promise<ApiResponse<User>> {
    const response = await apiClient.get<ApiResponse<User>>(`/api/user/${id}`);
    return response.data;
  }
};
