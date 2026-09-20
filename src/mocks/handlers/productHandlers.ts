import { http, HttpResponse } from 'msw'
import { successResponse, paginatedResponse } from '../utils'
import { generateProducts, generateId } from '../../utils/fakerData'
import type { Product } from '../../types/mock'

const MockProducts = generateProducts(30)

export const productHandlers = [
  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10)
    const category = url.searchParams.get('category')
    let products = MockProducts

    if (category) {
      products = products.filter((p) => p.category === category)
    }

    const start = (page - 1) * pageSize
    const end = start + pageSize

    return HttpResponse.json(
      paginatedResponse(products.slice(start, end), products.length, page, pageSize)
    )
  }),

  http.get('/api/products/:id', ({ params }) => {
    const product = MockProducts.find((p) => p.id === params.id)
    return HttpResponse.json(product ? successResponse(product) : successResponse(null))
  }),

  http.post('/api/products', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const newProduct: Product = {
      id: generateId(),
      ...(body as Partial<Product>),
      createdAt: new Date().toISOString(),
    } as Product
    return HttpResponse.json(successResponse(newProduct, '创建成功'))
  }),

  http.put('/api/products/:id', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json(successResponse({ id: params.id, ...body }, '更新成功'))
  }),

  http.delete('/api/products/:id', () => {
    return HttpResponse.json(successResponse(null, '删除成功'))
  }),
]
