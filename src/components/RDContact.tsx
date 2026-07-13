import React, { useState } from "react"
import { Sparkles, MessageSquare, Send, Check } from "lucide-react"

const maskPhone = (value: string) => {
  const digits = value.replace(/\D/g, "")
  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
}

export default function ContactFormRD() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [service, setService] = useState("")
  const [channel, setChannel] = useState("")
  const [message, setMessage] = useState("")
  const [consent, setConsent] = useState(false)
  
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(maskPhone(e.target.value))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setErrorMsg("Por favor, informe seu nome completo.")
      return
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Por favor, insira um e-mail válido.")
      return
    }
    if (phone.replace(/\D/g, "").length < 10) {
      setErrorMsg("Por favor, insira um telefone válido com DDD.")
      return
    }
    if (!service) {
      setErrorMsg("Por favor, selecione o serviço desejado.")
      return
    }
    if (!consent) {
      setErrorMsg("Você precisa aceitar os termos de consentimento para prosseguir.")
      return
    }

    setErrorMsg("")
    setSubmitted(true)

    // Formatar a mensagem do WhatsApp
    const whatsappMsg = `Olá! Preenchi o formulário de contato no site da Bi2B.

*Meus Dados:*
- *Nome:* ${name.trim()}
- *E-mail:* ${email.trim()}
- *Telefone/WhatsApp:* ${phone}
- *Serviço Desejado:* ${service}
- *Canal de Origem:* ${channel || "Não informado"}
${message.trim() ? `- *Mensagem:* ${message.trim()}` : ""}`

    const encodedText = encodeURIComponent(whatsappMsg)
    const whatsappUrl = `https://wa.me/556392812239?text=${encodedText}`

    // Redirecionar após breve intervalo
    setTimeout(() => {
      window.open(whatsappUrl, "_blank")
    }, 500)
  }

  const handleReset = () => {
    setName("")
    setEmail("")
    setPhone("")
    setService("")
    setChannel("")
    setMessage("")
    setConsent(false)
    setSubmitted(false)
  }

  return (
    <section id="contato" className="section-shell pt-6">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <div className="section-label mx-auto mb-5 w-fit">
            <Sparkles size={14} />
            Conversa estratégica
          </div>
          <h2 className="section-title mb-5">Contato</h2>
          <p className="section-copy max-w-2xl mx-auto">
            Preencha o formulário e receba uma resposta com mais direção.
          </p>
        </div>

        <div className="tech-panel px-4 py-8 sm:p-8 md:p-10 max-w-3xl mx-auto">
          <div className="mb-6 border-b border-white/10 pb-4 text-center sm:mb-7 sm:pb-5">
            <h3 className="text-xl font-bold text-white sm:text-2xl flex items-center justify-center gap-2">
              <MessageSquare className="text-cyan-300" size={24} />
              Falar com Especialista
            </h3>
          </div>

          {submitted ? (
            <div className="py-8 text-center flex flex-col items-center animate-in fade-in duration-300">
              <div className="h-16 w-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4 mx-auto animate-bounce">
                <Check size={32} />
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">
                Solicitação Iniciada!
              </h4>
              <p className="text-slate-300 mb-8 max-w-md mx-auto">
                Você foi redirecionado para o WhatsApp com uma mensagem formatada. Se o redirecionamento não ocorreu automaticamente, clique no botão abaixo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <a
                  href={`https://wa.me/556392812239?text=${encodeURIComponent(
                    `Olá! Preenchi o formulário de contato no site da Bi2B.\n\n*Meus Dados:*\n- *Nome:* ${name}\n- *E-mail:* ${email}\n- *Telefone:* ${phone}\n- *Serviço:* ${service}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tech-button-primary bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 font-semibold text-white shadow-lg hover:opacity-90"
                >
                  Abrir WhatsApp Manualmente
                </a>
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-full font-medium transition-all"
                >
                  Novo Formulário
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Serviço Desejado *
                  </label>
                  <select
                    required
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors cursor-pointer"
                  >
                    <option value="" disabled className="bg-slate-950 text-slate-500">Selecione o serviço</option>
                    <option value="Consultoria Financeira" className="bg-slate-950 text-white">Consultoria Financeira</option>
                    <option value="Business Intelligence & BI" className="bg-slate-950 text-white">Business Intelligence & BI</option>
                    <option value="Automatização de Processos" className="bg-slate-950 text-white">Automatização de Processos</option>
                    <option value="Treinamentos / Capacitação" className="bg-slate-950 text-white">Treinamentos / Capacitação</option>
                    <option value="Outro" className="bg-slate-950 text-white">Outro Serviço</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Por qual canal nos conheceu?
                  </label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors cursor-pointer"
                  >
                    <option value="" className="bg-slate-950 text-slate-500">Selecione uma opção (opcional)</option>
                    <option value="Google" className="bg-slate-950 text-white">Google</option>
                    <option value="LinkedIn" className="bg-slate-950 text-white">LinkedIn</option>
                    <option value="Instagram" className="bg-slate-950 text-white">Instagram</option>
                    <option value="Indicação" className="bg-slate-950 text-white">Indicação</option>
                    <option value="Outro" className="bg-slate-950 text-white">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Mensagem adicional (opcional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors resize-none"
                    placeholder="Como podemos ajudar você?"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-white/20 bg-slate-950 text-cyan-400 focus:ring-cyan-400 cursor-pointer"
                  />
                  <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors leading-tight">
                    Concordo em receber comunicações e aceito que meus dados sejam utilizados para fins de contato comercial, em total conformidade com a LGPD e a nossa Política de Privacidade.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#0d6084] to-[#0a4a62] hover:from-[#1176a3] hover:to-[#0c5c7a] text-white font-extrabold py-4 px-6 rounded-full transition-all shadow-[0_12px_40px_rgba(13,96,132,0.32)] hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(13,96,132,0.42)] text-sm uppercase tracking-wider"
              >
                <Send size={16} />
                Falar com Especialista no WhatsApp
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
