import img2 from '../assets/img_2.avif'

const services = [
  { num: '01', icon: '🎬', title: '动画内容制作', desc: '动画内容开发、导演、制片到制作的完整流程，覆盖从概念到成片的全链条服务。' },
  { num: '02', icon: '💻', title: '技术开发与服务', desc: '软件开发、数字内容制作及技术服务，利用前沿科技赋能创意内容。' },
  { num: '03', icon: '🎭', title: '影视摄制发行', desc: '持有电影发行许可，提供影视摄制、制作到发行的一站式解决方案。' },
  { num: '04', icon: '📡', title: '网络文化经营', desc: '持有增值电信业务及网络文化经营许可，深耕数字文化内容生态。' },
  { num: '05', icon: '🎨', title: '广告设计与发布', desc: '广告设计与发布服务，为品牌提供具有创意深度和视觉冲击力的传播解决方案。' },
  { num: '06', icon: '🌐', title: '文化活动组织', desc: '文化活动策划与组织，连接创意内容与受众，打造沉浸式文化体验。' },
]

const DELAYS = ['delay-1', 'delay-2', 'delay-3', 'delay-4', 'delay-1', 'delay-2']

export default function Services() {
  return (
    <section className="services section" id="services">
      <div className="container">
        <div className="section-header">
          <div className="section-label reveal">SERVICES · 业务范围</div>
          <h2 className="section-title reveal delay-1">
            多元业务<span className="gold">全面布局</span>
          </h2>
        </div>
        {/* img_2 (724×1024, 竖屏) — 裁切为横向展示条，放在 header 和业务网格之间 */}
        <div className="services-banner reveal delay-2">
          <img
            src={img2}
            alt="项目展示"
            className="services-banner-img"
            loading="lazy"
          />
          <div className="services-banner-overlay">
            <span className="services-banner-tag">FEATURED WORK</span>
            <p className="services-banner-caption">从概念到成片，全链条专业服务</p>
          </div>
        </div>

        <div className="services-grid">
          {services.map((s, i) => (
            <div key={s.num} className={`service-card reveal ${DELAYS[i]}`}>
              <div className="service-number">{s.num}</div>
              <div className="service-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
