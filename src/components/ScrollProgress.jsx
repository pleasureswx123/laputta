import { useEffect, useRef } from 'react'

// Direct DOM update — no React state, zero re-renders
// Remotion analogy: frame-accurate progress tracking
export default function ScrollProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    let raf = null
    function update() {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      const pct = total > 0 ? (scrolled / total) * 100 : 0
      bar.style.width = pct + '%'
      raf = requestAnimationFrame(update)
    }

    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [])

  return <div ref={barRef} className="scroll-progress" />
}
