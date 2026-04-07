import { useRef, useEffect } from 'react'
import { useCountUp } from '../hooks/useCountUp'
import ScrambleText from './ScrambleText'
import bgVideo from '../assets/bg_videos.mp4'

function StatNum({ target, suffix = '', label }) {
  const [val, ref] = useCountUp(target, { duration: 1600, delay: 200 })
  return (
    <div className="stat-item" ref={ref}>
      <span className="stat-num">{val.toLocaleString()}<em>{suffix}</em></span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

export default function Hero() {
  const videoRef = useRef(null)
  const contentRef = useRef(null)
  const statsRef = useRef(null)

  // Ensure autoplay resumes if browser suspends it (e.g. after tab switch)
  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    const resume = () => { if (vid.paused) vid.play().catch(() => {}) }
    document.addEventListener('visibilitychange', resume)
    return () => document.removeEventListener('visibilitychange', resume)
  }, [])

  // Parallax scroll — direct DOM, no re-render (Remotion: frame-accurate per-frame update)
  useEffect(() => {
    let raf
    function tick() {
      const y = window.scrollY
      if (contentRef.current) contentRef.current.style.transform = `translateY(${y * 0.25}px)`
      if (statsRef.current) statsRef.current.style.opacity = Math.max(0, 1 - y * 0.004)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section className="hero" id="hero">
      {/*
        videos.md: muted (always silenced) + loop + autoPlay + playsInline
        style: position absolute, inset 0, objectFit cover — fills the frame exactly
        z-index 0 so all overlays/content sit on top
      */}
      <video
        ref={videoRef}
        className="hero-video"
        src={bgVideo}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />
      <div className="hero-overlay" />
      {/* Cinematic scan line — Remotion-style timed sweep */}
      <div className="hero-scanline" aria-hidden="true" />
      {/* Animated film grain overlay */}
      <div className="hero-grain" aria-hidden="true" />

      <div className="hero-content" ref={contentRef}>
        <div className="hero-eyebrow reveal">
          <span className="eyebrow-typewriter">北京莱博塔传媒科技有限公司</span>
        </div>
        <h1 className="hero-title">
          {/* ScrambleText: Remotion text-animation — char-by-char unlock with scramble */}
          <span className="hero-title-line">
            <ScrambleText text="以国际之技" delay={300} lockSpeed={90} />
          </span>
          <span className="hero-title-line gold">
            <ScrambleText text="述中华之魂" delay={760} lockSpeed={90} />
          </span>
        </h1>
        <p className="hero-sub reveal delay-2">
          动画内容开发 · 导演制片 · 数字内容制作<br />
          推动中国科幻作品走向世界舞台
        </p>
        <div className="hero-actions reveal delay-3">
          <a href="#about" className="btn-primary">探索我们</a>
          <a href="#services" className="btn-ghost">业务范围</a>
        </div>
      </div>

      <div className="hero-scroll-hint reveal delay-4">
        <span>向下滚动</span>
        <div className="scroll-line" />
      </div>

      {/* Stats with CountUp — Remotion interpolate() mapped to DOM */}
      <div className="hero-stats reveal delay-3" ref={statsRef}>
        <StatNum target={2023} label="创立于北京" />
        <div className="stat-divider" />
        <StatNum target={1000} suffix="万" label="注册资本" />
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-num">全流程</span>
          <span className="stat-label">动画制作团队</span>
        </div>
      </div>
    </section>
  )
}

