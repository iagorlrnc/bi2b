import { CheckCircle, ArrowRight, Mail, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThankYouPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-3xl w-full">
        <div
          className={`text-center transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <CheckCircle className="w-24 h-24 text-green-500 relative z-10" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Dados enviados com sucesso!
          </h1>

          <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-red-500 mx-auto mb-8"></div>

          <p className="text-xl md:text-2xl text-gray-300 mb-6 leading-relaxed">
            Estamos <span className="text-red-600 font-semibold">ansiosos</span> para prestar nossos serviços!
          </p>

          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Nossa equipe está comprometida em gerar <span className="text-cyan-400 font-medium">melhorias significativas</span> para o seu negócio.
            Em breve entraremos em contato para iniciar nossa parceria de sucesso.
          </p>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 md:p-10 mb-8 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Próximos Passos
            </h2>

            <div className="space-y-6 text-left">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#0d6084] rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Análise da sua solicitação</h3>
                  <p className="text-gray-400">Nossa equipe analisará suas necessidades em até 24 horas</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#0d6084] rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Contato personalizado</h3>
                  <p className="text-gray-400">Entraremos em contato para entender melhor seu cenário</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#0d6084] rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Proposta customizada</h3>
                  <p className="text-gray-400">Desenvolveremos uma solução sob medida para seu negócio</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a
              href="/"
              className="group bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-red-600/50 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Voltar ao Início
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="border-t border-slate-700 pt-8 mt-8">
            <p className="text-cyan-400 font-semibold mb-4 text-lg">
              Precisa de ajuda imediata?
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-gray-400">
              <a href="mailto:contato@bi2b.com.br" className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                <Mail className="w-5 h-5" />
                <span>caio.baldassaune@bi2bconsultoria.com.br</span>
              </a>
              <a href="https://wa.me/556392812239" target='_blank'  className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                <Phone className="w-5 h-5" />
                <span>(63) 99281-2239</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
