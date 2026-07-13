import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useCookie } from "../contexts/CookieContext"
import { ShieldCheck, Settings } from "lucide-react"

export default function CookieBanner() {
  const { isBannerOpen, acceptAll, rejectAll, savePreferences, preferences } = useCookie()
  const [showSettings, setShowSettings] = useState(false)
  const [analytics, setAnalytics] = useState(true)
  const [marketing, setMarketing] = useState(true)

  useEffect(() => {
    if (isBannerOpen && preferences) {
      setAnalytics(preferences.analytics)
      setMarketing(preferences.marketing)
    }
  }, [isBannerOpen, preferences])

  if (!isBannerOpen) return null

  const handleSave = () => {
    savePreferences({ analytics, marketing })
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom duration-300">
      <div className="mx-auto max-w-4xl rounded-[24px] border border-white/10 bg-slate-950/90 p-5 md:p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        {!showSettings ? (
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-base font-semibold text-white">Preferências de Privacidade</h4>
                <p className="mt-1 text-sm text-slate-300 leading-relaxed">
                  Usamos cookies para otimizar nosso site, analisar desempenho e personalizar anúncios. Veja nossa{" "}
                  <Link to="/politica-de-privacidade" className="text-cyan-300 hover:underline">
                    Política de Privacidade
                  </Link>{" "}
                  para saber mais.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 self-end md:self-center shrink-0">
              <button
                onClick={() => setShowSettings(true)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/10"
              >
                <Settings size={14} />
                Personalizar
              </button>
              <button
                onClick={rejectAll}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/10"
              >
                Recusar
              </button>
              <button
                onClick={acceptAll}
                className="rounded-full bg-gradient-to-r from-cyan-500 to-[#0d6084] px-5 py-2.5 text-xs font-bold text-white shadow-[0_4px_20px_rgba(6,182,212,0.25)] transition-all hover:opacity-90"
              >
                Aceitar Todos
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-cyan-300" size={20} />
                <h4 className="text-base font-semibold text-white">Configurar Preferências de Cookies</h4>
              </div>
            </div>

            <div className="space-y-4">
              {/* Essenciais */}
              <div className="flex items-start justify-between gap-4 rounded-xl bg-white/5 p-3.5 border border-white/5">
                <div>
                  <h5 className="text-sm font-semibold text-white">Necessários (Obrigatórios)</h5>
                  <p className="mt-0.5 text-xs text-slate-400 leading-normal">
                    Esses cookies são essenciais para o funcionamento correto e seguro do site, como navegação de páginas e acesso a áreas seguras.
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center justify-center rounded bg-cyan-500/20 text-cyan-300 px-2 py-1 text-[10px] font-bold uppercase tracking-wider">
                    Sempre Ativos
                  </span>
                </div>
              </div>

              {/* Analíticos */}
              <div className="flex items-start justify-between gap-4 rounded-xl bg-white/5 p-3.5 border border-white/5">
                <div>
                  <h5 className="text-sm font-semibold text-white">Analíticos (Desempenho)</h5>
                  <p className="mt-0.5 text-xs text-slate-400 leading-normal">
                    Coletam informações sobre como você usa nosso site (páginas visitadas, tempo de permanência) de forma anônima, ajudando a melhorar nossos serviços.
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={analytics}
                      onChange={(e) => setAnalytics(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-slate-800 border border-white/10 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-slate-400 after:transition-all after:content-[''] peer-checked:bg-cyan-500 peer-checked:after:translate-x-full peer-checked:after:bg-white" />
                  </label>
                </div>
              </div>

              {/* Marketing */}
              <div className="flex items-start justify-between gap-4 rounded-xl bg-white/5 p-3.5 border border-white/5">
                <div>
                  <h5 className="text-sm font-semibold text-white">Marketing e Publicidade</h5>
                  <p className="mt-0.5 text-xs text-slate-400 leading-normal">
                    Utilizados para direcionar anúncios que sejam mais relevantes para você e seus interesses, além de limitar a frequência com que você vê um anúncio.
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={marketing}
                      onChange={(e) => setMarketing(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-slate-800 border border-white/10 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-slate-400 after:transition-all after:content-[''] peer-checked:bg-cyan-500 peer-checked:after:translate-x-full peer-checked:after:bg-white" />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end border-t border-white/10 pt-4 gap-3">
              <button
                onClick={acceptAll}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-white/10"
              >
                Aceitar Todos
              </button>
              <button
                onClick={handleSave}
                className="rounded-full bg-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-[0_4px_15px_rgba(6,182,212,0.2)] transition-all hover:opacity-90"
              >
                Salvar Escolhas
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
