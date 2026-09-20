export interface ResponseData<T = unknown> {
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

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  phone: string
  role: string
  status: 'active' | 'inactive'
  createdAt: string
}

export interface Product {
  id: string
  name: string
  price: number
  description: string
  category: string
  stock: number
  image: string
  status: 'on_sale' | 'off_sale'
  createdAt: string
}
