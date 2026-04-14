import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"

declare global {
  interface Window {
    RDStationForms: any
  }
}

const ContactFormRD = () => {
  const [isFormReady, setIsFormReady] = useState(false)
  const [hasFormError, setHasFormError] = useState(false)

  useEffect(() => {
    const scriptId = "rdstation-forms-script"
    const formId = "formulario-site-bi2b-0eaf6e225952b1af5d6b"
    const singleChoiceQuestions = [
      "serviço desejado",
      "servico desejado",
      "por qual canal nos conheceu",
    ]
    let mutationObserver: MutationObserver | null = null
    let readyTimeout: number | null = null

    const normalizeText = (text: string) =>
      text
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .trim()

    const setupSingleChoiceGroups = (container: HTMLElement) => {
      const groupSelectors =
        ".bricks-form__field, .bricks-form__fieldset, fieldset"
      const groups = Array.from(container.querySelectorAll(groupSelectors))

      groups.forEach((group) => {
        const groupText = normalizeText(group.textContent || "")
        const isSingleChoiceGroup = singleChoiceQuestions.some((question) =>
          groupText.includes(normalizeText(question)),
        )

        if (!isSingleChoiceGroup) return

        const checkboxes = Array.from(
          group.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'),
        )
        if (checkboxes.length < 2) return

        const checkboxesByQuestion = new Map<string, HTMLInputElement[]>()

        checkboxes.forEach((checkbox, index) => {
          const nameKey = checkbox.name?.trim()
          const parentField = checkbox.closest(
            ".bricks-form__field",
          ) as HTMLElement | null
          const parentQuestion = parentField
            ? normalizeText(parentField.textContent || "")
            : ""
          const questionKey = nameKey || parentQuestion || `fallback-${index}`

          const bucket = checkboxesByQuestion.get(questionKey) || []
          bucket.push(checkbox)
          checkboxesByQuestion.set(questionKey, bucket)
        })

        checkboxesByQuestion.forEach((questionCheckboxes, questionKey) => {
          if (questionCheckboxes.length < 2) return

          questionCheckboxes.forEach((checkbox) => {
            const bindingKey = `single-${questionKey}`
            if (checkbox.dataset.singleChoiceBound === bindingKey) return

            checkbox.dataset.singleChoiceBound = bindingKey
            checkbox.addEventListener("change", () => {
              if (!checkbox.checked) return

              questionCheckboxes.forEach((other) => {
                if (other !== checkbox && other.checked) {
                  other.checked = false
                }
              })
            })
          })
        })
      })
    }

    const setupPhoneEmailInline = (container: HTMLElement) => {
      const fields = Array.from(
        container.querySelectorAll<HTMLElement>(".bricks-form__field"),
      )

      const phoneField = fields.find((field) => {
        const text = normalizeText(field.textContent || "")
        return (
          text.includes("celular") ||
          text.includes("telefone") ||
          text.includes("whatsapp")
        )
      })

      const emailField = fields.find((field) => {
        const text = normalizeText(field.textContent || "")
        return text.includes("email") || text.includes("e-mail")
      })

      if (!phoneField || !emailField || phoneField === emailField) return

      const sharedParent = phoneField.parentElement
      if (!sharedParent || emailField.parentElement !== sharedParent) return

      const phoneInWrapper = phoneField.closest(".rd-inline-phone-email")
      const emailInWrapper = emailField.closest(".rd-inline-phone-email")
      if (
        phoneInWrapper &&
        emailInWrapper &&
        phoneInWrapper === emailInWrapper
      ) {
        return
      }

      const siblings = Array.from(sharedParent.children)
      const phoneIndex = siblings.indexOf(phoneField)
      const emailIndex = siblings.indexOf(emailField)
      const firstIndex = Math.min(phoneIndex, emailIndex)
      const firstNode = siblings[firstIndex]

      const wrapper = document.createElement("div")
      wrapper.className = "rd-inline-phone-email"
      sharedParent.insertBefore(wrapper, firstNode)

      if (phoneIndex <= emailIndex) {
        wrapper.appendChild(phoneField)
        wrapper.appendChild(emailField)
      } else {
        wrapper.appendChild(emailField)
        wrapper.appendChild(phoneField)
      }
    }

    const setupServiceChannelInline = (container: HTMLElement) => {
      const fields = Array.from(
        container.querySelectorAll<HTMLElement>(".bricks-form__field"),
      )

      const serviceField = fields.find((field) => {
        const text = normalizeText(field.textContent || "")
        return (
          text.includes("servico desejado") || text.includes("serviço desejado")
        )
      })

      const channelField = fields.find((field) => {
        const text = normalizeText(field.textContent || "")
        return text.includes("por qual canal nos conheceu")
      })

      if (!serviceField || !channelField || serviceField === channelField)
        return

      const sharedParent = serviceField.parentElement
      if (!sharedParent || channelField.parentElement !== sharedParent) return

      const serviceInWrapper = serviceField.closest(
        ".rd-inline-service-channel",
      )
      const channelInWrapper = channelField.closest(
        ".rd-inline-service-channel",
      )
      if (
        serviceInWrapper &&
        channelInWrapper &&
        serviceInWrapper === channelInWrapper
      ) {
        return
      }

      const siblings = Array.from(sharedParent.children)
      const serviceIndex = siblings.indexOf(serviceField)
      const channelIndex = siblings.indexOf(channelField)
      const firstIndex = Math.min(serviceIndex, channelIndex)
      const firstNode = siblings[firstIndex]

      const wrapper = document.createElement("div")
      wrapper.className = "rd-inline-service-channel"
      sharedParent.insertBefore(wrapper, firstNode)

      if (serviceIndex <= channelIndex) {
        wrapper.appendChild(serviceField)
        wrapper.appendChild(channelField)
      } else {
        wrapper.appendChild(channelField)
        wrapper.appendChild(serviceField)
      }
    }

    const renderForm = () => {
      const container = document.getElementById(formId)
      if (!window.RDStationForms || !container) return

      setHasFormError(false)
      setIsFormReady(false)

      // Usar o próprio elemento DOM como fonte da verdade garante robustez
      // contra as re-montagens instantâneas duplas do React Strict Mode e do Router.
      if (container.hasChildNodes() || container.dataset.rdLoaded === "true") {
        return
      }

      container.dataset.rdLoaded = "true"
      try {
        new window.RDStationForms(formId, "null").createForm()

        setTimeout(() => {
          setupSingleChoiceGroups(container)
          setupServiceChannelInline(container)
          setupPhoneEmailInline(container)

          if (container.querySelector("form")) {
            setIsFormReady(true)
          }

          mutationObserver = new MutationObserver(() => {
            setupSingleChoiceGroups(container)
            setupServiceChannelInline(container)
            setupPhoneEmailInline(container)

            if (container.querySelector("form")) {
              setIsFormReady(true)
            }
          })

          mutationObserver.observe(container, {
            childList: true,
            subtree: true,
            attributes: false,
          })
        }, 400)

        readyTimeout = window.setTimeout(() => {
          if (!container.querySelector("form")) {
            setHasFormError(true)
          }
        }, 8000)
      } catch (err) {
        console.error("RD Station Forms erro:", err)
        setHasFormError(true)
      }
    }

    let script = document.getElementById(scriptId) as HTMLScriptElement

    if (!script) {
      // Criação inicial (script nunca esteve na página)
      script = document.createElement("script")
      script.id = scriptId
      script.src =
        "https://d335luupugsy2.cloudfront.net/js/rdstation-forms/stable/rdstation-forms.min.js"
      script.type = "text/javascript"
      script.async = true
      script.addEventListener("load", renderForm)
      document.body.appendChild(script)
    } else if (window.RDStationForms) {
      // Script já existe e a biblioteca global está pronta (usuário navegou de volta)
      // O setTimeout garante que o navegador finalizou a montagem do container do React.
      setTimeout(renderForm, 100)
    } else {
      // Script existe mas a biblioteca ainda não (Strict Mode Mount 2)
      script.addEventListener("load", renderForm)
    }

    return () => {
      mutationObserver?.disconnect()
      if (readyTimeout) {
        window.clearTimeout(readyTimeout)
      }

      // Deixamos a global ilesa, limpamos apenas o container do React para
      // esvaziar o iframe e a sua "trava" ao sair da página.
      const container = document.getElementById(formId)
      if (container) {
        container.innerHTML = ""
        delete container.dataset.rdLoaded
      }
    }
  }, [])

  const handleRetry = () => {
    setHasFormError(false)
    setIsFormReady(false)
    window.location.reload()
  }

  return (
    <section id="contato" className="section-shell">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <div className="section-label mx-auto mb-5 w-fit">
            <Sparkles size={14} />
            Conversa estratégica
          </div>
          <h2 className="section-title mb-5">Contato</h2>
          <p className="section-copy max-w-2xl mx-auto">
            Preencha o formulário e receba uma resposta com mais direção e menos
            ruído.
          </p>
        </div>

        <div className="tech-panel px-0 py-4 sm:p-5 md:p-8">
          <div className="mb-6 border-b border-white/10 pb-4 text-center sm:mb-7 sm:pb-5">
            <h3 className="text-xl font-bold text-white sm:text-2xl">
              Falar com Especialista
            </h3>
          </div>

          {!isFormReady && !hasFormError && (
            <p className="mb-4 text-center text-sm text-slate-300">
              Carregando formulário...
            </p>
          )}

          {hasFormError && (
            <div className="mb-4 flex flex-col items-center gap-3 text-center">
              <p className="text-sm text-slate-300">
                Não foi possível carregar o formulário agora.
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="tech-button-primary bg-gradient-to-r from-[#0d6084] to-[#0a4a62] px-5 py-2.5 text-sm"
              >
                Tentar novamente
              </button>
            </div>
          )}

          <style>
            {`
              #formulario-site-bi2b-0eaf6e225952b1af5d6b form,
              #formulario-site-bi2b-0eaf6e225952b1af5d6b section,
              #formulario-site-bi2b-0eaf6e225952b1af5d6b .bricks-form {
                background-color: transparent !important;
                background: transparent !important;
              }

              #formulario-site-bi2b-0eaf6e225952b1af5d6b input:not([type="checkbox"]):not([type="radio"]),
              #formulario-site-bi2b-0eaf6e225952b1af5d6b select,
              #formulario-site-bi2b-0eaf6e225952b1af5d6b textarea {
                border-radius: 12px !important;
                width: 100% !important;
                min-width: 0 !important;
                box-sizing: border-box !important;
              }

              #formulario-site-bi2b-0eaf6e225952b1af5d6b .bricks-form,
              #formulario-site-bi2b-0eaf6e225952b1af5d6b .bricks-form__fieldset,
              #formulario-site-bi2b-0eaf6e225952b1af5d6b .bricks-form__field {
                width: 100% !important;
                min-width: 0 !important;
                box-sizing: border-box !important;
              }

              #formulario-site-bi2b-0eaf6e225952b1af5d6b .bricks-form__label {
                white-space: normal !important;
                word-break: break-word !important;
              }

              #formulario-site-bi2b-0eaf6e225952b1af5d6b .iti {
                width: 100% !important;
              }

              #formulario-site-bi2b-0eaf6e225952b1af5d6b .iti input {
                width: 100% !important;
              }

              #formulario-site-bi2b-0eaf6e225952b1af5d6b .iti__flag-container {
                position: absolute !important;
                top: 0 !important;
                bottom: 0 !important;
                display: flex !important;
                align-items: center !important;
                height: 100% !important;
                border-radius: 12px 0 0 12px !important;
              }

              #formulario-site-bi2b-0eaf6e225952b1af5d6b .iti__selected-flag {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 0 14px !important;
                height: 100% !important;
                background-color: transparent !important;
                border-radius: 12px 0 0 12px !important;
              }

              #formulario-site-bi2b-0eaf6e225952b1af5d6b .iti__flag {
                margin: 0 !important;
              }

              #formulario-site-bi2b-0eaf6e225952b1af5d6b .iti__arrow {
                margin-left: 6px !important;
              }

              #formulario-site-bi2b-0eaf6e225952b1af5d6b .rd-inline-phone-email {
                display: grid;
                grid-template-columns: 1fr;
                gap: 14px;
                width: 100%;
                max-width: 100%;
              }

              #formulario-site-bi2b-0eaf6e225952b1af5d6b .rd-inline-phone-email .bricks-form__field {
                margin: 0 !important;
                width: 100% !important;
              }

              #formulario-site-bi2b-0eaf6e225952b1af5d6b .rd-inline-service-channel {
                display: grid;
                grid-template-columns: 1fr;
                gap: 14px;
                width: 100%;
                max-width: 100%;
                padding-top: clamp(10px, 2vw, 18px);
              }

              #formulario-site-bi2b-0eaf6e225952b1af5d6b .rd-inline-service-channel .bricks-form__field {
                margin: 0 !important;
                width: 100% !important;
              }

              #formulario-site-bi2b-0eaf6e225952b1af5d6b button[type="submit"],
              #formulario-site-bi2b-0eaf6e225952b1af5d6b .bricks-form__submit button,
              #formulario-site-bi2b-0eaf6e225952b1af5d6b input[type="submit"] {
                width: 100% !important;
                max-width: 100% !important;
              }

              @media (max-width: 639px) {
                #formulario-site-bi2b-0eaf6e225952b1af5d6b form,
                #formulario-site-bi2b-0eaf6e225952b1af5d6b .bricks-form {
                  padding-left: 0 !important;
                  padding-right: 0 !important;
                }
              }

              @media (min-width: 900px) {
                #formulario-site-bi2b-0eaf6e225952b1af5d6b .rd-inline-service-channel {
                  grid-template-columns: repeat(2, minmax(0, 1fr));
                }

                #formulario-site-bi2b-0eaf6e225952b1af5d6b .rd-inline-phone-email {
                  grid-template-columns: repeat(2, minmax(0, 1fr));
                }

                #formulario-site-bi2b-0eaf6e225952b1af5d6b button[type="submit"],
                #formulario-site-bi2b-0eaf6e225952b1af5d6b .bricks-form__submit button,
                #formulario-site-bi2b-0eaf6e225952b1af5d6b input[type="submit"] {
                  max-width: 360px !important;
                }
              }
            `}
          </style>

          <div
            role="main"
            id="formulario-site-bi2b-0eaf6e225952b1af5d6b"
            className="min-h-[420px]"
          ></div>
        </div>
      </div>

      {/* Botão Flutuante WhatsApp - Posicionado de forma fixa */}
      <a
        href="https://wa.me/556392812239"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[9999] flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-[#0d6084] to-[#0a4a62] text-white shadow-[0_14px_40px_rgba(13,96,132,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(13,96,132,0.38)]"
        aria-label="Contato via WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.06 3.973l-1.125 4.105 4.204-1.102a7.923 7.923 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
        </svg>
      </a>
    </section>
  )
}

export default ContactFormRD
