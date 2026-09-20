import { faker } from '@faker-js/faker'
import type { User, Product } from '../types/mock'

export const generateId = (): string =>
  `mock_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

export const generateUser = (): User => ({
  id: generateId(),
  name: faker.person.lastName() + faker.person.firstName(),
  email: faker.internet.email(),
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${faker.string.alphanumeric(8)}`,
  phone: faker.phone.number(),
  role: faker.helpers.arrayElement(['admin', 'user', 'guest']),
  status: faker.helpers.arrayElement(['active', 'inactive']),
  createdAt: faker.date.recent({ days: 30 }).toISOString(),
})

export const generateUsers = (count: number): User[] =>
  Array.from({ length: count }, () => generateUser())

export const generateProduct = (): Product => ({
  id: generateId(),
  name: faker.commerce.productName(),
  price: parseFloat(faker.commerce.price({ min: 10, max: 1000, dec: 2 })),
  description: faker.lorem.paragraph(2),
  category: faker.commerce.department(),
  stock: faker.number.int({ min: 0, max: 100 }),
  image: faker.image.url({ width: 200, height: 200 }),
  status: faker.helpers.arrayElement(['on_sale', 'off_sale']),
  createdAt: faker.date.recent({ days: 30 }).toISOString(),
})

export const generateProducts = (count: number): Product[] =>
  Array.from({ length: count }, () => generateProduct())
