import { Sparkles } from "lucide-react"

export default function Resultados() {
  return (
    <section id="dashboard" className="section-shell">
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

        <div className="grid gap-4 md:grid-cols-3 mb-8 justify-items-center md:justify-items-stretch">
          {[
            ["Indicadores", "Visão consolidada do negócio"],
            ["Performance", "Leituras rápidas do cenário"],
            ["Direção", "Tomada de decisão com base real"],
          ].map(([title, text]) => (
            <div key={title} className="tech-card p-5">
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/70">
                {title}
              </p>
              <p className="mt-2 text-slate-200">{text}</p>
            </div>
          ))}
        </div>

        <div className="tech-panel p-4 md:p-6">
          <div className="relative w-full overflow-hidden rounded-[22px] border border-white/10 pt-[100%] md:pt-[56.25%]">
            <iframe
              title="Dashboard Bi2B - Amostra Comercial"
              className="absolute left-0 top-0 h-full w-full"
              src="https://app.powerbi.com/view?r=eyJrIjoiZTYxNzQ5MjktYWZkMS00M2ZhLTg3YzAtMWE1ZWM0ZmJiMzE0IiwidCI6IjAwZTBjNDIzLTk2MzYtNGM0Mi1hMTMwLTlhNWI1YjQwYzg3YiJ9"
              frameBorder="0"
              allowFullScreen={true}
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}
