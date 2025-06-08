'use server'

import OpenAI from 'openai'
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPEN_ROUTER_API_KEY!,
  defaultHeaders: {
    'X-Title': 'Dish Comment AI', // Optional. Site title for rankings on openrouter.ai.
  },
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const models = ['qwen/qwen3-30b-a3b:free', 'qwen/qwen3-32b:free', 'deepseek/deepseek-chat-v3-0324']

export async function generateComment(question: string, maxTokens: number, style: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-chat-v3-0324:free',
      messages: [
        {
          role: 'system',
          content: `
				你是一个餐厅点评生成器，根据用户的情况生成非常像真人的点评。
				输出要求：
				1. 直接输出纯文字
				2. 点评内容是积极向上的，除非用户明确要求批评
				3. 生成的字数一定要在 ${maxTokens} 到 ${maxTokens + 20} 之间，包括标点符号 [!important]
				4. 文字风格为${style}
				5. 用户可能输入点了哪些菜品，如果有的话，需要根据用户给的菜品生成点评
				6. 生成风格更像是真人点评，而不是机器点评，注意内容的换行，但不要出现空白行
				7. 点评内容要符合用户的情况，不要过于夸张
				8. 如果用户有一些要求，比如口味、环境、服务等，需要根据用户的要求生成点评
				`,
        },
        {
          role: 'user',
          content: question,
        },
      ],
    })
    return completion.choices[0].message.content
  } catch (error) {
    console.error(error)
    return '生成失败，请稍后再试'
  }
}
