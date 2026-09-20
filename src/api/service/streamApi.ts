import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { request } from '../instance'
import { URLS } from '../URLS'

export const streamApi = {
  startStream(data: object, config?: AxiosRequestConfig) {
    // 由于 axios 对浏览器流支持不佳，有两个方案：1.使用 原生fetch ， fetch 支持；2.在 axios 请求配置中添加自定义适配器来处理流式响应
    // return post<ReadableStream>(URLS.STREAM, data, {
    //   adapter: "fetch",
    //   responseType: "stream",
    //   _isStream: true, // 自定义标识，表示这是一个流式请求
    //   ...config,
    // });
    return request<AxiosResponse>({
      method: 'post',
      url: URLS.STREAM,
      data,
      adapter: 'fetch',
      responseType: 'stream',
      timeout: 0, // 流式请求通常不设置超时
      _isStream: true, // 自定义标识，表示这是一个流式请求
      ...config,
    })
  },
}
