import { useState, useEffect } from "react"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { X, FileText, Check, Loader2 } from "lucide-react"
import { useReportContext } from "../contexts/ReportContext"
import logoSrc from "../assets/img/logoazul.png"

type ReportModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function ReportModal({ isOpen, onClose }: ReportModalProps) {
  const { irpfData, pjData, funcionarioData } = useReportContext()

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [lgpd, setLgpd] = useState(false)

  const [includeIrpf, setIncludeIrpf] = useState(false)
  const [includePj, setIncludePj] = useState(false)
  const [includeFuncionario, setIncludeFuncionario] = useState(false)

  const [isGenerating, setIsGenerating] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIncludeIrpf(!!irpfData)
      setIncludePj(!!pjData)
      setIncludeFuncionario(!!funcionarioData)
      setSuccess(false)
    }
  }, [isOpen, irpfData, pjData, funcionarioData])

  if (!isOpen) return null

  const hasAnyCalculator = irpfData || pjData || funcionarioData
  const hasSelectedCalculators = includeIrpf || includePj || includeFuncionario
  const isFormValid =
    name.trim() !== "" &&
    phone.trim() !== "" &&
    email.trim() !== "" &&
    lgpd &&
    hasSelectedCalculators

  const maskPhone = (value: string) => {
    let v = value.replace(/\D/g, "")
    if (v.length > 11) v = v.substring(0, 11)
    if (v.length > 10) {
      return v.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")
    } else if (v.length > 6) {
      return v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3")
    } else if (v.length > 2) {
      return v.replace(/^(\d{2})(\d{0,5})/, "($1) $2")
    }
    return v
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val)

  const sendToWhatsApp = () => {
    const calculadoras = []
    if (includeIrpf && irpfData) calculadoras.push("IRPF (Simulação de Imposto Simplificada)")
    if (includePj && pjData) calculadoras.push("PJ (Comparativo Simples Nacional vs Lucro Presumido)")
    if (includeFuncionario && funcionarioData) calculadoras.push("Custo de Funcionário")

    const whatsappMsg = `Olá! Acabei de gerar uma simulação financeira no site da Bi2B.

*Meus Dados:*
- *Nome:* ${name.trim()}
- *E-mail:* ${email.trim()}
- *Telefone:* ${phone}

*Simulações no Relatório:*
- ${calculadoras.join("\n- ")}

Gostaria de agendar uma análise estratégica detalhada dessas simulações com um especialista!`

    const encodedText = encodeURIComponent(whatsappMsg)
    const whatsappUrl = `https://wa.me/556392812239?text=${encodedText}`
    window.open(whatsappUrl, "_blank")
  }

  const generatePDF = async () => {
    setIsGenerating(true)
    try {
      sendToWhatsApp()

      const doc = new jsPDF()

      // Load logo
      const img = new Image()
      img.src = logoSrc

      await new Promise((resolve) => {
        img.onload = () => resolve(true)
        img.onerror = () => resolve(false)
      })

      // Header
      if (img.width > 0) {
        // Centraliza a logo: (210 - largura) / 2
        doc.addImage(img, "PNG", (210 - 25) / 2, 10, 25, 10)
      }

      doc.setFontSize(22)
      doc.setTextColor(13, 96, 132)
      doc.text("Relatório de Simulação Tributária", 105, 30, {
        align: "center",
      })

      doc.setFontSize(12)
      doc.setTextColor(100, 100, 100)
      doc.text(`Solicitante: ${name}`, 105, 38, { align: "center" })
      doc.text(
        `Data: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`,
        105,
        44,
        { align: "center" },
      )

      let currentY = 55

      // IRPF Section
      if (includeIrpf && irpfData) {
        doc.setFontSize(16)
        doc.setTextColor(0, 0, 0)
        doc.text("Simulação de IRPF", 14, currentY)
        currentY += 6

        autoTable(doc, {
          startY: currentY,
          head: [["Descrição", "Valor"]],
          body: [
            ["Rendimento Mensal", formatCurrency(irpfData.rendimento)],
            ["Deduções", formatCurrency(irpfData.deducoes)],
            ["Base de Cálculo", formatCurrency(irpfData.resultado.base)],
            ["Alíquota Nominal", `${irpfData.resultado.aliquota}%`],
            ["Parcela a Deduzir", formatCurrency(irpfData.resultado.parcela)],
            ...(irpfData.resultado.redutor
              ? [
                  [
                    "Desconto Linear (Redutor)",
                    `- ${formatCurrency(irpfData.resultado.redutor)}`,
                  ],
                ]
              : []),
            [
              "Alíquota Efetiva Real",
              `${irpfData.resultado.aliquotaEfetiva.toFixed(2)}%`,
            ],
            ["Imposto Devido", formatCurrency(irpfData.resultado.imposto)],
          ],
          theme: "striped",
          headStyles: { fillColor: [13, 96, 132] },
        })
        currentY = (doc as any).lastAutoTable.finalY + 15
      }

      // PJ Section
      if (includePj && pjData) {
        // Check page break
        if (currentY > 230) {
          doc.addPage()
          currentY = 20
        }

        doc.setFontSize(16)
        doc.setTextColor(0, 0, 0)
        doc.text("Comparativo Simples Nacional x Lucro Presumido", 14, currentY)
        currentY += 6

        autoTable(doc, {
          startY: currentY,
          head: [["Descrição", "Simples Nacional", "Lucro Presumido"]],
          body: [
            [
              "Faturamento Mensal",
              formatCurrency(pjData.faturamento || pjData.rbt12 / 12),
              formatCurrency(pjData.faturamento || pjData.rbt12 / 12),
            ],
            [
              "Alíquota Efetiva Aprox.",
              `${pjData.resultado.simplesAliquota.toFixed(2)}%`,
              `${pjData.resultado.lucroAliquota.toFixed(2)}%`,
            ],
            [
              "Total Imposto Mensal",
              formatCurrency(pjData.resultado.simplesTotal),
              formatCurrency(pjData.resultado.lucroTotal),
            ],
          ],
          theme: "striped",
          headStyles: { fillColor: [13, 96, 132] },
        })
        currentY = (doc as any).lastAutoTable.finalY + 15
      }

      // Funcionario Section
      if (includeFuncionario && funcionarioData) {
        // Check page break
        if (currentY > 230) {
          doc.addPage()
          currentY = 20
        }

        doc.setFontSize(16)
        doc.setTextColor(0, 0, 0)
        doc.text("Custo de Funcionário", 14, currentY)
        currentY += 6

        autoTable(doc, {
          startY: currentY,
          head: [["Descrição", "Valor"]],
          body: [
            ["Salário Base Bruto", formatCurrency(funcionarioData.salario)],
            [
              "Regime",
              funcionarioData.regime === "simples"
                ? "Simples Nacional"
                : funcionarioData.regime === "mei"
                  ? "MEI"
                  : "Lucro Presumido",
            ],
            [
              "Total de Benefícios",
              formatCurrency(funcionarioData.resultado.beneficiosTotais),
            ],
            [
              "Encargos (Férias, 13º, FGTS, INSS)",
              formatCurrency(
                funcionarioData.resultado.total -
                  funcionarioData.salario -
                  funcionarioData.resultado.beneficiosTotais,
              ),
            ],
            [
              "Custo Total Mensal",
              formatCurrency(funcionarioData.resultado.total),
            ],
          ],
          theme: "striped",
          headStyles: { fillColor: [13, 96, 132] },
        })
        currentY = (doc as any).lastAutoTable.finalY + 15

        // Análise de Viabilidade da Contratação
        doc.setFontSize(14)
        doc.setTextColor(0, 0, 0)
        doc.text(
          "Análise de Viabilidade da Contratação do Funcionário",
          14,
          currentY,
        )
        currentY += 6

        const riskColor = funcionarioData.resultado.naZonaDeRisco
          ? [200, 50, 50]
          : [50, 150, 50]
        const riskStatus = funcionarioData.resultado.naZonaDeRisco
          ? "ZONA DE RISCO"
          : "SEGURO"

        autoTable(doc, {
          startY: currentY,
          head: [["Indicador", "Valor"]],
          body: [
            [
              "Percentual do Faturamento",
              `${funcionarioData.resultado.percentualFaturamento.toFixed(2)}%`,
            ],
            [
              "Margem Operacional após Contratação",
              formatCurrency(
                funcionarioData.resultado.margemOperacionalAposContratacao,
              ),
            ],
            [
              "Fôlego de Caixa (meses)",
              `${funcionarioData.resultado.coberturaCaixaMeses.toFixed(1)} meses`,
            ],
            [riskStatus, ""],
          ],
          theme: "striped",
          headStyles: { fillColor: [13, 96, 132] },
          bodyStyles: {
            textColor: [0, 0, 0],
          },
          didParseCell: (data: any) => {
            if (
              data.row.index === 3 &&
              data.column.index === 0 &&
              funcionarioData.resultado.naZonaDeRisco
            ) {
              data.cell.styles.fillColor = [255, 240, 240]
              data.cell.styles.textColor = riskColor
            } else if (
              data.row.index === 3 &&
              data.column.index === 0 &&
              !funcionarioData.resultado.naZonaDeRisco
            ) {
              data.cell.styles.fillColor = [240, 255, 240]
              data.cell.styles.textColor = riskColor
            }
          },
        })
        currentY = (doc as any).lastAutoTable.finalY + 15
      }

      // Footer disclaimer
      doc.setFontSize(9)
      doc.setTextColor(150, 150, 150)

      const disclaimerText =
        "Aviso: Os dados apresentados neste relatório não são oficiais e possuem caráter exclusivamente simulatório. Eles não substituem uma consultoria contábil profissional. Entre em contato com um consultor da Bi2B para uma análise detalhada e personalizada do seu negócio."
      const lines = doc.splitTextToSize(disclaimerText, 180)

      // If we are too far down the page, add a new one for disclaimer
      if (currentY + lines.length * 5 > 280) {
        doc.addPage()
        currentY = 20
      } else {
        // Put disclaimer at the bottom of the current page if there is space, or just after the tables.
        currentY = Math.max(currentY + 10, 270 - lines.length * 5)
      }

      doc.text(lines, 105, currentY, { align: "center" })

      doc.save("Relatorio_Bi2B_Simulacao.pdf")
      setSuccess(true)
    } catch (e) {
      console.error(e)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#061826] shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200 mt-auto mb-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {!success ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0d6084]/20 text-[#7ee7ff]">
                <FileText size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Gerar Relatório
                </h2>
                <p className="text-sm text-slate-400">
                  Exporte suas simulações em PDF
                </p>
              </div>
            </div>

            {!hasAnyCalculator ? (
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-sm mb-6">
                Você ainda não realizou nenhuma simulação. Preencha e calcule
                alguma ferramenta primeiro para gerar um relatório.
              </div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 p-2.5 text-white placeholder-slate-500 focus:border-[#7ee7ff] focus:outline-none focus:ring-1 focus:ring-[#7ee7ff]"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(maskPhone(e.target.value))}
                      className="w-full rounded-lg border border-white/10 bg-white/5 p-2.5 text-white placeholder-slate-500 focus:border-[#7ee7ff] focus:outline-none focus:ring-1 focus:ring-[#7ee7ff]"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 p-2.5 text-white placeholder-slate-500 focus:border-[#7ee7ff] focus:outline-none focus:ring-1 focus:ring-[#7ee7ff]"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <h3 className="text-sm font-medium text-slate-300 mb-3">
                    O que incluir no relatório?
                  </h3>
                  <div className="space-y-2">
                    {irpfData && (
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeIrpf}
                          onChange={(e) => setIncludeIrpf(e.target.checked)}
                          className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#7ee7ff] focus:ring-[#7ee7ff]"
                        />
                        <span className="text-sm text-slate-200">
                          Simulação de IRPF
                        </span>
                      </label>
                    )}
                    {pjData && (
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includePj}
                          onChange={(e) => setIncludePj(e.target.checked)}
                          className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#7ee7ff] focus:ring-[#7ee7ff]"
                        />
                        <span className="text-sm text-slate-200">
                          Comparativo (Simples Nacional x Lucro Presumido)
                        </span>
                      </label>
                    )}
                    {funcionarioData && (
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeFuncionario}
                          onChange={(e) =>
                            setIncludeFuncionario(e.target.checked)
                          }
                          className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#7ee7ff] focus:ring-[#7ee7ff]"
                        />
                        <span className="text-sm text-slate-200">
                          Custo de Funcionário
                        </span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={lgpd}
                      onChange={(e) => setLgpd(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-[#7ee7ff] focus:ring-[#7ee7ff]"
                    />
                    <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                      Concordo em fornecer meus dados para a Bi2B Consultoria.
                      Entendo que posso receber contatos e materiais
                      informativos, de acordo com a LGPD.
                    </span>
                  </label>
                </div>

                <button
                  onClick={generatePDF}
                  disabled={!isFormValid || isGenerating}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-[#0d6084] to-[#0a4a62] hover:from-[#0f729e] hover:to-[#0c5978] text-white py-3.5 px-6 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_20px_rgba(13,96,132,0.3)] hover:shadow-[0_12px_25px_rgba(13,96,132,0.4)]"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Gerando PDF...
                    </>
                  ) : (
                    <>
                      <FileText size={18} />
                      Baixar Relatório (PDF)
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="h-16 w-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4 mx-auto animate-bounce">
              <Check size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Relatório Gerado!
            </h2>
            <p className="text-slate-400 mb-8">
              O download do seu PDF começou automaticamente.
            </p>
            <button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white py-2 px-6 rounded-lg font-medium transition-all"
            >
              Voltar para as ferramentas
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
