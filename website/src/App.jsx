import { useState } from 'react'
import './App.css'

const NAV_LINKS = ['Inicio', 'Servicios', 'Proyectos', 'Sobre nosotros', 'Contacto']

const SERVICES = [
  { icon: '📍', title: 'Levantamiento Topográfico', desc: 'Medición y representación precisa del terreno para proyectos de ingeniería y construcción.' },
  { icon: '🏗️', title: 'Replanteo de Obra', desc: 'Trazado en campo de los elementos definidos en el proyecto para una ejecución exacta.' },
  { icon: '🛰️', title: 'Topografía con Dron', desc: 'Captura aérea de alta resolución para grandes superficies con precisión centimétrica.' },
  { icon: '💻', title: 'Procesamiento de Datos', desc: 'Generación de modelos digitales del terreno, nubes de puntos y cartografía técnica.' },
  { icon: '📐', title: 'Control Geométrico', desc: 'Verificación de estructuras y seguimiento de deformaciones en obras civiles.' },
  { icon: '🗺️', title: 'Cartografía y SIG', desc: 'Elaboración de planos, mapas y sistemas de información geográfica a medida.' },
]

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="page">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-inner">
          <a href="#" className="nav-logo">
            <span className="logo-abbr">GST</span>
            <span className="logo-full">Gestión de Sistemas Topográficos</span>
          </a>

          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {NAV_LINKS.map(link => (
              <li key={link}><a href="#" onClick={() => setMenuOpen(false)}>{link}</a></li>
            ))}
            <li><a href="#" className="nav-cta" onClick={() => setMenuOpen(false)}>Solicitar cita</a></li>
          </ul>

          <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menú">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-tag">Precisión al servicio de tu proyecto</p>
          <h1>Gestión de Sistemas<br />Topográficos</h1>
          <p className="hero-sub">
            Soluciones topográficas profesionales para ingeniería, construcción y urbanismo.
            Rigor técnico, tecnología de vanguardia y compromiso con cada proyecto.
          </p>
          <div className="hero-actions">
            <a href="#" className="btn-primary">Nuestros servicios</a>
            <a href="#" className="btn-secondary">Contactar</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-grid">
            <div className="grid-dot" /><div className="grid-dot" /><div className="grid-dot" />
            <div className="grid-dot" /><div className="grid-dot accent" /><div className="grid-dot" />
            <div className="grid-dot" /><div className="grid-dot" /><div className="grid-dot" />
          </div>
          <div className="hero-badge">
            <span className="badge-icon">📐</span>
            <span>+15 años de experiencia</span>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services">
        <div className="section-inner">
          <p className="section-tag">Lo que hacemos</p>
          <h2>Nuestros Servicios</h2>
          <p className="section-sub">Ofrecemos soluciones completas en topografía y gestión de datos geoespaciales.</p>
          <div className="services-grid">
            {SERVICES.map(s => (
              <div key={s.title} className="service-card">
                <span className="service-icon">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="section-inner cta-inner">
          <h2>¿Tienes un proyecto en mente?</h2>
          <p>Cuéntanos tus necesidades y te preparamos una propuesta sin compromiso.</p>
          <a href="#" className="btn-primary">Solicitar presupuesto</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <span className="logo-abbr small">GST</span>
          <p>© 2025 GST Gestión de Sistemas Topográficos. Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  )
}
