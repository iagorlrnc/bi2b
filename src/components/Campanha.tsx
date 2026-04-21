import {
  Check,
  AlertCircle,
  TrendingUp,
  Building2,
  ShieldCheck,
  ArrowLeft,
  FileText,
  BadgeCheck,
  Sparkles,
} from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

import negocioImg from "../assets/img/negocio.jpg"
import fechadoImg from "../assets/img/fechado.jpg"

const RETURN_SCROLL_KEY = "bi2b:faturamento:return-scroll"

export default function Campanha() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleBack = () => {
    if (location.state?.fromInternalLink) {
      navigate(-1)
      return
    }

    sessionStorage.removeItem(RETURN_SCROLL_KEY)
    navigate("/", { state: { scrollToTop: true } })
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
        setShowModal(true)
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
          setShowModal(true)
        } else if (
          typeof event.data === "object" &&
          !Array.isArray(event.data) &&
          event.data.eventType === "conversion"
        ) {
          setIsFormSubmitted(true)
          setShowModal(true)
        }
      } catch (e) {
        // Anti-crash override
      }
    }
    window.addEventListener("message", handleRdMessage)

    const renderForm = () => {
      const container = document.getElementById(formId)
      if (!(window as any).RDStationForms || !container) return

      if (container.hasChildNodes() || container.dataset.rdLoaded === "true") {
        return
      }

      container.dataset.rdLoaded = "true"
      try {
        new (window as any).RDStationForms(formId, "null").createForm()

        setTimeout(() => {
          const observer = new MutationObserver(() => {
            const html = container.innerHTML.toLowerCase()
            const formObj = container.querySelector("form")
            if (formObj && !formObj.dataset.btnListener) {
              formObj.dataset.btnListener = "true"
              formObj.addEventListener("submit", () => {
                const btn = formObj.querySelector(
                  'button.bricks-form__submit, button[type="submit"], input[type="submit"]',
                ) as any
                if (btn) {
                  if (btn.tagName === "INPUT") {
                    btn.value = "Aguarde..."
                  } else {
                    btn.innerHTML = "Aguarde..."
                  }
                  btn.style.opacity = "0.7"
                  btn.style.pointerEvents = "none"
                }
              })
            }

            if (html.includes("rd-form-success")) {
              setIsFormSubmitted(true)
              setShowModal(true)
            } else if (
              (html.includes("sucesso") ||
                html.includes("obrigado") ||
                html.includes("enviad")) &&
              !html.includes("<form")
            ) {
              setIsFormSubmitted(true)
              setShowModal(true)
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
    } else if ((window as any).RDStationForms) {
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

  return (
    <div className="min-h-screen relative">
      {/* SECTION 1: INÍCIO */}
      <section id="inicio" className="section-shell pt-12">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="section-label w-fit">
                  <Sparkles size={14} />
                  Abertura de Empresa
                </div>
                <h1 className="section-title">
                  Abra sua Empresa do Jeito Certo e Pague{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7ee7ff] via-white to-[#0d6084]">
                    Menos Impostos
                  </span>
                </h1>
              </div>

              <p className="section-copy max-w-2xl">
                Abrir uma empresa pode ser a melhor decisão para quem deseja
                crescer profissionalmente — mas também pode se tornar um
                problema quando é feito sem planejamento. O erro mais comum é
                ignorar o planejamento tributário, levando a pagamentos
                desnecessários de impostos.
              </p>

              <div className="tech-panel border-l-4 border-[#7ee7ff] p-3 max-w-2xl">
                <p className="text-slate-300 italic">
                  "Antes de abrir sua empresa, é fundamental avaliar cada
                  detalhe com cuidado. O Simples Nacional nem sempre é a melhor
                  opção. Cada caso precisa ser analisado individualmente para
                  garantir economia desde o início."
                </p>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                <img
                  src={negocioImg}
                  alt="Empreendedora planejando e trabalhando no laptop"
                  className="rounded-[28px] border border-white/10 shadow-2xl object-cover w-full h-[320px] sm:h-[400px]"
                />
                <div className="absolute -bottom-6 left-4 right-4 sm:right-auto sm:-left-6 tech-panel p-4 sm:p-5 sm:max-w-xs border-[#7ee7ff]/30 z-10 transition-transform hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="text-[#7ee7ff]" size={24} />
                    <p className="font-semibold text-white">Evite riscos</p>
                  </div>
                  <p className="text-sm text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    Não pague impostos indevidamente por falta de análise
                    prévia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SINAIS */}
      <section id="sinais" className="section-shell pt-6">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="order-2 lg:order-1 relative">
              <img
                src={fechadoImg}
                alt="Equipe de especialistas analisando dados em reunião"
                className="rounded-[28px] border border-white/10 shadow-xl w-full object-cover h-[320px] sm:h-[400px]"
              />
              <div className="absolute top-6 -right-6 tech-panel p-4 border-[#7ee7ff]/30 hidden lg:block z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-[#0d6084]/15 p-2 rounded-full">
                    <TrendingUp className="text-[#7ee7ff]" size={20} />
                  </div>
                  <p className="font-semibold text-white">
                    Maximize seus lucros
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8 order-1 lg:order-2">
              <div>
                <div className="section-label w-fit mb-5">
                  <Sparkles size={14} />
                  Para Autônomos
                </div>
                <h2 className="section-title mb-6">
                  Sinais de que Você Precisa Abrir Uma Empresa Agora
                </h2>
                <p className="section-copy max-w-2xl">
                  Se você atua como Pessoa Física, preste atenção nestes sinais
                  indicativos de que a hora de formalizar chegou:
                </p>
              </div>

              <div className="space-y-5 tech-panel p-6 border-white/10">
                {[
                  "Você está pagando impostos demais como pessoa física (IRPF e INSS)",
                  "Precisa emitir nota fiscal para fechar contratos com empresas",
                  "Quer crescer profissionalmente e ter novas oportunidades no mercado",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check
                      size={22}
                      className="text-[#7ee7ff] flex-shrink-0 mt-0.5"
                    />
                    <p className="text-slate-100 font-medium">{item}</p>
                  </div>
                ))}
              </div>

              <div className="tech-panel border-l-4 border-[#7ee7ff] p-4 max-w-2xl">
                <p className="text-slate-300 font-medium">
                  Formalizar seu negócio pode reduzir sua carga tributária, dar
                  mais credibilidade e abrir portas para novos contratos
                  empresariais.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: PROCESSO RÁPIDO */}
      <section id="processo" className="section-shell pt-6">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <div className="section-label w-fit mx-auto mb-5">
              <Sparkles size={14} />
              Nossa Jornada
            </div>
            <h2 className="section-title mb-6">
              Abertura Rápida, Simples e Sem Burocracia
            </h2>
            <p className="section-copy max-w-2xl mx-auto">
              Nós cuidamos de tudo para você com orientação especializada para
              garantir que você pague menos imposto desde o primeiro mês.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center md:justify-items-stretch">
            {[
              {
                icon: Building2,
                title: "CNPJ",
                desc: "Obtenção ágil do seu registro nacional sem dores de cabeça.",
              },
              {
                icon: FileText,
                title: "Inscrição Municipal",
                desc: "Regularização correta para o seu tipo de serviço ou produto.",
              },
              {
                icon: BadgeCheck,
                title: "Alvará",
                desc: "Garantimos a liberação do seu negócio para operar dentro da lei.",
              },
              {
                icon: TrendingUp,
                title: "Enquadramento",
                desc: "Análise individual para escolher o regime mais vantajoso.",
              },
            ].map((item, i) => (
              <div key={i} className="tech-card w-full">
                <div className="w-14 h-14 bg-[#0d6084]/15 text-[#7ee7ff] rounded-2xl flex items-center justify-center mb-6 border border-[#7ee7ff]/15">
                  <item.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-wide">
                  {item.title}
                </h3>
                <div className="w-12 h-0.5 bg-[#FF0000] mb-4"></div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: SEGURANÇA / CTA */}
      <section className="section-shell relative isolate pt-6">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(13,96,132,0.15),_transparent_50%)]" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="section-label w-fit mx-auto mb-5">
              <ShieldCheck size={14} />
              Segurança Total
            </div>
            <h2 className="section-title mb-6">
              Comece seu Negócio com Segurança
            </h2>
            <p className="section-copy max-w-2xl mx-auto mb-12">
              Abrir uma empresa não precisa ser complicado. Nossa equipe realiza
              todo o processo de forma rápida, com acompanhamento tributário e
              suporte contábil, garantindo que você comece sua jornada
              empreendedora com tranquilidade.
            </p>

            <div className="tech-panel py-4 sm:py-0 md:py-0">
              <div
                className={`text-center mb-8 transition-all duration-300 ${isFormSubmitted ? "opacity-60" : ""}`}
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Receba seu E-book Gratuitamente
                </h3>
                <p className="text-slate-300 text-base">
                  Preencha o formulário abaixo para receber o material
                  exclusivo.
                </p>
              </div>

              <style>
                {`
                  #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e form,
                  #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e section,
                  #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e .bricks-form {
                    background-color: transparent !important;
                    background: transparent !important;
                  }
                  
                  #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e input:not([type="checkbox"]):not([type="radio"]),
                  #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e select,
                  #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e textarea {
                    border-radius: 12px !important;
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
                `}
              </style>
              <div
                role="main"
                id="formulario-pag-abertura-de-empresa-060ce9f639cf1704454e"
                className={`w-full transition-all duration-300 ${isFormSubmitted ? "opacity-60 pointer-events-none grayscale-[20%]" : ""}`}
              ></div>

              <div className="mt-8 pt-6 border-t border-white/20">
                {!isFormSubmitted ? (
                  <p className="text-[#7ee7ff] text-sm text-center font-bold flex items-center justify-center gap-1.5">
                    <AlertCircle size={16} />
                    Preencha o formulário para receber o E-book
                  </p>
                ) : (
                  <p className="text-[#7ee7ff] text-sm text-center font-bold flex items-center justify-center gap-1.5">
                    <Check size={16} />O e-book foi enviado para o seu e-mail!
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-start">
              <button
                onClick={handleBack}
                aria-label="Voltar para a página anterior"
                className="tech-button-primary bg-gradient-to-r from-[#0d6084] to-[#0a4a62] px-6 py-3 shadow-[0_14px_40px_rgba(13,96,132,0.28)] hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(13,96,132,0.34)]"
              >
                <ArrowLeft size={18} />
                Início
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL DE SUCESSO CUSTOMIZADO */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 duration-300">
          <div className="tech-panel p-8 max-w-md w-full border-white/10">
            <div className="w-16 h-16 bg-[#0d6084]/15 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#7ee7ff]/30">
              <Check size={32} className="text-[#7ee7ff]" />
            </div>
            <h3 className="text-3xl font-extrabold text-white mb-3 text-center">
              Muito Obrigado!
            </h3>
            <p className="text-slate-300 mb-8 text-lg leading-relaxed text-center">
              Recebemos seus dados com sucesso.
              <br />O e-book foi enviado para o endereço de
              <br />
              e-mail preenchido no formulário!
            </p>
            <button
              onClick={() => {
                setShowModal(false)
              }}
              className="tech-button-primary w-full bg-gradient-to-r from-[#0d6084] to-[#0a4a62] shadow-[0_14px_40px_rgba(13,96,132,0.28)] hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(13,96,132,0.34)]"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
