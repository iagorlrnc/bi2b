import { BarChart3, Users, Calculator, FileText, RefreshCw, ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ServiceCard({ icon, title, description }: ServiceCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative p-8 transition-all duration-700 transform backdrop-blur-lg 
      bg-white/5 border border-white/10 hover:border-blue-500 hover:scale-105
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="text-4xl mb-6 text-[#0d6084] group-hover:text-blue-500 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function Services() {
  const servicesData = [
    {
      icon: <BarChart3 />,
      title: "Análise de Dados, KPI e Indicadores",
      description: "Suas decisões baseadas em fatos. Análise de dados e gestão de KPIs para guiar sua estratégia."
    },
    {
      icon: <Users />,
      title: "Consultoria Empresarial",
      description: "Soluções estratégicas para otimizar sua gestão e impulsionar o crescimento."
    },
    {
      icon: <Calculator />,
      title: "Planejamento Tributário",
      description: "Reestruturação do modelo de negócio visando redução da carga tributária."
    },
    {
      icon: <FileText />,
      title: "Assessoria Mensal Contábil, Fiscal e Pessoal",
      description: "Mantenha sua empresa em conformidade. Cuidamos de toda a rotina contábil, fiscal e pessoal."
    },
    {
      icon: <RefreshCw />,
      title: "Recuperação Tributária",
      description: "Recupere créditos tributários dos últimos 5 anos. Uma injeção de caixa segura para sua empresa."
    },
    {
      icon: <ShieldCheck />,
      title: "Registro de Marcas no INPI",
      description: "Proteja sua identidade e garanta a exclusividade da sua marca em todo o território nacional. Segurança jurídica para o seu patrimônio."
    }
  ];

  return (
    <section id="servicos" className="py-20 bg-black">
      <div className="container mx-auto px-6">
        {/* Header da Seção */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-wider">
            — Nossos Serviços
          </h2>
          <p className="text-[#0d6084] text-lg uppercase tracking-widest font-medium">
            para nossos clientes
          </p>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <ServiceCard 
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>

        <div className="flex justify-center mt-16">
          <a
            href="https://wa.me/+556392812239" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-110 shadow-[0_0_20px_rgba(22,163,74,0.4)]"
          >
            <FaWhatsapp className="text-2xl" />
            Fale com um especialista
          </a>
        </div>
      </div>
    </section>
  );
}