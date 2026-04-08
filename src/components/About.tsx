import { Target, TrendingUp, Shield } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`bg-white/5 backdrop-blur-lg border border-white/10 p-8 transition-all duration-700 transform hover:border-[#004a6e] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="text-[#004a6e] mb-4 text-4xl">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide">{title}</h3>
      <div className="w-12 h-0.5 bg-[#FF0000] mb-4"></div>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

export default function About() {
  return (
    <section id="sobre" className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 uppercase tracking-wider">
            Sobre a Bi2B
          </h2>
          <p className="text-gray-300 text-xl leading-relaxed">
            Somos especialistas em transformar dados em decisões estratégicas. Com anos de experiência em consultoria empresarial,
            oferecemos soluções personalizadas que impulsionam o crescimento e a eficiência do seu negócio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Target />}
            title="Excelência."
            description="Comprometemo-nos com a entrega de serviços de alta qualidade, orientados para a superação das expectativas de nossos clientes."
            delay={0}
          />
          <FeatureCard
            icon={<TrendingUp />}
            title="Comprometimento."
            description="Dedicação total aos objetivos e necessidades de nossos clientes, garantindo esforço constante para alcançar e superar as metas estabelecidas."
            delay={100}
          />
          <FeatureCard
            icon={<Shield />}
            title="Resultado."
            description="Focamos em proporcionar resultados concretos e mensuráveis, garantindo que cada solução implementada gere impacto positivo e duradouro."
            delay={200}
          />
        </div>
      </div>
    </section>
  );
}
