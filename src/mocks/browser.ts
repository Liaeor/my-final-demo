import { setupWorker } from 'msw/browser'
import { userHandlers } from './handlers/userHandlers'
import { productHandlers } from './handlers/productHandlers'
import streamHandlers from './handlers/streamHandlers'

export const worker = setupWorker(...userHandlers, ...productHandlers, ...streamHandlers)
