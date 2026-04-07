import { useState, useEffect, useRef } from 'react'

// Remotion-inspired: uses interpolate() concept — maps progress [0,1] → [start, end]
// with Easing.out(Easing.cubic) feel via (1 - (1-t)^3)
// Triggered via IntersectionObserver, like a Remotion composition entering the viewport

export function useCountUp(target, { duration = 1400, delay = 0 } = {}) {
  const [value, setValue] = useState(0)
  const [active, setActive] = useState(false)
  const elRef = useRef(null)

  // Observe when element enters viewport (like Remotion's sequence timing)
  useEffect(() => {
    const el = elRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect() } },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Run interpolation (Remotion-style: eased frame-by-frame progress)
  useEffect(() => {
    if (!active) return
    let raf
    const startTime = performance.now() + delay

    function tick(now) {
      if (now < startTime) { raf = requestAnimationFrame(tick); return }
      const elapsed = now - startTime
      // Remotion: interpolate(progress, [0,1], [0, target], { easing: Easing.out(Easing.cubic) })
      const t = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)  // ease-out cubic
      setValue(Math.round(eased * target))
      if (t < 1) raf = requestAnimationFrame(tick)
      else setValue(target)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target, duration, delay])

  return [value, elRef]
}
