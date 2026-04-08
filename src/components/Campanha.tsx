import { Link } from "react-router-dom"

export default function Campanha() {
  return (
    <section className="relative min-h-screen bg-[#f5f7fa] px-6 py-8 text-[#1f2937] md:px-10">
      <Link
        to="/"
        className="absolute left-6 top-6 rounded-full bg-[#0d6084] px-5 py-2 font-semibold text-white transition-colors hover:bg-[#0a4b66]"
      >
        Voltar
      </Link>

      <div className="mx-auto mt-16 max-w-3xl rounded-2xl bg-white p-8 shadow-lg md:p-10">
        <div className="mb-6 inline-flex rounded-full bg-[#0d6084]/10 px-4 py-2 text-sm font-semibold tracking-wide text-[#0d6084]">
          Campanha Bi2B
        </div>

        <h1 className="mb-6 text-3xl font-bold leading-tight text-[#0d6084] md:text-4xl">
          Abrir uma empresa com mais segurança e menos imposto
        </h1>

        <p className="mb-5 text-lg leading-8 text-[#374151]">
          Se você está pensando em abrir uma empresa, vale começar com uma base
          sólida. Um bom planejamento no início evita dores de cabeça, reduz
          custos desnecessários e ajuda seu negócio a nascer no caminho certo.
        </p>

        <p className="mb-5 text-lg leading-8 text-[#374151]">
          O erro mais comum é abrir a empresa sem avaliar o enquadramento
          tributário. Quando isso acontece, o empreendedor pode cair em um
          regime inadequado, pagar mais impostos do que deveria e comprometer a
          saúde financeira da operação logo nos primeiros meses.
        </p>

        <p className="mb-4 text-lg leading-8 text-[#374151]">
          Antes de formalizar seu negócio, é importante analisar pontos como:
        </p>

        <ul className="mb-6 space-y-3 rounded-2xl bg-[#f8fafc] p-6 text-lg leading-8 text-[#374151]">
          <li>
            Qual regime tributário oferece a melhor condição para o seu caso;
          </li>
          <li>
            Qual atividade será exercida e como isso impacta na tributação;
          </li>
          <li>Se existem benefícios fiscais que podem ser aproveitados;</li>
          <li>
            Qual será a projeção de faturamento e movimentação financeira;
          </li>
          <li>Como tudo isso se encaixa no seu modelo de negócio.</li>
        </ul>

        <p className="mb-5 text-lg leading-8 text-[#374151]">
          Essa análise prévia ajuda você a começar com mais tranquilidade,
          evitar desperdícios e pagar{" "}
          <strong>o mínimo de imposto possível</strong> dentro da lei.
        </p>

        <p className="mb-5 text-lg leading-8 text-[#374151]">
          <strong>Atenção:</strong> o Simples Nacional não é, obrigatoriamente,
          a melhor opção para todos os negócios. Cada empresa precisa ser
          avaliada individualmente para que a escolha seja realmente
          estratégica.
        </p>

        <p className="text-lg leading-8 text-[#374151]">
          <strong>
            Quer abrir sua empresa com mais clareza e menos risco?
          </strong>{" "}
          Eu posso te ajudar a estruturar esse processo do jeito certo.
        </p>
      </div>
    </section>
  )
}
