import { FaWhatsapp } from "react-icons/fa"
import { Linkedin, Instagram, Mail, MapPin } from "lucide-react"
import logoMain from "../assets/img/logo.png"

export default function Footer() {
  const scrollToSection = (id: string) => {
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
            <div className="md:col-span-2 lg:col-span-1 md:justify-self-center lg:justify-self-start text-center md:text-left">
              <div className="block md:flex md:items-start md:gap-8 lg:block">
                <div className="md:flex md:flex-col md:items-center lg:items-start">
                  <img
                    src={logoMain}
                    alt="Logo Bi2B"
                    loading="lazy"
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
                  <p className="mt-4 md:mt-0 lg:mt-4 max-w-sm mx-auto md:mx-0 text-sm leading-relaxed text-slate-400">
                    © 2024 Bi2B | Consultoria em Negócios.
                    <br />
                    Todos os direitos reservados.
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    CNPJ: 63.172.986/0001-05
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mx-auto w-fit text-center text-sm font-bold uppercase tracking-[0.28em] text-white">
                Links Rápidos
              </h3>
              <ul className="mx-auto mt-5 w-fit space-y-3 text-center text-slate-300">
                <li>
                  <button
                    onClick={() => scrollToSection("sobre")}
                    className="transition-colors duration-300 hover:text-cyan-300"
                  >
                    Sobre Nós
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("servicos")}
                    className="transition-colors duration-300 hover:text-cyan-300"
                  >
                    Serviços
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("contato")}
                    className="transition-colors duration-300 hover:text-cyan-300"
                  >
                    Contato
                  </button>
                </li>
              </ul>
            </div>

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
        </div>
      </div>
    </footer>
  )
}
