import { Link } from "react-router-dom"
import { ArrowRight, DatabaseZap, ShieldCheck, Sparkles } from "lucide-react"
import logoMain from "../assets/img/logo.png"

export default function Hero() {
  const scrollToServices = () => {
    const element = document.getElementById("servicos")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      id="home"
      className="relative overflow-hidden min-h-[100svh] flex flex-col items-center justify-center px-4 pt-[30px] pb-[clamp(4.5rem,8vh,6.5rem)] sm:px-6 sm:pb-[clamp(5rem,7vh,7rem)] md:pb-[clamp(5.5rem,6.5vh,7.5rem)] lg:pb-[clamp(6rem,6vh,8rem)] xl:pb-[clamp(6.5rem,6vh,8.5rem)]"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(13,96,132,0.32),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(255,0,0,0.12),_transparent_24%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,7,18,0.55),rgba(3,7,18,0.8)),url('/src/assets/img/heroimg.jpg')] bg-cover bg-center bg-no-repeat opacity-90" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,15,0.35)_0%,rgba(4,8,15,0.55)_45%,rgba(3,5,8,0.96)_100%)]" />
      </div>

      <div className="container mx-auto px-6 w-full">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-3xl">
            <div className="section-label mb-12 w-fit">
              <Sparkles size={14} />
              Consultoria com visão estratégica
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-[0.95] text-white pb-2 md:pb-3 lg:pb-2 pt-4">
              <img
                src={logoMain}
                alt="Bi2B"
                className="mb-2 h-11 w-auto sm:h-12 md:h-14 lg:h-16"
              />
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#7ee7ff] via-white pb-[10px] to-[#0d6084]">
                Inteligência para sua gestão
              </span>
            </h1>

            <p className="section-copy mt-6 max-w-2xl text-lg md:text-xl">
              Soluções completas em consultoria, dados e gestão contábil para
              transformar informação em decisão e dar mais clareza ao
              crescimento do seu negócio.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={scrollToServices}
                className="tech-button-primary bg-gradient-to-r from-[#0d6084] to-[#0a4a62] px-8 py-4 shadow-[0_12px_40px_rgba(13,96,132,0.32)] hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(13,96,132,0.42)]"
              >
                Conheça nossas soluções
                <ArrowRight size={18} />
              </button>
              <Link
                to="/abrir-minha-empresa"
                state={{ fromInternalLink: true }}
                className="tech-button-primary border border-white/15 bg-white/6 px-8 py-4 text-white hover:bg-white/10"
              >
                Abrir minha empresa
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: DatabaseZap,
                  title: "Dados",
                  text: "Visão prática para decisões.",
                },
                {
                  icon: ShieldCheck,
                  title: "Segurança",
                  text: "Processos com previsibilidade.",
                },
                {
                  icon: Sparkles,
                  title: "Estratégia",
                  text: "Crescimento com direção.",
                },
              ].map((item) => (
                <div key={item.title} className="tech-card p-4">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0d6084]/15 text-[#7ee7ff]">
                    <item.icon size={20} />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.24em] text-white">
                    {item.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:justify-self-end w-full flex justify-center lg:justify-end">
            <div className="tech-panel relative w-full max-w-xl overflow-hidden p-6 md:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(13,96,132,0.2),_transparent_55%)]" />
              <div className="relative grid gap-4 text-center sm:text-left">
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
                    Diagnóstico guiado
                  </p>
                  <h2 className="mt-3 text-2xl font-bold text-white">
                    Um posicionamento mais claro para sua empresa
                  </h2>
                  <p className="mt-3 text-slate-300 leading-relaxed">
                    Estruturamos análise, operação e comunicação em uma jornada
                    visual limpa, com leitura rápida e foco em conversão.
                  </p>
                </div>

                {/* <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                      Eficiência
                    </p>
                    <p className="mt-2 text-3xl font-bold text-white">+40%</p>
                    <p className="mt-1 text-sm text-slate-300">
                      leitura mais direta da proposta.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                      Clareza
                    </p>
                    <p className="mt-2 text-3xl font-bold text-white">
                      3 camadas
                    </p>
                    <p className="mt-1 text-sm text-slate-300">
                      dados, solução e contato em sequência.
                    </p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
