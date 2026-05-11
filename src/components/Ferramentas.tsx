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
  Info,
  FileText,
} from "lucide-react"
import ReportModal from "./ReportModal"
import { useReportContext } from "../contexts/ReportContext"

const parseCurrencyString = (value: string): number | "" => {
  const onlyDigits = value.replace(/\D/g, "")
  if (!onlyDigits) return ""
  return Number(onlyDigits) / 100
}

const formatCurrencyInput = (value: number | ""): string => {
  if (value === "") return ""
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

function CalculadoraIRPF() {
  const { setIrpfData } = useReportContext()
  const [rendimento, setRendimento] = useState<number | "">("")
  const [deducoes, setDeducoes] = useState<number | "">("")
  const [resultado, setResultado] = useState<{
    base: number
    aliquota: number
    aliquotaEfetiva: number
    parcela: number
    imposto: number
    redutor?: number
  } | null>(null)

  const [erro, setErro] = useState("")

  const hasValue =
    String(rendimento).trim() !== "" ||
    String(deducoes).trim() !== "" ||
    resultado !== null
  const limparFormulario = () => {
    setRendimento("")
    setDeducoes("")
    setResultado(null)
    setErro("")
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val)

  const calcularIRPF = () => {
    const r = Number(rendimento) || 0
    if (r <= 0) {
      setErro("Por favor, insira o seu rendimento mensal para simular.")
      setResultado(null)
      setTimeout(() => setErro(""), 3000)
      return
    }
    setErro("")
    const d = Number(deducoes) || 0
    const base = Math.max(0, r - d)

    let aliquota = 0
    let parcela = 0

    if (base <= 2428.8) {
      aliquota = 0
      parcela = 0
    } else if (base <= 2826.65) {
      aliquota = 7.5
      parcela = 182.16
    } else if (base <= 3751.05) {
      aliquota = 15
      parcela = 394.16
    } else if (base <= 4664.68) {
      aliquota = 22.5
      parcela = 675.49
    } else {
      aliquota = 27.5
      parcela = 908.73
    }

    const impostoBruto = Math.max(0, base * (aliquota / 100) - parcela)
    let impostoFinal = impostoBruto
    let redutorAplicado = 0

    if (base <= 5000) {
      aliquota = 0
      parcela = 0
      impostoFinal = 0
      redutorAplicado = 0
    } else if (base > 5000 && base <= 7350) {
      redutorAplicado = Math.max(0, 978.62 - 0.133145 * base)
      impostoFinal = Math.max(0, impostoBruto - redutorAplicado)
    }

    const aliquotaEfetiva = base > 0 ? (impostoFinal / base) * 100 : 0

    setResultado({
      base,
      aliquota,
      aliquotaEfetiva,
      parcela,
      imposto: impostoFinal,
      redutor: redutorAplicado,
    })

    setIrpfData({
      rendimento: r,
      deducoes: d,
      resultado: {
        base,
        aliquota,
        aliquotaEfetiva,
        parcela,
        imposto: impostoFinal,
        redutor: redutorAplicado,
      },
    })
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
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={calcularIRPF}
          className="tech-button-primary w-full justify-center bg-gradient-to-r from-[#0d6084] to-[#0a4a62] px-8 py-3 shadow-[0_12px_40px_rgba(13,96,132,0.32)] hover:-translate-y-0.5 sm:w-auto"
        >
          Calcular IRPF
        </button>
        <button
          onClick={limparFormulario}
          disabled={!hasValue}
          className="rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          Limpar
        </button>
      </div>

      {erro && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-500/20 rounded-lg text-center animate-in fade-in">
          <p className="text-sm text-red-400">{erro}</p>
        </div>
      )}

      {resultado && (
        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
            <Calculator className="text-[#7ee7ff]" size={24} />
            <h3 className="text-xl font-medium text-white">
              Resumo do Imposto
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-[#0a4a62]/30 border border-[#7ee7ff]/20 rounded-lg p-5">
              <div className="group relative flex items-center gap-1 cursor-help mb-2">
                <Info
                  size={14}
                  className="shrink-0 text-cyan-400 hover:text-cyan-300 transition-colors"
                />
                <span className="text-sm text-cyan-200">
                  O que você vai pagar (IRRF):
                </span>
                <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-slate-800 p-3 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 shadow-xl border border-white/10">
                  O valor final, em reais, que você de fato terá que pagar ou
                  que será retido na fonte.
                </div>
              </div>
              <span className="text-3xl font-bold text-[#7ee7ff]">
                {formatCurrency(resultado.imposto)}
              </span>
            </div>

            <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-lg p-5">
              <div className="group relative flex items-center gap-1 cursor-help mb-2">
                <Info
                  size={14}
                  className="shrink-0 text-emerald-400 hover:text-emerald-300 transition-colors"
                />
                <span className="text-sm text-emerald-200">
                  Peso real do imposto:
                </span>
                <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-slate-800 p-3 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 shadow-xl border border-white/10">
                  A porcentagem verdadeira que o imposto representa em relação
                  ao seu salário. Como o imposto é progressivo, o peso real no
                  seu bolso (Alíquota Efetiva) é sempre menor que a tabela.
                </div>
              </div>
              <span className="text-3xl font-bold text-emerald-400">
                {resultado.aliquotaEfetiva.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="space-y-3 text-slate-300 bg-slate-900/50 p-4 rounded-lg border border-white/5">
            <h4 className="text-xs font-medium text-slate-400 mb-3 uppercase tracking-wider">
              Como chegamos nesse valor? (Cálculo Técnico)
            </h4>

            <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-2 text-sm">
              <div className="group relative flex items-center gap-1 cursor-help">
                <Info
                  size={14}
                  className="shrink-0 text-slate-500 hover:text-cyan-400 transition-colors"
                />
                <span>Base de Cálculo:</span>
                <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-slate-800 p-3 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 shadow-xl border border-white/10">
                  Rendimento bruto menos as deduções informadas. É o valor sobre
                  o qual o imposto será calculado.
                </div>
              </div>
              <span className="shrink-0 text-right font-medium text-white">
                {formatCurrency(resultado.base)}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-2 text-sm">
              <div className="group relative flex items-center gap-1 cursor-help">
                <Info
                  size={14}
                  className="shrink-0 text-slate-500 hover:text-cyan-400 transition-colors"
                />
                <span>Parcela a Deduzir:</span>
                <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-slate-800 p-3 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 shadow-xl border border-white/10">
                  Valor fixo subtraído para garantir que a alíquota nominal seja
                  cobrada apenas sobre a parte do salário que ultrapassou a
                  faixa anterior.
                </div>
              </div>
              <span className="shrink-0 text-right font-medium text-white">
                {formatCurrency(resultado.parcela)}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-2 text-sm">
              <div className="group relative flex items-center gap-1 cursor-help">
                <Info
                  size={14}
                  className="shrink-0 text-slate-500 hover:text-cyan-400 transition-colors"
                />
                <span>Alíquota Nominal:</span>
                <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-slate-800 p-3 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 shadow-xl border border-white/10">
                  A porcentagem oficial da tabela da Receita Federal na qual a
                  sua Base de Cálculo se enquadrou.
                </div>
              </div>
              <span className="shrink-0 text-right font-medium text-white">
                {resultado.aliquota}%
              </span>
            </div>

            {resultado.redutor !== undefined && resultado.redutor > 0 && (
              <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-2 text-emerald-400 text-sm">
                <div className="group relative flex items-center gap-1 cursor-help">
                  <Info
                    size={14}
                    className="shrink-0 text-emerald-500/70 hover:text-emerald-400 transition-colors"
                  />
                  <span>Desconto Linear (Redutor 2026):</span>
                  <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-slate-800 p-3 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 shadow-xl border border-white/10">
                    Benefício da Lei 15.270/2025. Desconto matemático aplicado
                    diretamente no imposto bruto para rendas entre R$ 5.000,01 e
                    R$ 7.350,00.
                  </div>
                </div>
                <span className="shrink-0 text-right font-medium">
                  - {formatCurrency(resultado.redutor)}
                </span>
              </div>
            )}

            <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-2 text-sm">
              <div className="group relative flex items-center gap-1 cursor-help">
                <Info
                  size={14}
                  className="shrink-0 text-slate-500 hover:text-cyan-400 transition-colors"
                />
                <span>Alíquota Efetiva Real:</span>
                <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-slate-800 p-3 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 shadow-xl border border-white/10">
                  A porcentagem verdadeira que você está pagando no fim das
                  contas. O peso real do imposto no seu bolso.
                </div>
              </div>
              <span className="shrink-0 text-right font-medium text-emerald-400">
                {resultado.aliquotaEfetiva.toFixed(2)}%
              </span>
            </div>

            <div className="flex items-start justify-between gap-4 pt-1 text-sm">
              <div className="group relative flex items-center gap-1 cursor-help">
                <Info
                  size={14}
                  className="shrink-0 text-[#7ee7ff]/70 hover:text-[#7ee7ff] transition-colors"
                />
                <span className="font-semibold text-[#7ee7ff]">
                  Imposto Devido:
                </span>
                <div className="absolute bottom-full right-0 mb-2 w-64 rounded-lg bg-slate-800 p-3 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 shadow-xl border border-white/10">
                  O valor final, em reais, que você de fato terá que pagar ou
                  que será retido na fonte.
                </div>
              </div>
              <span className="shrink-0 text-right font-semibold text-[#7ee7ff]">
                {formatCurrency(resultado.imposto)}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 pt-4 text-center">
            *Tabela IRPF 2026 (Lei nº 15.270/2025). Consulte o contador para
            dados exatos.
          </p>
        </div>
      )}
    </div>
  )
}

//tabelas do Simples Nacional
const tabelasSimples = {
  anexoI: [
    { limite: 180000, aliquota: 0.04, deducao: 0 },
    { limite: 360000, aliquota: 0.073, deducao: 5940 },
    { limite: 720000, aliquota: 0.095, deducao: 13860 },
    { limite: 1800000, aliquota: 0.107, deducao: 22500 },
    { limite: 3600000, aliquota: 0.143, deducao: 87300 },
    { limite: 4800000, aliquota: 0.19, deducao: 378000 },
  ],
  anexoII: [
    { limite: 180000, aliquota: 0.045, deducao: 0 },
    { limite: 360000, aliquota: 0.078, deducao: 5940 },
    { limite: 720000, aliquota: 0.1, deducao: 13860 },
    { limite: 1800000, aliquota: 0.112, deducao: 22500 },
    { limite: 3600000, aliquota: 0.147, deducao: 85500 },
    { limite: 4800000, aliquota: 0.3, deducao: 720000 },
  ],
  anexoIII: [
    { limite: 180000, aliquota: 0.06, deducao: 0 },
    { limite: 360000, aliquota: 0.112, deducao: 9360 },
    { limite: 720000, aliquota: 0.135, deducao: 17640 },
    { limite: 1800000, aliquota: 0.16, deducao: 35640 },
    { limite: 3600000, aliquota: 0.21, deducao: 125640 },
    { limite: 4800000, aliquota: 0.33, deducao: 648000 },
  ],
  anexoIV: [
    { limite: 180000, aliquota: 0.045, deducao: 0 },
    { limite: 360000, aliquota: 0.09, deducao: 8100 },
    { limite: 720000, aliquota: 0.102, deducao: 12420 },
    { limite: 1800000, aliquota: 0.14, deducao: 39780 },
    { limite: 3600000, aliquota: 0.22, deducao: 183780 },
    { limite: 4800000, aliquota: 0.33, deducao: 828000 },
  ],
  anexoV: [
    { limite: 180000, aliquota: 0.155, deducao: 0 },
    { limite: 360000, aliquota: 0.18, deducao: 4500 },
    { limite: 720000, aliquota: 0.195, deducao: 9900 },
    { limite: 1800000, aliquota: 0.205, deducao: 17100 },
    { limite: 3600000, aliquota: 0.23, deducao: 62100 },
    { limite: 4800000, aliquota: 0.305, deducao: 540000 },
  ],
}

function calcularAliquotaEfetivaSimples(
  rbt12: number,
  anexo: typeof tabelasSimples.anexoI,
) {
  if (rbt12 === 0) return { aliquotaEfetiva: anexo[0].aliquota * 100 } //primeira faixa se não houver faturamento anterior

  const faixa = anexo.find((f) => rbt12 <= f.limite) || anexo[anexo.length - 1]

  return {
    aliquotaEfetiva: faixa.aliquota * 100, //porcentagem
  }
}

function CalculadoraPJ() {
  const { setPjData } = useReportContext()
  const [faturamento, setFaturamento] = useState<number | "">("")
  const [rbt12, setRbt12] = useState<number | "">("")
  const [anexoSelecionado, setAnexoSelecionado] = useState("anexoI")

  const [resultado, setResultado] = useState<{
    simplesAliquota: number
    simplesTotal: number
    lucroAliquota: number
    lucroTotal: number
    lucroBreakdown?: {
      pisCofins: number
      irpj: number
      csll: number
      pisCofinsPerc: number
      irpjPerc: number
      csllPerc: number
    }
  } | null>(null)

  const [erro, setErro] = useState("")

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val)

  const hasValue =
    String(faturamento).trim() !== "" ||
    String(rbt12).trim() !== "" ||
    resultado !== null
  const limparFormulario = () => {
    setFaturamento("")
    setRbt12("")
    setAnexoSelecionado("anexoI")
    setResultado(null)
    setErro("")
  }

  const getFaixaSimplesNacional = (rbt12Valor: number) => {
    let tabelaAtiva = tabelasSimples.anexoIII
    if (anexoSelecionado === "anexoI") tabelaAtiva = tabelasSimples.anexoI
    if (anexoSelecionado === "anexoII") tabelaAtiva = tabelasSimples.anexoII
    if (anexoSelecionado === "anexoIV") tabelaAtiva = tabelasSimples.anexoIV
    if (anexoSelecionado === "anexoV") tabelaAtiva = tabelasSimples.anexoV

    const faixaIndex = tabelaAtiva.findIndex(
      (faixa) => rbt12Valor <= faixa.limite,
    )
    const faixaNum = faixaIndex >= 0 ? faixaIndex + 1 : tabelaAtiva.length
    const faixaOrdinal: Record<number, string> = {
      1: "1ª",
      2: "2ª",
      3: "3ª",
      4: "4ª",
      5: "5ª",
      6: "6ª",
    }

    return faixaOrdinal[faixaNum] || `${faixaNum}ª`
  }

  const calcularPJ = () => {
    const fMensal = Number(faturamento) || 0
    const r12 = Number(rbt12) || 0

    if (fMensal <= 0 && r12 <= 0) {
      setErro(
        "Por favor, insira o faturamento mensal ou a receita bruta dos últimos 12 meses.",
      )
      setResultado(null)
      setTimeout(() => setErro(""), 5000)
      return
    }
    setErro("")
    //se a empresa for nova, o rbt12 é feito com base no faturamento mensal
    const rbt12Final = r12 > 0 ? r12 : fMensal * 12

    let tabelaAtiva = tabelasSimples.anexoIII
    if (anexoSelecionado === "anexoI") tabelaAtiva = tabelasSimples.anexoI
    if (anexoSelecionado === "anexoII") tabelaAtiva = tabelasSimples.anexoII
    if (anexoSelecionado === "anexoIV") tabelaAtiva = tabelasSimples.anexoIV
    if (anexoSelecionado === "anexoV") tabelaAtiva = tabelasSimples.anexoV

    const calculoSimples = calcularAliquotaEfetivaSimples(
      rbt12Final,
      tabelaAtiva,
    )
    const simplesAliquotaEfetiva = calculoSimples.aliquotaEfetiva

    const fMensalBase = fMensal > 0 ? fMensal : rbt12Final / 12

    // Lucro Presumido - Estimativas Realistas
    let lucroTotal = 0
    let lucroAliquota = 0
    let lucroBreakdown = undefined

    if (fMensalBase > 0) {
      const pisCofins = fMensalBase * 0.0365 // PIS/COFINS (Cumulativo: 0.65% + 3%)

      let presuncaoIRPJ = 0
      let presuncaoCSLL = 0

      if (anexoSelecionado === "anexoI" || anexoSelecionado === "anexoII") {
        // Comércio / Indústria
        presuncaoIRPJ = fMensalBase * 0.08
        presuncaoCSLL = fMensalBase * 0.12
      } else {
        // Serviços (Anexo III, IV, V)
        presuncaoIRPJ = fMensalBase * 0.32
        presuncaoCSLL = fMensalBase * 0.32
      }

      const irpjBase = presuncaoIRPJ * 0.15
      const irpjAdicional =
        presuncaoIRPJ > 20000 ? (presuncaoIRPJ - 20000) * 0.1 : 0
      const irpjTotal = irpjBase + irpjAdicional

      const csllTotal = presuncaoCSLL * 0.09

      lucroTotal = pisCofins + irpjTotal + csllTotal
      lucroAliquota = (lucroTotal / fMensalBase) * 100

      lucroBreakdown = {
        pisCofins,
        irpj: irpjTotal,
        csll: csllTotal,
        pisCofinsPerc: (pisCofins / fMensalBase) * 100,
        irpjPerc: (irpjTotal / fMensalBase) * 100,
        csllPerc: (csllTotal / fMensalBase) * 100,
      }
    }

    setResultado({
      simplesAliquota: simplesAliquotaEfetiva,
      simplesTotal: fMensalBase * (simplesAliquotaEfetiva / 100),
      lucroAliquota,
      lucroTotal,
      lucroBreakdown,
    })

    setPjData({
      faturamento: fMensal,
      rbt12: rbt12Final,
      anexoSelecionado,
      resultado: {
        simplesAliquota: simplesAliquotaEfetiva,
        simplesTotal: fMensalBase * (simplesAliquotaEfetiva / 100),
        lucroAliquota,
        lucroTotal,
        lucroBreakdown,
      },
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
            onChange={(e) =>
              setFaturamento(parseCurrencyString(e.target.value))
            }
            placeholder="R$ 0,00"
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder-slate-500 focus:border-[#7ee7ff] focus:outline-none focus:ring-1 focus:ring-[#7ee7ff]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Receita Bruta 12 Meses (RBT12)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={formatCurrencyInput(rbt12)}
            onChange={(e) => setRbt12(parseCurrencyString(e.target.value))}
            placeholder="R$ 0,00"
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder-slate-500 focus:border-[#7ee7ff] focus:outline-none focus:ring-1 focus:ring-[#7ee7ff]"
          />
          <p className="text-xs text-slate-400 mt-2">
            Deixe R$ 0,00 se a empresa não tiver 12 meses de criação
          </p>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Tipo de Atividade (Anexo)
          </label>
          <select
            value={anexoSelecionado}
            onChange={(e) => setAnexoSelecionado(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-3 text-white focus:border-[#7ee7ff] focus:outline-none focus:ring-1 focus:ring-[#7ee7ff] cursor-pointer"
          >
            <option
              value="anexoI"
              style={{ color: "#000", background: "#fff" }}
            >
              Anexo I
            </option>
            <option
              value="anexoII"
              style={{ color: "#000", background: "#fff" }}
            >
              Anexo II
            </option>
            <option
              value="anexoIII"
              style={{ color: "#000", background: "#fff" }}
            >
              Anexo III
            </option>
            <option
              value="anexoIV"
              style={{ color: "#000", background: "#fff" }}
            >
              Anexo IV
            </option>
            <option
              value="anexoV"
              style={{ color: "#000", background: "#fff" }}
            >
              Anexo V
            </option>
          </select>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={calcularPJ}
          className="tech-button-primary w-full justify-center bg-gradient-to-r from-[#0d6084] to-[#0a4a62] px-8 py-3 shadow-[0_12px_40px_rgba(13,96,132,0.32)] hover:-translate-y-0.5 sm:w-auto"
        >
          Comparar Regimes
        </button>
        <button
          onClick={limparFormulario}
          disabled={!hasValue}
          className="rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          Limpar
        </button>
      </div>

      {erro && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-500/20 rounded-lg text-center animate-in fade-in">
          <p className="text-sm text-red-400">{erro}</p>
        </div>
      )}

      {resultado && (
        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
            <Calculator className="text-[#7ee7ff]" size={24} />
            <h3 className="text-xl font-medium text-white">
              Comparativo de Impostos Mensais
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-[#0a4a62]/30 border border-[#7ee7ff]/20 rounded-lg p-5 relative">
              <div className="absolute top-0 right-0 p-2 bg-gradient-to-bl from-cyan-500/20 to-transparent rounded-bl-lg rounded-tr-lg">
                <Sparkles size={14} className="text-cyan-400" />
              </div>
              <div className="group relative flex items-center gap-2 cursor-help mb-2">
                <Info
                  size={14}
                  className="shrink-0 text-cyan-400 hover:text-cyan-300 transition-colors"
                />
                <span className="text-sm font-semibold text-cyan-300">
                  Simples Nacional:
                </span>
                <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-slate-800 p-3 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 shadow-xl border border-white/10">
                  O valor pago na guia única (DAS) do Simples Nacional.
                </div>
              </div>
              <span className="text-3xl font-bold text-[#7ee7ff]">
                {formatCurrency(resultado.simplesTotal)}
              </span>
            </div>

            <div className="bg-slate-800/50 border border-white/10 rounded-lg p-5 flex flex-col justify-between">
              <div>
                <div className="group relative flex items-center gap-2 cursor-help mb-2">
                  <Info
                    size={14}
                    className="shrink-0 text-slate-500 hover:text-slate-400 transition-colors"
                  />
                  <span className="text-sm font-semibold text-slate-300">
                    Lucro Presumido:
                  </span>
                  <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-slate-800 p-3 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 shadow-xl border border-white/10">
                    O valor somado das guias federais (DARFs) no Lucro
                    Presumido.
                  </div>
                </div>
                <span className="text-3xl font-bold text-slate-200">
                  {formatCurrency(resultado.lucroTotal)}
                </span>
              </div>
              <p className="text-[10px] leading-tight text-slate-500 pt-3 mt-3 border-t border-white/10 text-center">
                *Os impostos ICMS, IPI e ISS não foram incluídos nos cálculos
                pois variam em cada situação, mas podem ser contabilizados no
                valor final.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3 text-slate-300 bg-slate-900/50 p-4 rounded-lg border border-white/5">
              <h4 className="text-xs font-medium text-slate-400 mb-3 uppercase tracking-wider">
                Detalhamento: Simples Nacional
              </h4>
              <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                <div className="group relative flex items-center gap-2 cursor-help">
                  <Info
                    size={14}
                    className="shrink-0 text-slate-500 hover:text-cyan-400 transition-colors"
                  />
                  <span>Alíquota Efetiva:</span>
                  <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-slate-800 p-3 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 shadow-xl border border-white/10">
                    A alíquota calculada com base na receita dos últimos 12
                    meses (RBT12), já considerando o valor a deduzir.
                  </div>
                </div>
                <span className="text-white font-medium">
                  {resultado.simplesAliquota.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between pt-1 text-sm">
                <div className="group relative flex items-center gap-2 cursor-help">
                  <Info
                    size={14}
                    className="shrink-0 text-[#7ee7ff]/70 hover:text-[#7ee7ff] transition-colors"
                  />
                  <span className="font-semibold text-[#7ee7ff]">
                    Total Imposto Mensal:
                  </span>
                  <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-slate-800 p-3 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 shadow-xl border border-white/10">
                    O valor pago na guia única (DAS) do Simples Nacional.
                  </div>
                </div>
                <span className="font-semibold text-[#7ee7ff]">
                  {formatCurrency(resultado.simplesTotal)}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-slate-300 bg-slate-900/50 p-4 rounded-lg border border-white/5 flex flex-col">
              <h4 className="text-xs font-medium text-slate-400 mb-3 uppercase tracking-wider">
                Detalhamento: Lucro Presumido
              </h4>

              {resultado.lucroBreakdown && (
                <div className="space-y-2 mb-4 pb-3 border-b border-white/10 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <div className="group relative flex items-center gap-2 cursor-help">
                      <Info
                        size={14}
                        className="shrink-0 text-slate-500 hover:text-cyan-400 transition-colors"
                      />
                      <span>
                        PIS/COFINS (
                        {resultado.lucroBreakdown.pisCofinsPerc.toFixed(2)}%):
                      </span>
                      <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-slate-800 p-3 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 shadow-xl border border-white/10">
                        Impostos federais sobre a receita bruta (regime
                        cumulativo de 3,65%).
                      </div>
                    </div>
                    <span>
                      {formatCurrency(resultado.lucroBreakdown.pisCofins)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <div className="group relative flex items-center gap-2 cursor-help">
                      <Info
                        size={14}
                        className="shrink-0 text-slate-500 hover:text-cyan-400 transition-colors"
                      />
                      <span>
                        IRPJ (com Adic.) (
                        {resultado.lucroBreakdown.irpjPerc.toFixed(2)}%):
                      </span>
                      <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-slate-800 p-3 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 shadow-xl border border-white/10">
                        Imposto de Renda da Pessoa Jurídica, somado ao adicional
                        de 10% cobrado sobre o lucro presumido que exceder R$
                        20.000/mês.
                      </div>
                    </div>
                    <span>{formatCurrency(resultado.lucroBreakdown.irpj)}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="group relative flex items-center gap-2 cursor-help">
                      <Info
                        size={14}
                        className="shrink-0 text-slate-500 hover:text-cyan-400 transition-colors"
                      />
                      <span>
                        CSLL ({resultado.lucroBreakdown.csllPerc.toFixed(2)}%):
                      </span>
                      <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-slate-800 p-3 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 shadow-xl border border-white/10">
                        Contribuição Social sobre o Lucro Líquido (alíquota de
                        9% sobre a base de presunção).
                      </div>
                    </div>
                    <span>{formatCurrency(resultado.lucroBreakdown.csll)}</span>
                  </div>
                </div>
              )}
              <div className="mt-auto">
                <div className="flex justify-between text-sm mb-2 text-slate-300">
                  <div className="group relative flex items-center gap-2 cursor-help">
                    <Info
                      size={14}
                      className="shrink-0 text-slate-500 hover:text-cyan-400 transition-colors"
                    />
                    <span>Alíquota Efetiva Aprox:</span>
                    <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-slate-800 p-3 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 shadow-xl border border-white/10">
                      O peso percentual total dos impostos federais sobre o seu
                      faturamento bruto.
                    </div>
                  </div>
                  <span className="text-white font-medium">
                    {resultado.lucroAliquota.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between font-medium text-white pt-2 border-t border-white/10">
                  <div className="group relative flex items-center gap-2 cursor-help">
                    <Info
                      size={14}
                      className="shrink-0 text-slate-500 hover:text-cyan-400 transition-colors"
                    />
                    <span>Total Imposto Mensal:</span>
                    <div className="absolute bottom-full right-0 mb-2 w-64 rounded-lg bg-slate-800 p-3 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 shadow-xl border border-white/10">
                      O valor somado das guias federais (DARFs) no Lucro
                      Presumido.
                    </div>
                  </div>
                  <span className="text-slate-300 text-lg">
                    {formatCurrency(resultado.lucroTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-cyan-900/20 border border-cyan-500/20 rounded-lg">
            <p className="text-sm text-cyan-100">
              <span className="text-cyan-400 font-bold">Dica:</span> No Simples
              Nacional, a faixa da tabela é definida pelo faturamento acumulado
              dos últimos 12 meses. Considerando o faturamento informado de{" "}
              {formatCurrency(Number(rbt12) || Number(faturamento) * 12)}, sua
              empresa se enquadra na{" "}
              <strong>
                {getFaixaSimplesNacional(
                  Number(rbt12) || Number(faturamento) * 12,
                )}{" "}
                faixa
              </strong>{" "}
              da tabela do Simples Nacional.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6 overflow-hidden">
        <h3 className="text-lg font-medium text-white mb-4">
          Empresas que se encaixam em cada Anexo
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm text-slate-300">
            <thead>
              <tr className="border-b border-white/10 text-white">
                <th className="p-3 font-medium whitespace-nowrap">Anexo</th>
                <th className="p-3 font-medium">Atividades / Segmentos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-3 font-medium text-[#7ee7ff] whitespace-nowrap">
                  Anexo I
                </td>
                <td className="p-3">
                  Comércio: Revendedores em geral, restaurantes, padarias e
                  afins.
                </td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-3 font-medium text-[#7ee7ff] whitespace-nowrap">
                  Anexo II
                </td>
                <td className="p-3">
                  Indústria: Fábricas, indústrias e empresas industriais em
                  geral.
                </td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-3 font-medium text-[#7ee7ff] whitespace-nowrap">
                  Anexo III
                </td>
                <td className="p-3">
                  Serviços: Instalação, reparos e manutenção, agências de
                  viagens, treinamentos e atividades sem responsabilidade
                  técnica exigida.
                </td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-3 font-medium text-[#7ee7ff] whitespace-nowrap">
                  Anexo IV
                </td>
                <td className="p-3">
                  Serviços: Limpeza, vigilância, obras, construção de imóveis,
                  serviços advocatícios, entre outros.
                </td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-3 font-medium text-[#7ee7ff] whitespace-nowrap">
                  Anexo V
                </td>
                <td className="p-3">
                  Serviços: Auditoria, jornalismo, tecnologia, publicidade,
                  engenharia, entre outros.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function CalculadoraFuncionario() {
  const { setFuncionarioData } = useReportContext()
  const [faturamentoEmpresa, setFaturamentoEmpresa] = useState<number | "">("")
  const [caixaEmpresa, setCaixaEmpresa] = useState<number | "">("")
  const [salario, setSalario] = useState<number | "">("")
  const [valeTransporte, setValeTransporte] = useState<number | "">("")
  const [valeRefeicao, setValeRefeicao] = useState<number | "">("")
  const [ajudaCusto, setAjudaCusto] = useState<number | "">("")
  const [outroBeneficio, setOutroBeneficio] = useState<number | "">("")
  const [regime, setRegime] = useState("simples")
  const [resultado, setResultado] = useState<{
    bruto: number
    ferias: number
    decimoTerceiro: number
    fgts: number
    inssPatronal: number
    beneficiosTotais: number
    total: number
  } | null>(null)

  const [erro, setErro] = useState("")

  const hasValue =
    String(faturamentoEmpresa).trim() !== "" ||
    String(caixaEmpresa).trim() !== "" ||
    String(salario).trim() !== "" ||
    String(valeTransporte).trim() !== "" ||
    String(valeRefeicao).trim() !== "" ||
    String(ajudaCusto).trim() !== "" ||
    String(outroBeneficio).trim() !== "" ||
    resultado !== null
  const limparFormulario = () => {
    setFaturamentoEmpresa("")
    setCaixaEmpresa("")
    setSalario("")
    setValeTransporte("")
    setValeRefeicao("")
    setAjudaCusto("")
    setOutroBeneficio("")
    setRegime("simples")
    setResultado(null)
    setErro("")
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val)

  const calcularFuncionario = () => {
    const s = Number(salario) || 0
    if (s <= 0) {
      setErro("Por favor, insira o salário base bruto para calcular o custo.")
      setResultado(null)
      setTimeout(() => setErro(""), 5000)
      return
    }
    setErro("")

    const vt = Number(valeTransporte) || 0
    const vr = Number(valeRefeicao) || 0
    const ac = Number(ajudaCusto) || 0
    const ob = Number(outroBeneficio) || 0
    const beneficiosTotais = vt + vr + ac + ob

    const feriasMensal = s / 12 + s / 12 / 3
    const decimoTerceiroMensal = s / 12
    const fgts = (s + feriasMensal + decimoTerceiroMensal) * 0.08

    let inssPatronal = 0
    if (regime === "simples") {
      inssPatronal = 0
    } else if (regime === "mei") {
      inssPatronal = (s + feriasMensal + decimoTerceiroMensal) * 0.03
    } else {
      inssPatronal = (s + feriasMensal + decimoTerceiroMensal) * 0.2
    }

    const total =
      s +
      feriasMensal +
      decimoTerceiroMensal +
      fgts +
      inssPatronal +
      beneficiosTotais

    setResultado({
      bruto: s,
      ferias: feriasMensal,
      decimoTerceiro: decimoTerceiroMensal,
      fgts,
      inssPatronal,
      beneficiosTotais,
      total,
    })

    setFuncionarioData({
      faturamentoEmpresa: Number(faturamentoEmpresa) || 0,
      caixaEmpresa: Number(caixaEmpresa) || 0,
      salario: s,
      regime,
      valeTransporte: vt,
      valeRefeicao: vr,
      ajudaCusto: ac,
      outroBeneficio: ob,
      resultado: {
        bruto: s,
        ferias: feriasMensal,
        decimoTerceiro: decimoTerceiroMensal,
        fgts,
        inssPatronal,
        beneficiosTotais,
        total,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2 mb-2">
          <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
            Dados da Empresa
          </h3>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Faturamento Mensal (R$)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={formatCurrencyInput(faturamentoEmpresa)}
            onChange={(e) =>
              setFaturamentoEmpresa(parseCurrencyString(e.target.value))
            }
            placeholder="R$ 0,00"
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder-slate-500 focus:border-[#7ee7ff] focus:outline-none focus:ring-1 focus:ring-[#7ee7ff]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Caixa da Empresa (R$)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={formatCurrencyInput(caixaEmpresa)}
            onChange={(e) =>
              setCaixaEmpresa(parseCurrencyString(e.target.value))
            }
            placeholder="R$ 0,00"
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder-slate-500 focus:border-[#7ee7ff] focus:outline-none focus:ring-1 focus:ring-[#7ee7ff]"
          />
        </div>
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
            <option
              value="simples"
              style={{ color: "#000", background: "#fff" }}
            >
              Simples Nacional (Anexos I, II, III, V)
            </option>
            <option
              value="simples-iv"
              style={{ color: "#000", background: "#fff" }}
            >
              Simples Nacional (Anexo IV)
            </option>
            <option value="mei" style={{ color: "#000", background: "#fff" }}>
              MEI
            </option>
            <option
              value="lucro-presumido"
              style={{ color: "#000", background: "#fff" }}
            >
              Lucro Presumido
            </option>
          </select>
        </div>

        <div className="md:col-span-2 mt-4 mb-2">
          <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
            Dados do Funcionário
          </h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Vale Transporte Mensal (R$)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={formatCurrencyInput(valeTransporte)}
            onChange={(e) =>
              setValeTransporte(parseCurrencyString(e.target.value))
            }
            placeholder="R$ 0,00"
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder-slate-500 focus:border-[#7ee7ff] focus:outline-none focus:ring-1 focus:ring-[#7ee7ff]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Vale Refeição Mensal (R$)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={formatCurrencyInput(valeRefeicao)}
            onChange={(e) =>
              setValeRefeicao(parseCurrencyString(e.target.value))
            }
            placeholder="R$ 0,00"
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder-slate-500 focus:border-[#7ee7ff] focus:outline-none focus:ring-1 focus:ring-[#7ee7ff]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Ajuda de Custo (R$)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={formatCurrencyInput(ajudaCusto)}
            onChange={(e) => setAjudaCusto(parseCurrencyString(e.target.value))}
            placeholder="R$ 0,00"
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder-slate-500 focus:border-[#7ee7ff] focus:outline-none focus:ring-1 focus:ring-[#7ee7ff]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Outros Benefícios (R$)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={formatCurrencyInput(outroBeneficio)}
            onChange={(e) =>
              setOutroBeneficio(parseCurrencyString(e.target.value))
            }
            placeholder="R$ 0,00"
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder-slate-500 focus:border-[#7ee7ff] focus:outline-none focus:ring-1 focus:ring-[#7ee7ff]"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={calcularFuncionario}
          className="tech-button-primary w-full justify-center bg-gradient-to-r from-[#0d6084] to-[#0a4a62] px-8 py-3 shadow-[0_12px_40px_rgba(13,96,132,0.32)] hover:-translate-y-0.5 sm:w-auto"
        >
          Calcular Custo Total
        </button>
        <button
          onClick={limparFormulario}
          disabled={!hasValue}
          className="rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          Limpar
        </button>
      </div>

      {erro && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-500/20 rounded-lg text-center animate-in fade-in">
          <p className="text-sm text-red-400">{erro}</p>
        </div>
      )}

      {resultado && (
        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
            <Calculator className="text-[#7ee7ff]" size={24} />
            <h3 className="text-xl font-medium text-white">
              Resumo de Custos Mensais
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-[#0a4a62]/30 border border-[#7ee7ff]/20 rounded-lg p-5">
              <div className="group relative flex items-center gap-2 cursor-help mb-2">
                <Info
                  size={14}
                  className="shrink-0 text-cyan-400 hover:text-cyan-300 transition-colors"
                />
                <span className="text-sm text-cyan-200">
                  Custo Total para a Empresa:
                </span>
                <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-slate-800 p-3 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 shadow-xl border border-white/10">
                  O valor contábil real que o funcionário custa mensalmente para
                  a empresa, somando salário e encargos trabalhistas básicos.
                </div>
              </div>
              <span className="text-3xl font-bold text-[#7ee7ff]">
                {formatCurrency(resultado.total)}
              </span>
            </div>

            <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-lg p-5">
              <div className="group relative flex items-center gap-2 cursor-help mb-2">
                <Info
                  size={14}
                  className="shrink-0 text-emerald-400 hover:text-emerald-300 transition-colors"
                />
                <span className="text-sm text-emerald-200">
                  Acréscimo de Encargos e Benefícios:
                </span>
                <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-slate-800 p-3 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 shadow-xl border border-white/10">
                  O valor extra provisionado mensalmente além do salário bruto
                  para arcar com encargos (FGTS, Férias, 13º, INSS) e
                  benefícios.
                </div>
              </div>
              <span className="text-3xl font-bold text-emerald-400">
                + {formatCurrency(resultado.total - resultado.bruto)}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-slate-300 bg-slate-900/50 p-4 rounded-lg border border-white/5">
            <h4 className="text-xs font-medium text-slate-400 mb-3 uppercase tracking-wider">
              Detalhamento das Provisões (Cálculo Técnico)
            </h4>

            <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-2 text-sm">
              <div className="group relative flex items-center gap-1 cursor-help">
                <Info
                  size={14}
                  className="shrink-0 text-slate-500 hover:text-cyan-400 transition-colors"
                />
                <span>Salário Bruto Mensal:</span>
                <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-slate-800 p-3 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 shadow-xl border border-white/10">
                  O valor registrado na carteira de trabalho (CLT) antes de
                  qualquer desconto.
                </div>
              </div>
              <span className="shrink-0 text-right font-medium text-white">
                {formatCurrency(resultado.bruto)}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-2 text-sm">
              <div className="group relative flex items-center gap-1 cursor-help">
                <Info
                  size={14}
                  className="shrink-0 text-slate-500 hover:text-cyan-400 transition-colors"
                />
                <span>Férias + 1/3 (Provisão Mensal):</span>
                <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-slate-800 p-3 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 shadow-xl border border-white/10">
                  Valor mensal que a empresa deve guardar (provisionar) para o
                  pagamento das férias anuais acrescidas do terço
                  constitucional.
                </div>
              </div>
              <span className="shrink-0 text-right font-medium text-white">
                {formatCurrency(resultado.ferias)}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-2 text-sm">
              <div className="group relative flex items-center gap-1 cursor-help">
                <Info
                  size={14}
                  className="shrink-0 text-slate-500 hover:text-cyan-400 transition-colors"
                />
                <span>13º Salário (Provisão Mensal):</span>
                <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-slate-800 p-3 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 shadow-xl border border-white/10">
                  Fração do salário (1/12) que a empresa deve guardar
                  mensalmente para pagar o 13º no final do ano.
                </div>
              </div>
              <span className="shrink-0 text-right font-medium text-white">
                {formatCurrency(resultado.decimoTerceiro)}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-2 text-sm">
              <div className="group relative flex items-center gap-1 cursor-help">
                <Info
                  size={14}
                  className="shrink-0 text-slate-500 hover:text-cyan-400 transition-colors"
                />
                <span>FGTS Mensal + Provisões (8%):</span>
                <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-slate-800 p-3 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 shadow-xl border border-white/10">
                  Depósito compulsório de 8% sobre o salário, férias e 13º, que
                  a empresa recolhe para a conta vinculada do funcionário.
                </div>
              </div>
              <span className="shrink-0 text-right font-medium text-white">
                {formatCurrency(resultado.fgts)}
              </span>
            </div>

            {resultado.inssPatronal > 0 && (
              <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-2 text-sm">
                <div className="group relative flex items-center gap-1 cursor-help">
                  <Info
                    size={14}
                    className="shrink-0 text-slate-500 hover:text-cyan-400 transition-colors"
                  />
                  <span>INSS Patronal (20%):</span>
                  <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-slate-800 p-3 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 shadow-xl border border-white/10">
                    Encargo obrigatório de 20% pago pela empresa sobre a folha
                    de pagamento (Salário + Férias + 13º). Não aplicável para
                    Simples Nacional (exceto Anexo IV).
                  </div>
                </div>
                <span className="shrink-0 text-right font-medium text-white">
                  {formatCurrency(resultado.inssPatronal)}
                </span>
              </div>
            )}

            <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-2 text-sm pt-2">
              <div className="group relative flex items-center gap-1 cursor-help">
                <Info
                  size={14}
                  className="shrink-0 text-slate-500 hover:text-cyan-400 transition-colors"
                />
                <span className="font-medium text-emerald-300">
                  Total de Impostos e Provisões:
                </span>
                <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-slate-800 p-3 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 shadow-xl border border-white/10">
                  Soma de Férias, 13º Salário, FGTS e INSS Patronal.
                </div>
              </div>
              <span className="shrink-0 text-right font-medium text-emerald-300">
                {formatCurrency(
                  resultado.ferias +
                    resultado.decimoTerceiro +
                    resultado.fgts +
                    resultado.inssPatronal,
                )}
              </span>
            </div>

            {resultado.beneficiosTotais > 0 && (
              <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-2 text-sm pt-2">
                <div className="group relative flex items-center gap-1 cursor-help">
                  <Info
                    size={14}
                    className="shrink-0 text-slate-500 hover:text-cyan-400 transition-colors"
                  />
                  <span className="font-medium text-emerald-300">
                    Total de Benefícios:
                  </span>
                  <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-slate-800 p-3 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 shadow-xl border border-white/10">
                    Soma de Vale Transporte, Vale Refeição, Ajuda de Custo e
                    Outros Benefícios.
                  </div>
                </div>
                <span className="shrink-0 text-right font-medium text-emerald-300">
                  {formatCurrency(resultado.beneficiosTotais)}
                </span>
              </div>
            )}

            <div className="flex items-start justify-between gap-4 pt-1 text-sm">
              <div className="group relative flex items-center gap-1 cursor-help">
                <Info
                  size={14}
                  className="shrink-0 text-[#7ee7ff]/70 hover:text-[#7ee7ff] transition-colors"
                />
                <span className="font-semibold text-[#7ee7ff]">
                  Custo Total Mensal para a Empresa:
                </span>
                <div className="absolute bottom-full right-0 mb-2 w-64 rounded-lg bg-slate-800 p-3 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 shadow-xl border border-white/10">
                  O valor contábil real que o funcionário custa mensalmente para
                  a empresa, somando salário, encargos trabalhistas e
                  benefícios.
                </div>
              </div>
              <span className="shrink-0 text-right font-semibold text-[#7ee7ff]">
                {formatCurrency(resultado.total)}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 pt-4 text-center">
            *Valores contábeis. Não considera adicionais
            (periculosidade/insalubridade) nem custos rescisórios.
          </p>
        </div>
      )}
    </div>
  )
}

export default function Ferramentas() {
  const navigate = useNavigate()
  const [isReportOpen, setIsReportOpen] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [])

  const menus = [
    {
      id: "tributario-pj",
      title: "Alíquota Efetiva",
      icon: Building2,
      heading: "Calculadora Alíquota Efetiva",
      subtitle: "Calcule a alíquota efetiva do Simples Nacional.",
      content: <CalculadoraPJ />,
    },
    {
      id: "imposto-renda",
      title: "Imposto de Renda",
      icon: Calculator,
      heading: "Calculadora de Imposto de Renda",
      subtitle: "Simule o seu imposto de renda da pessoa física (IRPF).",
      content: <CalculadoraIRPF />,
    },
    {
      id: "custo-funcionario",
      title: "Custo de Funcionário",
      icon: Briefcase,
      heading: "Calculadora Custo de Funcionário",
      subtitle: "Descubra o custo real de um funcionário para a empresa.",
      content: <CalculadoraFuncionario />,
    },
  ] as const

  const [activeMenuId, setActiveMenuId] =
    useState<(typeof menus)[number]["id"]>("tributario-pj")

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
        <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout Header */}
          <div className="mb-8 max-w-4xl mx-auto text-center">
            <div className="mb-5 flex items-center justify-center gap-3 flex-nowrap md:grid md:w-full md:grid-cols-[56px_1fr_56px] md:items-center md:gap-0">
              <button
                onClick={() => navigate(-1)}
                className="shrink-0 rounded-full border border-white/20 bg-white/5 p-3 text-slate-300 transition-all hover:bg-white/10 hover:text-white md:justify-self-start"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="section-label m-0 flex h-auto min-h-[38px] w-fit shrink py-2 md:justify-self-center">
                <Sparkles size={14} className="shrink-0" />
                <span className="whitespace-normal leading-tight text-center">
                  Calculadoras e Simuladores
                </span>
              </div>
              <div className="hidden md:block" />
            </div>
            <h2 className="section-title mb-4">Ferramentas de Gestão</h2>
            <p className="section-copy w-full max-w-none text-center">
              Simule cenários tributários e custos operacionais de forma rápida
              para apoiar a tomada de decisão.
            </p>
          </div>

          <div className="flex flex-col gap-4 min-[1050px]:grid min-[1050px]:grid-cols-[280px_minmax(0,1fr)] min-[1050px]:gap-3 min-[1050px]:items-stretch">
            {/* Mobile Navigation */}
            <div className="space-y-4 min-[1050px]:hidden">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-gradient-to-r from-slate-950/40 to-slate-900/20 p-4 backdrop-blur-lg">
                <button
                  onClick={handlePrevMenu}
                  disabled={currentIndex === 0}
                  className="rounded-lg border border-white/20 bg-white/10 p-2 text-slate-300 transition-all duration-200 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>

                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 text-center">
                  {activeMenu.title}
                  <br />({currentIndex + 1} de {menus.length})
                </span>

                <button
                  onClick={handleNextMenu}
                  disabled={currentIndex === menus.length - 1}
                  className="rounded-lg border border-white/20 bg-white/10 p-2 text-slate-300 transition-all duration-200 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="hidden min-[600px]:grid min-[600px]:grid-cols-3 min-[600px]:gap-2">
                {menus.map((menu) => {
                  const isActive = activeMenuId === menu.id
                  return (
                    <button
                      key={`quick-${menu.id}`}
                      type="button"
                      onClick={() => setActiveMenuId(menu.id)}
                      className={`rounded-lg border px-3 py-2 text-center text-xs font-semibold transition-all duration-200 ${
                        isActive
                          ? "border-white/25 bg-white/12 text-slate-100 shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
                          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10 hover:text-slate-100"
                      }`}
                    >
                      {menu.title}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Desktop Navigation */}
            <aside className="hidden min-[1050px]:block h-full w-full rounded-[20px] border border-white/10 bg-gradient-to-b from-slate-950/40 to-slate-900/20 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-2xl">
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

            {/* Shared Content Area */}
            <main className="min-[1050px]:rounded-[20px] min-[1050px]:border min-[1050px]:border-white/10 min-[1050px]:bg-gradient-to-br min-[1050px]:from-slate-950/40 min-[1050px]:to-slate-900/20 min-[1050px]:p-8 min-[1050px]:shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.1)] min-[1050px]:backdrop-blur-2xl">
              {/* Desktop Component Header */}
              <header className="hidden min-[1050px]:block mb-8">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-100 md:text-3xl">
                  {activeMenu.heading}
                </h2>
                <p className="mt-2 text-sm text-slate-400 md:text-base">
                  {activeMenu.subtitle}
                </p>
              </header>

              <div className="space-y-4">
                {menus.map((menu) => {
                  const isActive = activeMenuId === menu.id

                  return (
                    <div
                      key={menu.id}
                      className={`${isActive ? "block" : "hidden"} rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 md:p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-lg`}
                    >
                      <div className="min-[1050px]:hidden mb-6">
                        <h2 className="mb-2 text-xl font-semibold tracking-tight text-slate-100">
                          {menu.heading}
                        </h2>
                        <p className="text-sm text-slate-400">
                          {menu.subtitle}
                        </p>
                      </div>

                      {menu.content}
                    </div>
                  )
                })}
              </div>
            </main>
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={() => setIsReportOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-3 rounded-full border border-cyan-300/20 bg-[#071723]/90 px-5 py-4 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-[#0b2231] hover:shadow-[0_22px_70px_rgba(13,96,132,0.28)]"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#7ee7ff]/20 to-[#0d6084]/20 text-[#7ee7ff]">
          <FileText size={18} />
        </span>
        <span className="flex flex-col items-start leading-tight">
          <span className="uppercase tracking-[0.18em] text-[10px] text-cyan-200/70">
            Relatório
          </span>
          <span>Gerar relatório</span>
        </span>
      </button>

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  )
}
