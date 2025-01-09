import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

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
  } catch (error) {
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


export type QueryKeyT = [string, object | undefined];

export const createQueryKeys = (endpoint: string) => ({
  all: [endpoint] as const,
  lists: () => [...createQueryKeys(endpoint).all, 'list'] as const,
  list: (filters: string) => [...createQueryKeys(endpoint).lists(), { filters }] as const,
  details: () => [...createQueryKeys(endpoint).all, 'detail'] as const,
  detail: (id: number) => [...createQueryKeys(endpoint).details(), id] as const,
});


