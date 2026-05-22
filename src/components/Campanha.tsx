import {
  Check,
  AlertCircle,
  TrendingUp,
  Building2,
  ShieldCheck,
  FileText,
  BadgeCheck,
  Sparkles,
  Lock,
  Download,
  Clock,
  Users,
  BookOpen,
  Zap,
} from "lucide-react"
import { useEffect, useState } from "react"
import { FaWhatsapp } from "react-icons/fa"
import ebookMockupImg from "../assets/img/ebook_mockup.png"
import logoImg from "../assets/img/logo.png"

// Tipagem mínima para o construtor do RDStationForms carregado dinamicamente
type RDStationFormsConstructor = new (
  formId: string,
  arg: string,
) => { createForm(): void }

const getRDStationForms = (): RDStationFormsConstructor | undefined =>
  (window as Window & { RDStationForms?: RDStationFormsConstructor })
    .RDStationForms

export default function Campanha() {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)
  const [modalStep, setModalStep] = useState<"thanks" | "notice" | null>(null)
  const [consent, setConsent] = useState(false)
  const [showConsentError, setShowConsentError] = useState(false)
  const [timeLeft, setTimeLeft] = useState(899) // 14 minutes and 59 seconds
  const [showStickyCta, setShowStickyCta] = useState(false)
  const [stickyFooterBottom, setStickyFooterBottom] = useState(0)

  // Timer effect to create urgency
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 899 : prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Scroll listener for sticky CTA (mobile only)
  useEffect(() => {
    const handleScroll = () => {
      const heroForm = document.getElementById("hero-form-container")
      if (heroForm) {
        const rect = heroForm.getBoundingClientRect()
        // Exibe o sticky CTA apenas quando o formulário estiver fora de vista no mobile
        setShowStickyCta(rect.bottom < 0)
      }
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const updateStickyFooterPosition = () => {
      const isIosDevice =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)

      if (window.innerWidth >= 1024 || !window.visualViewport || !isIosDevice) {
        setStickyFooterBottom(0)
        return
      }

      const viewport = window.visualViewport
      const hiddenBrowserChrome = Math.max(
        0,
        window.innerHeight - viewport.height - viewport.offsetTop,
      )

      setStickyFooterBottom(hiddenBrowserChrome)
    }

    updateStickyFooterPosition()

    if (window.visualViewport) {
      window.visualViewport.addEventListener(
        "resize",
        updateStickyFooterPosition,
      )
      window.visualViewport.addEventListener(
        "scroll",
        updateStickyFooterPosition,
      )
    }

    window.addEventListener("orientationchange", updateStickyFooterPosition)

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          updateStickyFooterPosition,
        )
        window.visualViewport.removeEventListener(
          "scroll",
          updateStickyFooterPosition,
        )
      }
      window.removeEventListener(
        "orientationchange",
        updateStickyFooterPosition,
      )
    }
  }, [])

  const triggerConsentError = () => {
    setShowConsentError(true)
    setTimeout(() => setShowConsentError(false), 500)
  }

  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked
    setConsent(isChecked)

    const container = document.getElementById(
      "formulario-pag-abertura-de-empresa-060ce9f639cf1704454e",
    )
    if (container) {
      const btn = container.querySelector(
        'button.bricks-form__submit, button[type="submit"], input[type="submit"]',
      ) as HTMLButtonElement | HTMLInputElement | null
      if (btn) {
        if (!isChecked) {
          btn.disabled = true
          btn.style.opacity = "0.5"
          btn.style.cursor = "not-allowed"
        } else {
          btn.disabled = false
          btn.style.opacity = "1"
          btn.style.cursor = "pointer"
        }
      }
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)

    const scriptId = "rdstation-forms-script"
    const formId = "formulario-pag-abertura-de-empresa-060ce9f639cf1704454e"

    // Suprime o "window.alert" chato que a RD Station tenta ejetar na tela
    const originalAlert = window.alert
    window.alert = function (message) {
      if (
        typeof message === "string" &&
        (message.toLowerCase().includes("obrigado") ||
          message.toLowerCase().includes("sucesso") ||
          message.toLowerCase().includes("enviad"))
      ) {
        // Usa o gatilho do alerta oculto para ativar a nossa linda interface!
        setIsFormSubmitted(true)
        setModalStep("thanks")
        return // Engole o alerta sem mostrar a caixa feia no navegador
      }
      originalAlert(message)
    }

    // Listener NATIVO de sucesso recomendado pela RD Station (Ignora envios em branco)
    const handleRdMessage = (event: MessageEvent) => {
      if (!event.data) return
      try {
        if (
          Array.isArray(event.data) &&
          event.data[0] &&
          event.data[0].event_type === "conversion"
        ) {
          setIsFormSubmitted(true)
          setModalStep("thanks")
        } else if (
          typeof event.data === "object" &&
          !Array.isArray(event.data) &&
          event.data.eventType === "conversion"
        ) {
          setIsFormSubmitted(true)
          setModalStep("thanks")
        }
      } catch {
        // Anti-crash override
      }
    }
    window.addEventListener("message", handleRdMessage)

    const renderForm = () => {
      const container = document.getElementById(formId)
      const RDForms = getRDStationForms()
      if (!RDForms || !container) return

      if (container.hasChildNodes() || container.dataset.rdLoaded === "true") {
        return
      }

      container.dataset.rdLoaded = "true"
      try {
        new RDForms(formId, "null").createForm()

        setTimeout(() => {
          const observer = new MutationObserver(() => {
            const html = container.innerHTML.toLowerCase()
            const formObj = container.querySelector("form")
            if (formObj && !formObj.dataset.btnListener) {
              formObj.dataset.btnListener = "true"

              const submitBtn = formObj.querySelector(
                'button.bricks-form__submit, button[type="submit"], input[type="submit"]',
              ) as HTMLButtonElement | HTMLInputElement | null
              if (submitBtn) {
                const checkbox = document.getElementById(
                  "consent-checkbox",
                ) as HTMLInputElement | null
                const isChecked = checkbox ? checkbox.checked : false
                if (!isChecked) {
                  submitBtn.disabled = true
                  submitBtn.style.opacity = "0.5"
                  submitBtn.style.cursor = "not-allowed"
                }
              }

              formObj.addEventListener("submit", () => {
                const btn = formObj.querySelector(
                  'button.bricks-form__submit, button[type="submit"], input[type="submit"]',
                ) as HTMLButtonElement | HTMLInputElement | null
                if (btn) {
                  if (btn.tagName === "INPUT") {
                    ;(btn as HTMLInputElement).value = "Aguarde..."
                  } else {
                    ;(btn as HTMLButtonElement).innerHTML = "Aguarde..."
                  }
                  btn.style.opacity = "0.7"
                  btn.style.pointerEvents = "none"
                }
              })
            }

            if (html.includes("rd-form-success")) {
              setIsFormSubmitted(true)
              setModalStep("thanks")
            } else if (
              (html.includes("sucesso") ||
                html.includes("obrigado") ||
                html.includes("enviad")) &&
              !html.includes("<form")
            ) {
              setIsFormSubmitted(true)
              setModalStep("thanks")
            }
          })
          observer.observe(container, {
            childList: true,
            subtree: true,
            attributes: true,
          })
        }, 500)
      } catch (err) {
        console.error("RD Station Forms erro:", err)
      }
    }

    let script = document.getElementById(scriptId) as HTMLScriptElement

    if (!script) {
      script = document.createElement("script")
      script.id = scriptId
      script.src =
        "https://d335luupugsy2.cloudfront.net/js/rdstation-forms/stable/rdstation-forms.min.js"
      script.type = "text/javascript"
      script.async = true
      script.addEventListener("load", renderForm)
      document.body.appendChild(script)
    } else if (getRDStationForms()) {
      setTimeout(renderForm, 100)
    } else {
      script.addEventListener("load", renderForm)
    }

    return () => {
      window.alert = originalAlert // Restaura o alerta padrão ao sair da página
      window.removeEventListener("message", handleRdMessage)
      const container = document.getElementById(formId)
      if (container) {
        container.innerHTML = ""
        delete container.dataset.rdLoaded
      }
    }
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-[#05070b] relative text-white selection:bg-cyan-500/30 selection:text-white">
      {/* Elementos de gradiente de fundo */}
      <div className="absolute top-0 inset-x-0 h-[700px] bg-[radial-gradient(circle_at_top_center,_rgba(6,182,212,0.15),_rgba(13,96,132,0.05)_40%,_transparent_75%)] pointer-events-none" />
      <div className="absolute top-1/4 left-[-100px] w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 right-[-100px] w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Estilos para customização e override do formulário RD Station */}
      <style>
        {`
          #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e form,
          #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e section,
          #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e .bricks-form {
            background-color: transparent !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e button.bricks-form__submit,
          #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e input[type="submit"],
          #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e button[type="submit"] {
            background: linear-gradient(90deg, #22d3ee 0%, #0d6084 100%) !important;
            border: none !important;
            color: #ffffff !important;
            font-weight: 800 !important;
            font-family: 'Space Grotesk', sans-serif !important;
            text-transform: uppercase !important;
            letter-spacing: 0.05em !important;
            border-radius: 9999px !important;
            padding: 16px 32px !important;
            font-size: 14px !important;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
            box-shadow: 0 10px 25px rgba(6, 182, 212, 0.3) !important;
            cursor: pointer !important;
            width: 100% !important;
            margin-top: 10px !important;
          }

          #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e button.bricks-form__submit:hover,
          #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e input[type="submit"]:hover,
          #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e button[type="submit"]:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 15px 30px rgba(6, 182, 212, 0.45) !important;
            filter: brightness(1.1) !important;
          }

          #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e button.bricks-form__submit:disabled {
            opacity: 0.5 !important;
            cursor: not-allowed !important;
            transform: none !important;
            box-shadow: none !important;
            filter: brightness(0.6) grayscale(0.5) !important;
          }

          #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e .bricks-form__field {
            margin-bottom: 16px !important;
          }

          #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e .bricks-form__label {
            color: #e2e8f0 !important;
            font-size: 13px !important;
            font-weight: 600 !important;
            margin-bottom: 6px !important;
            display: block !important;
            text-align: left !important;
          }

          #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e input:not([type="checkbox"]):not([type="radio"]),
          #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e select {
            background-color: rgba(255, 255, 255, 0.95) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            color: #0f172a !important;
            padding: 12px 16px !important;
            font-size: 14px !important;
            width: 100% !important;
            transition: all 0.3s ease !important;
            border-radius: 12px !important;
          }

          #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e input:not([type="checkbox"]):not([type="radio"]):focus,
          #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e select:focus {
            border-color: #22d3ee !important;
            background-color: #ffffff !important;
            box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.2) !important;
          }

          /* Container da Bandeira do Telefone */
          #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e .iti__flag-container {
            position: absolute !important;
            top: 0 !important;
            bottom: 0 !important;
            display: flex !important;
            align-items: center !important;
            height: 100% !important;
            border-radius: 12px 0 0 12px !important;
          }

          #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e .iti__selected-flag {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 0 14px !important;
            height: 100% !important;
            background-color: transparent !important;
            border-radius: 12px 0 0 12px !important;
          }

          #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e .iti__flag {
            margin: 0 !important;
          }
          
          #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e .iti__arrow {
            margin-left: 6px !important;
          }

          #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e.consent-not-checked button.bricks-form__submit,
          #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e.consent-not-checked button[type="submit"],
          #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e.consent-not-checked input[type="submit"] {
            opacity: 0.5 !important;
            filter: brightness(0.6) grayscale(0.5) !important;
            cursor: not-allowed !important;
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-6px); }
            40% { transform: translateX(6px); }
            60% { transform: translateX(-4px); }
            80% { transform: translateX(4px); }
          }
          .animate-shake {
            animation: shake 0.4s ease-in-out;
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          @media (min-width: 1024px) and (max-width: 1276px) {
            .whatsapp-text-hide {
              display: none !important;
            }
            .whatsapp-btn-shrink {
              padding: 0 !important;
              width: 3.5rem !important;
              height: 3.5rem !important;
              min-width: 3.5rem !important;
              border-radius: 9999px !important;
              justify-content: center !important;
            }
          }
        `}
      </style>

      {/* HEADER DE ALTA CONVERSÃO (Sem Links Distrativos) */}
      <header className="w-full py-5 border-b border-white/5 bg-[#05070b]/60 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Bi2B Logo" className="h-8 md:h-9 w-auto" />
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-emerald-400 text-[10px] md:text-xs font-bold uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Conexão Segura
          </div>
        </div>
      </header>

      {/* SEÇÃO HERO: IMPACTO TOTAL + FORMULÁRIO ABOVE THE FOLD */}
      <section className="section-shell pt-8 md:pt-16 pb-20 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* COPY PERSUASIVA (ESQUERDA) */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8 min-h-[640px] lg:min-h-[820px]">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-cyan-300 backdrop-blur-md">
                <Sparkles size={14} className="animate-pulse" />
                E-book Gratuito
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Abra sua empresa sem burocracia e{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-200 to-white drop-shadow-sm">
                  Economize até 60%
                </span>{" "}
                em Impostos
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-slate-300 font-medium leading-relaxed max-w-xl">
                Descubra no nosso novo guia prático o passo a passo definitivo
                para formalizar seu negócio de forma ágil, segura e com o menor
                enquadramento tributário possível.
              </p>

              {/* Selos Rápidos */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/5 max-w-lg">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <ShieldCheck
                    className="text-cyan-400 flex-shrink-0"
                    size={18}
                  />
                  <span className="text-xs text-slate-300 font-semibold">
                    100% Segura
                  </span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Zap className="text-cyan-400 flex-shrink-0" size={18} />
                  <span className="text-xs text-slate-300 font-semibold">
                    Acesso Imediato
                  </span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 col-span-2 sm:col-span-1">
                  <Check className="text-cyan-400 flex-shrink-0" size={18} />
                  <span className="text-xs text-slate-300 font-semibold">
                    Sem Taxas Ocultas
                  </span>
                </div>
              </div>

              {/* Modern contact card: headline, benefits, CTA and visible number */}
              <div className="!mt-16 md:!mt-24 relative group">
                {/* Background glow effects that appear on hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 via-cyan-500/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="relative w-full rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/[0.08] hover:border-emerald-500/20 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col lg:flex-row items-start lg:items-center gap-6 sm:gap-8 transition-all duration-300">
                  <div className="flex-1 space-y-3">
                    {/* Living Status and Title side-by-side in the same line without breaking */}
                    <div className="flex flex-row flex-nowrap items-center gap-3">
                      <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                        Online Agora
                      </span>
                      <h3 className="text-base sm:text-xl md:text-2xl font-extrabold text-white tracking-tight whitespace-nowrap shrink-0">
                        Fale com um especialista
                      </h3>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                      Tire suas dúvidas sobre abertura de empresa, economia de
                      impostos em poucos minutos, de forma 100% gratuita.
                    </p>
                  </div>

                  {/* Right CTA area */}
                  <div className="flex flex-col items-center justify-center gap-3 w-full lg:w-auto flex-shrink-0 border-t lg:border-t-0 lg:border-l border-white/[0.08] pt-6 lg:pt-0 lg:pl-8 text-center">
                    <a
                      href="https://wa.me/556392812239?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20um%20especialista%20sobre%20abrir%20minha%20empresa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn whatsapp-btn-shrink mx-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:via-emerald-500 hover:to-teal-500 text-white font-extrabold px-8 py-3.5 rounded-full shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_35px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300 text-center text-sm"
                    >
                      <FaWhatsapp
                        size={20}
                        className="transition-transform duration-300 group-hover/btn:rotate-12 group-hover/btn:scale-110 shrink-0"
                      />
                      <span className="whatsapp-text-hide">
                        Iniciar Conversa
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              {/* (removed small WhatsApp card — replaced by larger separate card below) */}
            </div>

            {/* FORMULÁRIO + MOCKUP DO EBOOK (DIREITA - CAPTURA PRIMÁRIA) */}
            <div className="lg:col-span-5 pt-8 lg:pt-0">
              <div
                id="hero-form-container"
                className="relative tech-panel p-6 sm:p-8 border-cyan-400/20 shadow-[0_0_50px_rgba(6,182,212,0.15)] transition-all hover:border-cyan-400/30"
              >
                {/* Mockup do Ebook em Destaque flutuante */}
                <div className="relative flex justify-center -mt-12 sm:-mt-16 mb-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-cyan-400/20 rounded-2xl blur-xl group-hover:bg-cyan-400/30 transition-all duration-500" />
                    <img
                      src={ebookMockupImg}
                      alt="E-book Guia Completo para Abrir Sua Empresa"
                      className="relative w-28 sm:w-32 h-auto object-cover rounded-xl shadow-2xl border border-white/10 transform rotate-1 group-hover:rotate-0 transition-transform duration-500"
                    />
                    <span className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-[10px] sm:text-xs px-3 py-1.5 rounded-full shadow-lg border border-amber-400/20 flex items-center gap-1 animate-pulse">
                      <Download size={12} />
                      100% GRÁTIS
                    </span>
                  </div>
                </div>

                {/* Gatilho Mental de Urgência (Timer) */}
                <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-3 mb-6 text-center">
                  <p className="text-[11px] sm:text-xs font-semibold text-red-300 flex items-center justify-center gap-1.5">
                    <Clock size={13} className="animate-pulse" />
                    Acesso gratuito garantido hoje por mais:{" "}
                    <span className="font-mono font-bold text-white bg-red-900 px-2 py-0.5 rounded border border-cyan-400/20">
                      {formatTime(timeLeft)}
                    </span>
                  </p>
                </div>

                {/* Chamada para Ação */}
                <div className="text-center mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                    Receba o E-book Grátis
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Preencha abaixo para receber o E-Book imediatamente
                  </p>
                </div>

                {/* Container do Formulário Integrado */}
                <div
                  role="main"
                  id="formulario-pag-abertura-de-empresa-060ce9f639cf1704454e"
                  className={`py-0 w-full transition-all duration-300 ${isFormSubmitted ? "opacity-60 pointer-events-none grayscale-[20%]" : ""} ${!consent ? "consent-not-checked" : ""}`}
                  onClickCapture={(e) => {
                    if (!consent) {
                      const target = e.target as HTMLElement
                      if (
                        target.closest(
                          'button[type="submit"], input[type="submit"], .bricks-form__submit',
                        )
                      ) {
                        e.stopPropagation()
                        e.preventDefault()
                        triggerConsentError()
                      }
                    }
                  }}
                  onSubmitCapture={(e) => {
                    if (!consent) {
                      e.stopPropagation()
                      e.preventDefault()
                      triggerConsentError()
                    }
                  }}
                  onKeyDownCapture={(e) => {
                    if (!consent && e.key === "Enter") {
                      e.stopPropagation()
                      e.preventDefault()
                      triggerConsentError()
                    }
                  }}
                ></div>

                {/* Consent Checkbox com tratamento de erros visual */}
                {!isFormSubmitted && (
                  <div
                    className={`mt-4 flex items-start gap-3 p-3 rounded-xl border transition-all duration-300 ${showConsentError ? "border-red-500 bg-red-500/10 animate-shake" : "border-white/5 bg-[#0d6084]/15"}`}
                  >
                    <input
                      type="checkbox"
                      id="consent-checkbox"
                      checked={consent}
                      onChange={handleConsentChange}
                      className="flex-shrink-0 w-4 h-4 mt-0.5 rounded border-gray-600 text-cyan-500 focus:ring-cyan-400 bg-slate-900 cursor-pointer"
                    />
                    <label
                      htmlFor="consent-checkbox"
                      className="text-[10px] text-slate-300 cursor-pointer leading-snug font-medium"
                    >
                      Concordo em receber comunicações e aceito que meus dados
                      sejam utilizados para fins de marketing e personalização
                      de ofertas.
                    </label>
                  </div>
                )}

                {/* Indicador de Privacidade e Segurança */}
                <div className="mt-5 border-t border-white/10 pt-4 text-center">
                  {!isFormSubmitted ? (
                    <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
                      <Lock size={12} className="text-cyan-400" />
                      Seus dados protegidos.
                    </p>
                  ) : (
                    <p className="text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5">
                      <Check size={14} />
                      Tudo pronto! Verifique sua caixa de entrada.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: O QUE VOCÊ VAI APRENDER (BENEFÍCIOS E CARDS PREMIUM) */}
      <section className="section-shell bg-[#080c14]/40 py-20 border-y border-white/5">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-cyan-300 mb-4">
              <BookOpen size={14} />
              Conteúdo do E-book
            </div>
            <h2 className="text-3xl md:text-4.5xl font-extrabold text-white mb-6">
              O que você vai aprender ao baixar este guia gratuito:
            </h2>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
              Desenvolvemos um material simples, sem termos contábeis difíceis
              de compreender, com foco direto na sua economia e segurança
              jurídica.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "Economia Tributária",
                desc: "Compare de forma clara o Simples Nacional, Lucro Presumido e a tributação por Pessoa Física e escolha o menor imposto legal.",
              },
              {
                icon: Building2,
                title: "Processo Sem Erros",
                desc: "Evite os erros capitais que atrasam a emissão do seu CNPJ ou geram problemas imediatos junto aos órgãos governamentais.",
              },
              {
                icon: FileText,
                title: "Regulamentação Fácil",
                desc: "Descubra como estruturar sua atividade corretamente usando as CNAEs ideais para o seu modelo de negócio ou serviço.",
              },
              {
                icon: BadgeCheck,
                title: "Checklist de Sucesso",
                desc: "Um plano de ação prático com tudo o que você deve configurar logo nos primeiros dias após ter a sua empresa aberta.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="tech-card group border-white/5 bg-slate-900/20 hover:border-cyan-400/25 transition-all"
              >
                <div className="w-12 h-12 bg-cyan-950/40 text-cyan-400 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/10 group-hover:scale-110 transition-transform duration-300">
                  <item.icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO: IDENTIFICAÇÃO (PARA QUEM É ESTE EBOOK) */}
      <section className="section-shell py-20 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-cyan-300 mb-4">
              <Users size={14} />
              Público Alvo
            </div>
            <h2 className="text-3xl md:text-4.5xl font-extrabold text-white mb-6">
              Para quem este material é indispensável?
            </h2>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
              Se você se enquadra em algum destes perfis, continuar atuando na
              informalidade ou sem suporte pode estar custando caro.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "Prestadores de Serviços (PJs)",
                desc: "Profissionais de TI, desenvolvedores, designers, redatores ou consultores que fecharam contratos corporativos e precisam emitir notas fiscais sem pagar o imposto massivo de Pessoa Física (que chega a até 27.5%).",
              },
              {
                title: "Empresas de Tecnologia & Startups",
                desc: "Empreendedores digitais que planejam iniciar operações, criar novas marcas ou aplicativos, e buscam o menor regime de imposto adequado para iniciar com segurança financeira.",
              },
              {
                title: "Profissionais Liberais e Autônomos",
                desc: "Médicos, advogados, arquitetos, psicólogos e demais autônomos que desejam regularizar suas receitas, planejar a previdência e expandir sua marca com CNPJ.",
              },
              {
                title: "Infoprodutores, Creators e Afiliados",
                desc: "Criadores de cursos, infoprodutos ou afiliados digitais que precisam emitir centenas de notas automatizadas e necessitam de uma contabilidade especializada para e-commerce.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="tech-panel p-6 border-white/5 bg-slate-900/10 flex items-start gap-4"
              >
                <div className="w-7 h-7 rounded-full bg-cyan-950 flex-shrink-0 flex items-center justify-center border border-cyan-500/10 mt-1">
                  <Check size={14} className="text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO: CTA SECUNDÁRIO FOCADO (FINAL) */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[#090d14] to-[#05070b]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_center,_rgba(34,211,238,0.08),_transparent_65%)]" />
        <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
          <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-cyan-400 shadow-lg shadow-cyan-400/5">
            <Download size={26} />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Pronto para economizar de forma imediata e legal?
          </h2>
          <p className="text-slate-300 text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Faça o download do guia definitivo agora mesmo. É rápido, 100%
            gratuito e trará a transformação tributária que a sua futura empresa
            merece.
          </p>
          <button
            onClick={() => {
              document
                .getElementById("hero-form-container")
                ?.scrollIntoView({ behavior: "smooth" })
            }}
            className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-cyan-400 to-[#0d6084] hover:from-cyan-300 hover:to-[#0a4a62] text-white font-extrabold px-6 sm:px-10 py-4 rounded-full shadow-[0_20px_50px_rgba(6,182,212,0.3)] hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-300 text-xs sm:text-sm md:text-base text-center"
          >
            <Download size={18} className="flex-shrink-0" />
            Quero Receber o E-book Grátis
          </button>
          <p className="text-[10px] sm:text-xs text-slate-500 mt-4 font-semibold uppercase tracking-wide">
            ✓ DOWNLOAD IMEDIATO | ✓ CONTEÚDO ATUALIZADO 2026
          </p>
        </div>
      </section>

      {/* RODAPÉ SIMPLIFICADO (SEM DISTRAÇÕES E FOCADO) */}
      <footer className="py-10 border-t border-white/5 bg-[#030508] text-slate-500 text-xs">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 opacity-60">
              <img src={logoImg} alt="Bi2B Logo" className="h-6 w-auto" />
            </div>
            <p className="text-center md:text-right">
              &copy; {new Date().getFullYear()} Bi2B Consultoria. Todos os
              direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* STICKY CTA NO MOBILE (FICA FIXO NO RODAPÉ DO CELULAR AO ROLAR) */}
      {showStickyCta && (
        <div
          className="fixed left-0 right-0 z-50 bg-[#05070b]/90 border-t border-cyan-400/20 backdrop-blur-lg p-4 flex items-center justify-between lg:hidden animate-fade-in-up shadow-2xl shadow-cyan-400/10"
          style={{
            bottom: `calc(env(safe-area-inset-bottom) + ${stickyFooterBottom}px)`,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-10 bg-cyan-950/40 rounded-md overflow-hidden flex-shrink-0 border border-cyan-500/10">
              <img
                src={ebookMockupImg}
                alt="Ebook"
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white leading-tight">
                Guia Abrir Minha Empresa
              </p>
              <p className="text-[10px] text-cyan-300 font-bold">
                100% Gratuito
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              document
                .getElementById("hero-form-container")
                ?.scrollIntoView({ behavior: "smooth" })
            }}
            className="bg-gradient-to-r from-cyan-400 to-[#0d6084] text-white text-[11px] sm:text-xs font-extrabold px-6 sm:px-8 py-2.5 rounded-full shadow-lg shadow-cyan-500/10 active:scale-95 transition-all flex-shrink-0 whitespace-nowrap"
          >
            Receber E-book
          </button>
        </div>
      )}

      {/* MODAL DE SUCESSO CUSTOMIZADO */}
      {modalStep && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm px-4 duration-300">
          <div className="tech-panel p-8 max-w-md w-full border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
            {modalStep === "thanks" ? (
              <>
                <div className="w-16 h-16 bg-cyan-950/40 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/30">
                  <Check size={32} className="text-cyan-400" />
                </div>
                <h3 className="text-3xl font-extrabold text-white mb-3 text-center">
                  Muito Obrigado!
                </h3>
                <p className="text-slate-300 mb-8 text-base leading-relaxed text-center">
                  Seus dados foram processados com sucesso.
                  <br />O link para download do e-book foi enviado para o
                  endereço de e-mail preenchido no formulário!
                </p>
                <button
                  onClick={() => {
                    setModalStep("notice")
                  }}
                  className="w-full bg-gradient-to-r from-cyan-400 to-[#0d6084] text-white font-extrabold py-4 rounded-full shadow-lg shadow-cyan-500/15 hover:brightness-110 transition-all text-sm uppercase tracking-wider"
                >
                  OK
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
                  <AlertCircle size={32} className="text-amber-400" />
                </div>
                <h3 className="text-3xl font-extrabold text-white mb-3 text-center">
                  Confira seu e-mail
                </h3>
                <p className="text-slate-300 mb-8 text-base leading-relaxed text-center">
                  Se não encontrar a mensagem em alguns instantes, certifique-se
                  de verificar as pastas
                  <span className="text-white font-semibold"> Principal</span>,
                  <span className="text-white font-semibold"> Promoções</span> e
                  <span className="text-white font-semibold"> Spam</span>.
                  <br />
                  <br />
                  Se ainda assim não o encontrar, sinta-se à vontade para falar
                  conosco.
                </p>
                <button
                  onClick={() => {
                    setModalStep(null)
                  }}
                  className="w-full bg-gradient-to-r from-cyan-400 to-[#0d6084] text-white font-extrabold py-4 rounded-full shadow-lg shadow-cyan-500/15 hover:brightness-110 transition-all text-sm uppercase tracking-wider"
                >
                  Fechar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
