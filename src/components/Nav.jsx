import { useState, useEffect } from 'react'

const links = [
  { href: '#about', label: '关于我们' },
  { href: '#services', label: '业务范围' },
  { href: '#philosophy', label: '核心理念' },
  { href: '#info', label: '公司信息' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const close = () => setMobileOpen(false)

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <a href="#" className="nav-logo">
            <img src="/logo.svg" alt="莱博塔传媒" className="nav-logo-img" />
          </a>
          <ul className="nav-links">
            {links.map(l => (
              <li key={l.href}><a href={l.href}>{l.label}</a></li>
            ))}
            <li><a href="#contact" className="nav-cta">联系我们</a></li>
          </ul>
          <button
            className="nav-hamburger"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="菜单"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
        <ul>
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} onClick={close}>{l.label}</a>
            </li>
          ))}
          <li><a href="#contact" onClick={close}>联系我们</a></li>
        </ul>
      </div>
    </>
  )
}
