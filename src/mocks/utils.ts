let idCounter = 1

export const generateId = (): string => `mock_${idCounter++}_${Date.now()}`

export function successResponse<T>(
  data: T,
  message = 'success'
): { code: number; message: string; data: T } {
  return { code: 200, message, data }
}

export function paginatedResponse<T>(
  list: T[],
  total: number,
  page: number,
  pageSize: number
): {
  code: number
  message: string
  data: { list: T[]; total: number; page: number; pageSize: number }
} {
  return {
    code: 200,
    message: 'success',
    data: { list, total, page, pageSize },
  }
}
