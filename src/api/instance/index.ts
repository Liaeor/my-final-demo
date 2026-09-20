import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosRequestConfig,
} from 'axios'
import type { ApiResponse, RetryConfig, CustomAxiosResponseConfig } from '../types'

const BASE_URL = import.meta.env.VITE_API_PRE || '/api'
const TIMEOUT = 10000

let loadingCount = 0
const loadingListeners: Set<(count: number) => void> = new Set()

export const onLoadingChange = (listener: (count: number) => void) => {
  loadingListeners.add(listener)
  return () => loadingListeners.delete(listener)
}

// 统一loading状态管理
const updateLoading = (delta: number) => {
  loadingCount += delta
  loadingListeners.forEach((listener) => listener(loadingCount))
}

// 创建Axios实例
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
})

// 请求拦截器(多个 后进先出)
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    console.log(`[Request] ${config.method?.toUpperCase()} ${config.url}`)
    updateLoading(1)

    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError): Promise<never> => {
    updateLoading(-1)
    return Promise.reject(error)
  }
)

// 响应拦截器(多个 先进先出)
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    console.log(`[Response] ${response.config.url}`, response.data)

    updateLoading(-1)
    // 统一处理业务错误（code !== 200）

    // 对于流式响应，直接返回原始响应对象，由调用方处理流式数据
    if ((response.config as CustomAxiosResponseConfig)._isStream) {
      return response
    }
    const { code, message } = response.data
    if (code !== 200) {
      throw new Error(message || 'Request failed')
    }
    return response
  },
  async (error: AxiosError): Promise<unknown> => {
    updateLoading(-1)
    // 处理 401 未授权（Token 过期）
    if (error.response?.status === 401) {
      // 尝试刷新 Token
      const newToken = await refreshToken()
      if (newToken) {
        // 重试原请求
        if (error.config) {
          error.config.headers.Authorization = `Bearer ${newToken}`
          return axiosInstance(error.config)
        }
      }
    }
    // 处理网络错误和服务器错误的自动重试
    const config = error.config as CustomAxiosResponseConfig
    const retry = config?.retry
    if (retry && shouldRetry(error)) {
      return retryRequest(error, retry)
    }
    return Promise.reject(error)
  }
)

const shouldRetry = (error: AxiosError) => {
  if (!error.response) return true
  return [429].includes(error.response.status) || error.response.status >= 500
}

// 重试请求
const retryRequest = async (error: AxiosError, retryConfig: RetryConfig): Promise<ApiResponse> => {
  // retries: 重试次数，retryDelay: 每次重试的间隔时间（毫秒）
  const { retries, retryDelay } = retryConfig
  const config = error.config as CustomAxiosResponseConfig

  if (!config || (config.retryCount ?? 0) >= retries) {
    return Promise.reject(error)
  }

  config.retryCount = (config.retryCount || 0) + 1

  await new Promise((resolve) => setTimeout(resolve, retryDelay))

  return axiosInstance(config)
}

// 基础CRUD请求方法
export const get = <T>(
  url: string,
  params?: object,
  config?: CustomAxiosResponseConfig
): Promise<ApiResponse<T>> => {
  const requestConfig: AxiosRequestConfig = { params, ...config }

  return axiosInstance.get<ApiResponse<T>>(url, requestConfig).then((res) => res.data)
}

export const post = <T>(
  url: string,
  data?: object,
  config?: CustomAxiosResponseConfig
): Promise<ApiResponse<T>> => {
  const requestConfig: AxiosRequestConfig = { ...config }

  return axiosInstance.post<ApiResponse<T>>(url, data, requestConfig).then((res) => res.data)
}

export const put = <T>(
  url: string,
  data?: object,
  config?: CustomAxiosResponseConfig
): Promise<ApiResponse<T>> => {
  const requestConfig: AxiosRequestConfig = { ...config }

  return axiosInstance.put<ApiResponse<T>>(url, data, requestConfig).then((res) => res.data)
}

export const del = <T>(
  url: string,
  config?: CustomAxiosResponseConfig
): Promise<ApiResponse<T>> => {
  const requestConfig: AxiosRequestConfig = { ...config }

  return axiosInstance.delete<ApiResponse<T>>(url, requestConfig).then((res) => res.data)
}

export const request = <T>(config: CustomAxiosResponseConfig): Promise<T> => {
  const makeRequest = () => axiosInstance(config) as Promise<T>

  return makeRequest().then((res) => res)
}

// 刷新 Token
export const refreshToken = async (): Promise<string | null> => {
  const refreshTokenValue = localStorage.getItem('refreshToken')
  if (!refreshTokenValue) return null

  try {
    const response = await axios.post('/api/refresh', {
      refreshToken: refreshTokenValue,
    })
    const { token } = response.data.data as { token: string }
    localStorage.setItem('token', token)
    return token
  } catch {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'
    return null
  }
}

export default axiosInstance
