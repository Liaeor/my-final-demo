import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { userApi } from '../service/userApi'

// Mock 数据
const mockUsers = [
  {
    id: '1',
    name: '张三',
    email: 'zhangsan@test.com',
    phone: '13800000001',
    avatar: '',
    role: 'user',
    status: 'active' as const,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: '李四',
    email: 'lisi@test.com',
    phone: '13800000002',
    avatar: '',
    role: 'admin',
    status: 'active' as const,
    createdAt: '2024-01-02',
  },
]

// 配置 MSW Server
const server = setupServer(
  // GET /users - 获取用户列表
  http.get('*/users', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const pageSize = Number(url.searchParams.get('pageSize')) || 10

    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: {
        list: mockUsers,
        total: mockUsers.length,
        page,
        pageSize,
      },
    })
  }),

  // GET /users/:id - 获取单个用户
  http.get('*/users/:id', ({ params }) => {
    const user = mockUsers.find((u) => u.id === params.id)
    if (user) {
      return HttpResponse.json({
        code: 200,
        message: 'success',
        data: user,
      })
    }
    return HttpResponse.json({ code: 404, message: 'User not found', data: null }, { status: 404 })
  }),

  // POST /users - 创建用户
  http.post('*/users', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const newUser = {
      id: '999',
      ...body,
      createdAt: new Date().toISOString(),
    }
    return HttpResponse.json(
      {
        code: 200,
        message: 'success',
        data: newUser,
      },
      { status: 201 }
    )
  }),

  // PUT /users/:id - 更新用户
  http.put('*/users/:id', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const updatedUser = {
      id: params.id,
      ...body,
    }
    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: updatedUser,
    })
  }),

  // DELETE /users/:id - 删除用户
  http.delete('*/users/:id', () => {
    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: null,
    })
  })
)

// 在所有测试前启动 Server
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// 每个测试后重置 handlers
afterEach(() => server.resetHandlers())

// 所有测试后关闭 Server
afterAll(() => server.close())

describe('userApi', () => {
  describe('getList', () => {
    it('应该返回用户列表', async () => {
      const result = await userApi.getList(1, 10)

      expect(result.code).toBe(200)
      expect(result.data.list).toHaveLength(2)
      expect(result.data.list[0].name).toBe('张三')
      expect(result.data.list[1].name).toBe('李四')
    })

    it('应该返回分页信息', async () => {
      const result = await userApi.getList(2, 5)

      expect(result.data.page).toBe(2)
      expect(result.data.pageSize).toBe(5)
      expect(result.data.total).toBe(2)
    })
  })

  describe('getById', () => {
    it('应该返回单个用户', async () => {
      const result = await userApi.getById('1')

      expect(result.code).toBe(200)
      expect(result.data.name).toBe('张三')
      expect(result.data.email).toBe('zhangsan@test.com')
    })

    it('用户不存在时应该返回 404', async () => {
      await expect(userApi.getById('999')).rejects.toThrow()
    })
  })

  describe('create', () => {
    it('应该创建新用户', async () => {
      const newUserData = {
        name: '王五',
        email: 'wangwu@test.com',
        phone: '13800000003',
        avatar: '',
        role: 'user' as const,
        status: 'active' as const,
        createdAt: '',
      }

      const result = await userApi.create(newUserData)

      expect(result.code).toBe(200)
      expect(result.data.name).toBe('王五')
      expect(result.data.id).toBe('999')
    })
  })

  describe('update', () => {
    it('应该更新用户信息', async () => {
      const updateData = {
        name: '张三（已更新）',
        email: 'zhangsan_new@test.com',
      }

      const result = await userApi.update('1', updateData)

      expect(result.code).toBe(200)
      expect(result.data.name).toBe('张三（已更新）')
      expect(result.data.email).toBe('zhangsan_new@test.com')
    })
  })

  describe('delete', () => {
    it('应该删除用户', async () => {
      const result = await userApi.delete('1')

      expect(result.code).toBe(200)
    })
  })

  describe('错误处理', () => {
    it('网络错误时应该抛出异常', async () => {
      // 临时覆盖 handler 来模拟网络错误
      server.use(
        http.get('*/users', () => {
          return HttpResponse.error()
        })
      )

      await expect(userApi.getList()).rejects.toThrow()
    })

    it('服务器错误时应该抛出异常', async () => {
      server.use(
        http.get('*/users', () => {
          return HttpResponse.json(
            { code: 500, message: 'Internal Server Error', data: null },
            { status: 500 }
          )
        })
      )

      await expect(userApi.getList()).rejects.toThrow()
    })
  })
})
