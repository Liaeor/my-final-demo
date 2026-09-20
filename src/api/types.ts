import { AxiosRequestConfig } from 'axios'

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PageResult<T = unknown> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface RequestConfig {
  headers?: Record<string, string>
  timeout?: number
  withCredentials?: boolean
}

export interface CustomAxiosRequestConfig {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch'
  url: string
  params?: object
  data?: object
  headers?: Record<string, string>
  timeout?: number
  withCredentials?: boolean
}

export interface CustomAxiosResponseConfig extends AxiosRequestConfig {
  retry?: RetryConfig
  retryCount?: number
  _isStream?: boolean // 自定义标识，表示这是一个流式请求
}

export interface RetryConfig {
  retries: number
  retryDelay: number
}

export interface CancelTokenSource {
  token: string
  cancel: () => void
}
