import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

async function enableMocking() {
  const { worker } = await import('./mocks/browser.ts')
  return worker.start({ onUnhandledRequest: 'bypass' })
}

const renderApp = () => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

if (import.meta.env.VITE_APP_ENV === 'development') {
  enableMocking().then(() => {
    renderApp()
  })
} else {
  renderApp()
}
