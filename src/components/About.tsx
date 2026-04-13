import { Target, TrendingUp, Shield, Sparkles } from "lucide-react"
import { useEffect, useRef, useState } from "react"

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

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

  return (
    <div
      ref={cardRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`tech-card ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="w-14 h-14 bg-[#0d6084]/15 text-[#7ee7ff] rounded-2xl flex items-center justify-center mb-6 border border-[#7ee7ff]/15">
        <div className="text-2xl">{icon}</div>
      </div>
      <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide">
        {title}
      </h3>
      <div className="w-12 h-0.5 bg-[#FF0000] mb-4"></div>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  )
}

export default function About() {
  return (
    <section id="sobre" className="section-shell">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto mb-16 text-center md:text-left">
          <div className="section-label mb-5 w-fit mx-auto md:mx-0">
            <Sparkles size={14} />
            Quem somos
          </div>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end justify-items-center lg:justify-items-stretch">
            <div className="w-full">
              <h2 className="section-title mb-6 text-center md:text-left">
                Sobre a Bi2B
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
            icon={<Target />}
            title="Excelência"
            description="Compromisso com entregas consistentes, precisão e uma experiência visual sem ruído."
            delay={0}
          />
          <FeatureCard
            icon={<TrendingUp />}
            title="Comprometimento"
            description="Acompanhamento próximo, foco em resultado e soluções alinhadas à realidade do cliente."
            delay={100}
          />
          <FeatureCard
            icon={<Shield />}
            title="Resultado"
            description="Estratégias práticas que fortalecem a operação e criam base para decisões mais seguras."
            delay={200}
          />
        </div>
      </div>
    </section>
  )
}
