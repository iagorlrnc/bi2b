import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Dashboard';
import Footer from './components/Footer';
import RDContact from './components/RDContact';
import Obrigado from './components/Obrigado'; // Certifique-se de que o arquivo existe neste caminho

// Criamos um componente para a Home para organizar melhor
const Home = () => (
  <>
    <Header />
    <Hero />
    <About />
    <Services />
    <Portfolio />
    <RDContact />
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/obrigado" element={<Obrigado />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;