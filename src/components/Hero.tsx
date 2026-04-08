export default function Hero() {
  const scrollToServices = () => {
    const element = document.getElementById('servicos');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[#0d6084]">
        <div 
          className="absolute inset-0 bg-[url('/src/assets/img/heroimg.jpg')] bg-cover bg-center bg-no-repeat opacity-70 mix-blend-multiply"
        ></div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d6084]/50 via-transparent to-black/80"></div>
      </div>
      <div className="relative z-10 mx-auto px-6 text-center animate-fade-in max-w-5xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
          Bi2B: <span className=" font-extrabold text-[#FF0000]">Inteligência</span> para sua Gestão
        </h1>
        <p className="text-xl md:text-2xl text-gray-100 mb-12 max-w-3xl mx-auto font-medium">
          Soluções completas em consultoria, dados e gestão contábil que transformam seu negócio.
        </p>
        <button
          onClick={scrollToServices}
          className="bg-[#FF0000] text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-red-700 transition-all duration-300 transform hover:scale-105 uppercase tracking-widest shadow-lg shadow-black/20"
        >
          Conheça nossas soluções
        </button>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/60 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}