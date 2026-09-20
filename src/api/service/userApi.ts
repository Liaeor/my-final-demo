import { get, post, put, del } from '../instance'
import type { PageResult } from '../types'
import type { User } from '../../types/mock'
import { URLS } from '../URLS'

export const userApi = {
  getList: (page = 1, pageSize = 10) => get<PageResult<User>>(URLS.USERS, { page, pageSize }),

  getById: (id: string) =>
    get<User>(
      `${URLS.USERS}/${id}`,
      {},
      {
        retry: {
          retries: 3,
          retryDelay: 1000,
        },
      }
    ),

  create: (data: Partial<User>) => post<User>(URLS.USERS, data),

  update: (id: string, data: Partial<User>) => put<User>(`${URLS.USERS}/${id}`, data),

  delete: (id: string) => del<void>(`${URLS.USERS}/${id}`),
}

export type UserApi = typeof userApi
