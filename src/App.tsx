import { useEffect, useState } from 'react'
import { onLoadingChange } from './api'
import Output from './components/Output'
import ApiDemo from './components/ApiDemo'

function App() {
  const [loading, setLoading] = useState(false)

  // 监听全局loading状态变化
  useEffect((): (() => void) => {
    const unsubscribe = onLoadingChange((count) => {
      setLoading(count > 0)
    })
    return unsubscribe
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>my Demo</h1>
      {loading && <p style={{ color: 'blue' }}>Global Loading...</p>}
      <ApiDemo />
      <Output />
    </div>
  )
}

export default App
