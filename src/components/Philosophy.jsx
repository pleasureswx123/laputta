import { useRef } from 'react'
import { useStarCanvas } from '../hooks/useStarCanvas'
import img3 from '../assets/img_3.avif'

const pillars = [
  { title: '技术卓越', desc: '运用国际水准的制作技术，将每一帧画面打磨至极致，以视觉语言突破表达边界。' },
  { title: '文化根植', desc: '深植于中国文化的沃土，以当代视角重新诠释东方叙事，让古老智慧焕发现代光彩。' },
  { title: '持续创新', desc: '在故事讲述与技术实现上不断探索突破，以创新驱动内容进化，引领行业前沿。' },
  { title: '全球视野', desc: '以全球化眼光构建本土内容，推动中国科幻与动画作品走向世界舞台，讲述中国故事。' },
]

const DELAYS = ['delay-1', 'delay-2', 'delay-3', 'delay-4']

export default function Philosophy() {
  const canvasRef = useRef(null)
  useStarCanvas(canvasRef, 120, 0.08)

  return (
    <section className="philosophy section" id="philosophy">
      <canvas ref={canvasRef} className="star-canvas" />
      <div className="container">
        <div className="section-label reveal">PHILOSOPHY · 核心理念</div>
        <h2 className="section-title centered reveal delay-1">
          我们相信<span className="gold">伟大的故事</span><br />能够超越边界
        </h2>

        {/* img_3 (547×1024, 高竖屏) — 两列布局：左边内容，右边粘性高图 */}
        <div className="philosophy-body">
          <div className="philosophy-left">
            <div className="philosophy-pillars">
              {pillars.map((p, i) => (
                <div key={p.title} className={`pillar reveal ${DELAYS[i]}`}>
                  <div className="pillar-line" />
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
            <blockquote className="philosophy-quote reveal delay-3">
              <p>「将团队的卓越融入优秀的内容，借助前沿科技的力量将其转化为叹为观止的画面。」</p>
            </blockquote>
          </div>

          <div className="philosophy-right reveal delay-2">
            <div className="philosophy-image-frame">
              <img
                src={img3}
                alt="创作理念"
                className="philosophy-img"
                loading="lazy"
              />
              <div className="philosophy-img-overlay" />
              <div className="philosophy-img-label">
                <span>LAIBOETA</span>
                <span>2023</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

