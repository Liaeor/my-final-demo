import { http, HttpResponse } from 'msw'
import { successResponse, paginatedResponse } from '../utils'
import { generateUsers, generateId } from '../../utils/fakerData'
import type { User } from '../../types/mock'

import { URLS } from '@/api/URLS'
const URL_PRE = import.meta.env.VITE_API_PRE ?? ''

const MockUsers = generateUsers(20)

export const userHandlers = [
  http.get(`${URL_PRE}${URLS.USERS}`, ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10)
    const allUsers = MockUsers
    const start = (page - 1) * pageSize
    const end = start + pageSize

    return HttpResponse.json(
      paginatedResponse(allUsers.slice(start, end), allUsers.length, page, pageSize)
    )
  }),

  http.get(`${URL_PRE}${URLS.USER_INFO}`, ({ params }) => {
    const userId = params.id
    const user = MockUsers.find((u) => u.id === userId)
    // return HttpResponse.json(null, { status: 500 });
    return HttpResponse.json(user ? successResponse(user) : successResponse(null))
  }),

  http.post(`${URL_PRE}${URLS.USERS}`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const newUser: User = {
      id: generateId(),
      ...(body as Partial<User>),
      createdAt: new Date().toISOString(),
    } as User
    return HttpResponse.json(successResponse(newUser, '创建成功'))
  }),

  http.put(`${URL_PRE}${URLS.USER_INFO}`, async ({ params, request }) => {
    const userId = params.id
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json(successResponse({ id: userId, ...body }, '更新成功'))
  }),

  http.delete(`${URL_PRE}${URLS.USER_INFO}`, ({ params }) => {
    const userId = params.id
    return HttpResponse.json(successResponse(null, `用户 ${userId} 删除成功`))
  }),
]
