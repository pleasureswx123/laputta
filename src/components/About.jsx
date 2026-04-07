import img1 from '../assets/img_1.avif'

const cards = [
  { icon: '⬡', text: '完整研发团队', cls: 'card-1' },
  { icon: '◈', text: '国际水准技术', cls: 'card-2' },
  { icon: '✦', text: '中国文化表达', cls: 'card-3' },
  { icon: '⬟', text: '全流程制作能力', cls: 'card-4' },
]

export default function About() {
  return (
    <section className="about section" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-text-col">
            <div className="section-label reveal">ABOUT US · 关于我们</div>
            <h2 className="section-title reveal delay-1">
              国内最具<br />
              <span className="gold">执行力与创新力</span><br />
              的动画全流程团队
            </h2>
            <p className="body-text reveal delay-2">
              北京莱博塔传媒科技有限公司由一支强劲的从动画内容开发、导演、制片到制作主创班底组建而成。拥有完整的专业研发团队，积累了丰沛的项目经验。
            </p>
            <p className="body-text reveal delay-2">
              我们基于利用国际水准的技术，呈现中国文化的理念。将团队的卓越融入我们优秀的内容，并借助前沿科技的力量将其转化为叹为观止的画面。
            </p>
            <p className="body-text reveal delay-2">
              作为行业的领导者，我们将在故事讲述方式和技术实现上不断探索创新，为推动中国科幻作品走向世界舞台注入无尽的能量。
            </p>
          </div>

          {/* img_1 (1024×576, 16:9) — 替换抽象卡片堆，特性卡作为玻璃遮层叠在图上 */}
          <div className="about-visual-col reveal delay-2">
            <div className="about-image-frame">
              <img
                src={img1}
                alt="莱博塔传媒制作现场"
                className="about-img"
                loading="lazy"
              />
              <div className="about-img-overlay" />
              {cards.map(c => (
                <div key={c.text} className={`about-card ${c.cls}`}>
                  <div className="about-card-icon">{c.icon}</div>
                  <div className="about-card-text">{c.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

