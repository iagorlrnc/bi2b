import { Target, TrendingUp, Shield, Sparkles } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import logo from "../assets/img/logo.png"

function FeatureCard({
  cardId,
  icon,
  title,
  description,
  delay,
  forceCompactTitle,
  onCompactChange,
}: {
  cardId: string
  icon: React.ReactNode
  title: string
  description: string
  delay: number
  forceCompactTitle: boolean
  onCompactChange: (cardId: string, isCompact: boolean) => void
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [isCompactTitle, setIsCompactTitle] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const titleBoxRef = useRef<HTMLDivElement>(null)
  const titleMeasureRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const updateTitleSize = () => {
      if (!titleBoxRef.current || !titleMeasureRef.current) {
        return
      }

      const containerWidth = titleBoxRef.current.clientWidth
      const titleBaseWidth = titleMeasureRef.current.offsetWidth
      const nextIsCompact = titleBaseWidth > containerWidth
      setIsCompactTitle(nextIsCompact)
      onCompactChange(cardId, nextIsCompact)
    }

    updateTitleSize()

    const resizeObserver = new ResizeObserver(updateTitleSize)
    if (cardRef.current) {
      resizeObserver.observe(cardRef.current)
    }

    window.addEventListener("resize", updateTitleSize)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", updateTitleSize)
    }
  }, [cardId, onCompactChange, title])

  return (
    <div
      ref={cardRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`tech-card w-full min-w-0 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="w-14 h-14 bg-[#0d6084]/15 text-[#7ee7ff] rounded-2xl flex items-center justify-center mb-6 border border-[#7ee7ff]/15">
        <div className="text-2xl">{icon}</div>
      </div>
      <div ref={titleBoxRef} className="mb-3 w-full max-w-full">
        <h3
          className={`w-full max-w-full whitespace-nowrap font-bold uppercase text-white ${
            forceCompactTitle || isCompactTitle
              ? "text-[0.82rem] tracking-[0.02em]"
              : "text-xl tracking-wide"
          }`}
        >
          {title}
        </h3>
        <span
          ref={titleMeasureRef}
          aria-hidden="true"
          className="pointer-events-none absolute opacity-0 whitespace-nowrap text-xl font-bold uppercase tracking-wide"
        >
          {title}
        </span>
      </div>
      <div className="w-12 h-0.5 bg-[#FF0000] mb-4"></div>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  )
}

export default function About() {
  const [compactByCard, setCompactByCard] = useState<Record<string, boolean>>(
    {},
  )

  const handleCompactChange = useCallback(
    (cardId: string, isCompact: boolean) => {
      setCompactByCard((prev) => {
        if (prev[cardId] === isCompact) {
          return prev
        }
        return { ...prev, [cardId]: isCompact }
      })
    },
    [],
  )

  const shouldUseCompactTitles = Object.values(compactByCard).some(Boolean)

  return (
    <section id="sobre" className="section-shell pt-6">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto mb-16 text-center md:text-left">
          <div className="section-label mb-5 w-fit mx-auto md:mx-0">
            <Sparkles size={14} />
            Quem somos
          </div>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end justify-items-center lg:justify-items-stretch">
            <div className="w-full">
              <h2 className="section-title mb-6 text-center md:text-left">
                Sobre a{" "}
                <img
                  src={logo}
                  alt="Bi2B"
                  className="inline-block h-[0.8em] w-auto align-baseline"
                />
              </h2>
            </div>
            <p className="section-copy text-center md:text-left lg:max-w-2xl lg:justify-self-end">
              Somos especialistas em transformar dados em decisões estratégicas.
              Com experiência em consultoria empresarial, entregamos soluções
              que combinam clareza visual, eficiência operacional e crescimento.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center md:justify-items-stretch">
          <FeatureCard
            cardId="excelencia"
            icon={<Target />}
            title="Excelência"
            description="Compromisso com entregas consistentes, precisão e uma experiência visual sem ruído."
            delay={0}
            forceCompactTitle={shouldUseCompactTitles}
            onCompactChange={handleCompactChange}
          />
          <FeatureCard
            cardId="comprometimento"
            icon={<TrendingUp />}
            title="Comprometimento"
            description="Acompanhamento próximo, foco em resultado e soluções alinhadas à realidade do cliente."
            delay={100}
            forceCompactTitle={shouldUseCompactTitles}
            onCompactChange={handleCompactChange}
          />
          <FeatureCard
            cardId="resultado"
            icon={<Shield />}
            title="Resultado"
            description="Estratégias práticas que fortalecem a operação e criam base para decisões mais seguras."
            delay={200}
            forceCompactTitle={shouldUseCompactTitles}
            onCompactChange={handleCompactChange}
          />
        </div>
      </div>
    </section>
  )
}
