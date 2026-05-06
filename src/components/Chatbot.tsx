import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const SYSTEM_PROMPT = `Você é o assistente virtual da Bi2B - Soluções Contábeis, Tributárias e de Consultoria.

Seu papel é responder dúvidas de usuários de forma clara, objetiva e humanizada, utilizando EXCLUSIVAMENTE as informações do contexto fornecido abaixo.

━━━━━━━━━━━━━━━━━━━
REGRA PRINCIPAL
━━━━━━━━━━━━━━━━━━━
Você deve responder as dúvidas dos usuários EXCLUSIVAMENTE com base no contexto abaixo. Se a pergunta for sobre um assunto fora do contexto, ou você não souber a resposta, informe que não tem a informação e oriente o usuário a chamar um especialista no WhatsApp: https://wa.me/556392812239.
Nunca invente ou deduza informações.

━━━━━━━━━━━━━━━━━━━
CONTEXTO DA BI2B
━━━━━━━━━━━━━━━━━━━
A Bi2B transforma dados em decisões estratégicas, oferecendo soluções com clareza visual, eficiência operacional e foco em crescimento.

Links úteis:
- WhatsApp: https://wa.me/556392812239
- Portal do Cliente: https://share.google/ZDrIBH8t9kXoMq5nJ
- Abrir Minha Empresa: https://www.bi2bconsultoria.com.br/abrir-minha-empresa

━━━━━━━━━━━━━━━━━━━
SERVIÇOS OFERECIDOS
━━━━━━━━━━━━━━━━━━━
1. Análise de Dados e KPIs  
Gestão baseada em dados e indicadores claros.

2. Consultoria Empresarial  
Melhoria da gestão e crescimento do negócio.

3. Planejamento Tributário  
Redução legal da carga tributária.

4. Assessoria Mensal  
Contábil, fiscal e pessoal para manter a empresa regularizada.

5. Recuperação Tributária  
Recuperação de créditos dos últimos 5 anos, gerando caixa.

6. Registro de Marcas (INPI)  
Proteção jurídica e exclusividade da marca.

━━━━━━━━━━━━━━━━━━━
ABERTURA DE EMPRESA
━━━━━━━━━━━━━━━━━━━
A Bi2B auxilia na abertura de empresas com foco em pagar menos impostos de forma legal.

Indicado para quem:
- Paga muito IRPF ou INSS como pessoa física.
- Precisa emitir nota fiscal.
- Quer fechar contratos com empresas.

Diferencial:
- Não enquadra automaticamente no Simples Nacional.
- Realiza análise tributária individual para garantir economia real.

Processo:
- CNPJ
- Inscrição Municipal
- Alvará
- Enquadramento ideal

Material gratuito:
- E-book disponível ao preencher o formulário na página "Abrir minha empresa"

━━━━━━━━━━━━━━━━━━━
ESTILO DE RESPOSTA (OBRIGATÓRIO)
━━━━━━━━━━━━━━━━━━━
- Responda apenas vantagens, não cite as desvantagens.
- Nunca diga que vai pagar mais impostos ou algo do tipo.
- Não invente dados de fora.
- Faça as respostas simples e direto ao ponto.
- Responda sempre em Português
- Seja direto e objetivo.
- Use linguagem simples (sem jargões técnicos)
- Não faça respostas longas e detalhadas.
- Não utilize emojis.
- Responda como uma conversa natural (tom humano).
- Converse como se fosse uma pessoa real conversando.
- Evite repetir informações.
- Quando houver tópicos, SEMPRE faça quebra de linhas (pule uma linha) para separar cada item.
- Escreva suas respostas com a formatação adequada para justificar o texto.
- Não use frases como:
  - "Estou feliz em ajudar"
  - "Espero ter ajudado"
  - "Estou aqui para ajudar"
- Ao listar itens, sempre separe cada item com uma linha em branco e um traço (-).
-FAÇA RESPOSTAS CURTAS E OBJETIVAS, APENAS LONGA SE FOR NECESSÁRIO.

━━━━━━━━━━━━━━━━━━━
FORMATAÇÃO
━━━━━━━━━━━━━━━━━━━
- Organize o texto de forma clara
- Quando usar tópicos:
  - Separe cada item com uma linha em branco
- Evite blocos grandes de texto
- NUNCA adicione quebras de linha duplas, espaços em branco ou traços (---) no final da sua resposta. Encerre o texto no último ponto final, sem nenhum espaçamento depois.

━━━━━━━━━━━━━━━━━━━
OBJETIVO FINAL
━━━━━━━━━━━━━━━━━━━
Responder rápido, com clareza e precisão, sempre guiando o usuário para uma solução — ou para o contato com um especialista quando necessário.`;
const maskPhone = (value: string) => {
  let v = value.replace(/\D/g, '');
  if (v.length > 11) v = v.substring(0, 11);
  if (v.length > 10) {
    return v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } else if (v.length > 6) {
    return v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
  } else if (v.length > 2) {
    return v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
  }
  return v;
};

const maskDocument = (value: string) => {
  let v = value.replace(/\D/g, '');
  if (v.length <= 11) {
    // CPF
    return v
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    // CNPJ
    v = v.substring(0, 14);
    return v
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  }
};

// Função customizada para um scroll suave, lento e elegante
const smoothScrollTo = (element: HTMLElement, targetPosition: number, duration: number) => {
  const startPosition = element.scrollTop;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);

    // Função de aceleração (Easing): easeInOutQuart - começa devagar, acelera no meio e termina bem suave
    const ease = progress < 0.5 
      ? 8 * progress * progress * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 4) / 2;

    element.scrollTop = startPosition + distance * ease;

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};

export default function Chatbot() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return window.location.pathname === '/chatbot';
    }
    return false;
  });

  // Sincroniza o estado de aberto com a rota no mobile
  useEffect(() => {
    if (window.innerWidth < 640) {
      if (location.pathname === '/chatbot') {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }
  }, [location.pathname]);

  const toggleChat = () => {
    if (isOpen) {
      closeChat();
    } else {
      if (window.innerWidth < 640) {
        navigate('/chatbot', { state: { backgroundLocation: location } });
      } else {
        setIsOpen(true);
      }
    }
  };

  const closeChat = () => {
    // Se o usuário já passou do consentimento, pede confirmação antes de fechar
    if (leadStep >= 4 && !showCloseConfirm) {
      setShowCloseConfirm(true);
      return;
    }

    // Se não chegou no consentimento ou se já estiver confirmando
    setShowCloseConfirm(false);
    if (window.innerWidth < 640 && location.pathname === '/chatbot') {
      navigate(-1);
    } else {
      setIsOpen(false);
    }
  };
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [leadStep, setLeadStep] = useState(0); // 0: Nome, 1: Telefone, 2: Documento, 3: Consentimento, 4: Chat Normal, -1: Negado
  const [leadData, setLeadData] = useState({ name: '', phone: '', document: '', consent: false, questions: [] as string[] });

  const [messages, setMessages] = useState<{ role: 'user' | 'assistant' | 'system', content: string }[]>([
    { role: 'assistant', content: 'Olá! Para começarmos o atendimento, por favor, digite seu **nome completo**:' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Função para envio ao RD Station
  const sendToRDStation = async (data: typeof leadData) => {
    try {
      const token = import.meta.env.VITE_RD_STATION_PUBLIC_TOKEN;
      if (!token) {
        console.warn('VITE_RD_STATION_PUBLIC_TOKEN não está definido no .env');
        return;
      }

      // O RD Station OBRIGA a existência de um campo "email" para criar o lead.
      // Como não pedimos email no funil, geramos um email fictício baseado no telefone.
      const telefoneNumeros = data.phone.replace(/\D/g, '');
      const dummyEmail = `cliente.${telefoneNumeros}@chatbot.com`;

      const historicoPerguntas = data.questions.length > 0
        ? data.questions.join(" | ")
        : "Nenhuma pergunta feita.";

      const payload = {
        token_rdstation: token,
        identificador: "chatbot-bi2b-lead",
        email: dummyEmail,
        nome: data.name,
        telefone: data.phone,
        cf_cnpj_cpf: data.document,
        cf_historico_perguntas: historicoPerguntas,
        cf_consentimento_lgpd: data.consent ? "Sim" : "Não"
      };

      console.log('Enviando para RD Station...', payload);

      await fetch('https://www.rdstation.com.br/api/1.2/conversions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log('Lead enviado com sucesso ao RD Station!');
    } catch (error) {
      console.error('Erro ao enviar dados para o RD Station', error);
    }
  };

  const formatMessage = (content: string) => {
    // 1. Divide o texto pelos marcadores de negrito "**"
    const boldParts = content.split(/(\*\*.*?\*\*)/g);

    return boldParts.map((boldPart, boldIndex) => {
      const isBold = boldPart.startsWith('**') && boldPart.endsWith('**');
      const textToProcess = isBold ? boldPart.slice(2, -2) : boldPart;

      // 2. Regex para encontrar links em formato Markdown [texto](url) OU urls soltas
      // Grupo 1: texto do markdown, Grupo 2: url do markdown, Grupo 3: url solta
      const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s]+)/g;
      const parts = textToProcess.split(linkRegex);

      const parsedContent = [];
      for (let i = 0; i < parts.length; i++) {
        // Se for texto normal (fora dos grupos de captura do regex)
        if (parts[i]) {
          parsedContent.push(<span key={`${boldIndex}-${i}`}>{parts[i]}</span>);
        }

        // Verifica os grupos de captura associados a esse texto
        if (i + 1 < parts.length) {
          const mdText = parts[i + 1];
          const mdUrl = parts[i + 2];
          const bareUrl = parts[i + 3];

          if (mdText && mdUrl) {
            parsedContent.push(
              <a key={`md-${boldIndex}-${i}`} href={mdUrl} target="_blank" rel="noopener noreferrer" className="text-[#7ee7ff] font-semibold underline underline-offset-2 hover:text-white transition-colors break-all">
                {mdText}
              </a>
            );
          } else if (bareUrl) {
            let url = bareUrl;
            let suffix = '';
            const lastChar = url.slice(-1);
            // Se a URL capturou pontuação final indesejada, separa
            if (['.', ',', '!', '?', ')', ']'].includes(lastChar)) {
              suffix = lastChar;
              url = url.slice(0, -1);
            }
            parsedContent.push(
              <span key={`bare-${boldIndex}-${i}`}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#7ee7ff] font-semibold underline underline-offset-2 hover:text-white transition-colors break-all">
                  {url}
                </a>
                {suffix}
              </span>
            );
          }
          // Pula os 3 índices de grupos de captura que o split inseriu no array
          i += 3;
        }
      }

      // Se for um bloco em negrito, encapsula na tag strong
      if (isBold) {
        return <strong key={boldIndex} className="font-bold">{parsedContent}</strong>;
      }

      return <span key={boldIndex}>{parsedContent}</span>;
    });
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const targetScroll = container.scrollHeight - container.clientHeight;
      smoothScrollTo(container, targetScroll, 1000); // 1 segundo (1000ms) para um scroll bem leve
    }
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage && lastMessage.role === 'user') {
      // Quando o usuário envia, rola para baixo
      scrollToBottom();
    } else if (lastMessage && lastMessage.role === 'assistant') {
      // Quando a IA responde, calculamos se a resposta cabe na tela
      const container = messagesContainerRef.current;
      if (container) {
        const messageElements = container.querySelectorAll('.message-wrapper');
        const userElements = container.querySelectorAll('.message-wrapper[data-role="user"]');

        const lastUserElement = userElements[userElements.length - 1] as HTMLElement;
        const lastAssistantElement = messageElements[messageElements.length - 1] as HTMLElement;

        if (lastUserElement && lastAssistantElement) {
          const userHeight = lastUserElement.getBoundingClientRect().height;
          const assistantHeight = lastAssistantElement.getBoundingClientRect().height;
          const containerHeight = container.clientHeight;

          // Adicionamos 40px de margem de segurança
          if (userHeight + assistantHeight + 40 < containerHeight) {
            // Se cabe tudo na tela, rola até o fim
            scrollToBottom();
          } else {
            // Se for gigante (ou teclado aberto limitando a tela),
            // rola até a pergunta do usuário para que ele leia desde o início
            const targetTop = Math.max(0, lastUserElement.offsetTop - 20);
            smoothScrollTo(container, targetTop, 1000); // 1 segundo de transição suave
          }
        } else {
          // Se for a primeira mensagem ou uma das mensagens curtas do funil inicial, rola pra baixo
          scrollToBottom();
        }
      }
    }
  }, [messages, leadStep]);

  // Bloqueia o scroll do body no mobile quando o chat está aberto
  useEffect(() => {
    // Aplica o bloqueio apenas em telas móveis (sm)
    if (isOpen && window.innerWidth < 640) {
      const scrollY = window.scrollY;

      // Fixa o body exatamente na posição atual para não pular pro topo
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        // Restaura a posição de scroll instantaneamente
        window.scrollTo({ top: scrollY, behavior: 'instant' });
      };
    }
  }, [isOpen]);

  const chatRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Mantém o topo do chat fixo quando o teclado abre no iOS/Android
  useEffect(() => {
    if (!isOpen || window.innerWidth >= 640) return;

    const handleViewportChange = () => {
      if (chatRef.current && window.visualViewport) {
        // A altura do viewport real (encolhe com o teclado)
        chatRef.current.style.height = `${window.visualViewport.height}px`;

        // Se o navegador fizer pan na tela (iOS), usamos transform (GPU acelerado) 
        // ao invés de 'top' para evitar tremores (jitter)
        chatRef.current.style.transform = `translateY(${window.visualViewport.offsetTop}px)`;
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      window.visualViewport.addEventListener('scroll', handleViewportChange);
      handleViewportChange();
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
        window.visualViewport.removeEventListener('scroll', handleViewportChange);
      }
      if (chatRef.current) {
        chatRef.current.style.height = '';
        chatRef.current.style.transform = '';
      }
    };
  }, [isOpen]);

  // Bloqueio agressivo de touchmove para o iOS (evita que o fundo arraste com o teclado aberto)
  useEffect(() => {
    if (!isOpen || window.innerWidth >= 640) return;

    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const messageContainer = target.closest('.messages-container') as HTMLElement;

      // Se não estiver dentro da área de mensagens, bloqueio absoluto
      if (!messageContainer) {
        if (e.cancelable) e.preventDefault();
        return;
      }

      // Se for dentro da caixa de mensagens, precisamos garantir que não dê "bounce" no limite
      const touchY = e.touches[0].clientY;
      const deltaY = touchY - touchStartY;

      const isAtTop = messageContainer.scrollTop === 0;
      const isAtBottom = messageContainer.scrollTop + messageContainer.clientHeight >= messageContainer.scrollHeight - 1;

      // Se está no topo e tentando rolar pra cima (arrastando dedo pra baixo)
      if (isAtTop && deltaY > 0) {
        if (e.cancelable) e.preventDefault();
      }

      // Se está no fundo e tentando rolar pra baixo (arrastando dedo pra cima)
      if (isAtBottom && deltaY < 0) {
        if (e.cancelable) e.preventDefault();
      }
    };

    // { passive: false } é obrigatório para o preventDefault() funcionar no touchmove
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        chatRef.current &&
        !chatRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeChat();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, leadStep, showCloseConfirm]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!input.trim() && leadStep !== 3) || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // --- LÓGICA DO FUNIL DE LEADS ---
    if (leadStep === 0) {
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
      setLeadData(prev => ({ ...prev, name: userMessage }));
      setLeadStep(1);
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: `Prazer em conhecer, **${userMessage.split(' ')[0]}**! Qual é o seu **telefone para contato**? ` }]);
      }, 500);
      return;
    }

    if (leadStep === 1) {
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
      setLeadData(prev => ({ ...prev, phone: userMessage }));
      setLeadStep(2);
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: `Obrigado! Agora, por favor, informe seu **CNPJ** (ou CPF, caso não possua empresa):` }]);
      }, 500);
      return;
    }

    if (leadStep === 2) {
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
      setLeadData(prev => ({ ...prev, document: userMessage }));
      setLeadStep(3);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Por último, a Bi2B Consultoria está comprometida em proteger e respeitar sua privacidade. Você concorda em receber nossas comunicações e que seus dados sejam utilizados para fins de marketing e otimização de preferências do cliente?`
        }]);
      }, 500);
      return;
    }

    // --- LÓGICA DE CHAT NORMAL ---
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);

    // Acumula as perguntas no histórico
    setLeadData(prev => ({ ...prev, questions: [...prev.questions, userMessage] }));

    setIsLoading(true);

    try {
      const response = await fetch('/api/ia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...newMessages.map(m => ({ role: m.role, content: m.content }))
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Falha na resposta da API');
      }

      const data = await response.json();
      let assistantText = data.text || 'Desculpe, não consegui obter uma resposta.';

      // Remove a propaganda de fim de resposta da API gratuita
      const adIdentifier = "Support Pollinations.AI";
      if (assistantText.includes(adIdentifier)) {
        assistantText = assistantText.split(adIdentifier)[0];
      }

      // Limpa rastros da propaganda ou formatações mortas no final (traços, asteriscos soltos e quebras de linha extras)
      assistantText = assistantText.replace(/[\s\-\*]+$/, '');

      setMessages(prev => [...prev, { role: 'assistant', content: assistantText.trim() }]);

    } catch (error) {
      console.error('Erro no chatbot:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Desculpe, ocorreu um erro na comunicação. Por favor, entre em contato via WhatsApp: https://wa.me/556392812239' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Container Flutuante para Tooltip e Botão (Posicionado ao lado do WhatsApp) */}
      <div className="floating-button fixed bottom-6 right-6 z-[9999] flex items-center gap-3">

        {/* Tooltip Chamativo */}
        {!isOpen && (
          <div className="relative flex items-center animate-bounce cursor-pointer" onClick={toggleChat}>
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
        <div ref={chatRef} className="fixed top-0 left-0 right-0 z-[10000] w-full h-[100dvh] flex flex-col bg-[#05070b] sm:bg-[#061826] sm:top-auto sm:left-auto sm:bottom-24 sm:right-6 sm:w-[380px] sm:h-[500px] sm:max-h-[70vh] sm:rounded-2xl sm:border sm:border-white/10 sm:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden overscroll-none touch-none sm:touch-auto sm:backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-bottom-5">
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
          <div ref={messagesContainerRef} className="messages-container flex-1 overflow-y-auto overflow-x-hidden overscroll-contain touch-pan-y p-4 space-y-4 bg-gradient-to-b from-transparent to-black/20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                data-role={msg.role}
                className={`message-wrapper flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div className={`flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full ${msg.role === 'user' ? 'bg-[#7ee7ff]/20 text-[#7ee7ff]' : 'bg-[#0d6084] text-white'
                  }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`rounded-2xl p-3 text-sm leading-relaxed shadow-sm whitespace-pre-wrap break-words text-left ${msg.role === 'user'
                  ? 'bg-[#0d6084] text-white rounded-tr-sm'
                  : 'bg-white/5 text-gray-200 border border-white/10 rounded-tl-sm'
                  }`}>
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
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
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
                  setLeadData(prev => ({ ...prev, consent: true }));
                  setMessages(prev => [
                    ...prev,
                    { role: 'user', content: 'Sim, eu concordo.' },
                    { role: 'assistant', content: 'Ótimo! Consentimento registrado. Sou o assistente de Inteligência Artificial da Bi2B. Como posso ajudar o seu negócio hoje?' }
                  ]);
                  setLeadStep(4);
                }}
                className="w-full bg-[#0d6084] hover:bg-[#0a4a62] text-white py-3 rounded-xl font-medium transition-colors"
              >
                Sim, eu concordo
              </button>
              <button
                onClick={() => {
                  setMessages(prev => [
                    ...prev,
                    { role: 'user', content: 'Não concordo.' },
                    { role: 'assistant', content: 'Compreendemos. Infelizmente não será possível prosseguir com o atendimento pelo Chatbot sem o seu consentimento. Agradecemos o contato!' }
                  ]);
                  setLeadStep(-1);
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
            <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-[#061826]">
              <div className="relative flex items-end">
                {(leadStep === 1 || leadStep === 2) ? (
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={input}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (leadStep === 1) {
                        val = maskPhone(val);
                      } else if (leadStep === 2) {
                        val = maskDocument(val);
                      }
                      setInput(val);
                    }}
                    placeholder={leadStep === 1 ? "Digite seu número..." : "Digite seu CPF/CNPJ..."}
                    disabled={isLoading}
                    className="w-full bg-white/5 border border-white/10 rounded-full pl-6 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#0d6084] transition-colors text-[16px]"
                  />
                ) : (
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (input.trim() && !isLoading) {
                          handleSubmit(e as unknown as React.FormEvent);
                        }
                      }
                    }}
                    placeholder={leadStep === 0 ? "Digite seu nome..." : "Digite sua dúvida..."}
                    disabled={isLoading}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#0d6084] transition-colors text-[16px] resize-none overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    style={{ minHeight: '48px', maxHeight: '120px' }}
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
                <h3 className="text-xl font-bold text-white mb-2">Encerrar atendimento?</h3>
                <p className="text-sm text-gray-300 mb-6">Ao encerrar, seu histórico de dúvidas será salvo e um especialista poderá entrar em contato.</p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      // Envia os dados para o RD Station
                      sendToRDStation(leadData);

                      // Reseta o estado para a próxima vez que abrir
                      setLeadStep(0);
                      setLeadData({ name: '', phone: '', document: '', consent: false, questions: [] });
                      setMessages([{ role: 'assistant', content: 'Olá! Para começarmos o atendimento, por favor, digite seu **nome completo**:' }]);
                      setShowCloseConfirm(false);

                      if (window.innerWidth < 640 && location.pathname === '/chatbot') {
                        navigate(-1);
                      } else {
                        setIsOpen(false);
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
  );
}
