import { ArrowRight, Home } from "lucide-react"
import { Link } from "react-router-dom"
import bpontoImg from "../assets/img/bponto.png"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(13,96,132,0.24),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(255,0,0,0.12),_transparent_24%)]" />

      <div className="w-full max-w-3xl">
        <div className="tech-panel p-8 md:p-12 text-center border-white/10">
          <div className="mb-6 flex justify-center">
            <img
              src={bpontoImg}
              alt="Bi2B"
              className="h-12 w-auto sm:h-14 md:h-16"
            />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200/70 mb-4">
            Erro 404
          </p>
          <h1 className="section-title mb-4">Pagina nao encontrada</h1>
          <p className="section-copy mx-auto max-w-2xl mb-10">
            A rota que voce tentou acessar nao existe ou foi movida. <br />
            Escolha um dos atalhos abaixo para continuar navegando.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              to="/"
              className="tech-button-primary justify-center bg-gradient-to-r from-[#0d6084] to-[#0a4a62] px-6 py-3 shadow-[0_12px_36px_rgba(13,96,132,0.26)] hover:-translate-y-0.5 hover:shadow-[0_16px_44px_rgba(13,96,132,0.32)]"
            >
              <Home size={18} />
              Início
            </Link>

            <Link
              to="/abrir-minha-empresa"
              className="tech-button-primary justify-center border border-white/15 bg-white/6 px-6 py-3 hover:bg-white/10"
            >
              <ArrowRight size={18} />
              Abrir minha empresa
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
