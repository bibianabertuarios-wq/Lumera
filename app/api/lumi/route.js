import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages, system, userId, language } = body;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: system || 'You are LUMI, a hormonal wellness coach for women 40+.',
      messages: messages,
    });

    return Response.json(response);
  } catch (error) {
    console.error('LUMI API error:', error);
    return Response.json(
      { error: 'Failed to process request', content: [{ text: 'Lo siento, no pude procesar tu solicitud.' }] },
      { status: 500 }
    );
  }
}
