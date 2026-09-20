import { http } from 'msw'
import { URLS } from '@/api/URLS'
const URL_PRE = import.meta.env.VITE_API_PRE ?? ''

export default [
  http.post(`${URL_PRE}${URLS.STREAM}`, async () => {
    // 模拟流式输出故事
    const story = [
      '从前，有一个勇敢的小骑士。',
      '他听说在遥远的彩虹山后面有一座神秘的水晶城堡。',
      '小骑士决定踏上冒险之旅，去寻找这座传说中的城堡。',
      '在旅途中，他遇到了一位智慧的老树。',
      '老树告诉小骑士，彩虹山上住着一只石像鬼，它会阻止任何试图接近城堡的人。',
    ]
      .join('')
      .split('')

    const encoder = new TextEncoder()
    let index = 0
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const stream = new ReadableStream({
      start(controller) {
        const push = () => {
          if (index < story.length) {
            controller.enqueue(encoder.encode(`data: ${story[index]}\n\n`))
            index += 1
            timeoutId = setTimeout(push, 100)
          } else {
            controller.enqueue(encoder.encode(' data: [DONE]\n\n'))
            controller.close()
          }
        }

        push()
      },
      cancel() {
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
      },
    })
    // 返回一个流式响应，Content-Type 设置为 text/event-stream，模拟 SSE（Server-Sent Events）格式
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream;charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  }),
]
