const OpenAI = require('openai');

const ARK_API_KEY = process.env.ARK_API_KEY || 'your-api-key'


const openai = new OpenAI({
  baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
  apiKey: ARK_API_KEY  // 请替换成您的实际API Key
});

exports.chat = async (ctx) => {
  try {
    const { message } = ctx.request.body

    if (!message) {
      ctx.throw(400, '消息不能为空')
    }
    // 设置正确的响应头
    ctx.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    ctx.status = 200;  // 明确设置状态码

    const stream = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: message
        }
      ],
      model: "ep-20250213143558-6dzx9",
      parameters: {               // 添加必要的参数
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 1024
      },
      stream: true
    });

    // 处理流式响应
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        // 发送数据块
        ctx.res.write(`data: ${JSON.stringify({
          code: 200,
          data: content
        })}\n\n`);
      }
    }

    // 结束响应
    ctx.res.end();
  } catch (error) {
    console.error('DeepSeek API Error:', error.response?.data || error.message)
    ctx.throw(500, '服务器错误')
  }
} 