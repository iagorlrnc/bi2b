import { FaWhatsapp } from "react-icons/fa"
import { Linkedin, Instagram, Mail, MapPin, Cookie, Shield } from "lucide-react"
import logoMain from "../assets/img/logo.png"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useCookie } from "../contexts/CookieContext"

export default function Footer() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setBannerOpen } = useCookie()

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollToSection: id } })
      return
    }
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="pb-10 pt-16">
      <div className="container mx-auto px-6">
        <div className="tech-panel p-8 md:p-10">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 justify-items-center text-center md:justify-items-stretch md:text-left">
            {/* Coluna 1: Logo & Info */}
            <div className="md:col-span-2 lg:col-span-1 md:justify-self-center lg:justify-self-start text-center md:text-left">
              <div className="block md:flex md:items-start md:gap-8 lg:block">
                <div className="md:flex md:flex-col md:items-center lg:items-start">
                  <img
                    src={logoMain}
                    alt="Logo Bi2B"
                    className="h-6 md:h-[2rem] lg:h-7 w-auto max-w-full shrink-0 mx-auto md:mx-auto lg:mx-0"
                  />
                  <div className="hidden md:flex lg:hidden mt-3 items-center md:pt-1.5 justify-center gap-2 text-slate-300">
                    <MapPin size={18} className="text-cyan-300" />
                    <p>Palmas-TO</p>
                  </div>
                </div>
                <div className="mt-5 md:mt-0 lg:mt-5">
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-slate-300 md:hidden lg:flex">
                    <MapPin size={18} className="text-cyan-300" />
                    <p>Palmas-TO</p>
                  </div>
                  <p className="mt-4 max-w-sm mx-auto md:mx-0 text-sm leading-relaxed text-slate-400">
                    Sua parceira estratégica em Business Intelligence, automatização de processos e consultoria financeira para acelerar o crescimento do seu negócio.
                  </p>
                  <p className="mt-3 text-xs text-slate-500 font-medium">
                    CNPJ: 63.172.986/0001-05
                  </p>
                </div>
              </div>
            </div>

            {/* Coluna 2: Links Rápidos */}
            <div>
              <h3 className="mx-auto w-fit text-center text-sm font-bold uppercase tracking-[0.28em] text-white">
                Links Rápidos
              </h3>
              <ul className="mx-auto mt-5 w-fit space-y-3 text-center text-slate-300">
                <li>
                  <button
                    onClick={() => scrollToSection("sobre")}
                    className="transition-colors duration-300 hover:text-cyan-300 text-sm"
                  >
                    Sobre Nós
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("servicos")}
                    className="transition-colors duration-300 hover:text-cyan-300 text-sm"
                  >
                    Serviços
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("contato")}
                    className="transition-colors duration-300 hover:text-cyan-300 text-sm"
                  >
                    Contato
                  </button>
                </li>
              </ul>
            </div>

            {/* Coluna 3: Siga-nos */}
            <div>
              <h3 className="mx-auto w-fit text-center text-sm font-bold uppercase tracking-[0.28em] text-white">
                Siga-nos
              </h3>
              <div className="mx-auto mt-5 grid w-fit grid-cols-2 gap-3 min-[520px]:grid-cols-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    href: "https://www.linkedin.com/company/bi2b-consultoria/?viewAsMember=true",
                    icon: Linkedin,
                    label: "LinkedIn",
                  },
                  {
                    href: "https://www.instagram.com/bi2bconsultoria?igsh=bmlodHR1dGsydGZr",
                    icon: Instagram,
                    label: "Instagram",
                  },
                  {
                    href: "https://wa.me/+556392812239",
                    icon: FaWhatsapp,
                    label: "Whatsapp",
                  },
                  {
                    href: "https://mail.google.com/mail/?view=cm&fs=1&to=caio.baldassaune@bi2bconsultoria.com.br",
                    icon: Mail,
                    label: "Gmail",
                  },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-white/10 hover:text-white"
                    aria-label={item.label}
                  >
                    <item.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Barra inferior de Copyright & Termos */}
          <div className="mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-xs md:text-sm text-slate-400">
              © 2026 Bi2B | Consultoria em Negócios. Todos os direitos reservados.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs md:text-sm text-slate-400">
              <Link
                to="/politica-de-privacidade"
                className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
              >
                <Shield size={14} />
                Política de Privacidade
              </Link>
              <button
                type="button"
                onClick={() => setBannerOpen(true)}
                className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
              >
                <Cookie size={14} />
                Preferências de Cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
