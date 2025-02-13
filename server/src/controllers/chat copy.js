const OpenAI = require('openai');

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'your-api-key'


const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: DEEPSEEK_API_KEY  // 请替换成您的实际API Key
});

exports.chat = async (ctx) => {
  try {
    const { message } = ctx.request.body

    if (!message) {
      ctx.throw(400, '消息不能为空')
    }

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: message
        }
      ],
      model: "deepseek-chat",
    });


    ctx.body = {
      code: 200,
      data: completion.choices[0].message.content
    }
  } catch (error) {
    console.error('DeepSeek API Error:', error.response?.data || error.message)
    ctx.throw(500, '服务器错误')
  }
} 