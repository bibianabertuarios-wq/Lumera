import Anthropic from '@anthropic-ai/sdk';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages, system } = body;

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'Invalid messages' }, { status: 400 });
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: system || 'You are LUMI, a hormonal wellness coach for women 40+.',
      messages: messages,
    });

    return Response.json(response);
  } catch (error) {
    console.error('LUMI API error:', error.message);
    return Response.json(
      { 
        error: 'Failed to process request', 
        content: [{ type: 'text', text: 'Lo siento, no pude procesar tu solicitud. Inténtalo de nuevo.' }] 
      },
      { status: 500 }
    );
  }
}
