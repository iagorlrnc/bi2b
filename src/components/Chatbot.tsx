import { useState, useRef, useEffect, useCallback } from "react"
import { X, Send, Bot, User } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

const SYSTEM_PROMPT = `
Você é o consultor e assistente virtual estratégico da Bi2B - Soluções Contábeis, Tributárias e de Consultoria.

Você deve responder as dúvidas dos usuários EXCLUSIVAMENTE com base no contexto abaixo. Se a pergunta for sobre um assunto fora do contexto, ou você não souber a resposta, informe amigavelmente que não tem a informação e oriente o usuário a chamar um especialista no WhatsApp: https://wa.me/556392812239.

---

### DIRETRIZES DE COMPORTAMENTO E FLUXO CONVERSACIONAL (MUITO IMPORTANTE)

1. **Escuta Ativa e Empatia Real**:
   - Cada resposta deve começar com uma breve validação empática e calorosa da situação ou dúvida do usuário (de 1 a 2 linhas). Mostre que compreende a dor dele.
   - Exemplos:
     * *Dúvida sobre impostos*: "Entendo perfeitamente a sua preocupação. A carga tributária realmente assusta quem está empreendendo, mas com o planejamento certo conseguimos otimizar bastante."
     * *Dúvida sobre abertura*: "Que excelente iniciativa! Começar um negócio próprio é um passo incrível, e planejar tudo desde o início evita muitas dores de cabeça futuras."
     * *Insatisfação com contabilidade*: "Compreendo a sua frustração. Ter um suporte contábil que não responde rápido ou não orienta de perto é muito prejudicial para o crescimento da empresa."

2. **Técnica da Pergunta Única de Condução**:
   - NUNCA termine uma resposta com uma frase fechada ou de forma passiva (como "Estou à disposição" ou "Tem mais alguma dúvida?").
   - Toda interação deve terminar com **exatamente UMA pergunta estratégica e natural** para conduzir o usuário no funil de qualificação de leads, de acordo com o contexto do que ele acabou de perguntar.
   - Faça as perguntas em etapas, coletando as informações de forma orgânica e em formato de bate-papo, sem parecer um formulário ou interrogatório.

3. **Adequação da Pergunta ao Contexto**:
   - **Se o usuário fala sobre Abertura**: Pergunte se ele pretende abrir sozinho ou com sócios, ou qual será o faturamento estimado.
   - **Se o usuário fala sobre Impostos / Redução de Carga**: Pergunte se ele atua como Pessoa Física (CPF) ou se já possui um CNPJ.
   - **Se o usuário fala sobre Gestão Financeira / BPO**: Pergunte se ele costuma misturar as finanças pessoais com as da empresa ou qual ferramenta de controle usa hoje.
   - **Se o usuário fala sobre insatisfação com a contabilidade atual**: Pergunte qual é a maior dificuldade enfrentada com o suporte atual ou qual o regime tributário da empresa.

---

### CONTEXTO DA BI2B (SITE PRINCIPAL):
A Bi2B transforma dados em decisões estratégicas. Entregamos soluções com clareza visual, eficiência operacional e crescimento. 
Pilares: Excelência, Comprometimento e Resultado.
Links Úteis: 
- WhatsApp: https://wa.me/556392812239
- Portal do Cliente: https://share.google/ZDrIBH8t9kXoMq5nJ
- Abrir Minha Empresa: https://abrirminhaempresa.bi2bconsultoria.com.br


### SERVIÇOS OFERECIDOS:
1. Análise de Dados e KPIs: Gestão guiada por fatos.
2. Consultoria Empresarial: Otimização de gestão e crescimento.
3. Planejamento Tributário: Redução lícita da carga tributária.
4. Assessoria Mensal (Contábil, Fiscal, Pessoal): Cuidamos de toda a rotina para manter a empresa em conformidade legal.
5. Recuperação Tributária: Resgate de créditos tributários dos últimos 5 anos (injeção de caixa segura).
6. Registro de Marcas (INPI): Proteção jurídica e exclusividade.

### ABERTURA DE EMPRESA:
Ajudamos autônomos e pessoas físicas a abrirem CNPJ pagando menos impostos.
- Sinais para abrir empresa: Pagar muito IRPF/INSS na Pessoa Física, precisar emitir nota fiscal ou buscar contratos corporativos.
- Diferencial Bi2B: Não colocamos o cliente automaticamente no Simples Nacional. Fazemos análise tributária individual para garantir economia real desde o início.
- Processo sem burocracia: Cuidamos de obter o CNPJ, Inscrição Municipal, Alvará e enquadramento ideal.
- Oferecemos um E-book gratuito sobre o tema para quem preencher o formulário na página "Abrir minha empresa".

---

### Módulo de Aquecimento e Qualificação de Lead para CRM

#### Função Comercial do Agente
Além de atender o cliente e responder dúvidas, você também atua como um pré-atendente comercial consultivo.
Seu objetivo é aquecer o lead de forma natural, entendendo sua necessidade, urgência, perfil e potencial de contratação, para depois encaminhar os dados organizados ao CRM e à equipe comercial.
Você não deve parecer um vendedor agressivo. A venda acontece por condução, clareza e diagnóstico.
O foco é fazer o visitante sentir que:
- foi compreendido;
- está falando com um escritório preparado;
- existe uma solução adequada para o problema dele;
- o próximo passo é simples e seguro.

#### Objetivos do Aquecimento do Lead
Durante a conversa, você deve identificar:
1. Qual problema o cliente quer resolver;
2. Qual o nível de urgência;
3. Se já possui empresa aberta;
4. Qual o tipo de empresa ou atividade;
5. Se há risco fiscal, prazo, débito ou pendência;
6. Se o cliente tem perfil para contabilidade mensal, regularização, abertura, consultoria ou BPO financeiro;
7. Se a demanda deve ir para atendimento comercial, técnico ou relacionamento;
8. Quais dados precisam ser enviados ao CRM.

#### Condução da Conversa Comercial
A conversa deve ser leve, progressiva e consultiva. Nunca faça um interrogatório. Faça perguntas em etapas, conforme o cliente responde.

##### Etapa 1 — Entender a intenção
Primeiro descubra o motivo principal do contato.
Exemplos de perguntas:
- “Entendi. Você quer resolver isso para sua empresa ou como pessoa física?”
- “Esse caso é sobre abertura de empresa, regularização, impostos, nota fiscal ou contabilidade mensal?”
- “Você já tem CNPJ ou ainda está começando?”

##### Etapa 2 — Entender a dor
Depois, descubra o problema real por trás da mensagem.
Exemplos:
- “O que mais está te preocupando nessa situação hoje?”
- “Você precisa resolver isso por causa de algum prazo?”
- “Essa pendência está impedindo emissão de nota, certidão, financiamento, licitação ou outro processo?”
- “Hoje sua maior dificuldade é com impostos, organização financeira, notas fiscais ou regularização?”

##### Etapa 3 — Medir urgência
Identifique se o lead precisa de atendimento rápido. Classifique internamente como: baixa urgência; média urgência; alta urgência; crítica.
Considere como alta ou crítica quando envolver: intimação; fiscalização; débito vencido; impedimento para emitir nota; certidão negativa; prazo inferior a 48 horas; desenquadramento; empresa irregular; risco de multa; licitação; bloqueio de atividade.
Perguntas úteis:
- “Existe algum prazo para resolver isso?”
- “Você recebeu alguma notificação?”
- “Isso está impedindo alguma operação da empresa?”

##### Etapa 4 — Identificar potencial comercial
Durante a conversa, identifique o tipo de oportunidade: abertura de empresa; contabilidade mensal; troca de contador; regularização fiscal; parcelamento de débitos; Imposto de Renda; folha de pagamento; consultoria tributária; BPO financeiro; diagnóstico da Reforma Tributária; organização financeira; emissão de nota fiscal; alteração ou encerramento de empresa.
Não ofereça todos os serviços de uma vez. Ofereça apenas o próximo passo compatível com a dor do cliente.
Exemplo:
“Pelo que você explicou, o ideal seria fazermos uma análise inicial da situação do CNPJ para entender as pendências e te indicar o caminho mais seguro.”

#### Gatilhos de Qualificação
Use perguntas naturais para qualificar o lead:
##### Para empresa já aberta:
- “Qual o CNPJ da empresa?”
- “A empresa está em qual cidade e estado?”
- “Hoje você já tem contador?”
- “Sua empresa é MEI, Simples Nacional, Lucro Presumido ou não sabe informar?”
- “Você emite notas fiscais com frequência?”
- “Possui funcionários?”
- “A empresa está com algum débito ou pendência?”
- “Hoje você sente falta de orientação mais próxima da contabilidade?”

##### Para quem quer abrir empresa:
- “Você pretende atuar sozinho ou terá sócio?”
- “A atividade será serviço, comércio ou os dois?”
- “Você pretende emitir nota fiscal para empresas?”
- “Já tem previsão de faturamento mensal?”
- “Já tem endereço para usar na empresa?”
- “Você precisa abrir com urgência?”

##### Para BPO financeiro ou gestão:
- “Hoje você controla o financeiro em planilha, sistema ou ainda não tem controle?”
- “Você consegue saber com clareza quanto a empresa lucra por mês?”
- “Existe mistura entre dinheiro da empresa e dinheiro pessoal?”
- “Você tem dificuldade com contas a pagar, contas a receber ou fluxo de caixa?”
- “Gostaria de receber relatórios para tomar decisões com mais segurança?”

#### Lead Scoring Interno
Ao longo da conversa, classifique internamente o lead com uma pontuação de 0 a 100. Essa pontuação não deve ser mostrada ao cliente.
Some pontos conforme os sinais abaixo:
- Tem CNPJ ativo: +10
- Já possui faturamento: +15
- Tem urgência ou prazo: +15
- Tem débito, pendência ou risco fiscal: +15
- Quer contratar contabilidade ou trocar de contador: +20
- Precisa abrir empresa em curto prazo: +15
- Possui funcionários: +10
- Emite notas fiscais com frequência: +10
- Demonstra dor com financeiro ou impostos: +15
- Aceita contato da equipe: +20
- Informou telefone/WhatsApp: +20
- Informou CNPJ: +15

#### Status do Lead para CRM
Ao final da conversa, classifique o lead em um dos status: Novo lead; Lead em qualificação; Lead qualificado; Oportunidade comercial; Atendimento técnico necessário; Aguardando documentos; Aguardando retorno do cliente; Lead sem perfil no momento; Cliente existente; Urgente.

#### Dados que Devem Ser Coletados para CRM
Sempre que houver intenção real, colete os dados abaixo de forma natural:
##### Dados básicos:
- Nome; WhatsApp; E-mail, se necessário; Cidade/Estado; CPF ou CNPJ, se aplicável.
##### Dados da empresa:
- Nome da empresa; CNPJ; Atividade; Regime tributário, se souber; Se possui funcionários; Se emite nota fiscal; Se possui contador atualmente; Principal dificuldade atual.
##### Dados da oportunidade:
- Serviço de interesse; Motivo do contato; Urgência; Prazo; Dor principal; Consequência se não resolver; Próximo passo sugerido; Melhor horário para contato; Canal preferido de atendimento.

#### Como Pedir os Dados sem Esfriar o Lead
Não diga apenas: “Preencha seus dados.”
Prefira: “Entendi sua situação. Para nossa equipe te orientar com mais segurança e já verificar o melhor caminho, me informe por favor:”
Depois peça:
1. Nome:
2. WhatsApp:
3. CNPJ, se tiver:
4. Cidade/Estado:
5. Melhor horário para contato:
Finalize com: “Com essas informações, conseguimos direcionar seu caso para a pessoa certa e evitar que você receba uma orientação genérica.”

#### Consentimento para Contato
Antes de finalizar a coleta, confirme de forma simples: “Podemos usar esses dados apenas para retornar seu atendimento e dar continuidade à sua solicitação?”
Se o cliente responder positivamente, siga. Se não responder, não pressione.

---

### REGRA DE ENCERRAMENTO COM CONVERSÃO E RD STATION
Após responder todas as perguntas e sanar as dúvidas do usuário, envie as informações úteis finais e pergunte de forma gentil e não invasiva se ele tem mais alguma dúvida. Caso não, agradeça pela conversa e ofereça as opções para finalizar o atendimento e transferir os dados estruturados para o RD Station.

---

### REGRAS DE RESPOSTA (OBRIGATÓRIO):
- Não invente dados de fora.
- FAÇA PERGUNTAS INDIVIDUALMENTE, NÃO FAÇA VARIAS PERGUNTAS AO MESMO TEMPO.
- Faça as respostas simples, extremamente diretas ao ponto e focadas na necessidade imediata apresentada.
- Responda sempre em Português.
- Não utilize jargões técnicos complexos. Explique termos contábeis de maneira simples e acessível.
- Não faça respostas longas e detalhadas que cansem a leitura.
- Seja altamente objetivo.
- Caso o usuário pergunte sobre as desvantagens de qualquer serviço, cite as vantagens. Coloque um breve texto explicativo antes, esclarecendo que não há desvantagens e sim adequação de perfil.
- Caso pergunte se vai pagar mais impostos abrindo empresa, diga NÃO. Explique que pessoa física (CPF) teoricamente paga muito mais impostos do que uma pessoa jurídica (CNPJ) devidamente planejada.
- Caso pergunte sobre custos mensais ou honorários, diga que irá variar de acordo com o faturamento, demanda operacional e regime tributário de cada negócio.
- Caso pergunte sobre valores específicos, diga que varia de acordo com a complexidade da demanda.
- Nunca diga ou insinue que o cliente vai pagar mais impostos ou ter prejuízo com as soluções propostas.
- Converse como se fosse uma pessoa de verdade prestando uma consultoria inicial amigável.
- Não utilize frases prontas e robotizadas como "Estou feliz em ajudar", "Espero ter ajudado" ou "Estou aqui para ajudar".
- Evite usar emojis.
- Evite usar tags puras do HTML nas respostas. Formate as respostas usando Markdown limpo compatível com a interface do chat.
- Escreva suas respostas com a formatação adequada para justificar o texto.
- Quando houver tópicos/listas, SEMPRE faça quebra de linhas dupla (pule uma linha em branco) para separar cada item na interface de chat.
`

const maskPhone = (value: string) => {
  let v = value.replace(/\D/g, "")
  if (v.length > 11) v = v.substring(0, 11)
  if (v.length > 10) {
    return v.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")
  } else if (v.length > 6) {
    return v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3")
  } else if (v.length > 2) {
    return v.replace(/^(\d{2})(\d{0,5})/, "($1) $2")
  }
  return v
}

const maskDocument = (value: string) => {
  let v = value.replace(/\D/g, "")
  if (v.length <= 11) {
    // CPF
    return v
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
  } else {
    // CNPJ
    v = v.substring(0, 14)
    return v
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
  }
}

// Função customizada para um scroll suave, lento e elegante
const smoothScrollTo = (
  element: HTMLElement,
  targetPosition: number,
  duration: number,
) => {
  const startPosition = element.scrollTop
  const distance = targetPosition - startPosition
  let startTime: number | null = null

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)

    // Função de aceleração (Easing): easeInOutQuart - começa devagar, acelera no meio e termina bem suave
    const ease =
      progress < 0.5
        ? 8 * progress * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 4) / 2

    element.scrollTop = startPosition + distance * ease

    if (timeElapsed < duration) {
      requestAnimationFrame(animation)
    }
  }

  requestAnimationFrame(animation)
}

export default function Chatbot() {
  const navigate = useNavigate()
  const location = useLocation()

  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      return window.location.pathname === "/chatbot"
    }
    return false
  })

  // Sincroniza o estado de aberto com a rota no mobile
  useEffect(() => {
    if (window.innerWidth < 640) {
      if (location.pathname === "/chatbot") {
        setIsOpen(true)
      } else {
        setIsOpen(false)
      }
    }
  }, [location.pathname])

  const [showCloseConfirm, setShowCloseConfirm] = useState(false)
  const [leadStep, setLeadStep] = useState(0) // 0: Nome, 1: Telefone, 2: Documento, 3: Consentimento, 4: Chat Normal, -1: Negado
  const [leadData, setLeadData] = useState({
    name: "",
    phone: "",
    document: "",
    consent: false,
    questions: [] as string[],
  })

  const [messages, setMessages] = useState<
    { role: "user" | "assistant" | "system"; content: string }[]
  >([
    {
      role: "assistant",
      content:
        "Olá! Para começarmos o atendimento, por favor, digite seu **nome completo**:",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Foca automaticamente o campo de input/textarea apropriado quando o passo muda ou o chat é aberto
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (leadStep === 1 || leadStep === 2) {
          inputRef.current?.focus()
        } else if (leadStep === 0 || leadStep === 4) {
          textareaRef.current?.focus()
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen, leadStep])

  const closeChat = useCallback(() => {
    // Se o usuário já passou do consentimento, pede confirmação antes de fechar
    if (leadStep >= 4 && !showCloseConfirm) {
      setShowCloseConfirm(true)
      return
    }

    // Se não chegou no consentimento ou se já estiver confirmando
    setShowCloseConfirm(false)
    if (window.innerWidth < 640 && location.pathname === "/chatbot") {
      navigate(-1)
    } else {
      setIsOpen(false)
    }
  }, [leadStep, showCloseConfirm, navigate, location])

  const toggleChat = () => {
    if (isOpen) {
      closeChat()
    } else {
      if (window.innerWidth < 640) {
        navigate("/chatbot", { state: { backgroundLocation: location } })
      } else {
        setIsOpen(true)
      }
    }
  }

  // move closeChat above toggleChat to avoid use-before-define issues

  // Função para envio ao RD Station
  const sendToRDStation = async (
    data: typeof leadData,
    chatHistory: { role: "user" | "assistant" | "system"; content: string }[] = messages,
  ) => {
    try {
      const token = import.meta.env.VITE_RD_STATION_PUBLIC_TOKEN
      if (!token) {
        console.warn("VITE_RD_STATION_PUBLIC_TOKEN não está definido no .env")
        return
      }

      // RD Station OBRIGA um campo "email" para criar o lead.
      // como não é solicitado email, é gerado um email fictício.
      const telefoneNumeros = data.phone.replace(/\D/g, "")
      const dummyEmail = `cliente.${telefoneNumeros}@chatbot.com`

      const historicoPerguntas =
        data.questions.length > 0
          ? data.questions.join(" | ")
          : "Nenhuma pergunta feita."

      // Transcreve a conversa inteira (diálogo completo entre Cliente e Assistente)
      const conversaCompleta = chatHistory
        .map((m) => {
          if (m.role === "user") {
            return `[Cliente]: ${m.content}`
          } else if (m.role === "assistant") {
            return `[Assistente]: ${m.content}`
          }
          return null
        })
        .filter(Boolean)
        .join("\r\n\r\n")

      const payload = {
        token_rdstation: token,
        identificador: "chatbot-bi2b-lead",
        email: dummyEmail,
        nome: data.name,
        telefone: data.phone,
        cf_cnpj_cpf: data.document,
        cf_historico_perguntas: historicoPerguntas,
        cf_historico_conversa: conversaCompleta,
        cf_consentimento_lgpd: data.consent ? "Sim" : "Não",
      }

      console.log("Enviando para RD Station...", payload)

      await fetch("https://www.rdstation.com.br/api/1.2/conversions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      console.log("Lead enviado com sucesso ao RD Station!")
    } catch (error) {
      console.error("Erro ao enviar dados para o RD Station", error)
    }
  }

  const formatMessage = (content: string) => {
    // 1. Divide o texto pelos marcadores de negrito "**"
    const boldParts = content.split(/(\*\*.*?\*\*)/g)

    return boldParts.map((boldPart, boldIndex) => {
      const isBold = boldPart.startsWith("**") && boldPart.endsWith("**")
      const textToProcess = isBold ? boldPart.slice(2, -2) : boldPart

      // 2. Regex para encontrar links em formato Markdown [texto](url) OU urls soltas
      // Grupo 1: texto do markdown, Grupo 2: url do markdown, Grupo 3: url solta
      const linkRegex =
        /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s]+)/g
      const parts = textToProcess.split(linkRegex)

      const parsedContent = []
      for (let i = 0; i < parts.length; i++) {
        // Se for texto normal (fora dos grupos de captura do regex)
        if (parts[i]) {
          parsedContent.push(<span key={`${boldIndex}-${i}`}>{parts[i]}</span>)
        }

        // Verifica os grupos de captura associados a esse texto
        if (i + 1 < parts.length) {
          const mdText = parts[i + 1]
          const mdUrl = parts[i + 2]
          const bareUrl = parts[i + 3]

          if (mdText && mdUrl) {
            parsedContent.push(
              <a
                key={`md-${boldIndex}-${i}`}
                href={mdUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7ee7ff] font-semibold underline underline-offset-2 hover:text-white transition-colors break-all"
              >
                {mdText}
              </a>,
            )
          } else if (bareUrl) {
            let url = bareUrl
            let suffix = ""
            const lastChar = url.slice(-1)
            // Se a URL capturou pontuação final indesejada, separa
            if ([".", ",", "!", "?", ")", "]"].includes(lastChar)) {
              suffix = lastChar
              url = url.slice(0, -1)
            }
            parsedContent.push(
              <span key={`bare-${boldIndex}-${i}`}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7ee7ff] font-semibold underline underline-offset-2 hover:text-white transition-colors break-all"
                >
                  {url}
                </a>
                {suffix}
              </span>,
            )
          }
          // Pula os 3 índices de grupos de captura que o split inseriu no array
          i += 3
        }
      }

      // Se for um bloco em negrito, encapsula na tag strong
      if (isBold) {
        return (
          <strong key={boldIndex} className="font-bold">
            {parsedContent}
          </strong>
        )
      }

      return <span key={boldIndex}>{parsedContent}</span>
    })
  }

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current
      const targetScroll = container.scrollHeight - container.clientHeight
      smoothScrollTo(container, targetScroll, 1000) // 1 segundo (1000ms) para um scroll bem leve
    }
  }

  useEffect(() => {
    const lastMessage = messages[messages.length - 1]

    if (lastMessage && lastMessage.role === "user") {
      // Quando o usuário envia, rola para baixo
      scrollToBottom()
    } else if (lastMessage && lastMessage.role === "assistant") {
      // Quando a IA responde, calculamos se a resposta cabe na tela
      const container = messagesContainerRef.current
      if (container) {
        const messageElements = container.querySelectorAll(".message-wrapper")
        const userElements = container.querySelectorAll(
          '.message-wrapper[data-role="user"]',
        )

        const lastUserElement = userElements[
          userElements.length - 1
        ] as HTMLElement
        const lastAssistantElement = messageElements[
          messageElements.length - 1
        ] as HTMLElement

        if (lastUserElement && lastAssistantElement) {
          const userHeight = lastUserElement.getBoundingClientRect().height
          const assistantHeight =
            lastAssistantElement.getBoundingClientRect().height
          const containerHeight = container.clientHeight

          // Adicionamos 40px de margem de segurança
          if (userHeight + assistantHeight + 40 < containerHeight) {
            // Se cabe tudo na tela, rola até o fim
            scrollToBottom()
          } else {
            // Se for gigante (ou teclado aberto limitando a tela),
            // rola até a pergunta do usuário para que ele leia desde o início
            const targetTop = Math.max(0, lastUserElement.offsetTop - 20)
            smoothScrollTo(container, targetTop, 1000) // 1 segundo de transição suave
          }
        } else {
          // Se for a primeira mensagem ou uma das mensagens curtas do funil inicial, rola pra baixo
          scrollToBottom()
        }
      }
    }
  }, [messages, leadStep])

  // Bloqueia o scroll do body no mobile quando o chat está aberto
  useEffect(() => {
    // Aplica o bloqueio apenas em telas móveis (sm)
    if (isOpen && window.innerWidth < 640) {
      const scrollY = window.scrollY

      // Fixa o body exatamente na posição atual para não pular pro topo
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = "100%"
      document.body.style.overflow = "hidden"
      document.documentElement.style.overflow = "hidden"

      return () => {
        document.body.style.position = ""
        document.body.style.top = ""
        document.body.style.width = ""
        document.body.style.overflow = ""
        document.documentElement.style.overflow = ""
        // Restaura a posição de scroll instantaneamente
        window.scrollTo({ top: scrollY, behavior: "instant" })
      }
    }
  }, [isOpen])

  const chatRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Mantém o topo do chat fixo quando o teclado abre no iOS/Android
  useEffect(() => {
    if (!isOpen || window.innerWidth >= 640) return

    const chatEl = chatRef.current

    const handleViewportChange = () => {
      if (chatEl && window.visualViewport) {
        // A altura do viewport real (encolhe com o teclado)
        chatEl.style.height = `${window.visualViewport.height}px`

        // Se o navegador fizer pan na tela (iOS), usamos transform (GPU acelerado)
        // ao invés de 'top' para evitar tremores (jitter)
        chatEl.style.transform = `translateY(${window.visualViewport.offsetTop}px)`
      }
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportChange)
      window.visualViewport.addEventListener("scroll", handleViewportChange)
      handleViewportChange()
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          handleViewportChange,
        )
        window.visualViewport.removeEventListener(
          "scroll",
          handleViewportChange,
        )
      }
      if (chatEl) {
        chatEl.style.height = ""
        chatEl.style.transform = ""
      }
    }
  }, [isOpen])

  // Bloqueio agressivo de touchmove para o iOS (evita que o fundo arraste com o teclado aberto)
  useEffect(() => {
    if (!isOpen || window.innerWidth >= 640) return

    let touchStartY = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      const messageContainer = target.closest(
        ".messages-container",
      ) as HTMLElement

      // Se não estiver dentro da área de mensagens, bloqueio absoluto
      if (!messageContainer) {
        if (e.cancelable) e.preventDefault()
        return
      }

      // Se for dentro da caixa de mensagens, precisamos garantir que não dê "bounce" no limite
      const touchY = e.touches[0].clientY
      const deltaY = touchY - touchStartY

      const isAtTop = messageContainer.scrollTop === 0
      const isAtBottom =
        messageContainer.scrollTop + messageContainer.clientHeight >=
        messageContainer.scrollHeight - 1

      // Se está no topo e tentando rolar pra cima (arrastando dedo pra baixo)
      if (isAtTop && deltaY > 0) {
        if (e.cancelable) e.preventDefault()
      }

      // Se está no fundo e tentando rolar pra baixo (arrastando dedo pra cima)
      if (isAtBottom && deltaY < 0) {
        if (e.cancelable) e.preventDefault()
      }
    }

    // { passive: false } é obrigatório para o preventDefault() funcionar no touchmove
    document.addEventListener("touchstart", handleTouchStart, { passive: true })
    document.addEventListener("touchmove", handleTouchMove, { passive: false })

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        chatRef.current &&
        !chatRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeChat()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, leadStep, showCloseConfirm, closeChat])

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if ((!input.trim() && leadStep !== 3) || isLoading) return

    const userMessage = input.trim()
    setInput("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }

    // --- LÓGICA DO FUNIL DE LEADS ---
    if (leadStep === 0) {
      setMessages((prev) => [...prev, { role: "user", content: userMessage }])
      setLeadData((prev) => ({ ...prev, name: userMessage }))
      setLeadStep(1)
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Prazer em conhecer, **${userMessage.split(" ")[0]}**! Qual é o seu **telefone para contato**? `,
          },
        ])
      }, 500)
      return
    }

    if (leadStep === 1) {
      setMessages((prev) => [...prev, { role: "user", content: userMessage }])
      setLeadData((prev) => ({ ...prev, phone: userMessage }))
      setLeadStep(2)
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Obrigado! Agora, por favor, informe seu **CNPJ** (ou CPF, caso não possua empresa):`,
          },
        ])
      }, 500)
      return
    }

    if (leadStep === 2) {
      setMessages((prev) => [...prev, { role: "user", content: userMessage }])
      setLeadData((prev) => ({ ...prev, document: userMessage }))
      setLeadStep(3)
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Por último, a Bi2B Consultoria está comprometida em proteger e respeitar sua privacidade. Você concorda em receber nossas comunicações e que seus dados sejam utilizados para fins de marketing e otimização de preferências do cliente?`,
          },
        ])
      }, 500)
      return
    }

    // --- LÓGICA DE CHAT NORMAL ---
    const newMessages = [
      ...messages,
      { role: "user" as const, content: userMessage },
    ]
    setMessages(newMessages)

    // Acumula as perguntas no histórico
    const updatedLeadData = {
      ...leadData,
      questions: [...leadData.questions, userMessage],
    }
    setLeadData(updatedLeadData)

    // Envia a pergunta do cliente imediatamente ao RD Station
    sendToRDStation(updatedLeadData, newMessages)

    setIsLoading(true)

    try {
      const response = await fetch("/api/ia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...newMessages.map((m) => ({ role: m.role, content: m.content })),
          ],
        }),
      })

      if (!response.ok) {
        throw new Error("Falha na resposta da API")
      }

      const data = await response.json()
      let assistantText = data.text || ""

      if (data.error) {
        throw new Error(data.error)
      }

      const looksLikeHtmlError =
        /<!doctype html|<html[\s>]|cloudflare|bad gateway/i.test(assistantText)
      if (!assistantText.trim() || looksLikeHtmlError) {
        throw new Error("Resposta inválida do serviço de IA")
      }

      // Remove a propaganda de fim de resposta da API gratuita
      const adIdentifier = "Support Pollinations.AI"
      if (assistantText.includes(adIdentifier)) {
        assistantText = assistantText.split(adIdentifier)[0]
      }

      // Limpa rastros da propaganda ou formatações mortas no final (traços, asteriscos soltos e quebras de linha extras)
      assistantText = assistantText.replace(/[\s\-*]+$/, "")

      const assistantMessages: typeof messages = [
        ...newMessages,
        { role: "assistant", content: assistantText.trim() },
      ]
      setMessages(assistantMessages)

      // Envia a resposta do assistente imediatamente ao RD Station
      sendToRDStation(updatedLeadData, assistantMessages)
    } catch (error) {
      console.error("Erro no chatbot:", error)
      const errorMessages: typeof messages = [
        ...newMessages,
        {
          role: "assistant",
          content:
            "Desculpe, ocorreu um erro na comunicação. Por favor, entre em contato via WhatsApp: https://wa.me/556392812239",
        },
      ]
      setMessages(errorMessages)
      sendToRDStation(updatedLeadData, errorMessages)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Container Flutuante para Tooltip e Botão (Posicionado ao lado do WhatsApp) */}
      <div className="floating-button fixed bottom-6 right-6 z-[9999] flex items-center gap-3">
        {/* Tooltip Chamativo */}
        {!isOpen && (
          <div
            className="relative flex items-center animate-bounce cursor-pointer"
            onClick={toggleChat}
          >
            <div className="bg-[#0d6084] text-[#7ee7ff] text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-[0_10px_25px_rgba(13,96,132,0.3)] border border-[#7ee7ff]/20 whitespace-nowrap">
              Tire suas dúvidas!
            </div>
            {/* Triângulo (Seta apontando para o botão) */}
            <div className="w-0 h-0 border-y-[8px] border-y-transparent border-l-[10px] border-l-[#0d6084]"></div>
          </div>
        )}

        {/* Botão */}
        <button
          ref={buttonRef}
          onClick={toggleChat}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-[#0d6084] to-[#0a4a62] text-white shadow-[0_14px_40px_rgba(13,96,132,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(13,96,132,0.38)]"
          aria-label="Abrir chat"
        >
          {isOpen ? <X size={28} /> : <Bot size={28} />}
        </button>
      </div>

      {/* Janela de Chat */}
      {isOpen && (
        <div
          ref={chatRef}
          className="fixed top-0 left-0 right-0 z-[10000] w-full h-[100dvh] flex flex-col bg-[#05070b] sm:bg-[#061826] sm:top-auto sm:left-auto sm:bottom-24 sm:right-6 sm:w-[380px] sm:h-[500px] sm:max-h-[70vh] sm:rounded-2xl sm:border sm:border-white/10 sm:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden overscroll-none touch-none sm:touch-auto sm:backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-bottom-5"
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-white/10 bg-[#0d6084]/20 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0d6084] text-[#7ee7ff]">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Assistente Bi2B</h3>
              <p className="text-xs text-gray-400">Online agora</p>
            </div>
            <button
              onClick={closeChat}
              className="ml-auto text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Área de Mensagens */}
          <div
            ref={messagesContainerRef}
            className="messages-container flex-1 overflow-y-auto overflow-x-hidden overscroll-contain touch-pan-y p-4 space-y-4 bg-gradient-to-b from-transparent to-black/20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                data-role={msg.role}
                className={`message-wrapper flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                <div
                  className={`flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full ${
                    msg.role === "user"
                      ? "bg-[#7ee7ff]/20 text-[#7ee7ff]"
                      : "bg-[#0d6084] text-white"
                  }`}
                >
                  {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div
                  className={`rounded-2xl p-3 text-sm leading-relaxed shadow-sm whitespace-pre-wrap break-words text-left ${
                    msg.role === "user"
                      ? "bg-[#0d6084] text-white rounded-tr-sm"
                      : "bg-white/5 text-gray-200 border border-white/10 rounded-tl-sm"
                  }`}
                >
                  {formatMessage(msg.content)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#0d6084] text-white">
                  <Bot size={16} />
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-sm rounded-tl-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"></span>
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Área de Input ou Botões de Consentimento */}
          {leadStep === 3 ? (
            <div className="p-4 border-t border-white/10 bg-[#061826] flex flex-col gap-3">
              <button
                onClick={() => {
                  const finalLeadData = { ...leadData, consent: true }
                  setLeadData(finalLeadData)
                  const initialMessages: typeof messages = [
                    ...messages,
                    { role: "user", content: "Sim, eu concordo." },
                    {
                      role: "assistant",
                      content:
                        "Ótimo! Consentimento registrado. Sou o assistente de Inteligência Artificial da Bi2B. Como posso ajudar o seu negócio hoje?",
                    },
                  ]
                  setMessages(initialMessages)
                  setLeadStep(4)
                  sendToRDStation(finalLeadData, initialMessages)
                }}
                className="w-full bg-[#0d6084] hover:bg-[#0a4a62] text-white py-3 rounded-xl font-medium transition-colors"
              >
                Sim, eu concordo
              </button>
              <button
                onClick={() => {
                  setMessages((prev) => [
                    ...prev,
                    { role: "user", content: "Não concordo." },
                    {
                      role: "assistant",
                      content:
                        "Compreendemos. Infelizmente não será possível prosseguir com o atendimento pelo Chatbot sem o seu consentimento. Agradecemos o contato!",
                    },
                  ])
                  setLeadStep(-1)
                }}
                className="w-full bg-transparent border border-white/20 hover:bg-white/5 text-gray-300 py-3 rounded-xl font-medium transition-colors"
              >
                Não concordo
              </button>
            </div>
          ) : leadStep === -1 ? (
            <div className="p-4 border-t border-white/10 bg-[#061826] text-center text-gray-400 text-sm">
              Atendimento encerrado por falta de consentimento.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="p-4 border-t border-white/10 bg-[#061826]"
            >
              <div className="relative flex items-end">
                {leadStep === 1 || leadStep === 2 ? (
                  <input
                    ref={inputRef}
                    type="tel"
                    inputMode="numeric"
                    value={input}
                    onChange={(e) => {
                      let val = e.target.value
                      if (leadStep === 1) {
                        val = maskPhone(val)
                      } else if (leadStep === 2) {
                        val = maskDocument(val)
                      }
                      setInput(val)
                    }}
                    placeholder={
                      leadStep === 1
                        ? "Digite seu número..."
                        : "Digite seu CPF/CNPJ..."
                    }
                    disabled={isLoading}
                    className="w-full bg-white/5 border border-white/10 rounded-full pl-6 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#0d6084] transition-colors text-[16px]"
                  />
                ) : (
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value)
                      e.target.style.height = "auto"
                      e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        if (input.trim() && !isLoading) {
                          handleSubmit(e as unknown as React.FormEvent)
                        }
                      }
                    }}
                    placeholder={
                      leadStep === 0
                        ? "Digite seu nome..."
                        : "Digite sua dúvida..."
                    }
                    disabled={isLoading}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#0d6084] transition-colors text-[16px] resize-none overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    style={{ minHeight: "48px", maxHeight: "120px" }}
                  />
                )}
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 bottom-[6px] p-2 text-[#7ee7ff] hover:text-white disabled:opacity-50 disabled:hover:text-[#7ee7ff] transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          )}

          {/* Confirmação de Fechamento */}
          {showCloseConfirm && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-in fade-in duration-200">
              <div className="bg-[#061826] border border-white/10 p-6 rounded-2xl w-full text-center shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                <h3 className="text-xl font-bold text-white mb-2">
                  Encerrar atendimento?
                </h3>
                <p className="text-sm text-gray-300 mb-6">
                  Ao encerrar, seu histórico de dúvidas será salvo e um
                  especialista poderá entrar em contato.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      // Envia os dados para o RD Station
                      sendToRDStation(leadData)

                      // Reseta o estado para a próxima vez que abrir
                      setLeadStep(0)
                      setLeadData({
                        name: "",
                        phone: "",
                        document: "",
                        consent: false,
                        questions: [],
                      })
                      setMessages([
                        {
                          role: "assistant",
                          content:
                            "Olá! Para começarmos o atendimento, por favor, digite seu **nome completo**:",
                        },
                      ])
                      setShowCloseConfirm(false)

                      if (
                        window.innerWidth < 640 &&
                        location.pathname === "/chatbot"
                      ) {
                        navigate(-1)
                      } else {
                        setIsOpen(false)
                      }
                    }}
                    className="w-full bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white py-3 rounded-xl font-medium transition-colors"
                  >
                    Sim, encerrar
                  </button>
                  <button
                    onClick={() => setShowCloseConfirm(false)}
                    className="w-full bg-[#0d6084] hover:bg-[#0a4a62] text-white py-3 rounded-xl font-medium transition-colors"
                  >
                    Não, continuar conversando
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
