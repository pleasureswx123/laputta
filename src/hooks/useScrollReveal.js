import { useEffect } from 'react'

export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    )

    const observe = () => {
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el))
    }

    // Initial pass + delayed pass for late-mounting elements
    observe()
    const t1 = setTimeout(observe, 100)
    const t2 = setTimeout(observe, 400)

    return () => {
      observer.disconnect()
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])
}
