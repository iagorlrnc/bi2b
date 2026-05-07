import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Calculator,
  Briefcase,
  Building2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight
} from "lucide-react"

// --- Helpers for Currency Mask ---
const parseCurrencyString = (value: string): number | "" => {
  const onlyDigits = value.replace(/\D/g, "")
  if (!onlyDigits) return ""
  return Number(onlyDigits) / 100
}

const formatCurrencyInput = (value: number | ""): string => {
  if (value === "") return ""
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

// --- Subcomponents for Calculators ---

function CalculadoraIRPF() {
  const [rendimento, setRendimento] = useState<number | "">("")
  const [deducoes, setDeducoes] = useState<number | "">("")
  const [resultado, setResultado] = useState<{
    base: number
    aliquota: number
    parcela: number
    imposto: number
  } | null>(null)

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val)

  const calcularIRPF = () => {
    const r = Number(rendimento) || 0
    const d = Number(deducoes) || 0
    const base = Math.max(0, r - d)

    let aliquota = 0
    let parcela = 0

    if (base <= 2259.2) {
      aliquota = 0
      parcela = 0
    } else if (base <= 2826.65) {
      aliquota = 7.5
      parcela = 169.44
    } else if (base <= 3751.05) {
      aliquota = 15
      parcela = 381.44
    } else if (base <= 4664.68) {
      aliquota = 22.5
      parcela = 662.77
    } else {
      aliquota = 27.5
      parcela = 896.0
    }

    const imposto = Math.max(0, base * (aliquota / 100) - parcela)

    setResultado({ base, aliquota, parcela, imposto })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Rendimento Tributável Mensal (R$)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={formatCurrencyInput(rendimento)}
            onChange={(e) => setRendimento(parseCurrencyString(e.target.value))}
            placeholder="R$ 0,00"
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder-slate-500 focus:border-[#7ee7ff] focus:outline-none focus:ring-1 focus:ring-[#7ee7ff]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Deduções (Dependentes, INSS, etc) (R$)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={formatCurrencyInput(deducoes)}
            onChange={(e) => setDeducoes(parseCurrencyString(e.target.value))}
            placeholder="R$ 0,00"
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder-slate-500 focus:border-[#7ee7ff] focus:outline-none focus:ring-1 focus:ring-[#7ee7ff]"
          />
        </div>
      </div>
      <button
        onClick={calcularIRPF}
        className="tech-button-primary w-full justify-center bg-gradient-to-r from-[#0d6084] to-[#0a4a62] px-8 py-3 shadow-[0_12px_40px_rgba(13,96,132,0.32)] hover:-translate-y-0.5 sm:w-auto"
      >
        Calcular IRPF
        <ArrowRight size={18} />
      </button>

      {resultado && (
        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h3 className="text-lg font-medium text-white mb-4">Resultado Simulado</h3>
          <div className="space-y-3 text-slate-300">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span>Base de Cálculo:</span>
              <span className="font-medium text-white">{formatCurrency(resultado.base)}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span>Alíquota Aplicável:</span>
              <span className="font-medium text-white">{resultado.aliquota}%</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span>Parcela a Deduzir:</span>
              <span className="font-medium text-white">{formatCurrency(resultado.parcela)}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="font-semibold text-[#7ee7ff]">Imposto Devido:</span>
              <span className="font-semibold text-[#7ee7ff]">{formatCurrency(resultado.imposto)}</span>
            </div>
            <p className="text-xs text-slate-500 pt-2 text-center">
              *Tabela IRPF base (estimativa para 2024). Consulte um contador para dados exatos.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function CalculadoraPJ() {
  const [faturamento, setFaturamento] = useState<number | "">("")
  const [atividade, setAtividade] = useState("servicos")
  const [resultado, setResultado] = useState<{
    simplesAliquota: number
    simplesTotal: number
    lucroAliquota: number
    lucroTotal: number
  } | null>(null)

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val)

  const calcularPJ = () => {
    const f = Number(faturamento) || 0

    // Estimativas super simplificadas (faixa inicial)
    let simplesAliquota = 0
    let lucroAliquota = 0

    if (atividade === "comercio") {
      simplesAliquota = 4.0
      lucroAliquota = 9.58 // IRPJ, CSLL, PIS, COFINS approx sem ICMS na estimativa
    } else if (atividade === "industria") {
      simplesAliquota = 4.5
      lucroAliquota = 9.58
    } else {
      // Servicos
      simplesAliquota = 6.0 // Anexo III faixa inicial
      lucroAliquota = 16.33 // IRPJ, CSLL, PIS, COFINS + ISS (aprox 5%)
    }

    // Caso o faturamento seja alto, no Simples Nacional a alíquota sobe drasticamente (progressiva)
    // Para fins de simulador básico, vamos aplicar uma pequena progressão simbólica
    if (f > 150000) simplesAliquota *= 1.5
    if (f > 300000) simplesAliquota *= 2.0

    setResultado({
      simplesAliquota,
      simplesTotal: f * (simplesAliquota / 100),
      lucroAliquota,
      lucroTotal: f * (lucroAliquota / 100),
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Faturamento Mensal (R$)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={formatCurrencyInput(faturamento)}
            onChange={(e) => setFaturamento(parseCurrencyString(e.target.value))}
            placeholder="R$ 0,00"
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder-slate-500 focus:border-[#7ee7ff] focus:outline-none focus:ring-1 focus:ring-[#7ee7ff]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Atividade Principal
          </label>
          <select
            value={atividade}
            onChange={(e) => setAtividade(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-3 text-white focus:border-[#7ee7ff] focus:outline-none focus:ring-1 focus:ring-[#7ee7ff] cursor-pointer"
          >
            <option value="servicos" style={{ color: '#000', background: '#fff' }}>Serviços</option>
            <option value="comercio" style={{ color: '#000', background: '#fff' }}>Comércio</option>
            <option value="industria" style={{ color: '#000', background: '#fff' }}>Indústria</option>
          </select>
        </div>
      </div>
      <button
        onClick={calcularPJ}
        className="tech-button-primary w-full justify-center bg-gradient-to-r from-[#0d6084] to-[#0a4a62] px-8 py-3 shadow-[0_12px_40px_rgba(13,96,132,0.32)] hover:-translate-y-0.5 sm:w-auto"
      >
        Comparar Regimes
        <ArrowRight size={18} />
      </button>

      {resultado && (
        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h3 className="text-lg font-medium text-white mb-4">Estimativa de Impostos (Comparativo Básico)</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-lg bg-slate-800/50 p-4 border border-white/5">
              <h4 className="text-md font-semibold text-cyan-300 mb-3">Simples Nacional</h4>
              <div className="flex justify-between text-sm mb-2 text-slate-300">
                <span>Alíquota Efetiva Aprox.:</span>
                <span className="text-white">{resultado.simplesAliquota.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between font-medium text-white pt-2 border-t border-white/10">
                <span>Total Mensal Estimado:</span>
                <span className="text-[#7ee7ff]">{formatCurrency(resultado.simplesTotal)}</span>
              </div>
            </div>
            <div className="rounded-lg bg-slate-800/50 p-4 border border-white/5">
              <h4 className="text-md font-semibold text-cyan-300 mb-3">Lucro Presumido</h4>
              <div className="flex justify-between text-sm mb-2 text-slate-300">
                <span>Total Impostos Aprox.:</span>
                <span className="text-white">{resultado.lucroAliquota.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between font-medium text-white pt-2 border-t border-white/10">
                <span>Total Mensal Estimado:</span>
                <span className="text-[#7ee7ff]">{formatCurrency(resultado.lucroTotal)}</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 pt-4 text-center">
            *Estes são valores iniciais simplificados. Fatores como Fator R, ICMS estadual e ISS municipal alteram estes valores. Consulte-nos para um planejamento real.
          </p>
        </div>
      )}
    </div>
  )
}

function CalculadoraFuncionario() {
  const [salario, setSalario] = useState<number | "">("")
  const [regime, setRegime] = useState("simples")
  const [resultado, setResultado] = useState<{
    bruto: number
    ferias: number
    decimoTerceiro: number
    fgts: number
    inssPatronal: number
    total: number
  } | null>(null)

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val)

  const calcularFuncionario = () => {
    const s = Number(salario) || 0

    const feriasMensal = s / 12 + (s / 12) / 3
    const decimoTerceiroMensal = s / 12
    const fgts = (s + feriasMensal + decimoTerceiroMensal) * 0.08
    
    let inssPatronal = 0
    if (regime === "lucro" || regime === "simples-iv") {
      // Aprox 27.8% (20% patronal + rat/terceiros)
      inssPatronal = (s + feriasMensal + decimoTerceiroMensal) * 0.278
    }

    const total = s + feriasMensal + decimoTerceiroMensal + fgts + inssPatronal

    setResultado({
      bruto: s,
      ferias: feriasMensal,
      decimoTerceiro: decimoTerceiroMensal,
      fgts,
      inssPatronal,
      total,
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Salário Base Bruto (R$)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={formatCurrencyInput(salario)}
            onChange={(e) => setSalario(parseCurrencyString(e.target.value))}
            placeholder="R$ 0,00"
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder-slate-500 focus:border-[#7ee7ff] focus:outline-none focus:ring-1 focus:ring-[#7ee7ff]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Regime de Tributação
          </label>
          <select
            value={regime}
            onChange={(e) => setRegime(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-3 text-white focus:border-[#7ee7ff] focus:outline-none focus:ring-1 focus:ring-[#7ee7ff] cursor-pointer"
          >
            <option value="simples" style={{ color: '#000', background: '#fff' }}>Simples Nacional (Anexos I, II, III, V)</option>
            <option value="simples-iv" style={{ color: '#000', background: '#fff' }}>Simples Nacional (Anexo IV)</option>
            <option value="lucro" style={{ color: '#000', background: '#fff' }}>Lucro Presumido / Real</option>
          </select>
        </div>
      </div>
      <button
        onClick={calcularFuncionario}
        className="tech-button-primary w-full justify-center bg-gradient-to-r from-[#0d6084] to-[#0a4a62] px-8 py-3 shadow-[0_12px_40px_rgba(13,96,132,0.32)] hover:-translate-y-0.5 sm:w-auto"
      >
        Calcular Custo Total
        <ArrowRight size={18} />
      </button>

      {resultado && (
        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h3 className="text-lg font-medium text-white mb-4">Provisão de Custo Mensal Estimado</h3>
          <div className="space-y-3 text-slate-300">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span>Salário Bruto Mensal:</span>
              <span className="font-medium text-white">{formatCurrency(resultado.bruto)}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span>Férias + 1/3 (Provisão Mensal):</span>
              <span className="font-medium text-white">{formatCurrency(resultado.ferias)}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span>13º Salário (Provisão Mensal):</span>
              <span className="font-medium text-white">{formatCurrency(resultado.decimoTerceiro)}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span>FGTS Mensal + Provisões (8%):</span>
              <span className="font-medium text-white">{formatCurrency(resultado.fgts)}</span>
            </div>
            {resultado.inssPatronal > 0 && (
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>INSS Patronal (aprox 27.8%):</span>
                <span className="font-medium text-white">{formatCurrency(resultado.inssPatronal)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2">
              <span className="font-semibold text-[#7ee7ff]">Custo Total Mensal para a Empresa:</span>
              <span className="font-semibold text-[#7ee7ff]">{formatCurrency(resultado.total)}</span>
            </div>
            <p className="text-xs text-slate-500 pt-4 text-center">
              *Valores contábeis. Não considera VR, VA, VT, ou custos rescisórios.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// --- Main Page ---

export default function Ferramentas() {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [])

  const menus = [
    {
      id: "imposto-renda",
      title: "Imposto de Renda",
      icon: Calculator,
      heading: "Calculadora de Imposto de Renda",
      subtitle: "Simule o seu imposto de renda da pessoa física (IRPF).",
      content: <CalculadoraIRPF />
    },
    {
      id: "tributario-pj",
      title: "Tributos PJ",
      icon: Building2,
      heading: "Planejamento Tributário (PJ)",
      subtitle: "Compare Simples Nacional x Lucro Presumido.",
      content: <CalculadoraPJ />
    },
    {
      id: "custo-funcionario",
      title: "Custo de Funcionário",
      icon: Briefcase,
      heading: "Calculadora Custo de Funcionário",
      subtitle: "Descubra o custo real de um funcionário para a empresa.",
      content: <CalculadoraFuncionario />
    }
  ] as const

  const [activeMenuId, setActiveMenuId] = useState<(typeof menus)[number]["id"]>("imposto-renda")

  const activeMenu = menus.find((menu) => menu.id === activeMenuId) ?? menus[0]

  const handlePrevMenu = () => {
    const currentIndex = menus.findIndex((m) => m.id === activeMenuId)
    if (currentIndex > 0) {
      setActiveMenuId(menus[currentIndex - 1].id)
    }
  }

  const handleNextMenu = () => {
    const currentIndex = menus.findIndex((m) => m.id === activeMenuId)
    if (currentIndex < menus.length - 1) {
      setActiveMenuId(menus[currentIndex + 1].id)
    }
  }

  const currentIndex = menus.findIndex((m) => m.id === activeMenuId)

  return (
    <div className="min-h-screen relative pt-12 bg-transparent text-white">
      <section className="section-shell pb-32">
          <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 lg:px-8 md:hidden">
            {/* Mobile Layout */}
            <div className="mb-8 max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-5 flex-nowrap">
                <button
                  onClick={() => navigate(-1)}
                  className="rounded-full border border-white/20 bg-white/5 p-3 text-slate-300 hover:bg-white/10 hover:text-white transition-all shrink-0"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="section-label w-fit m-0 shrink h-auto min-h-[38px] py-2">
                  <Sparkles size={14} className="shrink-0" />
                  <span className="whitespace-normal leading-tight text-center">Calculadoras e Simuladores</span>
                </div>
              </div>
              <h2 className="section-title mb-4">Ferramentas de Gestão</h2>
              <p className="section-copy max-w-2xl mx-auto">
                Simule cenários tributários e custos operacionais de forma rápida
                para apoiar a tomada de decisão.
              </p>
            </div>

            <div className="space-y-4">
              {/* Top Bar */}
              <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-gradient-to-r from-slate-950/40 to-slate-900/20 p-4 backdrop-blur-lg">
                <button
                  onClick={handlePrevMenu}
                  disabled={currentIndex === 0}
                  className="rounded-lg border border-white/20 bg-white/10 p-2 text-slate-300 transition-all duration-200 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>

                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 text-center">
                  {activeMenu.title}<br/>({currentIndex + 1} de {menus.length})
                </span>

                <button
                  onClick={handleNextMenu}
                  disabled={currentIndex === menus.length - 1}
                  className="rounded-lg border border-white/20 bg-white/10 p-2 text-slate-300 transition-all duration-200 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Main Container */}
              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-lg">
                  <h2 className="mb-2 text-xl font-semibold tracking-tight text-slate-100">
                    {activeMenu.heading}
                  </h2>
                  <p className="mb-6 text-sm text-slate-400">
                    {activeMenu.subtitle}
                  </p>
                  {activeMenu.content}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="mx-auto hidden w-full max-w-[1300px] px-4 sm:px-6 lg:px-8 md:block">
            <div className="mb-12 max-w-4xl mx-auto text-center md:text-left md:mx-0">
              <div className="flex gap-4 items-center">
                <button
                  onClick={() => navigate(-1)}
                  className="rounded-full border border-white/20 bg-white/5 p-3 text-slate-300 hover:bg-white/10 hover:text-white transition-all mb-5"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="section-label mb-5 w-fit">
                  <Sparkles size={14} />
                  Calculadoras e Simuladores
                </div>
              </div>
              <h2 className="section-title mb-4">Ferramentas de Gestão</h2>
              <p className="section-copy max-w-2xl mx-auto md:mx-0">
                Simule cenários tributários e custos operacionais de forma rápida
                para apoiar a tomada de decisão.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-[280px_minmax(0,1fr)] md:items-stretch">
              <aside className="h-full w-full rounded-[20px] border border-white/10 bg-gradient-to-b from-slate-950/40 to-slate-900/20 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-2xl">
                <p className="mb-6 px-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Calculadoras
                </p>

                <nav className="space-y-3">
                  {menus.map((menu) => {
                    const Icon = menu.icon
                    const isActive = activeMenuId === menu.id
                    return (
                      <button
                        key={menu.title}
                        type="button"
                        onClick={() => setActiveMenuId(menu.id)}
                        className={`group flex w-full items-center gap-3 rounded-lg border px-4 py-4 text-left text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "border-white/25 bg-white/12 text-slate-100 shadow-[0_0_0_1px_rgba(255,255,255,0.16),0_0_24px_rgba(255,255,255,0.18),inset_0_1px_2px_rgba(255,255,255,0.15),0_4px_12px_rgba(0,0,0,0.15)] backdrop-blur-md"
                            : "border-white/5 bg-white/5 text-slate-400 backdrop-blur-sm hover:border-white/20 hover:bg-white/10 hover:text-slate-100 hover:shadow-[0_0_18px_rgba(255,255,255,0.12)]"
                        }`}
                      >
                        <Icon
                          size={18}
                          className={`${
                            isActive
                              ? "text-slate-300"
                              : "text-slate-500 group-hover:text-slate-300"
                          } transition-colors duration-200`}
                        />
                        <span>{menu.title}</span>
                      </button>
                    )
                  })}
                </nav>
              </aside>

              <main className="rounded-[20px] border border-white/10 bg-gradient-to-br from-slate-950/40 to-slate-900/20 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-2xl sm:p-10">
                <header className="mb-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-100 md:text-3xl">
                    {activeMenu.heading}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400 md:text-base">
                    {activeMenu.subtitle}
                  </p>
                </header>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-lg">
                  {activeMenu.content}
                </div>
              </main>
            </div>
          </div>
        </section>
      </div>
  )
}
