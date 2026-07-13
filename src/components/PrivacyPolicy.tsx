import { useEffect } from "react"
import { Shield, ArrowLeft, Cookie } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import { useCookie } from "../contexts/CookieContext"

export default function PrivacyPolicy() {
  const navigate = useNavigate()
  const { setBannerOpen } = useCookie()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" })
  }, [])

  return (
    <>
      <Header />
      <div className="relative min-h-screen pt-28 pb-16 px-4 sm:px-6">
        {/* Background glow effects */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute top-10 left-[-8rem] h-96 w-96 rounded-full bg-[#0d6084]/20 blur-3xl" />
          <div className="absolute top-1/3 right-[-7rem] h-96 w-96 rounded-full bg-[#FF0000]/10 blur-3xl" />
          <div className="absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            className="group mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Voltar para a Home
          </button>

          {/* Title block */}
          <div className="mb-10 text-center md:text-left">
            <div className="section-label mb-4">
              <Shield size={14} />
              Conformidade e Segurança
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Política de Privacidade
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
              Última atualização: 13 de Julho de 2026
            </p>
          </div>

          {/* Policy content in tech-panel */}
          <div className="tech-panel p-6 sm:p-10 md:p-12 space-y-8 text-slate-300 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight border-l-2 border-cyan-400 pl-3">
                1. Introdução
              </h2>
              <p>
                A <strong>Bi2B</strong> valoriza a sua privacidade e está comprometida em proteger os seus dados pessoais. Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos suas informações quando você visita nosso site e utiliza nossos serviços, em total conformidade com a Lei Geral de Proteção de Dados (LGPD) e outras regulamentações aplicáveis.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight border-l-2 border-cyan-400 pl-3">
                2. Informações que Coletamos
              </h2>
              <p>
                Coletamos informações que você nos fornece diretamente, tais como:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-1">
                <li>Nome completo</li>
                <li>Endereço de e-mail</li>
                <li>Número de telefone / WhatsApp</li>
                <li>Dados sobre sua empresa (nome, faturamento, número de funcionários)</li>
              </ul>
              <p>
                Além disso, coletamos dados de forma automatizada através de cookies, que podem incluir seu endereço IP, tipo de navegador, páginas visitadas e tempo de permanência no site.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight border-l-2 border-cyan-400 pl-3">
                3. Finalidade do Tratamento de Dados
              </h2>
              <p>
                Utilizamos os dados coletados para:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-1">
                <li>Responder a contatos, dúvidas e prestar suporte comercial;</li>
                <li>Simular cenários tributários e financeiros nas nossas ferramentas;</li>
                <li>Enviar relatórios personalizados solicitados por você;</li>
                <li>Otimizar o desempenho e a usabilidade do nosso site;</li>
                <li>Enviar newsletters e comunicações de marketing, desde que consentido.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight border-l-2 border-cyan-400 pl-3">
                4. Cookies e Tecnologias de Rastreamento
              </h2>
              <p>
                Cookies são pequenos arquivos de texto armazenados no seu dispositivo para melhorar sua experiência. Nós utilizamos três categorias principais de cookies:
              </p>
              <div className="space-y-3 mt-2">
                <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                  <span className="font-semibold text-white">Necessários (Essenciais):</span> Garantem o funcionamento básico e a segurança do site. Eles não podem ser desativados.
                </div>
                <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                  <span className="font-semibold text-white">Analíticos:</span> Coletam informações anônimas de uso para nos ajudar a entender a audiência e melhorar nossos fluxos de navegação.
                </div>
                <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                  <span className="font-semibold text-white">Marketing:</span> Usados para veicular anúncios mais relevantes ao seu perfil de interesse nas redes parceiras.
                </div>
              </div>
              <p className="mt-4">
                Você pode alterar ou revogar suas preferências de cookies a qualquer momento clicando no botão abaixo ou no link de "Preferências de Cookies" no rodapé da página.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setBannerOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-300 transition-all hover:bg-cyan-500/20"
                >
                  <Cookie size={16} />
                  Gerenciar Preferências de Cookies
                </button>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight border-l-2 border-cyan-400 pl-3">
                5. Compartilhamento de Dados
              </h2>
              <p>
                Não vendemos ou alugamos seus dados pessoais a terceiros. Seus dados podem ser compartilhados com parceiros tecnológicos confiáveis (como provedores de hospedagem, serviços de e-mail marketing como o RD Station e ferramentas de análise web) única e exclusivamente para a execução das finalidades descritas nesta política.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight border-l-2 border-cyan-400 pl-3">
                6. Seus Direitos
              </h2>
              <p>
                Nos termos da LGPD, você possui o direito de:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-1">
                <li>Confirmar a existência do tratamento e acessar seus dados;</li>
                <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
                <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários;</li>
                <li>Revogar o consentimento fornecido para envio de e-mails ou comunicações de marketing.</li>
              </ul>
              <p>
                Para exercer qualquer um desses direitos, você pode entrar em contato conosco pelo e-mail: <a href="mailto:caio.baldassaune@bi2bconsultoria.com.br" className="text-cyan-300 hover:underline">caio.baldassaune@bi2bconsultoria.com.br</a>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight border-l-2 border-cyan-400 pl-3">
                7. Segurança
              </h2>
              <p>
                Adotamos medidas técnicas, administrativas e organizacionais adequadas para proteger seus dados pessoais contra acessos não autorizados, perdas, destruição ou alteração indesejada.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
