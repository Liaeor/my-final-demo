import { streamApi } from '@/api'
import { useState } from 'react'

// 流式输出示例
function Output() {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const startStreaming = async () => {
    setIsLoading(true)
    setContent('') // 清空旧内容

    try {
      // 1. 发起请求
      // axios 对浏览器流支持很差，fetch 原生支持流式响应，更适合处理这种场景
      // const response = await fetch(URLS.STREAM, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ prompt: '讲一个故事' }),
      // });
      const response = await streamApi.startStream({ prompt: '讲一个故事' })
      if (!response) throw new Error('网络响应错误')
      if (!response.data) throw new Error('浏览器不支持 ReadableStream')

      // 2. 获取流读取器
      const reader = response.data.getReader()

      // 3. 创建文本解码器 (将二进制数据转为字符串)
      const decoder = new TextDecoder()

      let buffer = '' // 缓冲区：用于处理被截断的 JSON 或文本

      // 4. 循环读取数据流
      while (true) {
        const { done, value } = await reader.read()

        // 如果读取完毕，跳出循环
        if (done) break

        // 5. 解码当前数据块
        // stream: true 表示保留不完整字符到下一次解码
        const chunk = decoder.decode(value, { stream: true })

        // 将新接收的块与缓冲区拼接
        buffer += chunk

        // 6. 处理数据 (假设后端返回的是 SSE 格式: data: xxx\n\n)
        const lines = buffer.split('\n')

        // 保留最后一行（可能是不完整的），放回 buffer 等待下一次拼接
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const text = line.slice(6) // 去掉 "data: " 前缀
            if (text === '[DONE]') {
              // 结束信号
              break
            }
            // 7. 实时渲染到页面
            setContent((prev) => prev + text)
          }
        }
      }
    } catch (error) {
      console.error('流式输出出错:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Output a story</h1>
      <button
        onClick={startStreaming}
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          backgroundColor: isLoading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        {isLoading ? '加载中...' : '开始生成故事'}
      </button>

      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          minHeight: '100px',
          lineHeight: '1.6',
        }}
      >
        {content}
      </div>
    </div>
  )
}

export default Output
