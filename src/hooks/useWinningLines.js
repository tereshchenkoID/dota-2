'use client'

import { useEffect, useState } from 'react'

export const useWinningLines = (containerRef, matches) => {
  const [geometry, setGeometry] = useState(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !matches.length) return

    const measure = () => {
      const bounds = container.getBoundingClientRect()
      if (!bounds.width || !bounds.height) return
      const lines = matches.map((match) => ({
        ...match,
        points: match.cells.flatMap((cell) => {
          const element = container.querySelector(`[data-cell="${cell}"]`)
          if (!element) return []
          const reel = element.closest('[data-reel]').getBoundingClientRect()
          return [{
            x: reel.left - bounds.left + element.offsetWidth / 2,
            y: reel.top - bounds.top + element.offsetTop + element.offsetHeight / 2,
          }]
        }),
      }))
      setGeometry({ width: bounds.width, height: bounds.height, lines })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    return () => observer.disconnect()
  }, [containerRef, matches])

  return geometry
}
