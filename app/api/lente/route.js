export async function POST(req) {
  try {
    const { image, lang } = await req.json();
    const is_es = lang === 'es';
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: image } },
            { type: 'text', text: is_es
              ? 'Eres LUMI, guia biologica de Lumera para mujeres 40+. Analiza esta comida en 3-4 frases cortas: que contiene, como afecta al GLP-1 y hormonas femeninas, y un consejo practico inmediato. Tono calido, cientifico y empoderador. Sin diagnosticar ni prescribir.'
              : 'You are LUMI, Lumera biological guide for women 40+. Analyse this food in 3-4 short sentences: what it contains, how it affects GLP-1 and female hormones, and one immediate practical tip. Warm, scientific and empowering tone. No diagnosing or prescribing.'
            }
          ]
        }]
      })
    });
    const data = await response.json();
    const analisis = data.content?.[0]?.text || (is_es ? 'No pude analizar la imagen.' : 'Could not analyse the image.');
    return Response.json({ analisis });
  } catch(e) {
    return Response.json({ analisis: is_es ? 'Error al analizar.' : 'Analysis error.' });
  }
}
