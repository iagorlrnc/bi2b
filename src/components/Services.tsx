import {
  BarChart3,
  Users,
  Calculator,
  FileText,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { FaWhatsapp } from "react-icons/fa"
import { Link } from "react-router-dom"

interface ServiceCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function ServiceCard({ icon, title, description }: ServiceCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 },
    )

    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={cardRef}
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

export default function Services() {
  const servicesData = [
    {
      icon: <BarChart3 />,
      title: "Análise de Dados, KPI e Indicadores",
      description:
        "Suas decisões baseadas em fatos. Análise de dados e gestão de KPIs para guiar sua estratégia.",
    },
    {
      icon: <Users />,
      title: "Consultoria Empresarial",
      description:
        "Soluções estratégicas para otimizar sua gestão e impulsionar o crescimento.",
    },
    {
      icon: <Calculator />,
      title: "Planejamento Tributário",
      description:
        "Reestruturação do modelo de negócio visando redução da carga tributária.",
    },
    {
      icon: <FileText />,
      title: "Assessoria Mensal Contábil, Fiscal e Pessoal",
      description:
        "Mantenha sua empresa em conformidade. Cuidamos de toda a rotina contábil, fiscal e pessoal.",
    },
    {
      icon: <RefreshCw />,
      title: "Recuperação Tributária",
      description:
        "Recupere créditos tributários dos últimos 5 anos. Uma injeção de caixa segura para sua empresa.",
    },
    {
      icon: <ShieldCheck />,
      title: "Registro de Marcas no INPI",
      description:
        "Proteja sua identidade e garanta a exclusividade da sua marca em todo o território nacional. Segurança jurídica para o seu patrimônio.",
    },
  ]

  return (
    <section id="servicos" className="section-shell pt-6">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 max-w-4xl text-center md:text-left mx-auto md:mx-0">
          <div className="section-label mb-5 w-fit mx-auto md:mx-0">
            <Sparkles size={14} />
            Estrutura de serviços
          </div>
          <h2 className="section-title mb-4">Nossos Serviços</h2>
          <p className="section-copy max-w-2xl mx-auto md:mx-0">
            Uma leitura direta dos pilares que sustentam a operação, com foco em
            eficiência, dados e suporte de alto nível.
          </p>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center lg:justify-items-stretch">
          {servicesData.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>

        <div className="mt-20 flex flex-col w-[90%] sm:w-fit mx-auto gap-4">
          <a
            href="https://wa.me/+556392812239"
            target="_blank"
            rel="noopener noreferrer"
            className="tech-button-primary border border-[#7ee7ff]/15 bg-gradient-to-r from-[#0d6084] to-[#0a4a62] px-10 py-4 text-lg shadow-[0_14px_40px_rgba(13,96,132,0.28)] hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(13,96,132,0.34)] text-center w-full justify-center"
          >
            <FaWhatsapp className="text-2xl" />
            Fale com um especialista
          </a>
          <Link
            to="/abrir-minha-empresa"
            state={{ fromInternalLink: true }}
            className="tech-button-primary border border-white/15 bg-white/6 px-10 py-4 text-lg text-white hover:bg-white/10 text-center w-full justify-center"
          >
            Abrir minha empresa
          </Link>
        </div>
      </div>
    </section>
  )
}
