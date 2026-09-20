// src/test/setup.ts
import '@testing-library/jest-dom'

// MSW 浏览器模式（如果需要在测试中使用 MSW）
// import { server } from '../mocks/browser'
// beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
// afterEach(() => server.resetHandlers())
// afterAll(() => server.close())
