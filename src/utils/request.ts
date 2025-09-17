/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import axios, { type AxiosRequestConfig } from 'axios';
import { notification } from 'metis-ui';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipErrorHandler?: boolean;
    originResponse?: boolean;
  }
}

// 与后端约定的响应数据格式
export type ResponseStructure<T = any, U extends Record<string, any> = {}> = {
  success: boolean;
  data: T;
  errorCode?: number;
  errorMessage?: string;
} & U;

// 获取 token 的方法（可根据实际项目调整）
export function getToken(): string | null {
  return sessionStorage.getItem('token');
}

// 获取 token 的方法（可根据实际项目调整）
export function setToken(token: string) {
  sessionStorage.setItem('token', token);
}

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 请求拦截器：自动携带 token
request.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 错误处理函数：统一处理错误
const handleError = (error: any) => {
  const config = error.config || {};
  if (config.skipErrorHandler) {
    return Promise.reject(error);
  }

  // 自动定义错误。
  if (error.name === 'BizError') {
    const errorInfo: ResponseStructure | undefined = error.info;
    if (errorInfo) {
      const { errorMessage, errorCode } = errorInfo;
      notification.error({
        description: errorMessage,
        message: `${errorCode ? `Error Code: ${errorCode}` : 'Error'}`,
      });
    }
  } else if (error.response) {
    // Axios 的错误
    // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
    notification.error({ message: `Response status:${error.response.status}` });
  } else if (error.request) {
    // 请求已经成功发起，但没有收到响应
    // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
    // 而在node.js中是 http.ClientRequest 的实例
    notification.error({ message: 'None response! Please retry.' });
  } else {
    // 发送请求时出了点问题
    notification.error({ message: 'Request error, please retry.' });
  }

  return Promise.reject(error);
};

// 响应拦截器：统一处理 token 失效和错误
request.interceptors.response.use((response) => {
  // 拦截响应数据，进行个性化处理
  const { data: responseData, config } = response;
  const { success, data, errorCode, errorMessage } = responseData as ResponseStructure;

  if (!success) {
    const error: any = new Error(errorMessage);
    error.name = 'BizError';
    error.info = { errorCode, errorMessage, data };
    error.config = config;
    return handleError(error);
  }

  return config.originResponse ? response : (responseData as any);
}, handleError);

export default request as unknown as {
  getUri(config?: AxiosRequestConfig): string;
  request<T = any, U extends Record<string, any> = {}>(
    config: AxiosRequestConfig,
  ): Promise<ResponseStructure<T, U>>;
  get<T = any, U extends Record<string, any> = {}>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ResponseStructure<T, U>>;
  delete<T = any, U extends Record<string, any> = {}>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ResponseStructure<T, U>>;
  head<T = any, U extends Record<string, any> = {}>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ResponseStructure<T, U>>;
  options<T = any, U extends Record<string, any> = {}>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ResponseStructure<T, U>>;
  post<T = any, U extends Record<string, any> = {}>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ResponseStructure<T, U>>;
  put<T = any, U extends Record<string, any> = {}>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ResponseStructure<T, U>>;
  patch<T = any, U extends Record<string, any> = {}>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ResponseStructure<T, U>>;
  postForm<T = any, U extends Record<string, any> = {}>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ResponseStructure<T, U>>;
  putForm<T = any, U extends Record<string, any> = {}>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ResponseStructure<T, U>>;
  patchForm<T = any, U extends Record<string, any> = {}>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ResponseStructure<T, U>>;
};
