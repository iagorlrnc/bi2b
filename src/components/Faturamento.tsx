import { useEffect } from "react"
import { ArrowLeft, Sparkles } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"

export default function Faturamento() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [])

  const handleBack = () => {
    if (location.state?.fromInternalLink) {
      navigate(-1)
      return
    }

    navigate("/")
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-50">
        <button
          onClick={handleBack}
          aria-label="Voltar para a página anterior"
          className="tech-button-primary bg-gradient-to-r from-[#0d6084] to-[#0a4a62] px-6 py-3 shadow-[0_14px_40px_rgba(13,96,132,0.28)] hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(13,96,132,0.34)]"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>
      </div>

      <section className="section-shell pt-24">
        <div className="container mx-auto px-6 relative z-10">
          <div className="mb-10 max-w-4xl mx-auto text-center md:text-left md:mx-0">
            <div className="section-label mb-5 w-fit mx-auto md:mx-0">
              <Sparkles size={14} />
              Resultados e leitura de dados
            </div>
            <h1 className="section-title mb-4">Painel de Faturamento</h1>
            <p className="section-copy max-w-2xl mx-auto md:mx-0">
              Visualize os indicadores em tempo real com o painel PowerBI.
            </p>
          </div>

          <div className="tech-panel p-4 md:p-6">
            <div className="relative w-full overflow-hidden rounded-[22px] border border-white/10 pt-[100%] md:pt-[56.25%]">
              <iframe
                title="Dashboard Bi2B - Amostra Comercial"
                className="absolute left-0 top-0 h-full w-full"
                src="https://app.powerbi.com/view?r=eyJrIjoiZTYxNzQ5MjktYWZkMS00M2ZhLTg3YzAtMWE1ZWM0ZmJiMzE0IiwidCI6IjAwZTBjNDIzLTk2MzYtNGM0Mi1hMTMwLTlhNWI1YjQwYzg3YiJ9"
                loading="eager"
                frameBorder="0"
                allowFullScreen={true}
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
