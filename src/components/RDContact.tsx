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
  const [consent, setConsent] = useState(false)
  const [showConsentError, setShowConsentError] = useState(false)

  const triggerConsentError = () => {
    setShowConsentError(true)
    setTimeout(() => setShowConsentError(false), 500)
  }

  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked
    setConsent(isChecked)

    const container = document.getElementById("formulario-site-bi2b-0eaf6e225952b1af5d6b")
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

            const formObj = container.querySelector("form")
            if (formObj) {
              const submitBtn = formObj.querySelector(
                'button.bricks-form__submit, button[type="submit"], input[type="submit"]',
              ) as HTMLButtonElement | HTMLInputElement | null
              if (submitBtn) {
                const checkbox = document.getElementById("rdcontact-consent-checkbox") as HTMLInputElement | null
                const isChecked = checkbox ? checkbox.checked : false
                if (!isChecked) {
                  submitBtn.disabled = true
                  submitBtn.style.opacity = "0.5"
                  submitBtn.style.cursor = "not-allowed"
                }
              }
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
                color: #000000 !important;
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

              #formulario-site-bi2b-0eaf6e225952b1af5d6b.consent-not-checked button.bricks-form__submit,
              #formulario-site-bi2b-0eaf6e225952b1af5d6b.consent-not-checked button[type="submit"],
              #formulario-site-bi2b-0eaf6e225952b1af5d6b.consent-not-checked input[type="submit"] {
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
            `}
          </style>

          <div
            role="main"
            id="formulario-site-bi2b-0eaf6e225952b1af5d6b"
            className={`min-h-[420px] transition-all duration-300 ${!consent ? "consent-not-checked" : ""}`}
            onClickCapture={(e) => {
              if (!consent) {
                const target = e.target as HTMLElement;
                if (target.closest('button[type="submit"], input[type="submit"], .bricks-form__submit')) {
                  e.stopPropagation();
                  e.preventDefault();
                  triggerConsentError();
                }
              }
            }}
            onSubmitCapture={(e) => {
              if (!consent) {
                e.stopPropagation();
                e.preventDefault();
                triggerConsentError();
              }
            }}
            onKeyDownCapture={(e) => {
              if (!consent && e.key === 'Enter') {
                e.stopPropagation();
                e.preventDefault();
                triggerConsentError();
              }
            }}
          ></div>

          <div className={`-mt-0.5 mx-auto w-fit flex items-center justify-center gap-3 p-3 rounded-xl border transition-all duration-300 ${showConsentError ? "border-red-500 bg-red-500/10 animate-shake" : "border-white/5 bg-[#0d6084]/10"}`}>
            <input
              type="checkbox"
              id="rdcontact-consent-checkbox"
              checked={consent}
              onChange={handleConsentChange}
              className="flex-shrink-0 w-5 h-5 rounded border-gray-300 text-[#0d6084] focus:ring-[#7ee7ff] cursor-pointer"
            />
            <label htmlFor="rdcontact-consent-checkbox" className="text-xs text-slate-300 cursor-pointer leading-tight text-center">
              Concordo em receber comunicações e aceito que meus dados sejam utilizados para fins de marketing e personalização de ofertas.
            </label>
          </div>
        </div>
      </div>


    </section>
  )
}

export default ContactFormRD
