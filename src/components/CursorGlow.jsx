import { useEffect, useRef } from 'react'

// Remotion-inspired spring physics: spring({ config: { stiffness: 150, damping: 22 } })
// "snappy" spring from Remotion docs: { damping: 20, stiffness: 200 }
// Adapted for real-time rAF — updates DOM directly (no React state) for zero re-render cost

const CFG = { stiffness: 140, damping: 20, mass: 1 }

function springStep(pos, vel, target, dt) {
  const x = pos - target
  const acc = (-CFG.stiffness * x - CFG.damping * vel) / CFG.mass
  const newVel = vel + acc * dt
  const newPos = pos + newVel * dt
  return [newPos, newVel]
}

export default function CursorGlow() {
  const glowRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    const mouse = { x: -300, y: -300 }
    const spring = { x: -300, y: -300, vx: 0, vy: 0 }
    const dot = { x: -300, y: -300, vx: 0, vy: 0 }
    let lastTs = null
    let raf = null
    let visible = false

    function tick(ts) {
      const dt = lastTs ? Math.min((ts - lastTs) / 1000, 0.05) : 0.016
      lastTs = ts

      // Large glow — slow spring (Remotion heavy: damping 15, stiffness 80)
      ;[spring.x, spring.vx] = springStep(spring.x, spring.vx, mouse.x, dt)
      ;[spring.y, spring.vy] = springStep(spring.y, spring.vy, mouse.y, dt)

      // Small dot — fast spring (Remotion snappy: damping 20, stiffness 200)
      const fastCfg = { stiffness: 280, damping: 28, mass: 1 }
      const ax = (-fastCfg.stiffness * (dot.x - mouse.x) - fastCfg.damping * dot.vx) / fastCfg.mass
      const ay = (-fastCfg.stiffness * (dot.y - mouse.y) - fastCfg.damping * dot.vy) / fastCfg.mass
      dot.vx += ax * dt; dot.x += dot.vx * dt
      dot.vy += ay * dt; dot.y += dot.vy * dt

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${spring.x}px, ${spring.y}px)`
        glowRef.current.style.opacity = visible ? '1' : '0'
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dot.x}px, ${dot.y}px)`
        dotRef.current.style.opacity = visible ? '1' : '0'
      }

      raf = requestAnimationFrame(tick)
    }

    const onMove = (e) => {
      mouse.x = e.clientX - 200   // offset so center of 400px glow is at cursor
      mouse.y = e.clientY - 200
      if (!visible) { visible = true }
    }
    const onLeave = () => { visible = false }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {/* Large spring glow — slow follow */}
      <div ref={glowRef} className="cursor-glow" style={{ opacity: 0 }} />
      {/* Small dot — fast follow */}
      <div ref={dotRef} className="cursor-dot" style={{ opacity: 0 }} />
    </>
  )
}
