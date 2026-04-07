const navLinks = [
  { href: '#about', label: '关于我们' },
  { href: '#services', label: '业务范围' },
  { href: '#philosophy', label: '核心理念' },
  { href: '#info', label: '公司信息' },
]

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-glow" />
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <img src="/logo.svg" alt="莱博塔传媒" className="footer-logo" />
            <p className="footer-tagline">以国际之技，述中华之魂</p>
            <p className="footer-desc">推动中国科幻动画走向世界舞台</p>
          </div>

          <div className="footer-links-col">
            <h4>快速导航</h4>
            {navLinks.map(l => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </div>

          <div className="footer-contact-col">
            <h4>联系我们</h4>
            <p>📍 北京市朝阳区</p>
            <p>🏢 北京莱博塔传媒科技有限公司</p>
            <div className="footer-badges">
              <span className="badge">动画制作</span>
              <span className="badge">科技研发</span>
              <span className="badge">数字内容</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 北京莱博塔传媒科技有限公司 版权所有</p>
          <p className="footer-icp">京ICP备XXXXXXXX号</p>
        </div>
      </div>
    </footer>
  )
}
