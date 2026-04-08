import { useEffect } from 'react';

declare global {
  interface Window {
    RDStationForms: any;
  }
}

const ContactFormRD = () => {
  useEffect(() => {
    const scriptId = 'rdstation-forms-script';
    const formId = 'formulario-site-bi2b-0eaf6e225952b1af5d6b';

    const createForm = () => {
      const container = document.getElementById(formId);
      if (window.RDStationForms && container) {
        // LIMPEZA: Remove qualquer conteúdo pré-existente para evitar duplicidade
        container.innerHTML = ''; 
        new window.RDStationForms(formId, 'null').createForm();
      }
    };

    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://d335luupugsy2.cloudfront.net/js/rdstation-forms/stable/rdstation-forms.min.js';
      script.type = 'text/javascript';
      script.async = true;
      script.onload = createForm;
      document.body.appendChild(script);
    } else {
      createForm();
    }
  }, []);

  return (
    <section id="contato" className="py-20 px-4 bg-black relative">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 text-white uppercase tracking-wider w-full">
          Contato
        </h2>
        
        {/* O container do formulário */}
        <div
          role="main"
          id="formulario-site-bi2b-0eaf6e225952b1af5d6b"
        ></div>
      </div>

      {/* Botão Flutuante WhatsApp - Posicionado de forma fixa */}
      <a
        href="https://wa.me/556392812239" 
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[9999] flex items-center justify-center w-14 h-14 bg-[#0d6084] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:brightness-125 active:scale-95"
        aria-label="Contato via WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.06 3.973l-1.125 4.105 4.204-1.102a7.923 7.923 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
      </a>
    </section>
  );
};

export default ContactFormRD;