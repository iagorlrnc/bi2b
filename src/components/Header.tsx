import { useState, useEffect } from 'react';
import logoMain from '../assets/img/logo.png';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isProgrammaticScroll) {
        return;
      }
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isProgrammaticScroll]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      setIsProgrammaticScroll(true);
      setMenuOpen(false);
      const targetIsScrolled = (id !== 'home');
      setIsScrolled(targetIsScrolled);
      element.scrollIntoView(); 
      setTimeout(() => {
        setIsProgrammaticScroll(false);
      }, 1000); 
    }
  };

  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'sobre', label: 'Sobre Nós' },
    { id: 'servicos', label: 'Serviços' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'contato', label: 'Contato' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || menuOpen
          ? 'bg-black/60 backdrop-blur-md shadow-lg' 
          : 'bg-transparent md:bg-transparent' 
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between box-border">
        <div className="flex items-center z-[60]">
          <img
            src={logoMain}
            alt="Logo Bi2B"
            className="h-10 md:h-12 w-auto max-w-full"
          />
        </div>

        <button
          className="md:hidden text-white focus:outline-none z-[60]" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {/* Ícone SVG Hambuguer */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Navegação Desktop */}
        <nav className="hidden md:flex md:items-center md:space-x-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-white hover:text-[#FF0000] transition-colors duration-300 font-medium"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overlay (fundo escuro) */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Navegação Mobile (Menu Dropdown do Topo) */}
      <nav
        className={`
          relative z-50 {/* <-- ADICIONADAS CLASSES 'relative' E 'z-50' */}
          md:hidden
          bg-black shadow-xl
          transition-all duration-300 ease-in-out
          ${menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}
        `}
      >
        <div className="flex flex-col items-center space-y-6 py-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-white hover:text-[#FF0000] text-lg py-2 transition-colors duration-300 font-medium"
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}