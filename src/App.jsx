import { useScrollReveal } from './hooks/useScrollReveal'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Philosophy from './components/Philosophy'
import CompanyInfo from './components/CompanyInfo'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'

function App() {
  useScrollReveal()

  return (
    <>
      <ScrollProgress />
      <Nav />
      <Hero />
      <About />
      <Services />
      <Philosophy />
      <CompanyInfo />
      <Footer />
    </>
  )
}

export default App
