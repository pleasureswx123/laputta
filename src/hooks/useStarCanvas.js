import { useEffect } from 'react'

export function useStarCanvas(canvasRef, starCount = 280, speedFactor = 0.15) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W, H, stars = [], animId

    function resize() {
      W = canvas.width = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }

    function createStars(n) {
      return Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.2,
        speed: (Math.random() * 0.4 + 0.05) * speedFactor,
        opacity: Math.random() * 0.6 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
      }))
    }

    function drawShootingStar() {
      const x = Math.random() * W
      const y = Math.random() * H * 0.5
      const len = Math.random() * 120 + 60
      const angle = Math.PI / 6
      const grad = ctx.createLinearGradient(x, y, x + Math.cos(angle) * len, y + Math.sin(angle) * len)
      grad.addColorStop(0, 'rgba(201,168,76,0)')
      grad.addColorStop(0.3, 'rgba(201,168,76,0.7)')
      grad.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len)
      ctx.strokeStyle = grad
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)
      stars.forEach(s => {
        s.twinkle += s.twinkleSpeed
        const alpha = s.opacity * (0.6 + 0.4 * Math.sin(s.twinkle))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 215, 255, ${alpha})`
        ctx.fill()
        s.y -= s.speed
        if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W }
      })
      if (Math.random() < 0.003) drawShootingStar()
      animId = requestAnimationFrame(draw)
    }

    function handleResize() {
      cancelAnimationFrame(animId)
      resize()
      stars = createStars(starCount)
      draw()
    }

    resize()
    stars = createStars(starCount)
    draw()
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
    }
  }, [canvasRef, starCount, speedFactor])
}
