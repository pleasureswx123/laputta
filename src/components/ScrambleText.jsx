import { useEffect, useRef, useState } from 'react'

// Remotion-inspired: character-by-character reveal with scramble decode effect
// Analogous to Remotion's useCurrentFrame() + string-slicing text animation
// Character pool: Chinese radicals + geometric symbols matching the brand
const POOL = '日月火水木金土天地人心道义礼仁智信勇廉耻▲△◇◆◈⬡⬟✦●○■□∞≡≈∮∫∑∏'

function randChar() {
  return POOL[Math.floor(Math.random() * POOL.length)]
}

export default function ScrambleText({
  text,
  delay = 0,
  lockSpeed = 75,   // ms between locking each char (Remotion: frames × (1000/fps))
  scrambleRate = 38, // ms between scramble updates (sub-frame flicker)
  className = '',
  style,
}) {
  const chars = text.split('')
  const [display, setDisplay] = useState(() => chars.map(c =>
    c === ' ' || c === '·' || c === '\n' ? c : randChar()
  ))
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
    let raf = null
    let lockedCount = 0
    let lastLock = null
    let lastScramble = null

    const t = setTimeout(() => {
      if (!mounted.current) return

      function tick(ts) {
        if (!mounted.current) return
        if (lastLock === null) lastLock = ts
        if (lastScramble === null) lastScramble = ts

        let changed = false

        // Lock the next char on schedule (like advancing frames in Remotion)
        if (ts - lastLock >= lockSpeed && lockedCount < chars.length) {
          lockedCount++
          lastLock = ts
          changed = true
        }

        // Scramble unlocked chars at sub-frame rate (flicker)
        if (ts - lastScramble >= scrambleRate) {
          lastScramble = ts
          changed = true
        }

        if (changed) {
          setDisplay(chars.map((c, i) => {
            if (c === ' ' || c === '·') return c
            if (i < lockedCount) return c
            return randChar()
          }))
        }

        if (lockedCount < chars.length) {
          raf = requestAnimationFrame(tick)
        } else {
          setDisplay(chars) // ensure final settled state
        }
      }

      raf = requestAnimationFrame(tick)
    }, delay)

    return () => {
      mounted.current = false
      clearTimeout(t)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [text, delay, lockSpeed, scrambleRate])

  return (
    <span className={className} style={style} aria-label={text}>
      {display.map((c, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            color: i === chars.indexOf(display[i]) ? undefined : 'var(--gold)',
            transition: 'color 0.05s',
          }}
        >
          {c}
        </span>
      ))}
    </span>
  )
}
