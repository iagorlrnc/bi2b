import { useEffect } from "react"
import { Sparkles } from "lucide-react"
import { Link } from "react-router-dom"

const RETURN_SCROLL_KEY = "bi2b:faturamento:return-scroll"

export default function Resultados() {
  const powerBiSrc =
    "https://app.powerbi.com/view?r=eyJrIjoiZTYxNzQ5MjktYWZkMS00M2ZhLTg3YzAtMWE1ZWM0ZmJiMzE0IiwidCI6IjAwZTBjNDIzLTk2MzYtNGM0Mi1hMTMwLTlhNWI1YjQwYzg3YiJ9"

  useEffect(() => {
    const storedScroll = sessionStorage.getItem(RETURN_SCROLL_KEY)
    if (!storedScroll) return

    sessionStorage.removeItem(RETURN_SCROLL_KEY)
    const top = Number(storedScroll)
    if (Number.isFinite(top)) {
      requestAnimationFrame(() => {
        window.scrollTo({ top, behavior: "auto" })
      })
    }
  }, [])

  const cards = [
    {
      title: "Faturamento",
      text: "Visão consolidada do negócio",
      to: "/faturamento",
    },
    {
      title: "Performance",
      text: "Leituras rápidas do cenário operacional",
      to: "/performance",
    },
    {
      title: "Estratégia",
      text: "Direcionamento estratégico com dados",
      to: "/estrategia",
    },
  ]

  return (
    <section id="dashboard" className="section-shell pt-6">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-14 max-w-4xl mx-auto text-center md:text-left md:mx-0">
          <div className="section-label mb-5 w-fit mx-auto md:mx-0">
            <Sparkles size={14} />
            Resultados e leitura de dados
          </div>
          <h2 className="section-title mb-4">Nossos Resultados</h2>
          <p className="section-copy max-w-2xl mx-auto md:mx-0">
            Um painel que reforça a proposta da marca: leitura direta, análise
            clara e decisões mais seguras com base em informação.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.title}
              to={card.to}
              state={{ fromInternalLink: true }}
              onClick={() => {
                sessionStorage.setItem(
                  RETURN_SCROLL_KEY,
                  String(window.scrollY),
                )
              }}
              className="tech-card w-full p-5"
            >
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/70">
                {card.title}
              </p>
              <p className="mt-2 text-slate-200">{card.text}</p>
            </Link>
          ))}
        </div>

        <p className="mb-4 pt-4 text-center text-sm text-red-500">
          Clique nos cards acima para abrir os paineis com nossos resultados.
        </p>

        <iframe
          title="Pré-carregamento do painel PowerBI"
          src={powerBiSrc}
          className="pointer-events-none absolute left-0 top-0 h-px w-px opacity-0"
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>
    </section>
  )
}
