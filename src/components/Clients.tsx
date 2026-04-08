import ClienteUm from '../assets/img/nikelogo.png';
import ClienteDois from '../assets/img/paralanches.png';
import ClienteTres from '../assets/img/jplanches.jpg';
import ClienteQuatro from '../assets/img/cocacola.png';
import ClienteCinco from '../assets/img/byddd.png';
import ClienteSeis from '../assets/img/xiqxiq.png';

// --- LISTA DE CLIENTES ---
const clientLogos = [
  {
    name: "Cliente 1",
    src: ClienteUm
  },
  {
    name: "Cliente 2",
    src: ClienteDois
  },
  {
    name: "Cliente 3",
    src: ClienteTres
  },
  {
    name: "Cliente 4",
    src: ClienteQuatro
  },
  {
    name: "Cliente 5",
    src: ClienteCinco
  },
  {
    name: "Cliente 6",
    src: ClienteSeis
  },
];


  export default function Clients() {
    return (
      <section 
        id="clientes"
        className="py-20 bg-[radial-gradient(ellipse_at_center,_#0d6084_0%,_black_70%)]"
      >
        <div className="container mx-auto px-6">
          
          <div className="mb-16 text-center">
            <h2 className="text-5xl md:text-5xl font-bold text-white mb-4 uppercase tracking-wider">
              Empresas que Confiam em Nós
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Alguns dos nossos parceiros e clientes que impulsionamos com dados e gestão inteligente.
            </p>
          </div>

          {/* --- GRADE DE LOGOS --- */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12 items-center">
            
            {clientLogos.map((client, index) => (
              <div 
                key={index}
                className="flex justify-center items-center"
              >
                
                <img
                  src={client.src}
                  alt={client.name}
                  className="h-12 md:h-16 w-auto object-contain transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }  
  