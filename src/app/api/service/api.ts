import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { refreshToken } from './auth'
import { getCookie } from './cookie'
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});
  
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = getCookie('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

async function apiCall<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    let response: AxiosResponse<T>;

    switch (method) {
      case 'GET':
        response = await axiosInstance.get<T>(url, config);
        break;
      case 'POST':
        response = await axiosInstance.post<T>(url, data, config);
        break;
      case 'PUT':
        response = await axiosInstance.put<T>(url, data, config);
        break;
      case 'PATCH':
        response = await axiosInstance.patch<T>(url, data, config);
        break;
      case 'DELETE':
        response = await axiosInstance.delete<T>(url, config);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      await refreshToken()
      return apiCall(method, url, data, config)
    }
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
}

export const get = <T>(url: string, config?: AxiosRequestConfig) =>
  apiCall<T>('GET', url, undefined, config);

export const post = <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
  apiCall<T>('POST', url, data, config);

export const put = <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
  apiCall<T>('PUT', url, data, config);

export const patch = <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
  apiCall<T>('PATCH', url, data, config);

export const del = <T>(url: string, config?: AxiosRequestConfig) =>
  apiCall<T>('DELETE', url, undefined, config);

