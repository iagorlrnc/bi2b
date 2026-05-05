import { useState, useEffect, useRef } from "react"
import { Sparkles } from "lucide-react"
import { FaWhatsapp, FaCheckCircle, FaTimesCircle } from "react-icons/fa"
import emailjs from "@emailjs/browser"

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
    subject: "",
  })

  const [emailError, setEmailError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<"success" | "error">("success")
  const [modalMessage, setModalMessage] = useState("")
  const [isSectionVisible, setIsSectionVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionVisible(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email === "" || emailRegex.test(email)) {
      setEmailError(null)
      return true
    } else {
      setEmailError("Digite um email válido")
      return false
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (name === "email") {
      validateEmail(value)
    }
  }

  const showSuccessModal = (message: string) => {
    setModalType("success")
    setModalMessage(message)
    setShowModal(true)
  }

  const showErrorModal = (message: string) => {
    setModalType("error")
    setModalMessage(message)
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEmail(formData.email) || formData.email === "") {
      setEmailError("*Digite um email válido")
      return
    }
    setIsSubmitting(true)
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.error("EmailJS keys are not loaded.")
      showErrorModal("Erro de configuração. O envio não pôde ser feito.")
      setIsSubmitting(false)
      return
    }
    emailjs
      .send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formData,
        EMAILJS_PUBLIC_KEY,
      )
      .then(
        (result) => {
          console.log("SUCCESS!", result.text)
          showSuccessModal(
            "Mensagem enviada com sucesso! Entraremos em contato em breve.",
          )
          setFormData({
            name: "",
            company: "",
            email: "",
            phone: "",
            message: "",
            subject: "",
          })
          setEmailError(null)
        },
        (error) => {
          console.log("FAILED...", error.text)
          showErrorModal("Ops! Algo deu errado. Tente novamente mais tarde.")
        },
      )
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <>
      <section ref={sectionRef} className="section-shell pt-6">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center mb-12">
            <div className="section-label mx-auto mb-5 w-fit">
              <Sparkles size={14} />
              Contato estratégico
            </div>
            <h2 className="section-title mb-5">Inicie sua Transformação</h2>
            <p className="section-copy max-w-2xl mx-auto">
              Entre em contato e agende uma conversa com nossos especialistas.
            </p>
          </div>

          <div className="tech-panel mx-auto max-w-4xl p-6 md:p-8">
            <form onSubmit={handleSubmit} className="mx-auto" noValidate>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-6">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Assunto"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white backdrop-blur-xl transition-colors duration-300 placeholder:text-slate-500 focus:outline-none focus:border-[#7ee7ff]/40"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Seu nome"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white backdrop-blur-xl transition-colors duration-300 placeholder:text-slate-500 focus:outline-none focus:border-[#7ee7ff]/40"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Empresa"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white backdrop-blur-xl transition-colors duration-300 placeholder:text-slate-500 focus:outline-none focus:border-[#7ee7ff]/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-6">
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    className={`w-full rounded-2xl border bg-white/5 px-6 py-4 text-white backdrop-blur-xl transition-colors duration-300 placeholder:text-slate-500 focus:outline-none ${
                      emailError
                        ? "border-red-500"
                        : "border-white/10 focus:border-[#7ee7ff]/40"
                    }`}
                  />
                  {emailError && (
                    <p className="mt-2 text-sm text-red-400">{emailError}</p>
                  )}
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(99) 99999-9999"
                    maxLength={15}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white backdrop-blur-xl transition-colors duration-300 placeholder:text-slate-500 focus:outline-none focus:border-[#7ee7ff]/40"
                  />
                </div>
              </div>

              <div className="mb-6">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Qual seu maior desafio hoje?"
                  required
                  rows={6}
                  className="w-full resize-none rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-white backdrop-blur-xl transition-colors duration-300 placeholder:text-slate-500 focus:outline-none focus:border-[#7ee7ff]/40"
                ></textarea>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="tech-button-primary bg-gradient-to-r from-[#FF0000] to-[#b40000] px-14 py-5 text-lg shadow-[0_14px_40px_rgba(255,0,0,0.22)] hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(255,0,0,0.28)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Enviando..." : "Enviar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <a
        href="https://wa.me/+556392812239"
        target="_blank"
        rel="noopener noreferrer"
        className={`floating-button fixed bottom-6 right-6 z-50 bg-[#0d6084] text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 ease-in-out ${
          isSectionVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <FaWhatsapp size={24} />
      </a>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
          <div className="tech-panel w-full max-w-md p-8 text-center">
            <div className="mb-4">
              {modalType === "success" ? (
                <FaCheckCircle className="text-green-500 text-6xl mx-auto" />
              ) : (
                <FaTimesCircle className="text-red-500 text-6xl mx-auto" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {modalType === "success" ? "Sucesso!" : "Ocorreu um Erro"}
            </h3>
            <p className="mb-6 text-slate-300">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className={`tech-button-primary px-10 py-3 shadow-lg ${
                modalType === "success"
                  ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-green-600/50"
                  : "bg-gradient-to-r from-[#FF0000] to-[#cc0000] hover:from-[#cc0000] hover:to-[#990000] hover:shadow-[#FF0000]/50"
              }`}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
