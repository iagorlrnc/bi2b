import { Check, AlertCircle, TrendingUp, Building2, ShieldCheck, ArrowLeft, Download, FileText, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Importação nativa do arquivo PDF para o Vite rastrear no build e dev
import ebookPDF from '../assets/ebook/ResumoIHC.pdf';

export default function Campanha() {
  const navigate = useNavigate();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const scriptId = 'rdstation-forms-script';
    const formId = 'formulario-pag-abertura-de-empresa-060ce9f639cf1704454e';

    // Suprime o "window.alert" chato que a RD Station tenta ejetar na tela
    const originalAlert = window.alert;
    window.alert = function (message) {
      if (typeof message === 'string' && (message.toLowerCase().includes('obrigado') || message.toLowerCase().includes('sucesso') || message.toLowerCase().includes('enviad'))) {
        // Usa o gatilho do alerta oculto para ativar a nossa linda interface!
        setIsFormSubmitted(true);
        setShowModal(true);
        return; // Engole o alerta sem mostrar a caixa feia no navegador
      }
      originalAlert(message);
    };

    // Listener NATIVO de sucesso recomendado pela RD Station (Ignora envios em branco)
    const handleRdMessage = (event: MessageEvent) => {
      if (!event.data) return;
      try {
        if (Array.isArray(event.data) && event.data[0] && event.data[0].event_type === 'conversion') {
           setIsFormSubmitted(true);
           setShowModal(true);
        } else if (typeof event.data === 'object' && !Array.isArray(event.data) && event.data.eventType === 'conversion') {
           setIsFormSubmitted(true);
           setShowModal(true);
        }
      } catch (e) {
        // Anti-crash override
      }
    };
    window.addEventListener('message', handleRdMessage);

    const renderForm = () => {
      const container = document.getElementById(formId);
      if (!(window as any).RDStationForms || !container) return;

      if (container.hasChildNodes() || container.dataset.rdLoaded === 'true') {
        return;
      }

      container.dataset.rdLoaded = 'true';
      try {
        new (window as any).RDStationForms(formId, 'null').createForm();

        setTimeout(() => {
          const observer = new MutationObserver(() => {
            const html = container.innerHTML.toLowerCase();

            // Fallback visual robusto (SÓ destrava se injetar a mensagem final verdadeira)
            if (html.includes('rd-form-success')) {
              setIsFormSubmitted(true);
              setShowModal(true);
            } else if ((html.includes("sucesso") || html.includes("obrigado") || html.includes("enviad")) && !html.includes("<form")) {
              setIsFormSubmitted(true);
              setShowModal(true);
            }
          });
          observer.observe(container, { childList: true, subtree: true, attributes: true });
        }, 500);
      } catch (err) {
        console.error('RD Station Forms erro:', err);
      }
    };

    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://d335luupugsy2.cloudfront.net/js/rdstation-forms/stable/rdstation-forms.min.js';
      script.type = 'text/javascript';
      script.async = true;
      script.addEventListener('load', renderForm);
      document.body.appendChild(script);
    } else if ((window as any).RDStationForms) {
      setTimeout(renderForm, 100);
    } else {
      script.addEventListener('load', renderForm);
    }

    return () => {
      window.alert = originalAlert; // Restaura o alerta padrão ao sair da página
      window.removeEventListener('message', handleRdMessage);
      const container = document.getElementById(formId);
      if (container) {
        container.innerHTML = '';
        delete container.dataset.rdLoaded;
      }
    };
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* BOTÃO VOLTAR */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-50">
        <button
          onClick={() => {
            window.scrollTo(0, 0);
            navigate('/');
          }}
          aria-label="Voltar para a página inicial"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-500 hover:shadow-md transition-all font-medium text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>
      </div>
      {/* SECTION 1: INÍCIO */}
      <section id="inicio" className="bg-white pt-20 pb-6 md:pt-32 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                  Abra sua Empresa do Jeito Certo e Pague <span className="text-blue-600">Menos Impostos</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Abrir uma empresa pode ser a melhor decisão para quem deseja crescer profissionalmente — mas também pode se tornar um problema quando é feito sem planejamento. O erro mais comum de quem inicia um negócio é ignorar o planejamento tributário, o que leva muitos empreendedores a pagarem milhares de reais a mais em impostos ao longo dos anos.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                  <p className="text-gray-700 italic">
                    "Antes de abrir sua empresa, é fundamental avaliar cada detalhe com cuidado. Inclusive, um ponto importante: o Simples Nacional nem sempre é a melhor opção. Cada caso precisa ser analisado individualmente para garantir economia desde o início."
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                <img
                  src="https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Empreendedora planejando e trabalhando no laptop"
                  className="rounded-2xl shadow-xl object-cover w-full h-[320px] sm:h-[400px] lg:h-[500px]"
                />
                <div className="absolute -bottom-6 left-4 right-4 sm:right-auto sm:-left-6 bg-white rounded-xl shadow-lg p-4 sm:p-5 sm:max-w-xs border border-gray-100 z-10 transition-transform hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="text-blue-600" size={24} />
                    <p className="font-semibold text-gray-900">Evite riscos</p>
                  </div>
                  <p className="text-sm text-gray-600">Não pague impostos indevidamente por falta de análise prévia.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SINAIS */}
      <section id="sinais" className="py-6 md:py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <img
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Equipe de especialistas analisando dados em reunião"
                className="rounded-2xl shadow-lg w-full object-cover h-[320px] sm:h-[400px] lg:h-[450px]"
              />
              <div className="absolute top-6 -right-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100 hidden lg:block z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full"><TrendingUp className="text-green-600" size={20} /></div>
                  <p className="font-semibold text-gray-900">Pague menos impostos</p>
                </div>
              </div>
            </div>

            <div className="space-y-8 order-1 lg:order-2">
              <div>
                <p className="text-sm font-semibold text-blue-600 mb-3 tracking-wide uppercase">Para Autônomos</p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                  Sinais de que Você Precisa Abrir Uma Empresa Agora
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Se você atua como Pessoa Física, preste atenção nestes sinais indicativos de que a hora de formalizar chegou:
                </p>
              </div>

              <div className="space-y-5 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                {[
                  'Você está pagando impostos demais como pessoa física (IRPF e INSS)',
                  'Precisa emitir nota fiscal para fechar contratos com empresas',
                  'Quer crescer profissionalmente e ter novas oportunidades no mercado'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check size={22} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-800 font-medium text-lg">{item}</p>
                  </div>
                ))}
              </div>

              <p className="text-lg text-gray-700 font-medium bg-blue-50/50 p-4 border-l-4 border-blue-600 rounded-r-lg">
                Formalizar seu negócio pode reduzir sua carga tributária, dar mais credibilidade e abrir portas para novos contratos empresariais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: PROCESSO RÁPIDO */}
      <section id="processo" className="py-6 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Abertura Rápida, Simples e Sem Burocracia
            </h2>
            <p className="text-xl text-gray-600">
              Não sabe por onde começar? Nós cuidamos de tudo para você com orientação especializada para garantir que você pague menos imposto desde o primeiro mês.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Building2, title: "CNPJ", desc: "Obtenção ágil do seu registro nacional sem dores de cabeça." },
              { icon: FileText, title: "Inscrição Municipal ou Estadual", desc: "Regularização correta para o seu tipo de serviço ou produto." },
              { icon: BadgeCheck, title: "Alvará de Funcionamento", desc: "Garantimos a liberação do seu negócio para operar dentro da lei." },
              { icon: TrendingUp, title: "Enquadramento Tributário", desc: "Análise individual para escolher o regime mais vantajoso." }
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: SEGURANÇA / CTA */}
      <section className="bg-blue-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ShieldCheck className="text-blue-400 mx-auto mb-6" size={64} />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Comece seu Negócio com Segurança
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 sm:mb-10 leading-relaxed px-2">
            Abrir uma empresa não precisa ser complicado. Nossa equipe realiza todo o processo de forma rápida, com acompanhamento tributário e suporte contábil, garantindo que você comece sua jornada empreendedora com tranquilidade e segurança.
          </p>
          <div className="mt-8 sm:mt-12 max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-3xl border border-white/20 shadow-2xl text-left">
            <style>
              {`
                #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e form,
                #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e section,
                #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e .bricks-form {
                  background-color: transparent !important;
                  background: transparent !important;
                }
                
                #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e input:not([type="checkbox"]):not([type="radio"]),
                #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e select,
                #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e textarea {
                  border-radius: 12px !important;
                }

                /* Container da Bandeira do Telefone */
                #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e .iti__flag-container {
                  position: absolute !important;
                  top: 0 !important;
                  bottom: 0 !important;
                  display: flex !important;
                  align-items: center !important;
                  height: 100% !important;
                  border-radius: 12px 0 0 12px !important;
                }

                #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e .iti__selected-flag {
                  display: flex !important;
                  align-items: center !important;
                  justify-content: center !important;
                  padding: 0 14px !important;
                  height: 100% !important;
                  background-color: transparent !important;
                  border-radius: 12px 0 0 12px !important;
                }

                #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e .iti__flag {
                  margin: 0 !important;
                }
                
                #formulario-pag-abertura-de-empresa-060ce9f639cf1704454e .iti__arrow {
                  margin-left: 6px !important;
                }
              `}
            </style>
            <div
              role="main"
              id="formulario-pag-abertura-de-empresa-060ce9f639cf1704454e"
              className={`w-full transition-all duration-300 ${isFormSubmitted ? 'opacity-60 pointer-events-none grayscale-[20%]' : ''}`}
            ></div>

            {/* BOTÃO E-BOOK - HABILITA APÓS O ENVIO DO FORMULÁRIO */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <button
                type="button"
                disabled={!isUnlocked}
                onClick={() => {
                  if (isUnlocked) {
                    const link = document.createElement('a');
                    link.href = ebookPDF; // Usa a referência correta do arquivo empacotado
                    link.download = 'eBook_Abertura_de_Empresa_Bi2B.pdf'; // Nome ideal pro usuário
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }
                }}
                className={`w-full font-bold text-lg py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3
                  ${isUnlocked
                    ? 'bg-green-500 hover:bg-green-400 text-white shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:shadow-[0_0_30px_rgba(34,197,94,0.7)] hover:-translate-y-1'
                    : 'bg-black/20 text-white/40 cursor-not-allowed border border-white/10'
                  }`}
              >
                <Download size={24} className="flex-shrink-0" />
                <span className="text-center">
                  {isUnlocked ? 'Baixar E-book Agora' : 'Baixar E-book'}
                </span>
              </button>

              {!isUnlocked && (
                <p className="text-yellow-500 text-sm text-center mt-3 font-bold flex items-center justify-center gap-1.5">
                  <AlertCircle size={16} />
                  Preencha o formulário para liberar o E-book
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MODAL DE SUCESSO CUSTOMIZADO */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={32} className="text-green-600" />
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900 mb-3">Muito Obrigado!</h3>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Recebemos seus dados com sucesso. Seu e-book exclusivo já está desbloqueado e preparado para você!
            </p>
            <button
              onClick={() => {
                setShowModal(false);
                setIsUnlocked(true);
              }}
              className="w-full bg-blue-600 text-white font-bold py-4 text-lg rounded-2xl hover:bg-blue-500 hover:shadow-lg transition-all transform hover:-translate-y-1"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
