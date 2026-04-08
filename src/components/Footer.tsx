import { FaWhatsapp } from 'react-icons/fa';  
import { Linkedin, Instagram, Mail, MapPin } from 'lucide-react';
import logoMain from '../assets/img/logo.png';

export default function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-black py-12 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          <div>
            <div className="text-3xl font-bold tracking-wider mb-4">
              <img 
              src={logoMain} 
              alt="Logo Bi2b" 
              className="h-12 w-auto"/>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin size={20} className="text-gray-400 mb-2" />
              <p className="text-gray-400">
              Palmas-TO
              </p>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 Bi2B | Consultoria em Negócios. Todos os direitos reservados.
            </p>
            <p className="text-gray-400 text-sm">
              CNPJ: 63.172.986/0001-05
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4 uppercase tracking-wider">
              Links Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection('sobre')}
                  className="text-gray-400 hover:text-[#FF0000] transition-colors duration-300"
                >
                  Sobre Nós
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('servicos')}
                  className="text-gray-400 hover:text-[#FF0000] transition-colors duration-300"
                >
                  Serviços
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contato')}
                  className="text-gray-400 hover:text-[#FF0000] transition-colors duration-300"
                >
                  Contato
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4 uppercase tracking-wider">
              Siga-nos
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/company/bi2b-consultoria/?viewAsMember=true"
                target='_blank'
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#FF0000] transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://www.instagram.com/bi2bconsultoria?igsh=bmlodHR1dGsydGZr"
                target='_blank'
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#FF0000] transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://wa.me/+556392812239"
                target='_blank'
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#FF0000] transition-colors duration-300"
                aria-label="Whatsapp"
              >
                <FaWhatsapp size={24} />
              </a>

              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=caio.baldassaune@bi2bconsultoria.com.br"
                target='_blank'
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#FF0000] transition-colors duration-300"
                aria-label="Gmail"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
