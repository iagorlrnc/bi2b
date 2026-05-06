import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const SYSTEM_PROMPT = `Você é o assistente virtual da Bi2B - Soluções Contábeis, Tributárias e de Consultoria.
Você deve responder as dúvidas dos usuários EXCLUSIVAMENTE com base no contexto abaixo. Se a pergunta for sobre um assunto fora do contexto, ou você não souber a resposta, informe que não tem a informação e oriente o usuário a chamar um especialista no WhatsApp: https://wa.me/556392812239.

CONTEXTO DA BI2B (SITE PRINCIPAL):
A Bi2B transforma dados em decisões estratégicas. Entregamos soluções com clareza visual, eficiência operacional e crescimento. 
Pilares: Excelência, Comprometimento e Resultado.
Links Úteis: 
- WhatsApp: https://wa.me/556392812239
- Portal do Cliente: https://share.google/ZDrIBH8t9kXoMq5nJ

SERVIÇOS OFERECIDOS:
1. Análise de Dados e KPIs: Gestão guiada por fatos.
2. Consultoria Empresarial: Otimização de gestão e crescimento.
3. Planejamento Tributário: Redução lícita da carga tributária.
4. Assessoria Mensal (Contábil, Fiscal, Pessoal): Cuidamos de toda a rotina para manter a empresa em conformidade legal.
5. Recuperação Tributária: Resgate de créditos tributários dos últimos 5 anos (injeção de caixa segura).
6. Registro de Marcas (INPI): Proteção jurídica e exclusividade.

ABERTURA DE EMPRESA:
Ajudamos autônomos e pessoas físicas a abrirem CNPJ pagando menos impostos.
- Sinais para abrir empresa: Pagar muito IRPF/INSS na Pessoa Física, precisar emitir nota fiscal ou buscar contratos corporativos.
- Diferencial Bi2B: Não colocamos o cliente automaticamente no Simples Nacional. Fazemos análise tributária individual para garantir economia real desde o início.
- Processo sem burocracia: Cuidamos de obter o CNPJ, Inscrição Municipal, Alvará e enquadramento ideal.
- Oferecemos um E-book gratuito sobre o tema para quem preencher o formulário na página "Abrir minha empresa".

REGRAS DE RESPOSTA (OBRIGATÓRIO):
- Não invente dados de fora.
- Faça as respostas simples e direto ao ponto.
- Responda sempre em Português.
- Não utilize jargões técnicos.
- Não faça respostas longas e detalhadas.
- Seja objetivo.
- Não utilize frases como "Estou feliz em ajudar", "Espero ter ajudado" ou "Estou aqui para ajudar".
- Escreva suas respostas com a formatação adequada para justificar o texto.
- Quando houver tópicos, SEMPRE faça quebra de linhas (pule uma linha) para separar cada item.`;

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
    if (window.innerWidth < 640) {
      if (!isOpen) {
        navigate('/chatbot', { state: { backgroundLocation: location } });
      } else {
        navigate(-1);
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  const closeChat = () => {
    if (window.innerWidth < 640 && location.pathname === '/chatbot') {
      navigate(-1);
    } else {
      setIsOpen(false);
    }
  };
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant' | 'system', content: string }[]>([
    { role: 'assistant', content: 'Olá! Sou o assistente virtual da Bi2B. Como posso ajudar você hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        
        // Se o navegador fizer pan na tela (iOS), o offsetTop diz quanto ele empurrou
        // Ao aplicar isso no top, ancoramos a janela perfeitamente
        chatRef.current.style.top = `${window.visualViewport.offsetTop}px`;
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
        chatRef.current.style.top = '';
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
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
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
      const assistantText = data.text || 'Desculpe, não consegui obter uma resposta.';

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
      <div className="floating-button fixed bottom-6 right-28 z-[9999] flex items-center gap-3">

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
        <div ref={chatRef} className="fixed top-0 left-0 right-0 z-[10000] w-full h-[100dvh] flex flex-col bg-[#05070b] sm:bg-[#061826] sm:top-auto sm:left-auto sm:bottom-24 sm:right-28 sm:w-[380px] sm:h-[500px] sm:max-h-[70vh] sm:rounded-2xl sm:border sm:border-white/10 sm:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden overscroll-none touch-none sm:touch-auto sm:backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-bottom-5">
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
          <div className="messages-container flex-1 overflow-y-auto overflow-x-hidden overscroll-contain touch-pan-y p-4 space-y-4 bg-gradient-to-b from-transparent to-black/20">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
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

          {/* Área de Input */}
          <form onSubmit={handleSubmit} className="border-t border-white/10 bg-white/5 p-3">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua dúvida..."
                // text-[16px] é obrigatório no mobile para evitar que o iOS dê zoom automático ao focar no input
                className="w-full rounded-full border border-white/10 bg-black/40 py-3 pl-4 pr-12 text-[16px] sm:text-sm text-white placeholder-gray-500 focus:border-[#7ee7ff]/50 focus:outline-none focus:ring-1 focus:ring-[#7ee7ff]/50 disabled:opacity-50 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#0d6084] text-white transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send size={16} className="mr-0.5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
