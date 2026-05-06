export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  try {
    const { messages } = req.body

    const response = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.POLLINATIONS_API_KEY}`,
      },
      body: JSON.stringify({
        messages,
        model: "openai",
      }),
    })

    const text = await response.text()
    const contentType = response.headers.get("content-type") || ""

    if (!response.ok) {
      console.error(
        "Pollinations upstream error:",
        response.status,
        text.slice(0, 500),
      )
      return res.status(response.status).json({
        error: "Falha ao consultar o serviço de IA",
        upstreamStatus: response.status,
        upstreamBody: text.slice(0, 500),
      })
    }

    if (
      contentType.includes("text/html") ||
      /^\s*<!DOCTYPE html/i.test(text) ||
      /^\s*<html[\s>]/i.test(text)
    ) {
      console.error(
        "Pollinations returned HTML instead of text:",
        text.slice(0, 500),
      )
      return res.status(502).json({
        error: "Resposta inválida do serviço de IA",
        upstreamBody: text.slice(0, 500),
      })
    }

    return res.status(200).json({ text })
  } catch (error) {
    console.error("API Error:", error)
    return res.status(500).json({ error: "Erro no backend da Vercel" })
  }
}
