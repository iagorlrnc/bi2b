import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const SYSTEM_PROMPT = `Você é o assistente virtual da Bi2B - Soluções Contábeis, Tributárias, de Consultoria.
Você deve responder as dúvidas dos usuários EXCLUSIVAMENTE com base no conteúdo do site da Bi2B.
Se o usuário perguntar algo que não está no contexto abaixo ou que você não saiba responder, informe gentilmente que você não tem essa informação e oriente o usuário a entrar em contato com um especialista via WhatsApp através deste link: https://wa.me/556392812239. Não invente dados de fora. Faça as respostas simples e direto ao ponto. Responda sempre em Português. Não utilize jargões técnicos. Não faça respostas longas e detalhadas. Seja objetivo. Não utilize frases como "Estou feliz em ajudar", “Espero ter ajudado” ou “Estou aqui para ajudar”. 

Contexto da Bi2B:
A Bi2B é especialista em transformar dados em decisões estratégicas. Com experiência em consultoria empresarial, entrega soluções que combinam clareza visual, eficiência operacional e crescimento. Seus pilares são: Excelência, Comprometimento e Resultado.
Serviços oferecidos:
1. Análise de Dados, KPI e Indicadores: Análise de dados e gestão de KPIs para guiar estratégia. Suas decisões baseadas em fatos.
2. Consultoria Empresarial: Soluções estratégicas para otimizar sua gestão e impulsionar o crescimento.
3. Planejamento Tributário: Reestruturação do modelo de negócio visando redução da carga tributária.
4. Assessoria Mensal Contábil, Fiscal e Pessoal: Mantenha sua empresa em conformidade. Cuidamos de toda a rotina contábil, fiscal e pessoal.
5. Recuperação Tributária: Recupere créditos tributários dos últimos 5 anos. Uma injeção de caixa segura para sua empresa.
6. Registro de Marcas no INPI: Proteja sua identidade e garanta exclusividade da marca. Segurança jurídica.

O site também tem opções para "Abrir minha empresa" e "Falar com especialista" (via WhatsApp).`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant' | 'system', content: string }[]>([
    { role: 'assistant', content: 'Olá! Sou o assistente virtual da Bi2B. Como posso ajudar você hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      <div className="fixed bottom-6 right-28 z-[9999] flex items-center gap-3">
        
        {/* Tooltip Chamativo */}
        {!isOpen && (
          <div className="relative flex items-center animate-bounce cursor-pointer" onClick={() => setIsOpen(true)}>
            <div className="bg-[#0d6084] text-[#7ee7ff] text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-[0_10px_25px_rgba(13,96,132,0.3)] border border-[#7ee7ff]/20 whitespace-nowrap">
              Tire suas dúvidas!
            </div>
            {/* Triângulo (Seta apontando para o botão) */}
            <div className="w-0 h-0 border-y-[8px] border-y-transparent border-l-[10px] border-l-[#0d6084]"></div>
          </div>
        )}

        {/* Botão */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-[#0d6084] to-[#0a4a62] text-white shadow-[0_14px_40px_rgba(13,96,132,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(13,96,132,0.38)]"
          aria-label="Abrir chat"
        >
          {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        </button>
      </div>

      {/* Janela de Chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 sm:right-28 z-[9999] w-[90vw] sm:w-[380px] h-[500px] max-h-[70vh] flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#061826] shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-bottom-5">
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
              onClick={() => setIsOpen(false)}
              className="ml-auto text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Área de Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-black/20">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div className={`flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full ${msg.role === 'user' ? 'bg-[#7ee7ff]/20 text-[#7ee7ff]' : 'bg-[#0d6084] text-white'
                  }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                    ? 'bg-[#0d6084] text-white rounded-tr-sm'
                    : 'bg-white/5 text-gray-200 border border-white/10 rounded-tl-sm'
                  }`}>
                  {msg.content}
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
                disabled={isLoading}
                className="w-full rounded-full border border-white/10 bg-black/40 py-3 pl-4 pr-12 text-sm text-white placeholder-gray-500 focus:border-[#7ee7ff]/50 focus:outline-none focus:ring-1 focus:ring-[#7ee7ff]/50 disabled:opacity-50 transition-all"
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
