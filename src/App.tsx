import { useEffect } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom"
import Header from "./components/Header"
import Hero from "./components/Hero"
import About from "./components/About"
import Services from "./components/Services"
import Portfolio from "./components/Dashboard"
import Footer from "./components/Footer.tsx"
import RDContact from "./components/RDContact"
import Obrigado from "./components/Obrigado"
import Campanha from "./components/Campanha"
import Faturamento from "./components/Faturamento"
import Performance from "./components/Performance"
import Estrategia from "./components/Estrategia"
import NotFound from "./components/NotFound"
import WhatsAppFloatingButton from "./components/WhatsAppFloatingButton"
import { ReportProvider } from "./contexts/ReportContext"

function Home() {
  const location = useLocation()

  useEffect(() => {
    if (location.state?.scrollToTop) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" })
    }
  }, [location.state])

  return (
    <>
      <Header />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <RDContact />
      <Footer />
    </>
  )
}

function AppRoutes() {
  const location = useLocation()
  const state = location.state as { backgroundLocation?: Location } | null
  const backgroundLocation = state?.backgroundLocation || location

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-[-8rem] h-96 w-96 rounded-full bg-[#0d6084]/20 blur-3xl" />
        <div className="absolute top-1/4 right-[-7rem] h-96 w-96 rounded-full bg-[#FF0000]/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>
      <Routes location={backgroundLocation}>
        <Route path="/" element={<Home />} />
        <Route path="/obrigado" element={<Obrigado />} />
        <Route path="/faturamento" element={<Faturamento />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/estrategia" element={<Estrategia />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <WhatsAppFloatingButton />
    </div>
  )
}

function App() {
  const isCampanhaSubdomain =
    window.location.hostname.startsWith("abrirminhaempresa.")

  if (isCampanhaSubdomain) {
    return (
      <ReportProvider>
        <Router>
          <div className="relative min-h-screen overflow-x-hidden bg-transparent text-white">
            <Routes>
              <Route path="*" element={<Campanha />} />
            </Routes>
            <WhatsAppFloatingButton />
          </div>
        </Router>
      </ReportProvider>
    )
  }

  return (
    <ReportProvider>
      <Router>
        <AppRoutes />
      </Router>
    </ReportProvider>
  )
}

export default App
