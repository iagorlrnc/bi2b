import { DollarSign, Sparkles } from "lucide-react"

export default function Resultados() {
  const powerBiSrc =
    "https://app.powerbi.com/view?r=eyJrIjoiZTYxNzQ5MjktYWZkMS00M2ZhLTg3YzAtMWE1ZWM0ZmJiMzE0IiwidCI6IjAwZTBjNDIzLTk2MzYtNGM0Mi1hMTMwLTlhNWI1YjQwYzg3YiJ9"

  const activeMenu = {
    id: "faturamento",
    title: "Faturamento",
    icon: DollarSign,
    heading: "Painel de Faturamento",
    subtitle: "Visão consolidade de negócio.",
    frameTitle: "Painel Power BI - Faturamento",
    src: powerBiSrc,
  }

  return (
    <section id="dashboard" className="section-shell pt-6 pb-32">
      <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 lg:px-8 md:hidden">
        {/* Mobile Layout */}
        <div className="mb-8 max-w-4xl mx-auto text-center">
          <div className="section-label mb-5 w-fit mx-auto">
            <Sparkles size={14} />
            Painel de Análise de Negócio
          </div>
          <h2 className="section-title mb-4">Dashboards Corporativos</h2>
          <p className="section-copy max-w-2xl mx-auto">
            Visualização em tempo real dos nossos dados com painéis interativos
            para melhor tomada de decisão.
          </p>
        </div>

        <div className="space-y-4">
          {/* Main Container */}
          <div className="space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-lg">
              <h2 className="mb-2 text-xl font-semibold tracking-tight text-slate-100">
                {activeMenu.heading}
              </h2>
              <p className="mb-4 text-sm text-slate-400">
                {activeMenu.subtitle}
              </p>
              <iframe
                title={activeMenu.frameTitle}
                src={activeMenu.src}
                className="h-[360px] w-full rounded-xl border border-white/10 bg-black"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="mx-auto hidden w-full max-w-[1300px] px-4 sm:px-6 lg:px-8 md:block">
        <div className="mb-12 max-w-4xl mx-auto text-center md:text-left md:mx-0">
          <div className="section-label mb-5 w-fit mx-auto md:mx-0">
            <Sparkles size={14} />
            Painel de Análise de Negócio
          </div>
          <h2 className="section-title mb-4">Dashboards Corporativos</h2>
          <p className="section-copy max-w-2xl mx-auto md:mx-0">
            Visualização em tempo real dos nossos dados com painéis interativos
            para melhor tomada de decisão.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-[240px_minmax(0,1fr)] md:items-stretch">
          <aside className="h-full w-full rounded-[20px] border border-white/10 bg-gradient-to-b from-slate-950/40 to-slate-900/20 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-2xl">
            <p className="mb-6 px-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              Menu
            </p>

            <nav>
              <button
                type="button"
                className="group flex w-full items-center gap-3 rounded-lg border border-white/25 bg-white/12 px-4 py-3 text-left text-sm font-medium text-slate-100 shadow-[0_0_0_1px_rgba(255,255,255,0.16),0_0_24px_rgba(255,255,255,0.18),inset_0_1px_2px_rgba(255,255,255,0.15),0_4px_12px_rgba(0,0,0,0.15)] backdrop-blur-md transition-all duration-200"
              >
                <DollarSign
                  size={16}
                  className="text-slate-300 transition-colors duration-200"
                />
                <span>{activeMenu.title}</span>
              </button>
            </nav>
          </aside>

          <main className="rounded-[20px] border border-white/10 bg-gradient-to-br from-slate-950/40 to-slate-900/20 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-2xl sm:p-8">
            <header>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-100 md:text-4xl">
                {activeMenu.heading}
              </h2>
              <p className="mt-2 text-sm text-slate-400 md:text-base">
                {activeMenu.subtitle}
              </p>
            </header>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-lg">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Dashboard Corporativo
                </p>
              </div>

              <iframe
                title={activeMenu.frameTitle}
                src={activeMenu.src}
                className="h-[420px] w-full rounded-xl border border-white/10 bg-black md:h-[540px]"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </main>
        </div>
      </div>
    </section>
  )
}
