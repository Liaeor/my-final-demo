import { get, post, put, del } from '../instance'
import type { PageResult } from '../types'
import type { Product } from '../../types/mock'

export const productApi = {
  getList: (page = 1, pageSize = 10, category?: string) =>
    get<PageResult<Product>>('/products', { page, pageSize, ...(category ? { category } : {}) }),

  getById: (id: string) => get<Product>(`/products/${id}`),

  create: (data: Partial<Product>) => post<Product>('/products', data),

  update: (id: string, data: Partial<Product>) => put<Product>(`/products/${id}`, data),

  delete: (id: string) => del<void>(`/products/${id}`),
}

export type ProductApi = typeof productApi
