import { describe, it, expect } from 'vitest'
import {
  generateId,
  generateUser,
  generateUsers,
  generateProduct,
  generateProducts,
} from '../fakerData'

describe('fakerData 工具函数', () => {
  describe('generateId', () => {
    it('应该返回以 mock_ 开头的字符串', () => {
      const id = generateId()
      expect(id).toMatch(/^mock_/)
    })

    it('每次生成的 ID 应该不同', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })
  })

  describe('generateUser', () => {
    it('应该返回完整的 User 对象', () => {
      const user = generateUser()

      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('name')
      expect(user).toHaveProperty('email')
      expect(user).toHaveProperty('avatar')
      expect(user).toHaveProperty('phone')
      expect(user).toHaveProperty('role')
      expect(user).toHaveProperty('status')
      expect(user).toHaveProperty('createdAt')
    })

    it('id 应该以 mock_ 开头', () => {
      const user = generateUser()
      expect(user.id).toMatch(/^mock_/)
    })

    it('role 应该是 admin/user/guest 之一', () => {
      const user = generateUser()
      expect(['admin', 'user', 'guest']).toContain(user.role)
    })

    it('status 应该是 active/inactive 之一', () => {
      const user = generateUser()
      expect(['active', 'inactive']).toContain(user.status)
    })

    it('email 应该包含 @ 符号', () => {
      const user = generateUser()
      expect(user.email).toContain('@')
    })
  })

  describe('generateUsers', () => {
    it('应该返回指定数量的用户', () => {
      const users = generateUsers(5)
      expect(users).toHaveLength(5)
    })

    it('应该返回 10 个用户', () => {
      const users = generateUsers(10)
      expect(users).toHaveLength(10)
    })

    it('每个用户都应该有唯一的 ID', () => {
      const users = generateUsers(20)
      const ids = users.map((u) => u.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(20)
    })
  })

  describe('generateProduct', () => {
    it('应该返回完整的 Product 对象', () => {
      const product = generateProduct()

      expect(product).toHaveProperty('id')
      expect(product).toHaveProperty('name')
      expect(product).toHaveProperty('price')
      expect(product).toHaveProperty('description')
      expect(product).toHaveProperty('category')
      expect(product).toHaveProperty('stock')
      expect(product).toHaveProperty('image')
      expect(product).toHaveProperty('status')
      expect(product).toHaveProperty('createdAt')
    })

    it('price 应该是正数', () => {
      const product = generateProduct()
      expect(product.price).toBeGreaterThan(0)
    })

    it('stock 应该是非负数', () => {
      const product = generateProduct()
      expect(product.stock).toBeGreaterThanOrEqual(0)
    })

    it('status 应该是 on_sale/off_sale 之一', () => {
      const product = generateProduct()
      expect(['on_sale', 'off_sale']).toContain(product.status)
    })
  })

  describe('generateProducts', () => {
    it('应该返回指定数量的产品', () => {
      const products = generateProducts(3)
      expect(products).toHaveLength(3)
    })

    it('每个产品都应该有唯一的 ID', () => {
      const products = generateProducts(15)
      const ids = products.map((p) => p.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(15)
    })
  })
})
