import React, { createContext, useContext, useState, ReactNode } from "react"

export type IrpfData = {
  rendimento: number
  deducoes: number
  resultado: {
    base: number
    aliquota: number
    aliquotaEfetiva: number
    parcela: number
    imposto: number
    redutor?: number
  }
}

export type PjData = {
  faturamento: number
  rbt12: number
  anexoSelecionado: string
  resultado: {
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
  }
}

export type FuncionarioData = {
  faturamentoEmpresa: number
  caixaEmpresa: number
  salario: number
  regime: string
  valeTransporte: number
  valeRefeicao: number
  ajudaCusto: number
  outroBeneficio: number
  resultado: {
    bruto: number
    ferias: number
    decimoTerceiro: number
    fgts: number
    inssPatronal: number
    beneficiosTotais: number
    total: number
    percentualFaturamento: number
    margemOperacionalAposContratacao: number
    coberturaCaixaMeses: number
    naZonaDeRisco: boolean
  }
}

type ReportContextType = {
  irpfData: IrpfData | null
  setIrpfData: React.Dispatch<React.SetStateAction<IrpfData | null>>
  pjData: PjData | null
  setPjData: React.Dispatch<React.SetStateAction<PjData | null>>
  funcionarioData: FuncionarioData | null
  setFuncionarioData: React.Dispatch<
    React.SetStateAction<FuncionarioData | null>
  >
}

const ReportContext = createContext<ReportContextType | undefined>(undefined)

export const ReportProvider = ({ children }: { children: ReactNode }) => {
  const [irpfData, setIrpfData] = useState<IrpfData | null>(null)
  const [pjData, setPjData] = useState<PjData | null>(null)
  const [funcionarioData, setFuncionarioData] =
    useState<FuncionarioData | null>(null)

  return (
    <ReportContext.Provider
      value={{
        irpfData,
        setIrpfData,
        pjData,
        setPjData,
        funcionarioData,
        setFuncionarioData,
      }}
    >
      {children}
    </ReportContext.Provider>
  )
}

export const useReportContext = () => {
  const context = useContext(ReportContext)
  if (!context) {
    throw new Error("useReportContext must be used within a ReportProvider")
  }
  return context
}
