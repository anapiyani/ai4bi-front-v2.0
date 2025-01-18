import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { getCookie, setCookie } from './cookie'
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const axiosRefreshInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: AxiosResponse<any>) => void;
  reject: (error: any) => void;
}> = [];


const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve({ data: token } as AxiosResponse);
    }
  });
  failedQueue = [];
};


const refreshToken = async (): Promise<void> => {
  try {
    const refresh_token = getCookie('refresh_token');
    if (!refresh_token) throw new Error('No refresh token available');

    const response = await axiosRefreshInstance.post('/user/refresh/', {
      refresh_token: refresh_token,
    });

    const { access_token, refresh_token: new_refresh_token } = response.data;
    setCookie('access_token', access_token);
    setCookie('refresh_token', new_refresh_token);
  } catch (error: any) {
    window.location.href = '/login';
    throw error;
  }
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 || error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        try {
          await refreshToken();
          processQueue(null);
          resolve(axiosInstance(originalRequest));
        } catch (err) {
          processQueue(err, null);
          reject(err);
        } finally {
          isRefreshing = false;
        }
      });
    }

    return Promise.reject(error);
  }
);

async function apiCall<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
  retryCount: number = 0
): Promise<T> {
  const MAX_RETRIES = 3; 

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
    if (retryCount >= MAX_RETRIES) {
      throw new Error(error.response?.data?.message || error.message);
    }

    if (error.response?.status === 403 || error.response?.status === 401) {
      try {
        await refreshToken();
        return apiCall(method, url, data, config, retryCount + 1);
      } catch (refreshError: any) {  
        throw new Error(refreshError.response?.data?.message || refreshError.message);
      }
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
