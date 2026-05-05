import { useState, useEffect, useRef } from "react"
import logoMain from "../assets/img/logo.png"

export default function Header() {
  const headerRef = useRef<HTMLElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (isProgrammaticScroll) {
        return
      }
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isProgrammaticScroll])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [menuOpen])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      setIsProgrammaticScroll(true)
      setMenuOpen(false)
      const targetIsScrolled = id !== "home"
      setIsScrolled(targetIsScrolled)

      if (id === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        const headerOffset = headerRef.current?.offsetHeight ?? 0
        const targetTop = element.getBoundingClientRect().top + window.scrollY
        window.scrollTo({
          top: Math.max(targetTop - headerOffset + 1, 0),
          behavior: "smooth",
        })
      }

      setTimeout(() => {
        setIsProgrammaticScroll(false)
      }, 1000)
    }
  }

  const menuItems = [
    { id: "home", label: "Home" },
    { id: "sobre", label: "Sobre Nós" },
    { id: "servicos", label: "Serviços" },
    { id: "dashboard", label: "Dashboard" },
    { id: "contato", label: "Contato" },
  ]

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || menuOpen
          ? "bg-slate-950/45 backdrop-blur-lg border-b border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.22)]"
          : "pointer-events-none -translate-y-full opacity-0 bg-transparent md:bg-transparent"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between box-border gap-3">
        {/* Esquerda: Logo */}
        <button
          type="button"
          onClick={() => scrollToSection("home")}
          aria-label="Ir para o início"
          className="flex items-center z-[60] rounded-full border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-md"
        >
          <img
            src={logoMain}
            alt="Logo Bi2B"
            className="h-6 md:h-7 w-auto max-w-full"
          />
        </button>

        {/* Direita: Navegação Desktop + Botão + Hamburger */}
        <div className="flex items-center gap-3 lg:gap-4">
          {/* Navegação Desktop */}
          <nav className="hidden md:flex md:items-center md:gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-md">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 transition-colors duration-300 hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <a
            href="https://share.google/ZDrIBH8t9kXoMq5nJ"
            target="_blank"
            rel="noopener noreferrer"
            className="tech-button-primary hidden md:flex items-center justify-center bg-gradient-to-r from-[#0d6084] to-[#0a4a62] px-6 py-2.5 shadow-[0_12px_40px_rgba(13,96,132,0.32)] hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(13,96,132,0.42)] text-white text-sm whitespace-nowrap rounded-full"
          >
            Portal do cliente
          </a>

          <button
            className="md:hidden text-white focus:outline-none z-[60] rounded-full border border-white/10 bg-white/5 p-3 backdrop-blur-md"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            type="button"
          >
            {/* Ícone SVG Hambuguer */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Navegação Mobile (Tela cheia) */}
      <nav
        id="mobile-navigation"
        className={`
          fixed inset-0 z-[100]
          md:hidden
          h-[100dvh] w-screen bg-slate-950/95 border-t border-white/10 shadow-2xl backdrop-blur-xl
          transition-all duration-300 ease-in-out
          ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      >
        <div className="flex h-full flex-col items-center justify-center overflow-y-auto px-4 py-8 sm:px-6">
          <button
            className="absolute right-4 top-4 text-white focus:outline-none z-[60] rounded-full border border-white/10 bg-white/5 p-3 backdrop-blur-md"
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="flex flex-col items-center space-y-6 py-6">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="text-white hover:text-cyan-300 text-lg py-2 transition-colors duration-300 font-medium"
              >
                {item.label}
              </button>
            ))}
            <a
              href="https://share.google/ZDrIBH8t9kXoMq5nJ"
              target="_blank"
              rel="noopener noreferrer"
              className="tech-button-primary mt-4 flex items-center justify-center bg-gradient-to-r from-[#0d6084] to-[#0a4a62] px-8 py-3 shadow-[0_12px_40px_rgba(13,96,132,0.32)] text-white w-full"
            >
              Portal do cliente
            </a>
          </div>
        </div>
      </nav>
    </header>
  )
}
