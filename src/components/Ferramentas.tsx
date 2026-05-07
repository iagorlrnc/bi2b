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

const parseCurrencyString = (value: string): number | "" => {
  const onlyDigits = value.replace(/\D/g, "")
  if (!onlyDigits) return ""
  return Number(onlyDigits) / 100
}

const formatCurrencyInput = (value: number | ""): string => {
  if (value === "") return ""
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

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
    { limite: 720000, aliquota: 0.10, deducao: 13860 },
    { limite: 1800000, aliquota: 0.112, deducao: 22500 },
    { limite: 3600000, aliquota: 0.147, deducao: 85500 },
    { limite: 4800000, aliquota: 0.30, deducao: 720000 },
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
  ]
};

function calcularAliquotaEfetivaSimples(rbt12: number, anexo: typeof tabelasSimples.anexoI) {
  if (rbt12 === 0) return { aliquotaEfetiva: anexo[0].aliquota * 100 }; //primeira faixa se não houver faturamento anterior
  
  const faixa = anexo.find(f => rbt12 <= f.limite) || anexo[anexo.length - 1];
  
  return {
    aliquotaEfetiva: faixa.aliquota * 100 //porcentagem
  };
}

function CalculadoraPJ() {
  const [faturamento, setFaturamento] = useState<number | "">("")
  const [rbt12, setRbt12] = useState<number | "">("")
  const [anexoSelecionado, setAnexoSelecionado] = useState("anexoI")
  
  const [resultado, setResultado] = useState<{
    simplesAliquota: number
    simplesTotal: number
  } | null>(null)

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val)

  const calcularPJ = () => {
    const fMensal = Number(faturamento) || 0;
    //se a empresa for nova, o rbt12 é feito com base no faturamento mensal
    const r12 = Number(rbt12) > 0 ? Number(rbt12) : fMensal * 12;

    let tabelaAtiva = tabelasSimples.anexoIII;
    if (anexoSelecionado === "anexoI") tabelaAtiva = tabelasSimples.anexoI;
    if (anexoSelecionado === "anexoII") tabelaAtiva = tabelasSimples.anexoII;
    if (anexoSelecionado === "anexoIV") tabelaAtiva = tabelasSimples.anexoIV;
    if (anexoSelecionado === "anexoV") tabelaAtiva = tabelasSimples.anexoV;

    const calculoSimples = calcularAliquotaEfetivaSimples(r12, tabelaAtiva);
    let simplesAliquotaEfetiva = calculoSimples.aliquotaEfetiva;
    
    setResultado({
      simplesAliquota: simplesAliquotaEfetiva,
      simplesTotal: fMensal * (simplesAliquotaEfetiva / 100)
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
            <option value="anexoI" style={{ color: '#000', background: '#fff' }}>Anexo I</option>
            <option value="anexoII" style={{ color: '#000', background: '#fff' }}>Anexo II</option>
            <option value="anexoIII" style={{ color: '#000', background: '#fff' }}>Anexo III</option>
            <option value="anexoIV" style={{ color: '#000', background: '#fff' }}>Anexo IV</option>
            <option value="anexoV" style={{ color: '#000', background: '#fff' }}>Anexo V</option>
          </select>
          {anexoSelecionado === "anexoV" && (
            <p className="text-xs text-amber-300 mt-1">
              * Se a folha de pagamento for &gt;= 28% da receita, o serviço pode ir para o Anexo III (Fator R). Escolha o Anexo III neste caso.
            </p>
          )}
        </div>
      </div>
      <button
        onClick={calcularPJ}
        className="tech-button-primary w-full justify-center bg-gradient-to-r from-[#0d6084] to-[#0a4a62] px-8 py-3 shadow-[0_12px_40px_rgba(13,96,132,0.32)] hover:-translate-y-0.5 sm:w-auto"
      >
        Simular Impostos
        <ArrowRight size={18} />
      </button>

      {resultado && (
        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h3 className="text-lg font-medium text-white mb-4">Estimativa de Impostos Mensais</h3>
          <div className="max-w-xl mx-auto">
            <div className="rounded-lg bg-slate-800/50 p-4 border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 bg-gradient-to-bl from-cyan-500/20 to-transparent rounded-bl-lg">
                <Sparkles size={14} className="text-cyan-400" />
              </div>
              <h4 className="text-md font-semibold text-cyan-300 mb-3">Simples Nacional</h4>
              <div className="flex justify-between text-sm mb-2 text-slate-300">
                <span>Alíquota (Porcentagem da Faixa):</span>
                <span className="text-white font-medium">{resultado.simplesAliquota.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between font-medium text-white pt-3 border-t border-white/10">
                <span>Total Imposto Mensal Estimado:</span>
                <span className="text-[#7ee7ff] text-lg">{formatCurrency(resultado.simplesTotal)}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-cyan-900/20 border border-cyan-500/20 rounded-lg">
            <p className="text-sm text-cyan-100 flex items-start gap-2">
              <span className="text-cyan-400 font-bold">Dica:</span> 
              A alíquota do Simples Nacional considera a receita bruta dos últimos 12 meses (RBT12). Com RBT12 de {formatCurrency(Number(rbt12) || Number(faturamento) * 12)}, sua empresa estaria nesta faixa de tributação.
            </p>
          </div>
          <p className="text-xs text-slate-500 pt-4 text-center">
            *Estes são valores iniciais simplificados. Apenas uma contabilidade consultiva pode realizar um planejamento tributário oficial com Fator R, benefícios de ICMS e ISS corretos.
          </p>
        </div>
      )}

      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6 overflow-hidden">
        <h3 className="text-lg font-medium text-white mb-4">Empresas que se encaixam em cada Anexo</h3>
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
                <td className="p-3 font-medium text-[#7ee7ff] whitespace-nowrap">Anexo I</td>
                <td className="p-3">Comércio: Revendedores em geral, restaurantes, padarias e afins.</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-3 font-medium text-[#7ee7ff] whitespace-nowrap">Anexo II</td>
                <td className="p-3">Indústria: Fábricas, indústrias e empresas industriais em geral.</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-3 font-medium text-[#7ee7ff] whitespace-nowrap">Anexo III</td>
                <td className="p-3">Serviços: Instalação, reparos e manutenção, agências de viagens, treinamentos e atividades sem responsabilidade técnica exigida.</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-3 font-medium text-[#7ee7ff] whitespace-nowrap">Anexo IV</td>
                <td className="p-3">Serviços: Limpeza, vigilância, obras, construção de imóveis, serviços advocatícios, entre outros.</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-3 font-medium text-[#7ee7ff] whitespace-nowrap">Anexo V</td>
                <td className="p-3">Serviços: Auditoria, jornalismo, tecnologia, publicidade, engenharia, entre outros.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
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
    if (regime === "simples-iv") {
      //27.8% (20% patronal + rat + terceiros)
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
      title: "Alíquota Efetiva",
      icon: Building2,
      heading: "Calculadora Alíquota Efetiva",
      subtitle: "Calcule a alíquota efetiva do Simples Nacional.",
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
