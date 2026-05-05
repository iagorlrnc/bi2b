export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages } = req.body;

    const response = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.POLLINATIONS_API_KEY}`
      },
      body: JSON.stringify({
        messages,
        model: "openai"
      })
    });

    const text = await response.text();

    res.status(200).json({ text });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Erro no backend da Vercel' });
  }
}
